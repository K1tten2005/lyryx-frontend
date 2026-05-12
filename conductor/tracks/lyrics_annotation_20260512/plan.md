# Implementation Plan: Lyrics Annotation

## Phase 1: API and Types Foundation
- [x] Task: Update Annotation API client (`lib/api/song.ts`) with `getSongAnnotations` and `createAnnotation` methods. 85745fa
- [x] Task: Define TypeScript interfaces for Annotations and API responses. 85745fa
- [x] Task: Conductor - User Manual Verification 'Phase 1: API and Types Foundation' (Protocol in workflow.md) [checkpoint: 5b1a243]

## Phase 2: Highlighting and Viewing [checkpoint: b0ff605]
- [x] Task: Implement `AnnotationHighlight` component to wrap and style annotated lyrics fragments. 7564213
- [x] Task: Update `SongPage` to fetch and map annotations to the lyrics text. 7564213
- [x] Task: Implement `AnnotationBubble` component for displaying annotation content in a glassmorphic sidebar/popover. 7564213
- [x] Task: Add logic to open `AnnotationBubble` on clicking highlighted lyrics. 7564213
- [x] Task: Conductor - User Manual Verification 'Phase 2: Highlighting and Viewing' (Protocol in workflow.md) b0ff605

## Phase 3: Text Selection and Creation Prompt [checkpoint: 578adea]
- [x] Task: Implement a custom hook for managing lyrics text selection and calculating coordinates. 578adea
- [x] Task: Create `CreateAnnotationPrompt` button component that appears next to the selection. 578adea
- [x] Task: Add logic to position the prompt to the right of the selection's last line. 578adea
- [x] Task: Conductor - User Manual Verification 'Phase 3: Text Selection and Creation Prompt' (Protocol in workflow.md) 578adea

## Phase 4: Annotation Creation and Final Polish [checkpoint: final]
- [x] Task: Implement the "Create Mode" for `AnnotationBubble` with a text editor and submission logic. final
- [x] Task: Add optimistic UI updates or re-fetching after successful annotation creation. final
- [x] Task: Ensure the whole system follows Frutiger Aero design guidelines (glossy effects, transitions). final
- [x] Task: Final cross-browser and mobile responsiveness check. final
- [x] Task: Conductor - User Manual Verification 'Phase 4: Annotation Creation and Final Polish' (Protocol in workflow.md) final