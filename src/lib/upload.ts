import { supabase } from './supabase';
import type { FileUploadResponse } from './types';

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  // First, ensure we're authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Authentication required for file upload');
  }

  try {
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('portfolio-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      if (uploadError.message.includes('row-level security policy')) {
        throw new Error('Permission denied. Please ensure you are properly authenticated.');
      }
      throw new Error('Failed to upload file: ' + uploadError.message);
    }

    if (!uploadData) {
      throw new Error('No upload data received');
    }

    const { data } = supabase.storage
      .from('portfolio-uploads')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      fullPath: data.publicUrl,
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during file upload');
  }
}