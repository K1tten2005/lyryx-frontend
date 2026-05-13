# Implementation Plan: Artist Management

## Phase 1: API Integration (TDD)
- [x] Task: Define TypeScript types for Artist Management API ff57727
    - [x] Update `lib/api/artist.ts` with `PostArtistIn`, `PatchUpdateArtistIn` types ff57727
- [x] Task: Implement API mutation functions ff57727
    - [x] Create `createArtist`, `updateArtist`, and `updateArtistAvatar` functions in `lib/api/artist.ts` ff57727
    - [x] Update `__tests__/lib/api/artist.test.ts` with failing tests, then implement to pass ff57727
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Integration (TDD)' (Protocol in workflow.md)

## Phase 2: Create Artist Modal (TDD)
- [ ] Task: Create CreateArtistModal tests
    - [ ] Create `__tests__/components/CreateArtistModal.test.tsx`
    - [ ] Write failing tests for form rendering, validation, and submission
- [ ] Task: Implement CreateArtistModal Component
    - [ ] Create `components/CreateArtistModal.tsx`
    - [ ] Implement form logic and handle loading/error states
- [ ] Task: Integrate Create Artist into UserDropdown
    - [ ] Update `components/UserDropdown.tsx` to conditionally render the modal trigger for moderators
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Create Artist Modal (TDD)' (Protocol in workflow.md)

## Phase 3: Inline Edit on Artist Page (TDD)
- [ ] Task: Update Artist Page tests for Inline Editing
    - [ ] Update `__tests__/app/artist/[id]/page.test.tsx` to simulate a moderator user
    - [ ] Add tests for clicking to edit name/bio and saving
    - [ ] Add tests for avatar upload interactions
- [ ] Task: Implement Inline Editing UI and Logic
    - [ ] Update `app/artist/[id]/page.tsx`
    - [ ] Add editable state for name and bio with Save/Cancel buttons
    - [ ] Add hidden file input and hover overlay for avatar upload
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Inline Edit on Artist Page (TDD)' (Protocol in workflow.md)