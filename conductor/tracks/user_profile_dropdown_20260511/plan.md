# Implementation Plan: User Profile Dropdown & Navbar Refinement

## Phase 1: Context & State Updates [checkpoint: 22c1d7c]
- [x] Task: Update the `UserInfo` interface in `lib/api/auth.ts` to include `avatar_url?: string`. Ensure related mock data in tests is updated if necessary. [fc2805a]
- [x] Task: Update the `logout` function in `contexts/AuthContext.tsx` to trigger a full page reload (`window.location.reload()`) upon successful sign-out. [3ec0378]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Context & State Updates' (Protocol in workflow.md) [22c1d7c]

## Phase 2: UI Implementation
- [x] Task: Create a new `components/UserDropdown.tsx` component. It should manage its own open/closed state, handle clicks outside to close, display the user's avatar (or fallback) alongside their reputation score ("N RS"), and render the dropdown menu. Write corresponding unit tests in `__tests__/components/UserDropdown.test.tsx`. [14e373e]
- [x] Task: Update `components/Navbar.tsx` to render the new `UserDropdown` component instead of the static user icon when the user is authenticated. Update `__tests__/components/Navbar.test.tsx` to reflect these changes. [b667207]
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md)
