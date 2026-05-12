# Implementation Plan: Annotation Management & Voting

## Phase 1: API Integration & Types
- [x] Task: Define TypeScript interfaces for voting and updated annotation responses in `lib/api/song.ts` or a new `lib/api/annotation.ts`. bb6ccc9
- [x] Task: Implement `updateAnnotation`, `deleteAnnotation`, `voteAnnotation`, and `deleteVote` API functions in `lib/api/song.ts`. bb6ccc9
- [x] Task: Write unit tests for the new API functions in `__tests__/lib/api/song.test.ts`. bb6ccc9
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Integration' (Protocol in workflow.md) [checkpoint: 619795a]

## Phase 2: UI Components (AnnotationBubble Updates)
- [x] Task: Update `AnnotationBubble.tsx` to include Thumbs Up/Down icons and rating counter. 08cf2ff
- [x] Task: Implement "Edit" and "Delete" buttons in `AnnotationBubble.tsx` with visibility logic (author/moderator only). 08cf2ff
- [x] Task: Create a `ConfirmationModal` or use a standard browser `confirm()` for deletion. 08cf2ff
- [x] Task: Implement the inline editing state in `AnnotationBubble.tsx`. 08cf2ff
- [x] Task: Write unit tests for `AnnotationBubble` updates in `__tests__/components/song/AnnotationBubble.test.tsx`. 08cf2ff
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Components' (Protocol in workflow.md)

## Phase 3: Logic & State Management
- [x] Task: Implement voting logic (optimistic updates or SWR revalidation) in `AnnotationBubble`. 08cf2ff
- [x] Task: Implement edit submission logic and error handling. 08cf2ff
- [x] Task: Implement delete logic and redirect/UI cleanup. 08cf2ff
- [x] Task: Verify overall flow and edge cases (unauthenticated voting, session expiry). 08cf2ff
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Logic & State Management' (Protocol in workflow.md)
