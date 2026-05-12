# Implementation Plan: Song Page

## Phase 1: API Client
- [x] Task: Create test file `lib/api/song.test.ts` with failing tests for fetching a song by ID (Red Phase). (8314d4f)
- [x] Task: Implement `getSongById` function in `lib/api/song.ts` using the `/v1/song/{id}` endpoint to pass tests (Green Phase). (3f9ea5c)
- [~] Task: Conductor - User Manual Verification 'Phase 1: API Client' (Protocol in workflow.md)

## Phase 2: Song Page Component
- [ ] Task: Create test file `__tests__/app/song/[id]/page.test.tsx` with failing tests for rendering the song page, including header elements and lyrics, and handling the 404 state (Red Phase).
- [ ] Task: Implement `app/song/[id]/page.tsx` displaying the song header (cover, title, artist link, release date, view count) and raw lyrics, styled with Tailwind CSS to match the "Frutiger Aero" aesthetic. Ensure proper handling of loading states and the standard Next.js 404 (Green Phase).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Song Page Component' (Protocol in workflow.md)