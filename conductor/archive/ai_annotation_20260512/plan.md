# AI Annotation Feature Implementation Plan

## Phase 1: API Client Implementation [checkpoint: 049bc33]
- [x] Task: Write failing test for `getAiAnnotation` API call in `__tests__/lib/api/song.test.ts` 51b90ff
- [x] Task: Implement `getAiAnnotation` function and schemas in `lib/api/song.ts` to pass tests 51b90ff
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Client Implementation' (Protocol in workflow.md) 049bc33

## Phase 2: UI Components (Prompt and Bubble) [checkpoint: 1689b7c]
- [x] Task: Write failing tests for new `AskAIPrompt` component 06be7b8
- [x] Task: Implement `AskAIPrompt` component (similar to `CreateAnnotationPrompt`) 06be7b8
- [x] Task: Write failing tests for new `AIBubble` component (handles input, loading, and result states) fc0c8f8
- [x] Task: Implement `AIBubble` component with Frutiger Aero styling fc0c8f8
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Components (Prompt and Bubble)' (Protocol in workflow.md) 1689b7c

## Phase 3: Integration in Song Page
- [x] Task: Write failing tests for rendering `AskAIPrompt` and `AIBubble` integration in `app/song/[id]/page.tsx` f19e7dd
- [x] Task: Update `app/song/[id]/page.tsx` to render both prompts side-by-side on text selection f19e7dd
- [x] Task: Update `app/song/[id]/page.tsx` state management to handle AI bubble opening, submitting question, API fetching, and displaying response f19e7dd
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration in Song Page' (Protocol in workflow.md) 049bc33