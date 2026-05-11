# Implementation Plan: Profile Editing Functionality

## Phase 1: API Integration [checkpoint: 100d89f]
- [x] Task: Add API functions to `lib/api/user.ts` c8aa116
    - [x] Write failing unit tests in `__tests__/lib/api/user.test.ts` for `updateUserProfile` and `updateUserAvatar`
    - [x] Implement `updateUserProfile` (PATCH `/user/me`)
    - [x] Implement `updateUserAvatar` (PATCH `/user/me/avatar`) using `FormData`
    - [x] Ensure tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Integration' (Protocol in workflow.md)

## Phase 2: Form Validation Schema [checkpoint: a772513]
- [x] Task: Create validation schemas f88041f
    - [x] Write unit tests for Zod validation schemas (Name, Bio, Email, Password)
    - [x] Implement Zod schema `profileEditSchema`
    - [x] Ensure tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 2: Form Validation Schema' (Protocol in workflow.md)

## Phase 3: Edit Profile Modal Component
- [x] Task: Build `EditProfileModal` component 1540f77
    - [x] Write component tests in `__tests__/components/EditProfileModal.test.tsx` (rendering, form submission, error handling)
    - [x] Implement UI using Tailwind CSS
    - [x] Integrate React Hook Form with `profileEditSchema`
    - [x] Implement form submission calling `updateUserProfile`
    - [x] Ensure tests pass
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