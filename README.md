# 🚌 LUbus — Lehigh Campus Transit, Simplified

### A smarter, simpler way to navigate Lehigh University.

**LUbus** is a student-built web application designed to make campus transportation at Lehigh University easier to understand, explore, and use.

Developed as a hackathon project, LUbus reimagines the campus transit experience by bringing shuttle routes, walking directions, campus locations, and live bus positions into one interactive map.

**[🌐 Try LUbus](https://forgiveej.github.io/LUbus/)** | **[💻 GitHub Repository](https://github.com/forgiveej/LUbus)**

---

## 💡 The Problem

Getting around campus should be simple.

However, navigating Lehigh University's transportation system can be confusing, especially for new students who are unfamiliar with campus buildings, shuttle stops, and bus routes.

Students often need to answer basic questions:

- Which shuttle should I take?
- Where is the nearest bus stop?
- How do I get from my current location to another campus building?
- Would walking be more convenient?
- Where is the shuttle right now?

Finding this information should not require navigating multiple confusing interfaces.

We believe campus transportation should be intuitive, accessible, and easy to understand.

## 🚀 Our Solution

LUbus brings essential campus transportation information into a single, user-friendly web experience.

Instead of requiring students to interpret transit information on their own, LUbus helps them explore available routes and understand how to reach their destinations.

Our goal is simple:

> Make getting around Lehigh easier for everyone.

LUbus focuses on three principles:

**Simplicity** — Make transportation information easier to find and understand.

**Accessibility** — Provide a browser-based experience that students can access without installing a dedicated app.

**Clarity** — Present routes, stops, walking connections, and transportation information on an interactive map.

---

## ✨ Features

### 🗺️ Interactive Campus Map

Explore Lehigh University and the surrounding Bethlehem area through an interactive map.

- Search for campus buildings and nearby locations.
- Find locations using building names or abbreviations.
- Explore campus destinations directly on the map.
- Switch between available map styles, including road, aerial, and terrain views.

### 🚌 Campus Shuttle Information

Explore four campus shuttle routes using the project's published transit data.

- View campus shuttle routes.
- Identify bus stops along supported routes.
- Access route and service-hour information.
- View available live vehicle positions on the map.

Live vehicle positions refresh approximately every 20 seconds while the relevant map view is visible.

### 🚶 Walking & Transit Route Planning

Enter a starting point and destination to explore a suggested journey.

Depending on the available route, LUbus can display:

- An estimated journey duration.
- Walking connections.
- Suggested shuttle boarding and alighting stops.
- A visual route on the map.

The current journey planner supports walking and campus transit.

Travel durations are estimates, and bus travel estimates do not include waiting time.

### 📍 Location Awareness

With browser location permission, LUbus can display your current position on the map.

Users can also enter a starting location manually.

### ⭐ Saved Places

Save frequently visited locations for convenient access.

Saved places are stored locally in the browser.

### 🌍 Multilingual Interface

LUbus supports three interface languages:

- English
- 中文 (Chinese)
- Español (Spanish)

English is the default language.

---

## 🛠️ Technology

LUbus is a browser-based application built primarily with:

| Technology | Purpose |
|------------|---------|
| HTML | Application structure |
| CSS | Interface styling and layout |
| JavaScript | Interactive functionality and route planning |
| Python | Static-site build process |
| OpenStreetMap ecosystem | Mapping, place search, and routing resources |
| GitHub | Source code management and collaboration |

The application uses a static frontend architecture and does not require a traditional application server for its core interface.

External services are used for features such as map tiles, place search, walking routes, and live transit information.

---

## 📂 Project Structure

The repository includes the following files:

```text
LUbus/
├── index.html
├── style1.css
├── script1.js
├── navigation.js
├── journey-engine.js
├── live-buses.js
├── transit-data.js
├── schedule-data.js
├── campus-places.js
├── campus-extras.js
├── search-scope.js
├── map-config.js
├── i18n-es.js
├── build.py
├── SOURCE-MANIFEST.json
├── VERSION.txt
└── README.md
```

Key components include:

- `index.html` — Main application entry point.
- `style1.css` — Application styling.
- `script1.js` — Main frontend functionality.
- `journey-engine.js` — Campus journey planning logic.
- `live-buses.js` — Live shuttle vehicle information.
- `transit-data.js` — Campus transit route data.
- `schedule-data.js` — Transit schedule information.
- `campus-places.js` — Campus location data.
- `map-config.js` — Map configuration.
- `build.py` — Static build script.

---

## 💻 Getting Started

LUbus can be run locally without installing a JavaScript framework or configuring a map API key.

### 1. Clone the repository

```bash
git clone https://github.com/forgiveej/LUbus.git
cd LUbus
```

Alternatively, download the repository as a ZIP file and extract it.

### 2. Start a local server

On macOS or Linux:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

On Windows:

```bash
py -m http.server 8765 --bind 127.0.0.1
```

### 3. Open the application

Visit:

http://127.0.0.1:8765/

Allow location access if you want to display your current position.

You can also manually enter a starting location.

**Important:** Use a local HTTP server rather than opening `index.html` directly through a `file://` URL.

---

## 🌐 Deployment

The project includes a Python build script for preparing static deployment files.

Run:

```bash
python3 build.py
```

This generates a `dist/` directory containing the deployable application.

The generated files can be published to a compatible static hosting service.

The repository also contains the source files needed for local development.

---

## 📊 Data Sources & Acknowledgments

LUbus uses publicly available campus transportation information and external mapping resources.

Relevant sources and services include:

- [Lehigh University Transit Route Information](https://auxiliaryservices.lehigh.edu/transit-route-information)
- [Lehigh Passio GO](https://lehigh.passiogo.com/)
- [Lehigh University Campus Map](https://www2.lehigh.edu/map)
- [OpenStreetMap](https://www.openstreetmap.org/copyright)
- [Photon Geocoding](https://github.com/komoot/photon)
- [FOSSGIS Routing Service](https://routing.openstreetmap.de/about.html)
- [USGS National Map](https://www.usgs.gov/programs/national-geospatial-program/national-map)

We acknowledge the organizations and contributors who maintain these resources.

---

## ⚠️ Current Limitations

LUbus is a student-developed project and should not be treated as an official transportation service.

Please note:

- Shuttle locations depend on the availability and accuracy of external transit data.
- Live GPS positions do not represent guaranteed arrival predictions.
- Estimated journey durations may differ from actual travel times.
- Bus travel estimates exclude waiting time.
- Published service-hour information may become outdated.
- Map tiles, place search, routing, and live transit information require an internet connection.
- Browser location access requires user permission.
- Saved places are stored locally and are not synchronized across devices.
- The application does not currently provide driving navigation or active journey tracking.

For official service changes and transportation announcements, refer to Lehigh University's transportation resources.

---

## 🎯 Project Vision

LUbus started with a simple observation:

**Students should not have to struggle with transportation software just to get around their own campus.**

By combining familiar web technologies with campus-specific transportation information, our project explores how a more intuitive interface can improve the everyday student experience.

We hope LUbus can serve as a foundation for further improvements to campus mobility and transportation accessibility.

---

## 🤝 Contributing

LUbus is a collaborative student project.

Suggestions, bug reports, and contributions are welcome.

To propose an improvement:

1. Open an issue describing the problem or suggestion.
2. Fork the repository.
3. Create a branch for your changes.
4. Submit a pull request.

Please keep contributions focused on usability, reliability, accessibility, and accurate transportation information.

---

## 📌 Disclaimer

LUbus is an independent student project created for educational and hackathon purposes.

It is not an official Lehigh University application and is not affiliated with or endorsed by Lehigh University or Passio Technologies.

Official transportation information and announcements should always take precedence.

---

<p align="center">
  Built by students, for students. ❤️
</p>

<p align="center">
  <strong>Making every campus journey a little easier.</strong>
</p>
