'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/lib/constants';
import Link from 'next/link';

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  pickup_location: string;
  image_url: string | null;
  created_at: string;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [category]);

  async function fetchListings() {
    setLoading(true);
    let query = supabase
      .from('listings')
      .select('id, title, price, category, pickup_location, image_url, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (!error && data) setListings(data as Listing[]);
    setLoading(false);
  }

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading listings...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No listings yet. Be the first to post one!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((l) => (
            <Link
              key={l.id}
              href={`/listings/${l.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {l.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.image_url}
                    alt={l.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No image</span>
                )}
              </div>
              <div className="p-2">
                <p className="font-medium text-sm truncate">{l.title}</p>
                <p className="text-ruet-maroon font-semibold">৳{l.price}</p>
                <p className="text-xs text-gray-500">{l.pickup_location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
