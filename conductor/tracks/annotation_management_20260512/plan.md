# Implementation Plan: Annotation Management & Voting

## Phase 1: API Integration & Types
- [ ] Task: Define TypeScript interfaces for voting and updated annotation responses in `lib/api/song.ts` or a new `lib/api/annotation.ts`.
- [ ] Task: Implement `updateAnnotation`, `deleteAnnotation`, `voteAnnotation`, and `deleteVote` API functions in `lib/api/song.ts`.
- [ ] Task: Write unit tests for the new API functions in `__tests__/lib/api/song.test.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Integration' (Protocol in workflow.md)

## Phase 2: UI Components (AnnotationBubble Updates)
- [ ] Task: Update `AnnotationBubble.tsx` to include Thumbs Up/Down icons and rating counter.
- [ ] Task: Implement "Edit" and "Delete" buttons in `AnnotationBubble.tsx` with visibility logic (author/moderator only).
- [ ] Task: Create a `ConfirmationModal` or use a standard browser `confirm()` for deletion.
- [ ] Task: Implement the inline editing state in `AnnotationBubble.tsx`.
- [ ] Task: Write unit tests for `AnnotationBubble` updates in `__tests__/components/song/AnnotationBubble.test.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Components' (Protocol in workflow.md)

## Phase 3: Logic & State Management
- [ ] Task: Implement voting logic (optimistic updates or SWR revalidation) in `AnnotationBubble`.
- [ ] Task: Implement edit submission logic and error handling.
- [ ] Task: Implement delete logic and redirect/UI cleanup.
- [ ] Task: Verify overall flow and edge cases (unauthenticated voting, session expiry).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Logic & State Management' (Protocol in workflow.md)
