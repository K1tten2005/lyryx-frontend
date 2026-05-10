# Implementation Plan: Light Theme Redesign

## Phase 1: Global Styles and Tailwind Configuration [checkpoint: f0a09b8]
- [x] Task: Update `tailwind.config.js` to define the new custom purple accent color ("Deep Indigo") and any necessary light theme background/text variables. [c3379f8]
- [x] Task: Update `app/globals.css` to change the global background to a light color (e.g., white or zinc-50) and the default text color to dark (e.g., black or zinc-900). [0e7002c]
- [x] Task: Update `app/layout.tsx` to modify the `<body>` tag classes to support the light theme base colors if necessary. [260d2e5]
- [x] Task: Run existing tests (`npm run test`) to ensure global CSS and layout changes haven't broken basic rendering. [52baf28]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Global Styles and Tailwind Configuration' (Protocol in workflow.md) [f0a09b8]

## Phase 2: Refactoring Core Components
- [x] Task: Update `components/Navbar.tsx`. Change the background to a light color with a subtle border/shadow, text to dark, and hover states to the new purple accent. Update the user icon. [8d89ba8]
- [x] Task: Update `components/SearchBar.tsx`. Change the input background to white or light gray, adjust the border, text color, placeholder, and update the focus ring to use the purple accent. Ensure shadows are suitable for a light theme. [9a60d27]
- [~] Task: Update `components/Footer.tsx`. Change the text color and top border to match the light theme aesthetic.
- [ ] Task: Run tests for all modified components (`__tests__/components/*.test.tsx`) to verify rendering.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refactoring Core Components' (Protocol in workflow.md)

## Phase 3: Home Page Refactoring and Final Polish
- [ ] Task: Update `app/page.tsx`. Refactor the hero section: adjust the text gradients, change the background gradient to a light/subtle effect, and ensure all text has high contrast.
- [ ] Task: Update `__tests__/app/page.test.tsx` if necessary.
- [ ] Task: Perform a comprehensive manual visual review across mobile and desktop viewports, checking contrast ratios and verifying that minor UI tweaks (shadows/borders) look consistent.
- [ ] Task: Run the full test suite (`npm run test`) to confirm all tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Home Page Refactoring and Final Polish' (Protocol in workflow.md)