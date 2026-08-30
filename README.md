# MEDUS

Static MVP for **MEDUS · Medical Education & Assessment Platform**.

## Current launch status

- GitHub repo: `https://github.com/doctordat/medus`
- Supabase project URL: `https://dyghkjnfdpxybutitizo.supabase.co`
- Public Supabase config: `assets/supabase-config.js`
- Google Sign-In entry: `auth/index.html`
- Mastery dashboard after login: `mastery/index.html`
- QBank attempts and mastery sync to Supabase in `qbank/index.html`

## Run locally

```bash
python3 -m http.server 4180
# open http://localhost:4180/
```

Because this is a static site, there is no build step required for the current MVP.

## OAuth launch checklist

If Google login shows `Error 400: redirect_uri_mismatch`, the app code has already reached Google. Fix Google Cloud OAuth config:

1. Google Cloud → Google Auth Platform → Clients → `MEDUS Web`.
2. In **Authorized redirect URIs**, add exactly:

   ```text
   https://dyghkjnfdpxybutitizo.supabase.co/auth/v1/callback
   ```

3. Do **not** put that callback only in Authorized JavaScript origins.
4. Do **not** add a trailing slash.
5. Wait ~30-60 seconds after saving, then test `auth/` → **Tiếp tục với Google** again.

Also confirm Supabase Authentication URL settings allow the deployed site URL, e.g. GitHub Pages URL and `/mastery/` callback path when used as `redirectTo`.

## Safety notes

- Supabase publishable key in this repo is intended to be public client-side config.
- Never commit Google Client Secret, service role key, or private Supabase keys.
- Content is educational; avoid presenting MEDUS output as a replacement for clinician judgment.
