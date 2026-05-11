# Implementation Plan: User Profile Page Implementation

## Phase 1: API Integration & Data Models
- [x] Task: Define the necessary TypeScript interfaces in `lib/api/user.ts` (or equivalent file) based on the Swagger definitions: `GetUserByIDOut`, `UserAnnotation`, and `GetUserAnnotationsOut`. 92cd8a8
- [x] Task: Implement the API client functions to fetch user data (`GET /v1/user/{id}`) and user annotations (`GET /v1/user/{id}/annotations`). Ensure error handling is robust. 37128c6
- [x] Task: Write unit tests for the new API client functions, mocking the `fetch` calls to ensure correct data parsing and error throwing. 37128c6
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Integration & Data Models' (Protocol in workflow.md)

## Phase 2: User Profile Page Structure & Routing
- [ ] Task: Create the dynamic route file `app/user/[id]/page.tsx` for the user profile page.
- [ ] Task: Implement a foundational server component or client component (depending on data fetching strategy, likely client-side for dynamic tabs and pagination) that reads the `[id]` parameter.
- [ ] Task: Update the `UserDropdown` component (`components/UserDropdown.tsx`) so that the "Profile" button navigates to `/user/${user.user_id}` instead of being a no-op. Write/update tests for `UserDropdown` to verify the routing behavior.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: User Profile Page Structure & Routing' (Protocol in workflow.md)

## Phase 3: Profile UI Construction
- [ ] Task: Create a `components/UserProfileHeader.tsx` component to display the user's avatar, username, bio, reputation score, and role. Write unit tests for this component.
- [ ] Task: Create a `components/UserAnnotationsTab.tsx` component to render the list of annotations. This component should display the song context (cover, title, artist) and the annotation details (content, rating, date) for each item. Write unit tests for this component.
- [ ] Task: Integrate `UserProfileHeader` and `UserAnnotationsTab` into `app/user/[id]/page.tsx`. Implement the tabbed layout logic (using state to switch between tabs, even if only "Annotations" exists initially).
- [ ] Task: Implement loading states (e.g., skeletons) for the user info and annotations while data is being fetched.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Profile UI Construction' (Protocol in workflow.md)