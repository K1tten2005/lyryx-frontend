# AI Annotation Feature Specification

## Overview
Implement an AI-powered read-only lyrics explanation feature. Users can select lyrics text, click a new "Ask AI" prompt, type a custom question, and receive an AI-generated explanation from the backend.

## Functional Requirements

### 1. UI Additions
*   **Prompt Button:** Add an "Ask AI" button (e.g., with a sparkle icon) next to the existing "Add Annotation" prompt that appears upon text selection.
*   **AI Interaction Bubble:** Implement an interface (reusing or extending the existing bubble style) for the AI interaction.
    *   **Input State:** An input field for the user's question and a "Send" button.
    *   **Loading State:** A visual indicator while waiting for the AI response.
    *   **Result State:** Read-only display of the AI's response text.

### 2. Interaction Flow
1.  User selects a segment of lyrics.
2.  User clicks "Ask AI".
3.  An AI bubble opens near the selected text, prompting the user for a question.
4.  User enters a question and submits.
5.  A loading state is displayed.
6.  The frontend calls `GET /v1/song/{id}/ai-annotation` with the `question`, `start_index`, and `end_index`.
7.  The AI response is displayed as read-only text within the bubble.
8.  The user can dismiss/close the bubble by clicking away or a close button.

### 3. API Integration
*   Create a new API function (e.g., `getAiAnnotation`) to call the `/v1/song/{id}/ai-annotation` endpoint and handle the `GetAiAnnotationOut` response.

## Non-Functional Requirements
*   The new UI components should match the existing Frutiger Aero aesthetic (glassmorphism, vibrant accents).
*   Handle API errors gracefully (e.g., show a toast or error message in the bubble if the request fails).

## Out of Scope
*   Saving the AI response as a permanent community annotation.
*   Editing the AI response.