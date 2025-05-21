import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SubmissionModel from '@/models/Submission';
import HallTicketModel from '@/models/HallTicket';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { FormStatus } from '@/types';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const submission = await SubmissionModel.findOne({ 
      $or: [
        { _id: id },
        { uniqueId: id }
      ]
    });
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    
    // Check admin authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    await dbConnect();
    
    const submission = await SubmissionModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }

    // If the submission is being approved, automatically generate a hall ticket
    if (body.status === FormStatus.APPROVED) {
      // Check if hall ticket already exists
      const existingHallTicket = await HallTicketModel.findOne({ submissionId: id });
      
      if (!existingHallTicket) {
        // Create a new hall ticket
        const hallTicket = new HallTicketModel({
          submissionId: id,
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
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      submission,
      message: 'Submission updated successfully!'
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    
    // Check admin authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const submission = await SubmissionModel.findByIdAndDelete(id);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Submission deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}