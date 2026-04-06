

# Add Cookie Consent Banner

## Overview
Add a GDPR-compliant cookie consent banner that appears on first visit, letting users accept or manage cookies — standard for any professional UK e-commerce site.

## What the user will see
A slim banner at the bottom of the screen on first visit with a brief message about cookies and two buttons: "Accept All" and "Manage Preferences". Once accepted, the choice is saved to localStorage and the banner won't appear again.

## Technical Details

### 1. Create `src/components/CookieConsent.tsx`
- Fixed bottom banner with `z-50`, styled to match the warm luxury aesthetic (cream/stone tones)
- Two buttons: **Accept All** (gold primary) and **Manage Preferences** (outline)
- "Manage Preferences" expands an inline section with toggles for: Essential (always on), Analytics, Marketing
- On accept, store consent object in `localStorage` under `cookie_consent`
- Banner slides up with a subtle animation on mount
- Links to the existing `/privacy` page

### 2. Update `src/components/Layout.tsx`
- Import and render `<CookieConsent />` alongside other layout elements
- Only renders if no consent has been stored yet

No database changes needed — consent is stored client-side in localStorage.

