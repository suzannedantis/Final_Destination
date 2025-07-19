import { supabase } from './supabase';

export const addPost = async (postData, userId) => {
  try {
    const { data, error } = await supabase
      .from('post')
      .insert([
        {
          user_id: userId,
          content: postData.content,
          media_urls: postData.media_urls,
          post_type: postData.post_type,
          tags: postData.tags,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting post:', error);
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('post')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching posts:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};