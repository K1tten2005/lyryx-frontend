# Specification: Lyrics Annotation Functionality

## 1. Overview
Implement an interactive annotation system for the Song Page, allowing users to view, create, and interact with lyrics explanations, similar to Genius.com.

## 2. Functional Requirements
### 2.1 Viewing Annotations
- **Data Fetching:** Fetch all annotations for the current song using `GET /v1/song/{id}/annotations` upon page load.
- **Visual Highlighting:** Annotated text fragments must be highlighted with a light gray background (Genius style).
- **Interaction:** Clicking a highlighted fragment must open an annotation "bubble" (popover/side panel) on the right side of the lyrics block.
- **Content:** The bubble displays the annotation text, author's username, and reputation score.

### 2.2 Creating Annotations
- **Text Selection:** Users can select one or multiple lines of lyrics.
- **Creation Prompt:** A "Create Annotation" button appears to the right of the selected text, aligned with the bottom of the selection.
- **Editor:** Clicking the prompt opens an empty annotation bubble with a text area for input.
- **Submission:** Annotations are saved via `POST /v1/song/{id}/annotation`, sending the `content`, `start_index`, and `end_index`.
- **Validation:** Creation is only available for authenticated users.

### 2.3 Interaction Rules
- **Selection Overlap:** Prevent selection of text that already contains or overlaps with an existing annotation (per API constraints).
- **Bubble Behavior:** Only one annotation bubble should be active at a time.

## 3. Non-Functional Requirements
- **Design:** The annotation bubble and creation prompt must adhere to the Frutiger Aero aesthetic (glassmorphism, vibrant accents).
- **UX:** Smooth transitions when opening/closing bubbles and appearing prompts.

## 4. Acceptance Criteria
- [ ] Lyrics with annotations are visually distinct on load.
- [ ] Clicking an annotation correctly displays its content in a right-aligned bubble.
- [ ] Selecting lyrics shows a "Create" button in the correct position.
- [ ] Submitting a new annotation successfully saves it to the backend and reflects it in the UI.
- [ ] Only authenticated users can see the creation prompt and submit annotations.

## 5. Out of Scope
- AI-generated annotations (to be implemented in a future track).
- Voting on annotations (to be implemented in a future track).
- Editing or deleting existing annotations (to be implemented in a future track).