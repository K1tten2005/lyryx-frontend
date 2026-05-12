# Specification: Song Page

## Overview
Implement a dedicated page to view song details and lyrics. This page will fetch data from the `/v1/song/{id}` endpoint and display the song's cover, title, artist link, release date, view count, and raw lyrics.

## Functional Requirements
- **Route:** The page should be accessible at `/song/[id]`.
- **Data Fetching:** Fetch song data using the `/v1/song/{id}` endpoint.
- **Header Section:** Display the song's title, cover image, artist name (as a link to `/artist/[id]`), release date, and view count.
- **Lyrics Section:** Display the raw text of the song's lyrics.
- **Error Handling:** If the song is not found (404), display the standard Next.js 404 page.

## Non-Functional Requirements
- **Design:** Adhere to the "Frutiger Aero (Web 2.0)" aesthetic (glossy sky-blue backgrounds, glassmorphic panels).
- **Responsiveness:** Ensure the layout looks good on both mobile and desktop screens.
- **Performance:** Handle loading states gracefully (e.g., using skeleton loaders).

## Out of Scope
- Interactive lyrics annotations (creating or viewing).
- Song editing capabilities.
- AI translation or AI annotation features.