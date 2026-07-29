import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Clear the error message after 2 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(''), 2000);
    return () => clearTimeout(timer);
  }, [errorMsg]);
  // Sign in function with supabase authentication
  async function signIn(email: string, password: string) {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    return !error;
  }
  // Sign up function with supabase authentication
  async function signUp(email: string, password: string) {
    setErrorMsg('');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return false;
    }

    // Supabase quirk: existing email returns "success" with no error,
    // but identities array is empty for an account that already exists.
    // this is a workaround to detect same email addresses and show a proper error message.
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      setErrorMsg(
        'An account with this email already exists. Please sign in instead.',
      );
      return false;
    }

    return true;
  }

  return { signIn, signUp, loading, errorMsg };
}
