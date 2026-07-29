import { supabase } from '@/utils/supabase';
import { useState } from 'react';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  async function signUp(email: string, password: string) {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    return !error;
  }

  return { signIn, signUp, loading, errorMsg };
}
