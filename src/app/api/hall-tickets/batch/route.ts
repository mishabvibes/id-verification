import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import HallTicketModel from '@/models/HallTicket';
import SubmissionModel from '@/models/Submission';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { FormStatus } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { filter } = body;
    
    await dbConnect();
    
    // Find approved submissions without hall tickets
    const query: any = { status: FormStatus.APPROVED };
    
    // Add additional filters if provided
    if (filter?.category) {
      query.category = filter.category;
    }
    
    if (filter?.zone) {
      query['educationDetails.zone'] = filter.zone;
    }
    
    // Get all approved submissions
    const submissions = await SubmissionModel.find(query);
    
    if (submissions.length === 0) {
      return NextResponse.json({ 
        message: 'No eligible submissions found for hall ticket generation',
        generated: 0
      });
    }
    
    // Check which submissions already have hall tickets
    const submissionIds = submissions.map(sub => sub._id.toString());
    const existingHallTickets = await HallTicketModel.find({
      submissionId: { $in: submissionIds }
    });
    
    const existingSubmissionIds = new Set(
      existingHallTickets.map(ticket => ticket.submissionId.toString())
    );
    
    // Filter submissions that don't have hall tickets yet
    const eligibleSubmissions = submissions.filter(
      sub => !existingSubmissionIds.has(sub._id.toString())
    );
    
    if (eligibleSubmissions.length === 0) {
      return NextResponse.json({ 
        message: 'All eligible submissions already have hall tickets',
        generated: 0
      });
    }
    
    // Prepare hall tickets to create
    const hallTicketsToCreate = eligibleSubmissions.map(submission => ({
      submissionId: submission._id,
      uniqueId: submission.uniqueId,
      programCode: submission.category,
      centre: 'ANVARUL ISLAM ARABIC COLLAGE RAMAPURAM',
      name: submission.personalDetails.name,
      dateOfBirth: submission.personalDetails.dateOfBirth,
      zone: submission.educationDetails.zone,
      membershipId: submission.personalDetails.skssflMembershipId,
      issuedAt: new Date(),
      status: 'issued'
    }));
    
    // Create hall tickets in bulk
    await HallTicketModel.insertMany(hallTicketsToCreate);
    
    return NextResponse.json({ 
      success: true, 
      message: `Generated ${hallTicketsToCreate.length} hall tickets successfully`,
      generated: hallTicketsToCreate.length
    });
  } catch (error) {
    console.error('Error generating batch hall tickets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}