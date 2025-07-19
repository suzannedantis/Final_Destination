import { supabase } from './supabase';

export const addStartup = async (startupData, userId) => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .insert([
        {
          name: startupData.name,
          idea_summary: startupData.idea_summary,
          stage: startupData.stage,
          funding_status: startupData.funding_status,
          website: startupData.website,
          pitch_deck_url: startupData.pitch_deck_url,
          registered_on: new Date(startupData.registered_on),
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting startup:', error);
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('Error adding startup:', error);
    throw error;
  }
};

export const getStartupsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching startups:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error getting startups:', error);
    throw error;
  }
};

export const getAllStartups = async () => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('registered_on', { ascending: false });

    if (error) {
      console.error('Error fetching all startups:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error getting all startups:', error);
    throw error;
  }
};