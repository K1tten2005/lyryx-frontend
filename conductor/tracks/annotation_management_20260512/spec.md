# Specification: Annotation Management & Voting

## Overview
This track implements the functionality to edit, delete, and vote on lyrics annotations. It focuses on providing users with the ability to manage their own contributions and interact with others' annotations through a voting system (likes/dislikes).

## Functional Requirements
### 1. Annotation Editing
- **Permission:** Only the author of the annotation can edit it.
- **Action:** Users can modify the content of their annotations.
- **API:** Uses `PATCH /v1/annotation/{id}`.
- **UI:** An "Edit" button will be added inline to the `AnnotationBubble`. Clicking it will transform the text into a textarea or open an inline editor.

### 2. Annotation Deletion
- **Permission:** Only the author or a moderator can delete an annotation.
- **Action:** Users can permanently remove an annotation.
- **Confirmation:** A confirmation dialog is required before deletion.
- **API:** Uses `DELETE /v1/annotation/{id}`.
- **UI:** A "Delete" button will be added inline to the `AnnotationBubble`.

### 3. Voting System
- **Permission:** Any authenticated user can vote.
- **Action:** Users can cast a +1 (Like) or -1 (Dislike) vote.
- **Toggle:** Clicking the same vote again cancels it (`DELETE /v1/annotation/{id}/vote`).
- **API:** Uses `POST /v1/annotation/{id}/vote` and `DELETE /v1/annotation/{id}/vote`.
- **UI:** Thumbs Up/Down icons with a counter will be added to the `AnnotationBubble`.

## Non-Functional Requirements
- **Feedback:** Use `react-hot-toast` for success and error notifications.
- **Real-time Update:** UI should update optimistically or revalidate data immediately after actions using SWR.
- **Styling:** Adhere to Frutiger Aero / Glassmorphic design principles as defined in `product.md`.

## Acceptance Criteria
- Authors can successfully edit their annotations and see the changes reflected.
- Authors and moderators can delete annotations after confirming.
- Users can like/dislike annotations, and the UI correctly reflects their own vote state and the total rating.
- Unauthorized users (not authors/moderators) cannot see or trigger edit/delete actions.
- Unauthenticated users are prompted to log in when trying to vote.

## Out of Scope
- Moderator-specific dashboard for mass deletion (managed via inline delete for now).
- Detailed voting history for users.
