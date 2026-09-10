# Blake's Portable Welding

Copy of the current Square site at [blakesportablewelding.com](https://www.blakesportablewelding.com), so the business can leave Square later without changing how the site looks.

This is a separate project from Cortez McKinnon / BFN Tezz.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Estimate requests go to `blakesportablewelding@gmail.com`, including optional photos.

Gmail blocks regular passwords from websites, so the form uses a Google App Password:

1. Turn on 2-Step Verification for `blakesportablewelding@gmail.com`.
2. Create an app password at https://myaccount.google.com/apppasswords
3. In Netlify → Site configuration → Environment variables, set:
   - `GMAIL_USER` = `blakesportablewelding@gmail.com`
   - `GMAIL_APP_PASSWORD` = the 16-character app password (no spaces)
4. Redeploy so the keys take effect.

## Spam protection

The form already drops hidden-field bots, fast automated submits, extra links, and more than 5 sends from the same network in 10 minutes.

For the robot checkbox, add a free [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) widget:

1. Create a Turnstile site for your domain.
2. In Netlify (or `.env.local` for local), set:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — the site key
   - `TURNSTILE_SECRET_KEY` — the secret key
3. Redeploy so the keys take effect.
