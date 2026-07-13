-- Run this entire file in Supabase Dashboard > SQL Editor > New Query > Run

-- LISTINGS TABLE
create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  price numeric not null,
  category text not null,
  pickup_location text,
  image_url text,
  status text default 'active',
  created_at timestamp with time zone default now()
);

-- MESSAGES TABLE (chat)
create table messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) not null,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- RATINGS TABLE (for later use)
create table ratings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  rater_id uuid references auth.users(id),
  ratee_id uuid references auth.users(id),
  score int check (score between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- REPORTS TABLE (for moderation later)
create table reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  reported_by uuid references auth.users(id),
  reason text,
  status text default 'open',
  created_at timestamp with time zone default now()
);

-- ROW LEVEL SECURITY: turn it on
alter table listings enable row level security;
alter table messages enable row level security;
alter table ratings enable row level security;
alter table reports enable row level security;

-- Anyone logged in can view active listings
create policy "Public listings are viewable"
on listings for select
using (true);

-- Only the logged-in seller can insert their own listing
create policy "Users can insert own listings"
on listings for insert
with check (auth.uid() = seller_id);

-- Only the seller can update/delete their own listing
create policy "Users can update own listings"
on listings for update
using (auth.uid() = seller_id);

create policy "Users can delete own listings"
on listings for delete
using (auth.uid() = seller_id);

-- Messages: only sender or receiver can view
create policy "Users can view their own messages"
on messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Messages: only sender can insert as themselves
create policy "Users can send messages as themselves"
on messages for insert
with check (auth.uid() = sender_id);

-- Ratings: anyone can view, only rater can insert as self
create policy "Ratings are viewable"
on ratings for select
using (true);

create policy "Users can insert ratings as themselves"
on ratings for insert
with check (auth.uid() = rater_id);

-- Reports: only the reporter can view/insert their own report; admins should
-- use the Supabase dashboard directly to review all reports for now.
create policy "Users can insert their own reports"
on reports for insert
with check (auth.uid() = reported_by);

create policy "Users can view their own reports"
on reports for select
using (auth.uid() = reported_by);

-- STORAGE: create a public bucket for listing images
-- (Also doable via Dashboard > Storage > New Bucket > name "listing-images" > Public)
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Anyone can view listing images"
on storage.objects for select
using (bucket_id = 'listing-images');

create policy "Logged in users can upload listing images"
on storage.objects for insert
with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');
