# Implementation Plan: Song Management

## Phase 1: API Integration (TDD)
- [ ] Task: Define TypeScript types for Song API
    - [ ] Update `lib/api/song.ts` with creation/update payload types matching Swagger.
- [ ] Task: Implement API mutation functions
    - [ ] Add `createSong`, `updateSong`, and `updateSongCover` to `lib/api/song.ts`.
    - [ ] Add failing tests in `__tests__/lib/api/song.test.ts`, then implement to pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Integration (TDD)' (Protocol in workflow.md)

## Phase 2: Song Creation Feature (TDD)
- [ ] Task: Setup Song Creation Route & Tests
    - [ ] Create `__tests__/app/artist/[id]/create-song/page.test.tsx` with failing tests.
- [ ] Task: Implement Song Creation Page
    - [ ] Create `app/artist/[id]/create-song/page.tsx`.
    - [ ] Implement form with `react-hook-form` and `zod` for title, release_date, and lyrics.
    - [ ] Handle redirect on success and error states.
- [ ] Task: Integrate "Add Song" button
    - [ ] Update `app/artist/[id]/page.tsx` to include an "Add Song" button for moderators.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Song Creation Feature (TDD)' (Protocol in workflow.md)

## Phase 3: Song Editing Feature (TDD)
- [ ] Task: Setup Song Editing Route & Tests
    - [ ] Create `__tests__/app/song/[id]/edit/page.test.tsx` with failing tests.
- [ ] Task: Implement Edit Song Page
    - [ ] Create `app/song/[id]/edit/page.tsx`.
    - [ ] Fetch existing song data and populate the form.
    - [ ] Implement submission logic for text fields.
- [ ] Task: Implement Cover Art Upload
    - [ ] Add cover upload UI to the edit page.
    - [ ] Implement image file upload handler.
- [ ] Task: Integrate "Edit Song" button
    - [ ] Update `app/song/[id]/page.tsx` to include an "Edit Song" button for moderators.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Song Editing Feature (TDD)' (Protocol in workflow.md)