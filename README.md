# RUET Student Exchange — Setup Guide

This is a working starter: RUET-email signup, browse/create listings with
images, and live chat per listing. Follow these steps in order.

## What you need installed first
1. **Node.js** (v18 or newer) — download from https://nodejs.org (choose the LTS version). Installing this also installs `npm`.
2. **VS Code** (or any code editor) — https://code.visualstudio.com
3. A free **Supabase** account — https://supabase.com
4. A free **Vercel** account — https://vercel.com (for later, when you deploy)
5. A **GitHub** account — https://github.com (for later, when you deploy)

## Step 1 — Create your Supabase project
1. Go to https://supabase.com/dashboard and click "New project".
2. Give it a name (e.g. `ruet-marketplace`), set a database password (save it somewhere), pick the region closest to Bangladesh (e.g. Singapore).
3. Wait ~2 minutes for it to finish setting up.

## Step 2 — Run the database schema
1. In your Supabase project, go to the **SQL Editor** tab (left sidebar).
2. Click "New query".
3. Open the file `supabase/schema.sql` from this project, copy ALL of it, paste it in, and click **Run**.
4. This creates all your tables (listings, messages, ratings, reports) and sets up security rules and image storage.

## Step 3 — Turn on realtime for chat
1. In Supabase, go to **Database > Replication** (or search "Realtime" in the left sidebar).
2. Find the `messages` table and toggle it ON for realtime.
   (Without this, chat messages won't show up instantly — the page would need a refresh.)

## Step 4 — Get your API keys
1. In Supabase, go to **Project Settings > API**.
2. Copy the **Project URL** and the **anon public** key.

## Step 5 — Set up the project on your computer
1. Extract/copy this whole `ruet-marketplace` folder onto your computer.
2. Open a terminal inside that folder.
3. Run:
   ```
   npm install
   ```
   This downloads all the required packages (takes a minute or two).
4. Copy `.env.local.example` and rename the copy to `.env.local`.
5. Open `.env.local` and paste in your Supabase URL and anon key from Step 4:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 6 — Set your real university email domain
Open `lib/constants.ts` and change this line to your actual RUET student email domain:
```ts
export const ALLOWED_EMAIL_DOMAIN = 'ruet.ac.bd';
```
(Ask around or check an official RUET email to confirm the exact domain students use.)

## Step 7 — Run it locally
```
npm run dev
```
Open http://localhost:3000 in your browser. You should see the site running!

Try it out:
1. Go to **Sign Up**, create an account with your RUET email.
2. Check your email for a confirmation link (Supabase sends this automatically) and click it.
3. Log in.
4. Go to **Sell/Rent** to post a listing with a photo.
5. Open the listing and try the chat box.

## Step 8 — Put it on GitHub
1. Create a new repository on GitHub (e.g. `ruet-marketplace`).
2. In your project folder terminal:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ruet-marketplace.git
   git push -u origin main
   ```

## Step 9 — Deploy it live with Vercel
1. Go to https://vercel.com and log in with GitHub.
2. Click **Add New > Project**, select your `ruet-marketplace` repo.
3. Under "Environment Variables", add the same two values from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
5. In a minute or two, Vercel gives you a live URL like `ruet-marketplace.vercel.app` — that's your real, working website.

## What's already built
- RUET-email-only signup + login
- Browse listings with category filter + search
- Post a listing with photo upload
- Listing detail page
- Real-time chat between buyer and seller per listing

## What's NOT built yet (your next steps once this is working)
- Ratings after a completed trade (table already exists in the database — `ratings`)
- Reporting fraudulent listings (table already exists — `reports`)
- Wishlist/alerts for specific items
- Admin panel to review reports
- Senior bundle listings, group buying

Once the basics above are working and you're comfortable, tell me which of
these you want to add next and I'll write the code for it.

## If something breaks
- **"Invalid API key" error** — double check `.env.local` has no extra spaces and you restarted `npm run dev` after editing it.
- **Signup fails silently** — check Supabase Dashboard > Authentication > Users to see if the account was actually created; also check Authentication > Email Templates that confirmation emails are enabled.
- **Images don't show** — confirm the `listing-images` bucket exists in Supabase > Storage and is marked Public.
- **Chat doesn't update live** — make sure you completed Step 3 (enabling realtime on the `messages` table).
