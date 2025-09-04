import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Insert profile after signup
export async function insertUserProfile(form: {
  fullName: string;
  dob: string;
  niNumber: string;
  country: string;
}) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (error || !user) throw new Error('User not authenticated');

  const { error: insertError } = await supabase.from('profiles').insert([
    {
      id: user.id,
      full_name: form.fullName,
      dob: form.dob,
      ni_number: form.niNumber,
      country: form.country,
    },
  ]);

  if (insertError) throw insertError;
}

// Fetch profile + filings for dashboard
export async function getUserDashboard() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (sessionError || !user) throw new Error('User not authenticated');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: filings, error: filingsError } = await supabase
    .from('filings')
    .select('*')
    .eq('user_id', user.id)
    .order('tax_year', { ascending: false });

  console.log('Profile Error:', profileError);
  console.log('Filings Error:', filingsError);

  if (profileError || filingsError) throw new Error('Failed to fetch dashboard data');

  return { profile, filings };
}
