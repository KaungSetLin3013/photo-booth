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


