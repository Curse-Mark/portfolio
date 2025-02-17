import { supabase } from './supabase';

export async function signInAsAdmin(username: string, password: string) {
  // First check if we have the required environment variables
  const adminEmail = import.meta.env.VITE_SUPABASE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_SUPABASE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not configured in environment variables');
  }

  // Verify the provided credentials match the expected values
  if (username !== 'admin' || password !== 'admin123') {
    throw new Error('Invalid admin credentials');
  }

  try {
    // Sign out any existing session first to ensure clean state
    await supabase.auth.signOut();

    // Attempt to sign in with the admin credentials from environment variables
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid Supabase admin credentials. Please check your environment variables.');
      }
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('Failed to authenticate with Supabase');
    }

    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during authentication');
  }
}