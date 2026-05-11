# Implementation Plan: Profile Editing Functionality

## Phase 1: API Integration
- [ ] Task: Add API functions to `lib/api/user.ts`
    - [ ] Write failing unit tests in `__tests__/lib/api/user.test.ts` for `updateUserProfile` and `updateUserAvatar`
    - [ ] Implement `updateUserProfile` (PATCH `/user/me`)
    - [ ] Implement `updateUserAvatar` (PATCH `/user/me/avatar`) using `FormData`
    - [ ] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Integration' (Protocol in workflow.md)

## Phase 2: Form Validation Schema
- [ ] Task: Create validation schemas
    - [ ] Write unit tests for Zod validation schemas (Name, Bio, Email, Password)
    - [ ] Implement Zod schema `profileEditSchema`
    - [ ] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Form Validation Schema' (Protocol in workflow.md)

## Phase 3: Edit Profile Modal Component
- [ ] Task: Build `EditProfileModal` component
    - [ ] Write component tests in `__tests__/components/EditProfileModal.test.tsx` (rendering, form submission, error handling)
    - [ ] Implement UI using Tailwind CSS
    - [ ] Integrate React Hook Form with `profileEditSchema`
    - [ ] Implement form submission calling `updateUserProfile`
    - [ ] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Edit Profile Modal Component' (Protocol in workflow.md)

## Phase 4: Avatar Upload Integration
- [ ] Task: Add Avatar Upload to Modal
    - [ ] Update component tests for avatar file selection
    - [ ] Add file input and preview to `EditProfileModal`
    - [ ] Implement upload logic calling `updateUserAvatar`
    - [ ] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Avatar Upload Integration' (Protocol in workflow.md)

## Phase 5: Profile Page Integration
- [ ] Task: Integrate Modal into Profile Header
    - [ ] Update `__tests__/components/UserProfileHeader.test.tsx` to test "Edit Profile" button presence (only for the logged-in user's profile)
    - [ ] Add "Edit Profile" button to `components/UserProfileHeader.tsx`
    - [ ] Manage modal open/close state
    - [ ] Handle UI update upon successful save
    - [ ] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Profile Page Integration' (Protocol in workflow.md)