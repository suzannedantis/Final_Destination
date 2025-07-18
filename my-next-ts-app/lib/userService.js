// lib/userService.js
import { supabase } from './supabase'
import { uploadProfilePicture, updateProfilePicture } from './storage'

export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData);
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          role: userData.role,
          organization: userData.organization
        }
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }

    if (data.user) {
      // Create user profile with or without profile picture
      await createUserProfile(data.user.id, userData);
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error?.message || error);
    throw new Error(error?.message || 'Unknown error during user creation');
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    let profilePicUrl = null;

    // Upload profile picture if provided
    if (userData.profilePhoto) {
      try {
        profilePicUrl = await uploadProfilePicture(userData.profilePhoto, userId);
        console.log('Profile picture uploaded successfully:', profilePicUrl);
      } catch (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        // Continue with profile creation even if image upload fails
        // You might want to show a warning to the user
      }
    }

    // Insert user profile into database
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_id: userId,
          full_name: userData.fullName,
          email: userData.email,
          password: userData.password, // Note: Storing passwords in plain text is not recommended
          role: userData.role,
          organization: userData.organization,
          domain_of_interest: userData.domains || [],
          linkedin: userData.linkedinUrl || null,
          github: userData.portfolioUrl || null,
          bio: userData.bio || null,
          profile_pic: profilePicUrl
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting into users table:', error);
      throw new Error(error.message || 'Failed to insert user profile');
    }

    console.log('User profile created successfully:', data?.[0]);
    return data?.[0];
  } catch (error) {
    console.error('Error creating user profile:', error?.message || error);
    throw new Error(error?.message || 'Unknown error creating profile');
  }
};

export const loginUser = async (email, password) => {
  try {
    // Sign in with email and password using Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Supabase login error:', error);
      throw new Error(error.message || 'Login failed');
    }

    const { user, session } = data;

    // Return only authentication user object and session
    return { user, session };
  } catch (error) {
    console.error('Error logging in:', error?.message || error);
    throw new Error(error?.message || 'Unknown login error');
  }
};


export const updateUserProfile = async (userId, updateData) => {
  try {
    let profilePicUrl = updateData.profilePicUrl;

    // Handle profile picture update
    if (updateData.profilePhoto) {
      try {
        profilePicUrl = await updateProfilePicture(updateData.profilePhoto, userId);
        console.log('Profile picture updated successfully:', profilePicUrl);
      } catch (uploadError) {
        console.error('Error updating profile picture:', uploadError);
        throw new Error('Failed to update profile picture');
      }
    }

    // Update user profile in database
    const updatePayload = {
      full_name: updateData.fullName,
      role: updateData.role,
      organization: updateData.organization,
      domain_of_interest: updateData.domains || [],
      linkedin: updateData.linkedinUrl || null,
      github: updateData.portfolioUrl || null,
      bio: updateData.bio || null,
    };

    // Only update profile_pic if we have a new URL
    if (profilePicUrl) {
      updatePayload.profile_pic = profilePicUrl;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }

    return data?.[0];
  } catch (error) {
    console.error('Error updating user profile:', error?.message || error);
    throw new Error(error?.message || 'Unknown error updating profile');
  }
};

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile:', error?.message || error);
    throw new Error(error?.message || 'Unknown error fetching profile');
  }
};