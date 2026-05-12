# AI Annotation Feature Implementation Plan

## Phase 1: API Client Implementation
- [x] Task: Write failing test for `getAiAnnotation` API call in `__tests__/lib/api/song.test.ts` 51b90ff
- [x] Task: Implement `getAiAnnotation` function and schemas in `lib/api/song.ts` to pass tests 51b90ff
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Client Implementation' (Protocol in workflow.md)

## Phase 2: UI Components (Prompt and Bubble)
- [ ] Task: Write failing tests for new `AskAIPrompt` component
- [ ] Task: Implement `AskAIPrompt` component (similar to `CreateAnnotationPrompt`)
- [ ] Task: Write failing tests for new `AIBubble` component (handles input, loading, and result states)
- [ ] Task: Implement `AIBubble` component with Frutiger Aero styling
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Components (Prompt and Bubble)' (Protocol in workflow.md)

## Phase 3: Integration in Song Page
- [ ] Task: Write failing tests for rendering `AskAIPrompt` and `AIBubble` integration in `app/song/[id]/page.tsx`
- [ ] Task: Update `app/song/[id]/page.tsx` to render both prompts side-by-side on text selection
- [ ] Task: Update `app/song/[id]/page.tsx` state management to handle AI bubble opening, submitting question, API fetching, and displaying response
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration in Song Page' (Protocol in workflow.md)