## Summary
<!-- One paragraph: what changed and why. Skip the diff narration. -->

## Test plan
- [ ] `npm test` (or `pnpm test`) green
- [ ] `npm run typecheck` green
- [ ] `npm run build` green locally
- [ ] Manual smoke: home page renders + calculator computes + share link works
- [ ] Manual smoke (if touched): /privacy, /terms, /contact, /network, /changelog, /not-found

## Screenshots
<!-- Optional. Required for visible UI changes. -->

## Checklist
- [ ] No new hardcoded brand strings, domains, or hex literals — values flow through `lib/site-config.ts`
- [ ] No raw `process.env.*` reads in components — go through `siteConfig.*`
- [ ] If a new env var was added, it's documented in `.env.example`
