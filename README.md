# Blake's Portable Welding

Copy of the current Square site at [blakesportablewelding.com](https://www.blakesportablewelding.com), so the business can leave Square later without changing how the site looks.

This is a separate project from Cortez McKinnon / BFN Tezz.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Estimate requests stay on the site and go to `blakesportablewelding@gmail.com` through FormSubmit. Text-only requests use AJAX. Requests with photos use a hidden form post so the pictures actually attach. The first live photo submit may ask that inbox to confirm email delivery once.

## Spam protection

The form already drops hidden-field bots, fast automated submits, extra links, and more than 5 sends from the same network in 10 minutes.

For the robot checkbox, add a free [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) widget:

1. Create a Turnstile site for your domain.
2. In Netlify (or `.env.local` for local), set:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — the site key
   - `TURNSTILE_SECRET_KEY` — the secret key
3. Redeploy so the keys take effect.
