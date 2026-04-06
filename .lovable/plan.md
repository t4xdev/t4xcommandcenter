
## Fix marker and popup alignment in Command Center

### What is going wrong
The current issue is in the map rendering logic, not the vessel coordinates.

From the code in `src/pages/CommandCenter.tsx`:
- The selected marker is visually enlarged with `scale(1.35)`, which makes it appear to move when clicked.
- The popup is rendered as a separate `Marker` with a manual SVG `translate(...)` offset, so it can look detached from the selected vessel.
- The popup hide/show timing adds extra instability during quick selections.

### Implementation plan

**Primary file:** `src/pages/CommandCenter.tsx`

1. **Keep the clicked vessel marker fixed**
   - Remove the selected marker scale-up effect.
   - Keep the marker anchored at the exact same map coordinate before and after click.
   - Use only non-positional selection styling:
     - pulse ring
     - brighter stroke
     - slightly stronger opacity
   - This ensures clicking a marker never makes it appear to shift place.

2. **Anchor the popup to the same vessel coordinate**
   - Stop treating the popup like a separately shifted free-floating marker.
   - Render the popup from the selected vessel anchor using a proper anchored callout approach so the card and its pointer stay visually attached to the same marker.
   - Keep left/right flipping, but compute it as popup placement only, not as a second independent location.

3. **Make popup offset screen-stable**
   - Use a popup offset approach that remains visually adjacent during zoom and pan.
   - Avoid large SVG-space offsets that visually stretch away from the marker as map scale changes.
   - The popup should sit beside the selected vessel with a short connector/pointer.

4. **Simplify selection state transitions**
   - Keep `selectedVesselId` as the source of truth.
   - Remove or reduce the delayed popup hide/show behavior that can briefly show stale positioning when switching vessels quickly.
   - On marker click:
     - pause auto-rotate
     - set selected vessel ID
     - show popup immediately for that vessel

5. **Preserve current map behavior**
   - Keep map pan and zoom as-is.
   - Do not move the map when selecting a vessel.
   - Only the selected marker styling and popup should update.

### Technical details
```text
Current problem areas:
- Marker selected state uses: scale(1.35)
- Popup is another Marker with translate(tx, -78)
- Popup offset is visually decoupled from the actual clicked icon

Planned rendering model:
Vessel coordinate
   -> fixed marker stays at same point
   -> selection halo around same point
   -> popup/callout attached to same point with stable side offset
```

### Expected result
After this change:
- Clicking a vessel marker will not make the marker move.
- The popup will open next to the exact selected marker.
- Marker and popup will remain visually attached during pan/zoom.
- Auto-rotation will stay paused after manual selection.

### Validation
1. Click several nearby vessel markers in sequence.
2. Confirm the selected marker stays in the exact same place.
3. Confirm the popup always appears adjacent to that same marker.
4. Zoom in and out and verify the popup remains attached visually.
5. Pan the map and verify marker/popup alignment still holds.
