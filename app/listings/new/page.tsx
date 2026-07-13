'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES, PICKUP_LOCATIONS } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pickup, setPickup] = useState(PICKUP_LOCATIONS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to post a listing.');
      return;
    }

    setLoading(true);

    let imageUrl: string | null = null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('listings').insert({
      seller_id: user.id,
      title,
      description,
      price: Number(price),
      category,
      pickup_location: pickup,
      image_url: imageUrl,
      status: 'active',
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push('/listings');
  }

  return (
    <div className="max-w-lg mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">Post a listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border rounded p-2"
          placeholder="Title (e.g. Casio fx-991EX Calculator)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded p-2"
          placeholder="Description / condition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <input
          className="border rounded p-2"
          placeholder="Price (৳)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        >
          {PICKUP_LOCATIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <input
          className="border rounded p-2"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="bg-ruet-maroon text-white rounded p-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}
