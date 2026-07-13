'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  pickup_location: string;
  image_url: string | null;
  seller_id: string;
};

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });

    supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single()
      .then(({ data }) => setListing(data as Listing));
  }, [listingId]);

  useEffect(() => {
    if (!userId || !listing) return;

    fetchMessages();

    const channel = supabase
      .channel(`chat-${listingId}-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, listing, listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchMessages() {
    setLoadingChat(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) ?? []);
    setLoadingChat(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !listing) return;

    const receiverId = listing.seller_id;

    await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: userId,
      receiver_id: receiverId,
      content: newMessage.trim(),
    });

    setNewMessage('');
  }

  if (!listing) return <p>Loading...</p>;

  const isOwner = userId === listing.seller_id;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.image_url} alt={listing.title} className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        <p className="text-ruet-maroon text-xl font-semibold">৳{listing.price}</p>
        <p className="text-sm text-gray-500 mb-2">
          {listing.category} · Pickup: {listing.pickup_location}
        </p>
        <p className="text-gray-700">{listing.description}</p>
      </div>

      <div className="border rounded-lg flex flex-col h-[500px]">
        <div className="border-b p-3 font-medium">
          {isOwner ? 'Messages about this listing' : 'Chat with seller'}
        </div>

        {!userId ? (
          <div className="p-3 text-gray-500">Log in to chat with the seller.</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {loadingChat ? (
                <p className="text-gray-400 text-sm">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.sender_id === userId
                        ? 'bg-ruet-maroon text-white self-end'
                        : 'bg-gray-100 self-start'
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="border-t p-2 flex gap-2">
              <input
                className="border rounded p-2 flex-1 text-sm"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="bg-ruet-maroon text-white rounded px-4 text-sm">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
