# Specification: Profile Editing Functionality

## Overview
Implement functionality allowing users to edit their profile information and change their avatar directly from their user profile page. This will utilize the existing `PATCH /user/me` and `PATCH /user/me/avatar` backend endpoints.

## Functional Requirements
- **Edit Profile Modal:** Implement a modal dialog that opens when the user clicks an "Edit Profile" button on their profile page.
- **Editable Fields:** The modal should allow the user to modify the following fields using the `PATCH /user/me` endpoint:
  - Name
  - Bio
  - Email
  - Password
- **Avatar Upload:** 
  - Provide an interface within the modal (or triggering a file dialog directly) to select a new image file.
  - Implement direct file upload using the `PATCH /user/me/avatar` endpoint.
- **Form Validation:** Use React Hook Form and Zod to validate inputs client-side before submission.
- **State Update:** Upon successful update, the user's profile information displayed on the page should reflect the changes immediately.

## Non-Functional Requirements
- **UI/UX:** Adhere to the "Modern & Sleek" design tone, using Tailwind CSS, and ensure a responsive mobile-first experience.
- **Error Handling:** Display clear, user-friendly error messages for failed requests.

## Acceptance Criteria
- [ ] User can open the "Edit Profile" modal.
- [ ] User can successfully update Name, Bio, Email, and Password.
- [ ] Form input is validated client-side.
- [ ] User can upload a new avatar image.
- [ ] Profile page UI updates immediately after successful save.

## Out of Scope
- Image cropping before upload.
- Additional verification flows for email/password changes (beyond what the backend strictly requires/returns).