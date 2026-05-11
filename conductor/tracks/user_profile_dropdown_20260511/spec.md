# Specification: User Profile Dropdown & Navbar Refinement

## Overview
This track updates the authenticated user's view in the `Navbar`. It replaces the simple user icon with a detailed button showing the user's avatar and their current reputation score (e.g., "10 RS"). Clicking this button toggles a dropdown menu with "Profile" and "Logout" options. The logout action will clear the session via the backend `/v1/auth/sign-out` endpoint and refresh the current page to ensure all client states are accurately reset.

## Functional Requirements
- **Update Auth Models:** Ensure the `UserInfo` type includes an `avatar_url` (optional) and the existing `reputation_score`.
- **Navbar Profile Button:** 
  - Display the user's avatar image if `avatar_url` is present.
  - Display the default Lucide `User` icon if `avatar_url` is missing or fails to load.
  - Display the `reputation_score` formatted as "N RS" (e.g., "150 RS") next to the avatar.
  - The entire area (avatar + RS) must be clickable to toggle the dropdown.
- **Dropdown Menu:**
  - Implemented using custom React state (`useState`).
  - Must include logic to close the dropdown when clicking outside of it.
  - Contains two menu items: "Profile" and "Logout".
- **Menu Actions:**
  - **Profile:** Currently a no-op (does nothing when clicked, but visually acts as a placeholder for future routing).
  - **Logout:** Calls the `logout()` function from `AuthContext` (which hits `/v1/auth/sign-out`). Upon success, it triggers a full page reload (`window.location.reload()`) to clear all in-memory application states.

## Non-Functional Requirements
- **Styling:** The dropdown must match the project's "Modern & Sleek" aesthetic, utilizing Tailwind CSS for clean borders, shadows, and hover states.
- **Accessibility:** Ensure the dropdown is positioned correctly and the toggle button is keyboard accessible.

## Acceptance Criteria
- [ ] Authenticated users see their avatar (or default icon) and "N RS" in the Navbar.
- [ ] Clicking the profile button opens a dropdown menu.
- [ ] Clicking outside the open dropdown closes it.
- [ ] The dropdown contains "Profile" (no-op) and "Logout" buttons.
- [ ] Clicking "Logout" calls the backend sign-out endpoint, clears local session storage, and reloads the current page.

## Out of Scope
- Implementing the actual Profile page routing/view.
- Uploading or editing the user's avatar.
- Real-time updates for the reputation score (relies on initial load/auth state).
