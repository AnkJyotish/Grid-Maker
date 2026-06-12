# AnkJyōtish Static Site Improvement Plan

This file turns the high-level recommendations into a practical execution checklist for the current repository.

## Goals

- Make the site easier to maintain
- Reduce duplicated code and styling
- Improve mobile behavior and visual consistency
- Clarify feature boundaries between public and protected pages
- Prepare the project for stronger authentication and backend support later

## Current Project Shape

Core public pages:
- `index.html`
- `name.html`
- `mobile.html`
- `about-us.html`
- `about-coder.html`
- `privacy.html`
- `more.html`

Protected or semi-protected pages:
- `registration.html`
- `password.html`
- `chart.html`
- `match.html`

Shared assets:
- `styles.css`
- `script.js`
- `jspdf.umd.min.js`
- image files in the repository root

## Phase 1: Quick Wins

### 1. Fix branding and encoding issues

Files:
- `index.html`
- `registration.html`
- `password.html`
- `about-us.html`
- `about-coder.html`
- `more.html`
- `privacy.html`
- `README.md`

Tasks:
- Replace mojibake text such as broken `AnkJyōtish` spellings
- Standardize brand spelling across titles, headings, links, and footer copy
- Normalize copyright/footer text

Outcome:
- Clean text rendering on every page
- Consistent branding across the site

### 2. Update documentation to match the actual repo

Files:
- `README.md`

Tasks:
- Rewrite project summary to describe the real multi-page site
- Document each page and what it does
- Document `localStorage` and `sessionStorage` usage at a high level
- Remove outdated “full-stack” wording unless a backend exists
- Fix broken box-drawing characters in the file tree

Outcome:
- README becomes accurate and useful for future maintenance

### 3. Add consistent page metadata

Files:
- `index.html`
- `registration.html`
- `password.html`
- `chart.html`
- `match.html`
- `name.html`
- `mobile.html`
- `about-us.html`
- `about-coder.html`
- `privacy.html`
- `more.html`

Tasks:
- Add or standardize `meta description`
- Add favicon reference if available
- Standardize page titles
- Add social metadata later if needed

Outcome:
- Better SEO, cleaner tab titles, and more consistent page identity

### 4. Clean obvious style duplication

Files:
- `styles.css`
- `registration.html`
- `password.html`
- `chart.html`
- `match.html`
- `mobile.html`
- `name.html`

Tasks:
- Identify shared button, card, header, and back-button styles
- Move reusable styles into `styles.css`
- Leave only page-specific styles inline

Outcome:
- Less repeated CSS
- Easier visual changes later

### 5. Review immediate mobile issues

Files:
- `styles.css`
- `index.html`
- `chart.html`
- `match.html`
- `mobile.html`

Tasks:
- Check grid overflow
- Check panel widths and card spacing
- Check fixed bottom navigation overlap
- Check readability of large sections on small screens

Outcome:
- Main flows work more reliably on mobile

## Phase 2: Code Structure Refactor

### 6. Split `script.js` by responsibility

Current file:
- `script.js`

Suggested targets:
- `assets/js/numerology-core.js`
- `assets/js/storage.js`
- `assets/js/ui-render.js`
- `assets/js/navigation.js`
- `assets/js/pdf-export.js`
- `assets/js/index-page.js`

Tasks:
- Move pure calculation logic into `numerology-core.js`
- Move `localStorage` and `sessionStorage` access into `storage.js`
- Move DOM rendering helpers into `ui-render.js`
- Move PDF logic into `pdf-export.js`
- Leave page bootstrapping in a page-specific entry file

Outcome:
- Smaller files
- Easier debugging and reuse

### 7. Centralize auth and access-control helpers

Files:
- `password.html`
- `registration.html`
- `chart.html`
- `match.html`

Suggested target:
- `assets/js/auth.js`

Tasks:
- Extract repeated auth validation
- Extract subscription-expiry checks
- Extract redirect handling
- Standardize storage key access

Outcome:
- One source of truth for current client-side auth behavior

### 8. Standardize storage keys and data contracts

Files:
- `script.js`
- `password.html`
- `registration.html`
- `chart.html`
- `match.html`

Tasks:
- Document all current keys:
  - `ankjyotish_registered`
  - `ankjyotish_authenticated`
  - `ankjyotish_username`
  - `ankjyotish_userdata`
  - `ankjyotish_loginTimestamp`
  - `showNavigation`
  - `numerologyData`
- Wrap reads and writes in helper functions
- Add defensive parsing and fallback defaults

Outcome:
- Fewer fragile storage bugs
- Easier future migration to backend auth

### 9. Reorganize the file structure

Suggested structure:
- `assets/css/`
- `assets/js/`
- `assets/images/`
- `pages/` or keep pages in root if deployment simplicity matters

Tasks:
- Move images into `assets/images`
- Move JS into `assets/js`
- Move CSS into `assets/css`
- Update all paths carefully

Outcome:
- Cleaner repo
- Better long-term scalability

Note:
- Do this only after metadata and CSS cleanup so path changes stay manageable.

## Phase 3: UX and Content Cleanup

### 10. Unify the visual system

Files:
- `styles.css`
- page-specific inline style blocks across all HTML files

Tasks:
- Define a single color system
- Define shared spacing and card patterns
- Standardize button shapes, headers, and typography
- Make sure all pages feel like one product

Outcome:
- More professional and cohesive UI

### 11. Clarify navigation and feature hierarchy

Files:
- `index.html`
- `script.js`
- `more.html`
- `name.html`
- `mobile.html`
- `chart.html`
- `match.html`

Tasks:
- Decide primary navigation items
- Remove redundant or hidden paths
- Make “advanced/protected” features clearly labeled
- Review whether `mobile.html` should remain separate

Outcome:
- Users can understand the site structure quickly

### 12. Improve forms and feedback

Files:
- `index.html`
- `script.js`
- `registration.html`
- `password.html`
- `match.html`
- `chart.html`

Tasks:
- Standardize validation messages
- Improve empty/error states
- Add clearer success states for registration and login
- Add visible action feedback for PDF generation where relevant

Outcome:
- Fewer user mistakes
- Better perceived quality

### 13. Review content quality and trust signals

Files:
- `about-us.html`
- `about-coder.html`
- `privacy.html`
- `index.html`
- `more.html`

Tasks:
- Tighten copy and remove repetition
- Make calls to action more deliberate
- Ensure privacy-policy claims match actual site behavior
- Add clearer contact/support paths if needed

Outcome:
- Better credibility
- Fewer mismatches between copy and implementation

## Phase 4: Security and Architecture

### 14. Decide whether protected pages need real security

Files affected now:
- `password.html`
- `chart.html`
- `match.html`
- `registration.html`

Tasks:
- Decide whether protected pages are just convenience-gated or truly restricted
- If truly restricted, plan a backend for auth and subscription validation
- Remove trust in client-side `localStorage` for access control

Outcome:
- Security model matches business intent

### 15. Review EmailJS usage

Files:
- `registration.html`

Tasks:
- Audit exposed EmailJS identifiers
- Confirm rate-limiting and spam handling approach
- Decide whether registration should remain frontend-only

Outcome:
- Fewer abuse risks

### 16. Prepare for optional backend integration

Possible future additions:
- user registration API
- login API
- subscription validation API
- report history storage
- admin dashboard

Outcome:
- Clear path from static site to lightweight web app

## Recommended Execution Order

1. Fix branding and README
2. Standardize metadata and shared styles
3. Resolve mobile layout issues
4. Split JavaScript and centralize storage/auth helpers
5. Reorganize folders
6. Unify navigation and UX
7. Reassess security and backend needs

## First Concrete Files To Touch

If starting immediately, use this order:

1. `README.md`
2. `styles.css`
3. `index.html`
4. `script.js`
5. `password.html`
6. `registration.html`
7. `chart.html`
8. `match.html`
9. `about-us.html`
10. `about-coder.html`
11. `privacy.html`
12. `more.html`
13. `name.html`
14. `mobile.html`

## Suggested Next Implementation Pass

The best next pass is:
- refresh `README.md`
- fix broken brand text across pages
- standardize metadata and footer/header copy
- then move repeated styles into `styles.css`

That gives the best cleanup-to-risk ratio before larger refactors.
