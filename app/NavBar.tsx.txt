'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-ruet-maroon text-white px-4 py-3 flex items-center justify-between">
      <Link href="/listings" className="font-bold text-lg">
        RUET Exchange
      </Link>
      <div className="flex gap-4 text-sm items-center">
        <Link href="/listings">Browse</Link>
        <Link href="/listings/new">Sell / Rent</Link>
        {loggedIn === null ? null : loggedIn ? (
          <Link href="/profile">Profile</Link>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}