
## Fix: Move All Vessel Markers Away from Land

### Problem
From the live preview, multiple vessel markers appear on or very near land masses — specifically near the East African coast (Somalia/Tanzania), the Indian subcontinent, Sri Lanka, and Indonesia. The current location pools include points at longitudes 60° and 70° which, with ±1° jitter, place markers on coastlines.

### Root Cause
- **Western points** (lon 60°) are too close to the Somali/East African coast
- **Eastern points** (lon 70°) are too close to India, Sri Lanka, and Indonesian islands
- **Northern points** (lat 12°–16°) are too close to the Indian subcontinent
- The ±1° jitter pushes borderline coordinates onto land

### Plan

**Single file change: `src/data/commandCenterData.ts`**

1. **Tighten the coordinate bounding box** to a safe deep-ocean zone:
   - Longitude: **63°E to 68°E** (well clear of Africa at ~51°E and India/Sri Lanka at ~72°E)
   - Latitude: **-12°S to 8°N** (clear of Arabian peninsula and any southern islands)

2. **Update all 13 location pools** to stay within these bounds, e.g.:
   - Replace `lon: 60.0` points → `lon: 63.0` or `lon: 64.0`
   - Replace `lon: 70.0` points → `lon: 67.0` or `lon: 68.0`
   - Cap northern latitude at ~8° (down from 12°–16°)

3. **Update the 6 real vessels** (v1–v6) to use coordinates within the same safe zone

4. **Reduce jitter to ±0.5°** (multiply by 1 instead of 2) so markers stay closer to their base points and never drift near coastlines

### Outcome
All 216 vessel markers will be clustered in the central Indian Ocean, safely 5°+ from any coastline in every direction.
