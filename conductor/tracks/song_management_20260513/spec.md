# Specification: Song Management (Creation & Editing)

## Overview
Implement the ability for moderators to create new songs for an artist and edit existing song details (including cover art) via dedicated pages.

## Functional Requirements
- **Access Control:** 
  - Only authenticated users with the `moderator` role can see song creation/editing controls and access the respective routes.
- **Song Creation (`/artist/[id]/create-song` or modal on artist page):**
  - Access point: A "Add Song" button on the Artist profile page (`/artist/[id]`), visible only to moderators.
  - The creation form should include fields for: `title` (Text), `release_date` (Date), and `lyrics` (Plain Text Area).
  - The `artist_id` is supplied implicitly by the context of the Artist page.
  - On success, redirects the user to the newly created Song Page (`/song/[id]`).
- **Song Editing (`/song/[id]/edit`):**
  - Access point: An "Edit Song" button on the Song Page (`/song/[id]`), visible only to moderators.
  - The dedicated edit page allows updating: `title`, `release_date`, and `lyrics`.
  - **Cover Art Upload:** Provide a file upload component on the edit page (or inline cover click) to upload and preview the song's cover image.
- **API Integration:**
  - `POST /v1/song`: Create a song.
  - `PATCH /v1/song/{id}`: Update song details.
  - `PATCH /v1/song/{id}/cover`: Upload/update cover image.

## Non-Functional Requirements
- Ensure proper loading states during API requests (e.g., saving spinners, disabled buttons).
- Use `react-hot-toast` for success and error notifications.
- Form validation using `react-hook-form` and `zod` for required fields.
- Match the existing Frutiger Aero design aesthetic.

## Acceptance Criteria
- A moderator can click "Add Song" on an artist's page and successfully create a song.
- The new song appears in the artist's discography and redirects correctly.
- A moderator can click "Edit Song" on a song page, navigate to `/song/[id]/edit`, update text details and the cover image, and save successfully.
- Non-moderators do not see the "Add/Edit Song" buttons and are redirected/denied access to the creation/edit routes.