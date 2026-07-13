'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isAllowedEmail, ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isAllowedEmail(email)) {
      setError(`Please use your RUET email address (@${ALLOWED_EMAIL_DOMAIN}).`);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, department, batch },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      // Email confirmation is OFF — user is already logged in
      router.push('/listings');
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
        <p className="text-gray-600">
          We sent a confirmation link to <b>{email}</b>. Confirm it, then log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Create your account</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          className="border rounded p-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border rounded p-2"
          placeholder={`Your RUET email (name@${ALLOWED_EMAIL_DOMAIN})`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Department (e.g. ECE)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Batch/Series (e.g. ECE-23)"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="bg-ruet-maroon text-white rounded p-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
