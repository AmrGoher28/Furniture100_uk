

# Design & Set Custom Favicon Logo

## Overview
Generate a compact monogram/icon favicon for Furniture100 — an abstract "F100" mark that works at small sizes (16×16, 32×32, 192×192). Then set it as the site favicon.

## Design Direction
- **Mark**: Stylised "F" with a subtle "100" integrated — think luxury brand monogram
- **Colours**: Gold (#C4A265 or similar warm gold) on dark near-black (#1A1A1A) background, matching the site's luxury palette
- **Style**: Clean geometric lines, no gradients, readable at favicon sizes

## Steps

### 1. Generate the logo using AI image generation
- Use the Lovable AI image endpoint (`google/gemini-3-pro-image-preview`) via an edge function or script to generate a monogram icon
- Prompt: a minimal, geometric "F100" monogram on dark background with gold accent, suitable as a favicon, clean luxury aesthetic
- Save the result as `public/favicon.png`

### 2. Update `index.html`
- Add `<link rel="icon" href="/favicon.png" type="image/png">` in the `<head>`
- Remove or replace any existing default favicon reference

### 3. QA
- Visually inspect the generated icon to ensure it's crisp and recognisable at small sizes
- Verify it renders correctly as the browser tab icon

## Files Changed
- **New**: `public/favicon.png` (generated)
- **Updated**: `index.html` — favicon link tag

