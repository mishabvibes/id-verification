import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to fetch a simple query to test connection
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json({ 
        status: 'error',
        message: error.message,
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success',
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 