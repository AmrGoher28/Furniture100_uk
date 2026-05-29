## Hero redesign — Architectural grid

Replace `src/components/Hero.tsx` with the selected architectural grid layout: a 12-col bordered grid combining the headline, two furniture image placeholders, supporting copy, and a bordered Shop Now CTA.

### Structure
1. Full-width headline row — `Premium Furniture. / Delivered Nationwide.` (`clamp(2.5rem, 9vw, 7.5rem)`, tracking `-0.04em`, leading `0.9`).
2. Left cell (cols 1–8): 16:9 image placeholder, `#FAFAFA` outer + `#ECECEC` inner block, tiny "Feature 01" + "Main Image" labels.
3. Right cell (cols 9–12): short paragraph, a square "Detail 02" placeholder, and a bordered Shop Now button (black border, hover fills `#111` with white text + arrow translate).
4. Meta footer row: `Collection 2026` + `01 / 02 / 03` + `Scroll` indicator with hairline tick.
5. All cells separated by 1px `border-border` hairlines. Section padding `py-8 md:py-12`, max-w `7xl`.

### Responsive
- Mobile: every cell stacks to `col-span-12`; right-column padding drops to `p-6`; numbered list hides on `<sm`; aspect ratio shifts to `16/10`.
- Desktop: 8/4 split as in the prototype.

### Tokens & motion
- Colors via design tokens (`background`, `foreground`, `border`) — keeps monochrome system intact. Hex `#FAFAFA` / `#ECECEC` used only inside placeholder blocks to match the prototype's two-tone grey.
- `animate-fade-in` on the grid wrapper. No shadows, no gradients.

### Files
- `src/components/Hero.tsx` — full rewrite (only file touched).
