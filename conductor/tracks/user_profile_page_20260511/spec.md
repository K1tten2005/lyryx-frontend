# Specification: User Profile Page Implementation

## Overview
This track implements the User Profile page for the application, acting as a Genius.com analogue. The profile page will display user information (avatar, bio, reputation score, etc.) and a list of annotations created by the user. It will use a split-view or tabbed layout and utilize standard ID-based routing (`/user/[id]`). The "Profile" button in the Navbar's user dropdown will be updated to link to this new page for the authenticated user.

## Functional Requirements
- **Routing:** Implement a dynamic route `/user/[id]` to display the profile of a specific user. The "Profile" button in the `Navbar` must route to the current authenticated user's profile ID.
- **Data Fetching (User Info):** Fetch user data using the `GET /v1/user/{id}` endpoint.
- **Data Fetching (Annotations):** Fetch the user's annotations using the `GET /v1/user/{id}/annotations` endpoint. This should support pagination if `has_more` is true.
- **Profile UI (Tabbed Layout):**
  - **Header/Sidebar:** Display the user's `avatar_url`, `username`, `bio`, `reputation_score`, and `role`.
  - **Main Content Area (Tabs):** Implement a tabbed interface. Initially, this will contain an "Annotations" tab.
- **Annotations Display:**
  - In the "Annotations" tab, render the list of annotations returned by the API (`GetUserAnnotationsOut` containing `UserAnnotation` items).
  - Each annotation item must display contextual information about the song (`song.title`, `song.artist.name`, `song.cover_url`) alongside the annotation details (`content`, `rating`, `created_at`). This provides a rich, Genius-like context for the user's contributions.
- **Authentication:** Publicly accessible. Unauthenticated users can view profiles.

## Non-Functional Requirements
- **Styling:** Adhere to the "Modern & Sleek" design tone (minimalist, light-themed, vibrant purple/indigo accent color) using Tailwind CSS.
- **Loading States:** Provide skeleton loaders or spinners while fetching user data and annotations.
- **Error Handling:** Display appropriate error messages if the user is not found (404) or if the API request fails.

## Acceptance Criteria
- [ ] Navigating to `/user/[id]` successfully renders the user's profile page.
- [ ] The "Profile" button in the `UserDropdown` navigates to the authenticated user's profile page.
- [ ] User information (avatar, username, bio, reputation) is correctly fetched and displayed.
- [ ] A tabbed interface is present, with an "Annotations" tab displaying the user's annotations.
- [ ] The annotations list correctly renders the annotated song context (cover, title, artist) along with the annotation content, rating, and creation date.
- [ ] Loading and error states are handled gracefully.

## Out of Scope
- Editing the user profile (e.g., changing bio, uploading a new avatar). This will be a separate track.
- Deleting annotations from the profile page.