# Implementation Plan: User Authentication & Registration

## Phase 1: State Management & API Integration
- [~] Task: Create API client functions to communicate with the Go backend (`/v1/auth/sign-in`, `/v1/auth/sign-up`, `/v1/auth/sign-out`).
- [ ] Task: Implement `AuthContext` to manage the authentication state (token, current user info) and provide login, register, and logout actions.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: State Management & API Integration' (Protocol in workflow.md)

## Phase 2: Forms & Modal UI
- [ ] Task: Implement the Login form using React Hook Form and Zod for validation, including Toast/Global error feedback.
- [ ] Task: Implement the Registration form using React Hook Form and Zod for validation, handling API error feedback.
- [ ] Task: Implement the `AuthModal` component to host the forms, manage the toggle state between Login and Registration, and handle modal visibility.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Forms & Modal UI' (Protocol in workflow.md)

## Phase 3: Navbar Integration & Polish
- [ ] Task: Update the `Navbar` component to display a single "Login" button when the user is not authenticated (which opens the AuthModal).
- [ ] Task: Update the `Navbar` component to display the user profile icon when the user is authenticated.
- [ ] Task: Run full test suite and ensure all components meet the >80% coverage requirement.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Navbar Integration & Polish' (Protocol in workflow.md)
