import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SubmissionModel from '@/models/Submission';
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
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    await dbConnect();
    
    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Get total count for pagination
    const total = await SubmissionModel.countDocuments(query);
    
    // Get submissions
    const submissions = await SubmissionModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({ 
      submissions, 
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      
      // Generate uniqueId if not present
      if (!body.uniqueId) {
        const prefix = body.category === 'ECC' ? 'ECC' : 'TCC';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 900) + 100;
        body.uniqueId = `${prefix}${timestamp}${random}`;
        console.log('Generated uniqueId in API route:', body.uniqueId);
      }
      
      await dbConnect();
      
      console.log('Attempting to save submission with data:', JSON.stringify(body, null, 2));
      const submission = new SubmissionModel(body);
      await submission.save();
      
      return NextResponse.json({ 
        success: true, 
        submission,
        message: 'Form submitted successfully!'
      }, { status: 201 });
    } catch (error: any) {
      console.error('Error creating submission:', error);
      
      if (error.code === 11000) {
        return NextResponse.json(
          { error: 'Duplicate submission detected' }, 
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal Server Error', details: error.message }, 
        { status: 500 }
      );
    }
  }