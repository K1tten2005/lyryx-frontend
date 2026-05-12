# Implementation Plan: Lyrics Annotation

## Phase 1: API and Types Foundation
- [x] Task: Update Annotation API client (`lib/api/song.ts`) with `getSongAnnotations` and `createAnnotation` methods. 85745fa
- [x] Task: Define TypeScript interfaces for Annotations and API responses. 85745fa
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API and Types Foundation' (Protocol in workflow.md)

## Phase 2: Highlighting and Viewing
- [ ] Task: Implement `AnnotationHighlight` component to wrap and style annotated lyrics fragments.
- [ ] Task: Update `SongPage` to fetch and map annotations to the lyrics text.
- [ ] Task: Implement `AnnotationBubble` component for displaying annotation content in a glassmorphic sidebar/popover.
- [ ] Task: Add logic to open `AnnotationBubble` on clicking highlighted lyrics.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Highlighting and Viewing' (Protocol in workflow.md)

## Phase 3: Text Selection and Creation Prompt
- [ ] Task: Implement a custom hook for managing lyrics text selection and calculating coordinates.
- [ ] Task: Create `CreateAnnotationPrompt` button component that appears next to the selection.
- [ ] Task: Add logic to position the prompt to the right of the selection's last line.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Text Selection and Creation Prompt' (Protocol in workflow.md)

## Phase 4: Annotation Creation and Final Polish
- [ ] Task: Implement the "Create Mode" for `AnnotationBubble` with a text editor and submission logic.
- [ ] Task: Add optimistic UI updates or re-fetching after successful annotation creation.
- [ ] Task: Ensure the whole system follows Frutiger Aero design guidelines (glossy effects, transitions).
- [ ] Task: Final cross-browser and mobile responsiveness check.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Annotation Creation and Final Polish' (Protocol in workflow.md)