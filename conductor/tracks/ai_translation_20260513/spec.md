# Specification: AI Lyrics Translation

## Overview
Implement an AI-powered lyrics translation feature on the song page. This feature integrates with the `/v1/song/{id}/ai-translation` backend endpoint, allowing authenticated users to request translations of the entire song's lyrics into a selected language. The translated lines will be displayed line-by-line, interleaved with the original lyrics.

## Functional Requirements
- **Translation Button:** A button labeled "Translate" (or similar) will be placed above the lyrics container on the song page (`app/song/[id]/page.tsx`).
- **Language Selection:** Clicking the button will reveal a dropdown menu listing available target languages.
- **API Integration:** Selecting a language will trigger a `GET` request to `/v1/song/{id}/ai-translation?language={lang}`.
- **Authentication:** The request must include the user's authentication token. If the token is expired, the system will attempt to refresh it.
- **Interleaved Display:** Upon successful response, the translated lyrics will be interleaved line-by-line with the original lyrics.
- **Toggle Functionality:** The user can toggle the visibility of the translation off and on. When active, the button acts as a toggle or provides a "Hide Translation" option.
- **Loading State:** While the API request is pending, the translation button will display a loading spinner and be disabled to prevent duplicate requests.

## Non-Functional Requirements
- **Styling:** The translated lines will be styled differently from the original lyrics to provide visual distinction. Specifically, they will be italicized and use a slightly smaller font size.
- **Performance:** The interleaving logic should not block the main thread or cause significant layout shifts.
- **Annotations Preservation:** The existing annotation functionality (selection, highlighting, bubbles) must continue to work correctly on the original text even when translated lines are visible.

## Acceptance Criteria
- [ ] The translate button and dropdown are visible above the lyrics.
- [ ] Selecting a language fetches the translation from the backend.
- [ ] During the fetch, the button shows a loading spinner.
- [ ] The translated text is displayed line-by-line immediately below the corresponding original line.
- [ ] The translated text is italicized and smaller.
- [ ] The user can toggle the translation off to view only the original lyrics.
- [ ] Text selection and annotations still function accurately on the original lyrics lines.

## Out of Scope
- Translating individual selected lines (the endpoint translates the entire song).
- Annotating the translated text.
- Caching translations on the frontend (re-fetching on subsequent requests if the page reloads).