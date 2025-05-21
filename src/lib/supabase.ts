import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
  try {
    // First, check if the bucket exists using admin client
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw bucketsError;
    }

    // If bucket doesn't exist, create it using admin client
    if (!buckets?.find(b => b.name === bucket)) {
      const { error: createError } = await supabaseAdmin
        .storage
        .createBucket(bucket, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          fileSizeLimit: 5242880 // 5MB
        });

      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
    }

    // Upload the file using admin client to bypass RLS
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL using regular client
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
}