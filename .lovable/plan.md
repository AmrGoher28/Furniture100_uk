

## Convert TrustBar to Sliding Marquee

Transform the static trust icons grid into a continuously scrolling marquee strip, reusing the same animation pattern already in `AnnouncementBar.tsx`.

### Changes

**`src/components/TrustBar.tsx`**
- Replace the CSS grid layout with a horizontal scrolling track using `requestAnimationFrame` (same technique as `AnnouncementBar`)
- Duplicate the items array to create a seamless loop
- Each item keeps its icon + label in a row layout
- Pause on hover for accessibility
- Reduce vertical padding slightly for a sleeker bar

