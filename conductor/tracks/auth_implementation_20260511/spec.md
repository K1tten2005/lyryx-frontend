# Specification: User Authentication & Registration

## Overview
This track implements user authentication and registration via JWT. The authentication interface will be presented as a Modal Overlay accessible from any page. If a user is not authenticated, the `Navbar` will display a single "Login" button instead of the user profile icon. Clicking this button opens the Auth Modal, where the user can choose to either log in or register. The frontend will communicate with the existing Go backend on `localhost:8080` using the `/v1/auth/*` endpoints.

## Functional Requirements
- **Navbar Integration:** Update the `Navbar` component to display a single "Login" button when the user is not authenticated, and the user profile icon when authenticated.
- **Authentication Modal:** Implement a modal component that opens when "Login" is clicked. It should present the user with a choice to either "Log In" or "Register" and display the corresponding form.
- **Login Flow:**
  - Submit email and password to `POST /v1/auth/sign-in`.
  - On success, save the `access_token` and user data.
- **Registration Flow:**
  - Submit username, email, and password to `POST /v1/auth/sign-up`.
  - On success, save the `access_token` and user data.
- **Sign Out:** Implement logout functionality that calls `POST /v1/auth/sign-out` and clears local session data.
- **State Management:** Use React Context (`AuthContext`) to manage the current user session and authentication token across the application.
- **Form Handling:** Use React Hook Form with Zod for robust form validation.

## Non-Functional Requirements
- **User Feedback:** Use Toast notifications for success/failure events and Global Form Errors inside the modal for general API errors (e.g., "Invalid credentials").
- **Security:** Ensure tokens are stored securely.
- **Styling:** The modal and buttons should match the project's "Modern & Sleek" light theme aesthetic.

## Acceptance Criteria
- [ ] The Navbar shows a "Login" button when logged out.
- [ ] Clicking "Login" in the Navbar opens the Auth Modal.
- [ ] The Auth Modal allows toggling between Login and Registration forms.
- [ ] Users can successfully register a new account.
- [ ] Users can successfully log into an existing account.
- [ ] After login/registration, the modal closes and the Navbar updates to show the authenticated user state.
- [ ] API errors are clearly displayed.
- [ ] The app successfully communicates with the backend at `localhost:8080/v1/auth/*`.

## Out of Scope
- Password reset / "Forgot Password" functionality.
- OAuth (Google, GitHub) login.
- Profile editing (beyond initial registration).
