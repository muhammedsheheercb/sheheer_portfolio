# Sheheer’s World

An interactive driving portfolio built in the existing Next.js 16 App Router project. The original seven projects, seven WebP previews, 26 skills, career and education entries, and contact links are preserved.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm run start`. The existing Google Fonts integration needs network access during the build.

The contact form uses `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` from `.env`. Missing configuration produces an error with direct-contact alternatives; submissions are never simulated. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin for social image metadata, robots, and sitemap generation. Without it, those routes use the incoming request origin.

## Explore

Use W/A/S/D or arrow keys to drive, S to brake and reverse, Space to jump, Shift to boost, Enter to open a nearby destination, R to respawn, and M to open the destination map. Escape closes panels. The top navigation and world map move the vehicle directly to destinations. On phones, use the steering joystick and accelerator, reverse, jump, and boost buttons.

The reading view provides the same content as accessible, server-rendered HTML. WebGL failures automatically open it, and a no-JavaScript fallback makes the content available without the game. Project previews support previous/next navigation and original live links. The source portfolio has no photography, profile photo, or video assets; the design gallery uses the actual project previews.

## Structure

- `src/lib/portfolio.ts`: original portfolio content and world destinations.
- `src/components/world/WorldExperience.tsx`: navigation, map, dialogs, loading, input, and touch interface.
- `src/components/world/useDrivingControls.ts`: persistent keyboard input, touch input, and pause/blur cleanup.
- `src/components/world/Scene.tsx`: dynamically loaded renderer, loading progress, and physics boundary.
- `src/components/world/Vehicle.tsx`: fixed-step Rapier driving, ground detection, jumping, wheels, and camera.
- `src/components/world/Environment.tsx`: original procedural environment, instanced forest, screenshot displays, colliders, ramp, and movable crates.
- `src/components/world/PortfolioContent.tsx` and `SectionContent.tsx`: server-rendered reading content and shared section panels.
- `src/components/Contact.tsx`: preserved Web3Forms contact integration.

Rendering quality controls cap DPR and switch shadows. Touch devices default to low quality. Paused scenes use demand rendering, assets and the renderer load behind Suspense, and movement does not rely on React state updates. Reduced motion can follow the operating system preference or be enabled in settings.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run start
node scripts/world-check.mjs
```

Pass a URL argument or set `PORTFOLIO_TEST_URL` to select another server. `node scripts/content-check.mjs` compares the migrated data with the original Git revision. The browser check exercises real acceleration, reverse, steering, jumping, collisions, resets, all destinations, project/gallery navigation, reading mode, phone/landscape/tablet overflow, mobile pedals and joystick, robots, and sitemap. Web3Forms success and rejection responses are intercepted; the check sends no real messages. Screenshots are written to `/tmp/world-*.png`. Hardware frame rates and physical iOS/Android behavior need testing on those devices.
