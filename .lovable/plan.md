

## Fix Command Center: Markers, Popup, Tooltip, Pan, and Coordinates

### 1. Fix ping ring and marker alignment
The ping ring `<circle>` is rendered outside the `<g transform="rotate(...) scale(0.9)">` group. The `scale(0.9)` with `transformOrigin: "center"` shifts the arrow polygon relative to the unscaled ping ring. Fix: remove the `scale(0.9)` or put the ping ring inside the same transform group (without the rotate).

**Change in `CommandCenter.tsx`:** Remove `scale(0.9)` from the marker `<g>` transform. Keep only `rotate(course)`. The ping circle stays at `(0,0)` and the arrow polygon stays centered at `(0,0)` — both aligned.

### 2. Add small info popup on selected marker
Render a `foreignObject` inside the selected marker's `<Marker>` component showing vessel name, status, speed, and hiring status. This keeps it anchored to the marker coordinate automatically.

**Add inside the `{isSelected && ...}` block:** A `<foreignObject>` positioned above/beside the marker with a small card (vessel name, status badge, speed, company).

### 3. Add hover tooltip on markers
Add a `<title>` element (already exists but nested inside `<polygon>`). Instead, add an `onMouseEnter`/`onMouseLeave` state-driven tooltip overlay, or use a simpler approach: render a small `<foreignObject>` on hover showing the vessel name.

**Add state:** `hoveredVesselId`. On marker `onMouseEnter` set it, `onMouseLeave` clear it. Render a small label `<foreignObject>` when hovered (and not selected).

### 4. Pan map to selected vessel
When `selectedVessel` changes, update `mapCenter` to the vessel's coordinates.

**Change in `CommandCenter.tsx`:** In the `useEffect` that watches `selectedVessel`, add `setMapCenter([selectedVessel.longitude, selectedVessel.latitude])`.

### 5. Spread vessels across real ocean areas
Replace the current single Indian Ocean cluster with the user-provided ocean regions:
- Arabian Sea (55-75°E, 10-25°N)
- Bay of Bengal (80-100°E, 5-22°N)
- Southern Indian Ocean (20-120°E, -60-0°S)
- Mozambique Channel (35-50°E, -25 to -10°N)
- Andaman Sea (92-100°E, 5-20°N)

**Change in `commandCenterData.ts`:** Replace `locationPools` with points safely inside these ocean polygons (with margin from coastlines). Distribute vessels across all 5 regions. Update the 6 real vessels similarly. Keep jitter at ±0.5°.

### Files to modify
- `src/pages/CommandCenter.tsx` — items 1-4
- `src/data/commandCenterData.ts` — item 5

