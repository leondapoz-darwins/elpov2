# elpov2

Password-protected preview page for ELPO v2, styled to match elpo.eu (brand blue `#0064a8`, Inter / Roboto Condensed). Deployed via GitHub Pages at https://elpov2.darwins.eu.

## How the password gate works

The page (`index.html`) is a single static file. The protected content is encrypted with **AES-GCM-256** using a key derived from the password via **PBKDF2-SHA-256 (200,000 iterations)**. The browser decrypts in-memory after the user submits the password — no server, no cookies. Wrong password = decryption fails, nothing is revealed.

Because the ciphertext is genuinely encrypted, the source of the page can be public.

## Updating the password or content

1. Edit `content/protected.html`.
2. Re-encrypt and copy the JSON output:

   ```bash
   node tools/encrypt.js "<new-password>" content/protected.html
   ```

3. Replace the `PAYLOAD = { ... }` object inside `index.html` with the JSON from step 2.
4. Commit and push — GitHub Pages auto-deploys.

## Deployment

- GitHub Pages is configured to serve from the `main` branch root.
- `CNAME` pins the custom domain `elpov2.darwins.eu`.
- DNS: a `CNAME` record `elpov2.darwins.eu → leondapoz-darwins.github.io` is required (configured in Cloudflare for darwins.eu).

## Files

- `index.html` — the page (gate UI + decryption logic + encrypted payload)
- `content/protected.html` — plaintext source of the protected fragment (not deployed; kept for re-encryption)
- `tools/encrypt.js` — re-encryption helper (Node, no deps)
- `assets/logo.jpg` — ELPO logo, mirrored from elpo.eu
- `CNAME` — custom domain for GitHub Pages
