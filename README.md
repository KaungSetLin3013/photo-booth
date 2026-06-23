# 📸 Memories

A single-file, mobile-first "digital disposable camera" web app. Guests open the page, snap photos with a real-time camera UI (grid, zoom, timer, aspect ratio), and every shot lands in a shared live gallery — perfect for weddings, parties, or any event where you want a crowdsourced photo stream without installing an app.

No build step, no framework, no backend code to deploy — it's one `index.html` file backed by [Supabase](https://supabase.com) for storage and the photo feed.

## ✨ Features

**Camera**
- Live camera preview with front/back switching
- Pinch-to-zoom and a draggable zoom ruler (0.5×–5×)
- Composition grid overlay
- Self-timer (3s / 5s / 10s)
- Cycling aspect ratios (4:3, 16:9, 1:1, 3:2, 2:3) with crop overlay
- Optional caption per photo

**Gallery**
- Live grid of every photo uploaded by any guest
- Tap to open a full-screen lightbox with caption, uploader, and date
- Pull-to-refresh

**Guest experience**
- First-time name prompt ("Who's uploading?") so photos are attributed
- Per-device upload limits (set by the admin), tracked via a generated device ID — no login required

**Admin panel**
- Hidden behind a 5-second pull-down gesture on the gallery (or `Ctrl+Shift+A`)
- Password-protected (password lives in Supabase, not in the code)
- Edit captions or delete any photo
- View connected devices, their photo counts, and reset/delete them
- Set or remove the per-device photo limit
- Change the admin password

## 🛠 Tech stack

- Vanilla HTML/CSS/JS — no dependencies, no bundler
- [Supabase](https://supabase.com) for:
  - **Storage** — photo files (public bucket)
  - **Postgres (via REST)** — photo metadata, devices, and settings

## 🚀 Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project (the free tier is plenty for an event).

### 2. Create the storage bucket
In **Storage**, create a bucket named `photos` and make it **public** (so gallery images can be displayed without auth).

### 3. Create the database tables
Run this in the Supabase **SQL Editor**:

```sql
-- Photo metadata
create table photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  uploader text,
  caption text,
  device_id text,
  created_at timestamptz default now()
);

-- One row per guest device
create table devices (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,
  name text,
  photo_count int default 0,
  last_seen timestamptz default now()
);

-- App settings (admin password, photo limit)
create table settings (
  key text primary key,
  value text
);
insert into settings (key, value) values
  ('admin_password', 'admin123'),
  ('photo_limit', '0');
```

### 4. Enable Row Level Security and add policies
Since this app uses the public **anon key** with no user accounts, RLS policies need to allow the anon role to read/write directly:

```sql
alter table photos enable row level security;
alter table devices enable row level security;
alter table settings enable row level security;

create policy "anon full access" on photos for all to anon using (true) with check (true);
create policy "anon full access" on devices for all to anon using (true) with check (true);
create policy "anon full access" on settings for all to anon using (true) with check (true);
```

> ⚠️ This makes the tables fully read/write for anyone with the anon key (which is visible in the page source). That's an acceptable trade-off for a short-lived, low-stakes event gallery, but don't reuse this pattern for anything sensitive. See [Security notes](#-security-notes) below.

### 5. Configure the app
Open `index.html` and replace the placeholder config near the top of the `<body>`:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Both values are in your Supabase project under **Settings → API**.

### 6. Deploy
Since it's a static file, host it anywhere: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or even a plain S3/Supabase storage bucket. HTTPS is required for camera access in most browsers.

## 📱 Usage

1. Open the page on a phone (works best over HTTPS, on a real device — desktop camera access works too for testing).
2. Enter a name when prompted.
3. Tap the shutter to take a photo; it uploads automatically.
4. Switch to the **Gallery** tab to see everyone's photos live.
5. To open the **Admin panel**: pull down on the gallery for 5 seconds (or press `Ctrl+Shift+A` on desktop), then enter the admin password.

## ⚙️ Customization ideas

- Swap the accent color (`--accent` CSS variable) to match your event branding.
- Change the default admin password by editing the `settings` row, or just use the in-app **Change Admin Password** field after first login.
- Adjust `ratioMap` / `RATIOS_DISPLAY` to add or remove aspect ratio options.

## 🔒 Security notes

This is designed for short-lived, casual events — not a production photo-sharing platform. Keep in mind:
- The Supabase anon key is visible in the page source by design; access control relies entirely on your RLS policies, not secrecy of the key.
- The admin password is stored as plain text in the `settings` table — change it from the default before sharing the link, and don't reuse a password you care about.
- Anyone with the link can upload and (if they find the admin gesture) attempt to log into the admin panel — there's no rate limiting beyond the per-device photo cap.

## 📄 License

Add a license of your choice (e.g. MIT) if you plan to share or open-source this.
