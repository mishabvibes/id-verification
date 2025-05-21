import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!type || !['photo', 'payment'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be either photo or payment.' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported. Please upload JPEG, PNG or PDF.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Determine bucket and path
    const bucket = type === 'photo' ? 'student-photos' : 'payment-proofs';
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${timestamp}-${sanitizedFileName}.${fileExt}`;
    
    // Upload to Supabase
    const fileUrl = await uploadFile(file, bucket, path);
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Failed to upload file. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ fileUrl });
  } catch (error: any) {
    console.error('Error in upload API:', error);
    
    // Handle specific error types
    if (error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { error: 'Unable to connect to storage service. Please check your internet connection.' },
        { status: 503 }
      );
    }
    
    if (error.message?.includes('permission denied') || 
        error.message?.includes('violates row-level security policy') ||
        error.statusCode === '403') {
      return NextResponse.json(
        { error: 'Permission denied. Please contact support.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}