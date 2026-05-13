# Implementation Plan: AI Lyrics Translation

## Phase 1: API Client & Data Types
- [x] Task: Update API Types and Functions (5e8cc64)
    - [ ] Update `lib/api/song.ts` to include the `GetAiTranslationOut` type.
    - [ ] Create `getAiTranslation` function in `lib/api/song.ts` to call `/v1/song/{id}/ai-translation`.
- [ ] Task: Write Tests for API Client
    - [ ] Write unit tests for `getAiTranslation` in `__tests__/lib/api/song.test.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Client & Data Types' (Protocol in workflow.md)

## Phase 2: UI Component Implementation
- [ ] Task: Write Tests for UI State
    - [ ] Create tests in `__tests__/app/song/[id]/page.test.tsx` verifying the presence and behavior of the translation toggle and language dropdown.
- [ ] Task: Implement Translation State and Fetching
    - [ ] Add state variables in `app/song/[id]/page.tsx` for `targetLanguage`, `isTranslationLoading`, and `translatedLyrics` (or similar).
    - [ ] Implement the `handleTranslate` function that calls `getAiTranslation` and manages loading state.
- [ ] Task: Implement Translation Controls UI
    - [ ] Render the "Translate" button with loading spinner state above the lyrics.
    - [ ] Render the language selection dropdown next to the button.
    - [ ] Implement toggle functionality (hide/show translated lyrics).
- [ ] Task: Implement Interleaved Rendering Logic
    - [ ] Modify the lyrics rendering logic in `app/song/[id]/page.tsx`.
    - [ ] Split both `song.lyrics` and `translatedLyrics` by newline.
    - [ ] Update the rendering algorithm to correctly map original text and annotations while injecting the corresponding translated line below each original line.
    - [ ] Apply italicized and smaller text styling to the translated lines.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Component Implementation' (Protocol in workflow.md)