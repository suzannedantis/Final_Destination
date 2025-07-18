'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const finishOAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error retrieving session:', error.message);
      }

      if (session) {
        router.replace('/'); // Redirect to dashboard or home
      } else {
        router.replace('/'); // Still redirect if no session to avoid blank screen
      }
    };

    finishOAuth();
  }, []);

  return <div className="p-6 text-center text-lg font-medium">Signing you in...</div>;
}