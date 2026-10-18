# Lehigh Transit - Final release

Live website: https://lehigh-transit.neonhaven4.chatgpt.site/

This directory contains the complete final approved application, matching Sites production v9. This is the main product at the repository root. Earlier code is recoverable through Git history.

## Download and run

Download the main branch ZIP. Extract it and open the folder containing index.html. No map account or API key is required for this release.

macOS / Linux:
```sh
python3 -m http.server 8765 --bind 127.0.0.1
```
Windows:
```sh
py -m http.server 8765 --bind 127.0.0.1
```
Open http://127.0.0.1:8765/ in your browser. Allow location access or type a starting place. Do not open the HTML directly with file://.

## Build and host

Run `python3 build.py` to generate dist/. Publish dist/ to static HTTPS hosting. The live website uses Sites; uploading code to GitHub does not automatically redeploy that website.

## Final features

- English default, with Spanish and Chinese interfaces.
- Top-left search above a separate campus menu; campus building names and abbreviations; Bethlehem-area search.
- Selecting a destination fills the form. Submit Routes to show one itinerary with estimated time, bus boarding/alighting stops, and walking connections.
- Campus transit and walking modes only. No driving or start-navigation/travelled-route tracking.
- Four campus bus routes, weekly service hours, and real selected-route vehicle positions refreshed about every 20 seconds while visible.
- Browser location dot, locally saved starred places, road/aerial/terrain map styles.
- Click the map to dismiss a displayed bus route. Campus buildings have larger click targets. Search remains visible beside map-style and saved-place panels.

## Maps and configuration

The current public configuration uses online maps without an API key. MapTiler Streets is prepared in map-config.js, but its key is intentionally empty pending owner authorization. Never upload a private local key. The legacy maptiler-config.example.js is not loaded by this version.

This is not an offline map: tiles, external place search, routing and live bus data require internet. Saved places stay in the current browser. Location requires permission. GPS bus locations are not arrival predictions. Travel times are estimates; bus estimates exclude waiting time. Service hours are a Fall 2026 snapshot; official announcements take precedence. Public external services are best-effort and intended for modest interactive use; do not bulk-download tiles.

## Data sources and attribution

- https://auxiliaryservices.lehigh.edu/transit-route-information
- https://lehigh.passiogo.com/
- https://www2.lehigh.edu/map
- https://www.openstreetmap.org/copyright
- https://operations.osmfoundation.org/policies/tiles/
- https://github.com/komoot/photon
- https://routing.openstreetmap.de/about.html
- https://www.usgs.gov/programs/national-geospatial-program/national-map

SOURCE-MANIFEST.json contains SHA-256 hashes of all 13 runtime source files for verification against the final published source.
