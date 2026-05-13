# Implementation Plan: Artist Management

## Phase 1: API Integration (TDD) [checkpoint: f64aadf]
- [x] Task: Define TypeScript types for Artist Management API ff57727
    - [x] Update `lib/api/artist.ts` with `PostArtistIn`, `PatchUpdateArtistIn` types ff57727
- [x] Task: Implement API mutation functions ff57727
    - [x] Create `createArtist`, `updateArtist`, and `updateArtistAvatar` functions in `lib/api/artist.ts` ff57727
    - [x] Update `__tests__/lib/api/artist.test.ts` with failing tests, then implement to pass ff57727
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Integration (TDD)' (Protocol in workflow.md) f64aadf

## Phase 2: Create Artist Modal (TDD) [checkpoint: 1555d35]
- [x] Task: Create CreateArtistModal tests d370865
    - [x] Create `__tests__/components/CreateArtistModal.test.tsx` d370865
    - [x] Write failing tests for form rendering, validation, and submission d370865
- [x] Task: Implement CreateArtistModal Component d370865
    - [x] Create `components/CreateArtistModal.tsx` d370865
    - [x] Implement form logic and handle loading/error states d370865
- [x] Task: Integrate Create Artist into UserDropdown d370865
    - [x] Update `components/UserDropdown.tsx` to conditionally render the modal trigger for moderators d370865
- [x] Task: Conductor - User Manual Verification 'Phase 2: Create Artist Modal (TDD)' (Protocol in workflow.md) 1555d35

## Phase 3: Inline Edit on Artist Page (TDD)
- [x] Task: Update Artist Page tests for Inline Editing c4df5ef
    - [x] Update `__tests__/app/artist/[id]/page.test.tsx` to simulate a moderator user c4df5ef
    - [x] Add tests for clicking to edit name/bio and saving c4df5ef
    - [x] Add tests for avatar upload interactions c4df5ef
- [x] Task: Implement Inline Editing UI and Logic c4df5ef
    - [x] Update `app/artist/[id]/page.tsx` c4df5ef
    - [x] Add editable state for name and bio with Save/Cancel buttons c4df5ef
    - [x] Add hidden file input and hover overlay for avatar upload c4df5ef
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Inline Edit on Artist Page (TDD)' (Protocol in workflow.md)