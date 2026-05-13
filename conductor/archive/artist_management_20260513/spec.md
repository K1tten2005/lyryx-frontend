# Specification: Artist Management (Moderator Features)

## Overview
Implement the remaining `/artist` API endpoints to allow users with the "moderator" role to create and edit artist profiles.

## Functional Requirements
- **API Integration:**
  - `POST /v1/artist`: Create a new artist (name, bio).
  - `PATCH /v1/artist/{id}`: Update artist details (name, bio).
  - `PATCH /v1/artist/{id}/avatar`: Update artist avatar (multipart/form-data).
- **Access Control:**
  - Only authenticated users with `user.role === 'moderator'` (or equivalent admin role) can see and use these features.
- **Create Artist:**
  - Access point: A "Create Artist" link/button in the Navbar User Dropdown.
  - UX: Opens a modal with a form containing 'Name' and 'Biography' fields.
  - On success, redirects the moderator to the newly created Artist Page (`/artist/[id]`).
- **Edit Artist (Inline):**
  - On the Artist Page (`/artist/[id]`), moderators will see inline editing capabilities.
  - **Avatar:** An overlay with an upload icon appears on hover; selecting an image uploads and updates the avatar immediately.
  - **Name & Biography:** Clicking the text transforms it into an input/textarea with "Save" and "Cancel" buttons.
  - Saving updates the data via the API and updates the local state.

## Non-Functional Requirements
- Ensure proper loading states during API requests (e.g., saving spinners, disabled buttons).
- Use `react-hot-toast` for success and error notifications.
- Ensure the file upload validates images (PNG/JPEG).

## Acceptance Criteria
- A moderator can open the "Create Artist" modal from the Navbar and successfully create an artist.
- Non-moderators do not see the "Create Artist" option or any edit controls on the Artist Page.
- A moderator can edit an artist's name and bio directly on their profile page.
- A moderator can click the artist's avatar to upload a new one and see it update.