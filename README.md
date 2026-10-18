# 🚌 LUbus — Lehigh Campus Transit, Simplified

### A smarter, simpler way to navigate Lehigh University.

**LUbus** is a student-built web application designed to make campus transportation at Lehigh University easier, clearer, and more accessible.

Developed as a hackathon project, LUbus reimagines the campus transit experience by bringing shuttle routes, walking directions, campus locations, and live bus positions together in one interactive map.

<p align="center">
  <a href="https://forgiveej.github.io/LUbus/">
    <strong>🌐 Launch LUbus →</strong>
  </a>
</p>

<p align="center">
  <strong>No installation required. Just open the website and start exploring!</strong>
</p>

---

## 🚀 Try LUbus

### 🌐 [Open LUbus Online](https://forgiveej.github.io/LUbus/)

LUbus runs directly in your browser.

**No downloads, installations, or account registration required.**

Simply open the link above on your computer or mobile device to explore Lehigh University's campus transportation system.

> **Note:** Some features, including live vehicle positions, walking routes, and location services, require an internet connection. Location access is optional.

---

## 💡 The Problem

Getting around campus should be simple.

However, navigating Lehigh University's transportation system can be confusing, especially for new students who are unfamiliar with campus buildings, shuttle stops, and bus routes.

Students often find themselves asking:

- 🚌 Which shuttle should I take?
- 📍 Where is the nearest bus stop?
- 🗺️ How do I get from one campus building to another?
- 🚶 Would walking be more convenient?
- ⏱️ Where is the shuttle right now?

Finding answers to these questions should not require navigating confusing interfaces or switching between multiple resources.

**We believe campus transportation should be intuitive, accessible, and easy to understand.**

---

## 🎯 Our Solution

LUbus provides a unified, student-friendly interface for exploring campus transportation.

Instead of requiring students to interpret complex transit information, LUbus helps them understand available routes, find destinations, and plan their journeys.

Our project focuses on three principles:

### ✨ Simplicity
Transportation information should be easy to find and understand.

### 🌍 Accessibility
Students should be able to access transportation information directly through a web browser without installing a dedicated application.

### 🧭 Clarity
Routes, stops, walking connections, and vehicle locations should be presented visually through an interactive map.

Our goal is simple:

> Make getting around Lehigh easier for everyone.

---

## ✨ Features

### 🗺️ 1. Interactive Campus Map

Explore Lehigh University and the surrounding Bethlehem area using an interactive map.

Features include:

- Search for campus buildings and nearby locations.
- Find locations using building names or abbreviations.
- Explore campus destinations directly on the map.
- Switch between road, aerial, and terrain map views.

### 🚌 2. Campus Shuttle Routes

Explore four campus shuttle routes using the project's transit data.

- View supported shuttle routes.
- Identify bus stops along each route.
- Access available route and service-hour information.
- View available live shuttle positions on the map.

Live vehicle positions refresh approximately every 20 seconds while the relevant map view is visible.

### 🚶 3. Walking & Transit Route Planning

Enter a starting point and destination to explore a suggested journey.

Depending on the available route, LUbus can display:

- Estimated journey duration.
- Walking connections.
- Suggested shuttle boarding and alighting stops.
- Visual route information on the map.

The current journey planner supports walking and campus transit.

**Note:** Travel durations are estimates. Shuttle travel estimates do not include waiting time.

### 📍 4. Location Awareness

With browser location permission, LUbus can display your current position on the map.

Users can also manually enter a starting location.

Location access is optional.

### ⭐ 5. Saved Places

Save frequently visited campus locations for convenient access.

Saved places are stored locally in your browser.

### 🌍 6. Multilingual Interface

LUbus supports three interface languages:

- 🇺🇸 English
- 🇨🇳 中文 (Chinese)
- 🇪🇸 Español (Spanish)

English is the default language.

---

## 🛠️ Technology Stack

LUbus is built primarily using standard web technologies.

| Technology | Purpose |
|------------|---------|
| HTML | Application structure |
| CSS | Interface styling and layout |
| JavaScript | Interactive functionality and route planning |
| Python | Static-site build process |
| OpenStreetMap ecosystem | Mapping, location search, and routing resources |
| GitHub | Version control and collaboration |
| GitHub Pages | Public website hosting |

The application uses a static frontend architecture.

External services provide resources such as map tiles, location search, walking routes, and live transit information.

---

## 📂 Project Structure

The repository includes the following core files:

```text
LUbus/
│
├── index.html
├── style1.css
├── script1.js
│
├── navigation.js
├── journey-engine.js
├── live-buses.js
│
├── transit-data.js
├── schedule-data.js
├── campus-places.js
├── campus-extras.js
│
├── search-scope.js
├── map-config.js
├── i18n-es.js
│
├── build.py
├── SOURCE-MANIFEST.json
├── VERSION.txt
│
└── README.md
```

### Core Components

| File | Description |
|------|-------------|
| `index.html` | Main application entry point |
| `style1.css` | User interface styling |
| `script1.js` | Main frontend functionality |
| `navigation.js` | Navigation functionality |
| `journey-engine.js` | Journey planning logic |
| `live-buses.js` | Live shuttle information |
| `transit-data.js` | Campus shuttle route data |
| `schedule-data.js` | Transit schedule information |
| `campus-places.js` | Campus location data |
| `map-config.js` | Map configuration |
| `build.py` | Static build script |

---

## 💻 Local Development

> **For developers only.**
>
> If you simply want to use LUbus, visit the
> **[official LUbus website](https://forgiveej.github.io/LUbus/)**.
>
> You do not need to follow these steps to use the online application.

If you want to run LUbus locally, modify its source code, or test new features, follow the instructions below.

### Step 1 — Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/forgiveej/LUbus.git
```

Navigate to the project directory:

```bash
cd LUbus
```

Alternatively, download the repository as a ZIP file and extract it.

### Step 2 — Start a Local Server

LUbus should be served through a local HTTP server rather than opened directly using a `file://` URL.

On macOS or Linux:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

On Windows:

```bash
py -m http.server 8765 --bind 127.0.0.1
```

Keep the terminal running.

### Step 3 — Open the Local Application

Once the local server has started, open your browser and visit:

**http://127.0.0.1:8765/**

You can now test LUbus locally.

> ⚠️ **Important**
>
> `127.0.0.1` is a local address that refers to your own computer.
>
> It will only work if you have started the local server.
>
> If you receive a "Connection Refused" error, make sure the server is running.
>
> This address is not the public LUbus website.
>
> To access LUbus without any setup, use:
>
> **https://forgiveej.github.io/LUbus/**

---

## 🌐 Deployment

LUbus is designed to work as a static web application.

### Build for Deployment

The repository includes a Python build script:

```bash
python3 build.py
```

This generates a `dist/` directory containing the deployable application.

The generated files can be published to a compatible static hosting platform.

### Public Website

The project is available through GitHub Pages:

**https://forgiveej.github.io/LUbus/**

---

## 📊 Data Sources & Acknowledgments

LUbus uses publicly available campus transportation information and external mapping resources.

Relevant sources include:

- [Lehigh University Transit Route Information](https://auxiliaryservices.lehigh.edu/transit-route-information)
- [Lehigh Passio GO](https://lehigh.passiogo.com/)
- [Lehigh University Campus Map](https://www2.lehigh.edu/map)
- [OpenStreetMap](https://www.openstreetmap.org/copyright)
- [Photon Geocoding](https://github.com/komoot/photon)
- [FOSSGIS Routing Service](https://routing.openstreetmap.de/about.html)
- [USGS National Map](https://www.usgs.gov/programs/national-geospatial-program/national-map)

We acknowledge the organizations, developers, and contributors who maintain these resources.

---

## ⚠️ Current Limitations

LUbus is a student-developed project and should not be treated as an official transportation service.

Please note:

- Shuttle positions depend on external transit data availability and accuracy.
- Live GPS positions do not guarantee accurate arrival predictions.
- Estimated journey durations may differ from actual travel times.
- Shuttle travel estimates exclude waiting time.
- Published service-hour information may become outdated.
- Map tiles, place search, routing, and live transit information require an internet connection.
- Browser location access requires user permission.
- Saved places are stored locally and are not synchronized across devices.
- The application does not currently support driving navigation or active journey tracking.

For official transportation updates, refer to Lehigh University's transportation resources.

---

## 🔮 Project Vision

LUbus started with a simple observation:

**Students should not have to struggle with transportation software just to get around their own campus.**

As students navigating Lehigh ourselves, we wanted to explore how a more intuitive interface could improve the everyday campus experience.

Our hackathon project demonstrates how accessible web technologies, thoughtful interface design, and campus-specific transit information can be brought together to create a more user-friendly transportation experience.

LUbus is more than an exercise in building a website.

It is an exploration of how technology can solve everyday problems within our own university community.

We hope LUbus can serve as a foundation for future improvements in campus mobility, usability, and transportation accessibility.

---

## 🤝 Contributing

LUbus is a collaborative student project.

Suggestions, bug reports, and contributions are welcome!

To contribute:

1. Open an issue describing a problem or feature suggestion.
2. Fork this repository.
3. Create a new branch for your changes.
4. Make and test your improvements.
5. Submit a pull request.

We welcome contributions focused on:

- User experience and interface improvements.
- Accessibility.
- Transportation data accuracy.
- Performance and reliability.
- Bug fixes.

---

## 📌 Disclaimer

LUbus is an independent student project developed for educational and hackathon purposes.

It is not an official Lehigh University application and is not affiliated with or endorsed by Lehigh University or Passio Technologies.

Official university transportation information and announcements should always take precedence.

---

<div align="center">

### 🚌 LUbus

**Built by students, for students. ❤️**

*Making every campus journey a little easier.*

**[🌐 Try LUbus](https://forgiveej.github.io/LUbus/)** · **[💻 View Source](https://github.com/forgiveej/LUbus)**

</div>
