// lib/storage.js
import { supabase } from './supabase'

export const uploadProfilePicture = async (file, userId) => {
  try {
    // Validate inputs
    if (!file || !userId) {
      throw new Error('File and userId are required');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    console.log(`File path: ${filePath}`);

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('User must be authenticated to upload files');
    }

    console.log('User authenticated:', user.id);

    // Delete existing profile picture if it exists
    try {
      const { data: existingFiles } = await supabase.storage
        .from('profile-pictures')
        .list('profiles', {
          search: `profile-${userId}`
        });

      if (existingFiles && existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`profiles/${existingFile.name}`]);
        }
      }
    } catch (error) {
      console.warn('Could not delete existing profile picture:', error);
    }

    // Upload new file
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Upload error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      });
      
      // Handle specific error cases
      if (error.message?.includes('new row violates row-level security policy')) {
        throw new Error('Permission denied: You can only upload your own profile picture');
      } else if (error.message?.includes('duplicate key value')) {
        throw new Error('File already exists');
      } else if (error.statusCode === 413) {
        throw new Error('File too large');
      } else {
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    console.log('Public URL generated:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to delete profile picture
export const deleteProfilePicture = async (userId) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User must be authenticated');
    }

    // List files with the user's ID pattern
    const { data: files, error: listError } = await supabase.storage
      .from('profile-pictures')
      .list('profiles', {
        search: `profile-${userId}`
      });

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    if (files && files.length > 0) {
      const filePaths = files.map(file => `profiles/${file.name}`);
      
      const { error: deleteError } = await supabase.storage
        .from('profile-pictures')
        .remove(filePaths);

      if (deleteError) {
        throw new Error(`Failed to delete files: ${deleteError.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};

// Function to update profile picture (combines delete and upload)
export const updateProfilePicture = async (file, userId) => {
  try {
    // Delete existing profile picture first
    await deleteProfilePicture(userId);
    
    // Upload new profile picture
    const newUrl = await uploadProfilePicture(file, userId);
    
    return newUrl;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Function to get profile picture URL
export const getProfilePictureUrl = async (userId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('profile-pictures')
      .list('profiles', {
        search: `profile-${userId}`
      });

    if (error) {
      throw new Error(`Failed to get profile picture: ${error.message}`);
    }

    if (files && files.length > 0) {
      // Get the most recent file (in case there are multiple)
      const latestFile = files.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
      
      const { data: publicUrlData } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(`profiles/${latestFile.name}`);

      return publicUrlData.publicUrl;
    }

    return null;
  } catch (error) {
    console.error('Error getting profile picture URL:', error);
    throw error;
  }
};