# Implementation Plan: Song Management

## Phase 1: API Integration (TDD) [checkpoint: 0b9d305]
- [x] Task: Define TypeScript types for Song API
    - [x] Update `lib/api/song.ts` with creation/update payload types matching Swagger.
- [x] Task: Implement API mutation functions
    - [x] Add `createSong`, `updateSong`, and `updateSongCover` to `lib/api/song.ts`.
    - [x] Add failing tests in `__tests__/lib/api/song.test.ts`, then implement to pass.
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Integration (TDD)' (Protocol in workflow.md) 0b9d305

## Phase 2: Song Creation Feature (TDD) [checkpoint: 64c15a6]
- [x] Task: Setup Song Creation Route & Tests
    - [x] Create `__tests__/app/artist/[id]/create-song/page.test.tsx` with failing tests.
- [x] Task: Implement Song Creation Page
    - [x] Create `app/artist/[id]/create-song/page.tsx`.
    - [x] Implement form with `react-hook-form` and `zod` for title, release_date, and lyrics.
    - [x] Handle redirect on success and error states.
- [x] Task: Integrate "Add Song" button
    - [x] Update `app/artist/[id]/page.tsx` to include an "Add Song" button for moderators.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Song Creation Feature (TDD)' (Protocol in workflow.md) 64c15a6

## Phase 3: Song Editing Feature (TDD) [checkpoint: a5a56eb]
- [x] Task: Setup Song Editing Route & Tests
    - [x] Create `__tests__/app/song/[id]/edit/page.test.tsx` with failing tests.
- [x] Task: Implement Edit Song Page
    - [x] Create `app/song/[id]/edit/page.tsx`.
    - [x] Fetch existing song data and populate the form.
    - [x] Implement submission logic for text fields.
- [x] Task: Implement Cover Art Upload
    - [x] Add cover upload UI to the edit page.
    - [x] Implement image file upload handler.
- [x] Task: Integrate "Edit Song" button
    - [x] Update `app/song/[id]/page.tsx` to include an "Edit Song" button for moderators.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Song Editing Feature (TDD)' (Protocol in workflow.md) a5a56eb