# AnkJyōtish Static Website

AnkJyōtish is a multi-page static numerology website built with HTML, CSS, and vanilla JavaScript. It includes public numerology tools, protected practitioner-style pages, PDF report generation, and supporting informational pages.

## What This Project Contains

- A main destiny and Vedic numerology calculator
- Dasha and antardasha calculations with report-style output
- A separate name numerology tool
- A mobile-oriented calculator page
- A match-making / compatibility page
- Registration and password-gated access flows
- About, developer, privacy, and more-information pages

## Main Files

Public pages:
- `index.html` - main numerology calculator
- `name.html` - name numerology calculator
- `mobile.html` - mobile calculator variant
- `about-us.html` - founder page
- `about-coder.html` - developer page
- `privacy.html` - privacy policy
- `more.html` - extra links

Protected or gated pages:
- `registration.html` - registration flow
- `password.html` - password access page
- `chart.html` - advanced dasha chart page
- `match.html` - compatibility page

Shared assets:
- `styles.css` - shared site styling
- `script.js` - main calculator logic and navigation behavior
- `jspdf.umd.min.js` - PDF generation library

## Key Features

- Destiny number calculation
- Basic number calculation
- Vedic numerology grid generation
- Maha dasha and antardasha display
- PDF export from the main calculator flow
- Responsive layouts for desktop and mobile
- Browser storage for registration, navigation state, and session data

## Technical Notes

- Stack: HTML5, CSS3, JavaScript
- Build step: none
- Runtime: browser only
- Storage used: `localStorage` and `sessionStorage`

## Local Development

1. Open the project folder.
2. Launch `index.html` in a browser.
3. Open related HTML pages directly when testing specific flows.

No package manager or local server is required for basic development.

## Current Limitations

- Access control is client-side and based on browser storage.
- Some pages still duplicate styles and scripts.
- The project structure is flat and would benefit from asset folders.

## Recommended Next Cleanup

- Normalize branding and metadata across all pages
- Move repeated CSS into shared styles
- Split large JavaScript logic into smaller files
- Reorganize images, CSS, and JS into asset folders
- Reassess protected-page security if real restriction is required

## Related Notes

- `TODO.md` tracks a focused in-progress UI task
- `IMPROVEMENT_PLAN.md` tracks broader repository improvements
