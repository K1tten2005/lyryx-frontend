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

## Phase 3: Edit Profile Modal Component [checkpoint: 213a77f]
- [x] Task: Build `EditProfileModal` component 1540f77
    - [x] Write component tests in `__tests__/components/EditProfileModal.test.tsx` (rendering, form submission, error handling)
    - [x] Implement UI using Tailwind CSS
    - [x] Integrate React Hook Form with `profileEditSchema`
    - [x] Implement form submission calling `updateUserProfile`
    - [x] Ensure tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 3: Edit Profile Modal Component' (Protocol in workflow.md)

## Phase 4: Avatar Upload Integration [checkpoint: b8683c7]
- [x] Task: Add Avatar Upload to Modal 12c95f6
    - [x] Update component tests for avatar file selection
    - [x] Add file input and preview to `EditProfileModal`
    - [x] Implement upload logic calling `updateUserAvatar`
    - [x] Ensure tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 4: Avatar Upload Integration' (Protocol in workflow.md)

## Phase 5: Profile Page Integration
- [x] Task: Integrate Modal into Profile Header 17d391f
    - [x] Update `__tests__/components/UserProfileHeader.test.tsx` to test "Edit Profile" button presence (only for the logged-in user's profile)
    - [x] Add "Edit Profile" button to `components/UserProfileHeader.tsx`
    - [x] Manage modal open/close state
    - [x] Handle UI update upon successful save
    - [x] Ensure tests pass
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Profile Page Integration' (Protocol in workflow.md)