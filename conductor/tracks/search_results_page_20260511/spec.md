# Specification: Search Results Page

## Overview
Implementation of a comprehensive search results page that aggregates and categorizes results from the backend search API. This page will serve as the primary landing for all search queries initiated from the application's navbar.

## Functional Requirements
- **Search Integration:** Triggered by queries from the existing `SearchBar` in the `Navbar`.
- **Categorized Results:** Display results in the following categories:
    1. **Artists**
    2. **Songs**
    3. **Lyrics Matched Songs**
    4. **Users**
- **Category Display Logic:**
    - Show up to the first **3 results** for each category on the main results page.
    - If more than 3 results exist, display a "See All" button/link below the 3rd result.
- **"See All" Modal:**
    - Clicking "See All" opens a modal window dedicated to that specific category.
    - The modal must display all available results for that category.
    - Implement **Infinite Scroll** within the modal to handle large result sets.
- **Empty State:** Display a clear "No results found for '[query]'" message when the API returns no matches across all categories.

## Non-Functional Requirements
- **Performance:** Ensure fast loading and smooth transitions when opening modals.
- **SEO:** (Optional) Use appropriate metadata for the search results page.
- **Accessibility:** Ensure result items and modal interactions are keyboard-accessible and screen-reader friendly.

## Design Guidelines (Frutiger Aero)
- **Aesthetic:** Glossy sky-blue backgrounds, glassmorphic translucent panels for result cards.
- **Accents:** Use vibrant purple for "See All" buttons and active states.
- **Feedback:** Subtle hover effects on result items to enhance the interactive feel.

## Technical Details
- **Endpoint:** `/v1/search?q={query}&limit=20`
- **Frontend Stack:** Next.js, React, Tailwind CSS, TypeScript.
- **State Management:** Use local state or context for search results and modal visibility.

## Acceptance Criteria
- [ ] Searching from the navbar redirects to `/search?q={query}`.
- [ ] Results are correctly categorized and ordered (Artists first).
- [ ] Top 3 results are shown, with "See All" appearing only when applicable.
- [ ] "See All" modal opens correctly and populates with relevant category data.
- [ ] Infinite scroll works seamlessly within the modal.
- [ ] Empty state is handled gracefully.

## Out of Scope
- Global site filters (e.g., filter by date, popularity) - to be considered in future tracks.
- Advanced Boolean search operators.
