import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import HallTicketModel from '@/models/HallTicket';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    await dbConnect();
    
    // Get total count for pagination
    const total = await HallTicketModel.countDocuments();
    
    // Get hall tickets
    const hallTickets = await HallTicketModel
      .find({})
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({ 
      hallTickets, 
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching hall tickets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}