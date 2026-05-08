// AdSense publisher ID. Hardcoded by design: it's a public identifier
// (appears in page source for verification — that's how AdSense works)
// and hardcoding makes the loader, meta tag, and ads.txt robust to
// Vercel env-var propagation issues. Single source of truth for the ID.
export const ADSENSE_CLIENT_ID = "ca-pub-6985819972152617";
