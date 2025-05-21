import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import HallTicketModel from '@/models/HallTicket';
import SubmissionModel from '@/models/Submission';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('submissionId');
    const uniqueId = searchParams.get('uniqueId');
    
    await dbConnect();
    
    // Build query
    const query: any = {};
    if (submissionId) query.submissionId = submissionId;
    if (uniqueId) query.uniqueId = uniqueId;
    
    const hallTicket = await HallTicketModel.findOne(query);
    
    if (!hallTicket) {
      return NextResponse.json(
        { error: 'Hall ticket not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(hallTicket);
  } catch (error) {
    console.error('Error fetching hall ticket:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authentication for creating hall tickets
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { submissionId } = body;
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' }, 
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find the submission
    const submission = await SubmissionModel.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }
    
    // Check if hall ticket already exists
    const existingHallTicket = await HallTicketModel.findOne({ submissionId });
    
    if (existingHallTicket) {
      return NextResponse.json(
        { error: 'Hall ticket already exists for this submission', hallTicket: existingHallTicket }, 
        { status: 409 }
      );
    }
    
    // Create a new hall ticket
    const hallTicket = new HallTicketModel({
      submissionId,
      uniqueId: submission.uniqueId,
      programCode: submission.category,
      centre: 'ANVARUL ISLAM ARABIC COLLAGE RAMAPURAM',
      name: submission.personalDetails.name,
      dateOfBirth: submission.personalDetails.dateOfBirth,
      zone: submission.educationDetails.zone,
      membershipId: submission.personalDetails.skssflMembershipId,
      issuedAt: new Date(),
      status: 'issued'
    });
    
    await hallTicket.save();
    
    return NextResponse.json({ 
      success: true, 
      hallTicket,
      message: 'Hall ticket generated successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating hall ticket:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}