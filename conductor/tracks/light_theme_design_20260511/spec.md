# Specification: Light Theme Redesign

## Overview
This track aims to redesign the Lyryx frontend application by replacing the existing dark theme with a clean, modern light theme. The primary accent color will be changed from yellow to a deep indigo purple. This change will involve updating global styles, component-specific styles, and adjusting minor UI elements like shadows and borders to ensure a consistent and visually appealing light mode experience.

## Functional Requirements
- **Theme Replacement:** The application must exclusively use a light theme. The existing dark theme will be completely removed.
- **Accent Color:** All primary interactive elements (e.g., focused inputs, links, buttons) that currently use yellow must be updated to use "Deep Indigo" (a sophisticated purple).
- **Backgrounds & Text:** Global backgrounds must be updated to light colors (e.g., white or light gray), and text colors must be updated to dark colors (e.g., black or dark gray) to ensure high contrast and readability.
- **Component Updates:** All existing components (`Navbar`, `SearchBar`, `Footer`, etc.) must be styled to match the new light theme, ensuring proper contrast and visual hierarchy.
- **Minor UI Tweaks:** Shadows, borders, and minor spacing adjustments can be made to enhance the light theme aesthetic.
- **Gradients & Effects:** Existing visual effects, such as the background gradient on the home page and text gradients, must be adjusted or replaced to complement the light theme.

## Non-Functional Requirements
- **Accessibility (a11y):** The new color palette must meet WCAG AA contrast ratios for text and interactive elements.
- **Maintainability:** The implementation should be clean and idiomatic to Tailwind CSS.

## Acceptance Criteria
- [ ] The application background is light (e.g., white or light gray).
- [ ] Main text is dark and easily readable against the light background.
- [ ] The primary accent color is purple ("Deep Indigo") across the application.
- [ ] The `SearchBar` input text, border, and focus states are visible and accessible in the light theme.
- [ ] The `Navbar` and `Footer` match the new light aesthetic.
- [ ] The home page hero text and background effects look cohesive in a light theme context.
- [ ] Minor visual tweaks (shadows, borders) enhance the light theme.
- [ ] The existing dark theme styles (e.g., `bg-black`, `text-white`, `bg-zinc-900`) are removed or refactored.
- [ ] All automated tests pass after the design changes.
- [ ] The layout and visual changes are responsive and look good on mobile devices.

## Out of Scope
- Adding a theme toggle (dark/light mode switch).
- Adding new functional features (e.g., search logic, authentication).
- Major structural layout changes.