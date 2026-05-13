# Specification: Artist Page

## Overview
Implement a dedicated Artist Page that displays the artist's profile information and a list of their songs. This page will consume the `/v1/artist/{id}` endpoint.

## Functional Requirements
- **Route:** The page should be accessible at `/artist/[id]`.
- **Data Fetching:** 
  - Fetch artist data from the API endpoint `/v1/artist/{id}`.
  - The API returns: `id`, `name`, `bio`, `avatar_url`, and `songs` (array of songs with `id`, `title`, `cover_url`, `release_date`, `views`).
- **Header Section:**
  - Display the artist's avatar, name, and biography.
  - Layout: **Centered** (Large avatar centered above the Name and Bio).
- **Songs Section:**
  - Display the artist's discography.
  - Layout: **Vertical List** (Classic list view with small thumbnails, title, release date, and views count).
- **Empty States / Missing Data:**
  - If the biography is missing, display a placeholder text (e.g., "Biography not provided").
  - If there are no songs, display a placeholder message (e.g., "No songs found").

## Non-Functional Requirements
- Ensure loading states (skeletons or spinners) are shown while fetching data.
- Handle error states gracefully (e.g., "Artist not found" for 404, handled via `notFound()`).
- Styling should align with the project's Frutiger Aero aesthetic (glossy backgrounds, glassmorphic panels).

## Acceptance Criteria
- User can navigate to `/artist/[id]` and view the artist profile.
- The header is centered with avatar, name, and bio.
- Songs are displayed in a vertical list with correct details.
- Placeholder texts are visible if bio or songs are missing.
- Loading and error states are handled properly.