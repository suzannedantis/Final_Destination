import { supabase } from './supabase';

export const addProject = async (projectData, userId) => {
  try {
    const { data, error } = await supabase
      .from('research_papers')
      .insert([
        {
          title: projectData.title,
          abstract: projectData.description,
          category: projectData.category,
          tags: projectData.tags,
          year: parseInt(projectData.yearOfPublishing, 10),
          authors: projectData.authors,
          journal: projectData.journal,
          types: projectData.types.join(','),
          status: projectData.status,
          is_public: projectData.visibility === 'Public',
          pdf_url: projectData.document_url || null,
          user_id: userId,
          author_name: projectData.author_name
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting project:', error);
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjectsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const getAllProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all projects:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
};