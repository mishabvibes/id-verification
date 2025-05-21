import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import HallTicketModel from '@/models/HallTicket';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const hallTicket = await HallTicketModel.findOne({ 
      $or: [
        { _id: id },
        { uniqueId: id }
      ]
    });
    
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
    
    const hallTicket = await HallTicketModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!hallTicket) {
      return NextResponse.json(
        { error: 'Hall ticket not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      hallTicket,
      message: 'Hall ticket updated successfully'
    });
  } catch (error) {
    console.error('Error updating hall ticket:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;
    
    await dbConnect();
    
    const hallTicket = await HallTicketModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    
    if (!hallTicket) {
      return NextResponse.json(
        { error: 'Hall ticket not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      hallTicket,
      message: 'Hall ticket status updated successfully'
    });
  } catch (error) {
    console.error('Error updating hall ticket status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}