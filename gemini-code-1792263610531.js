// Lehigh Transit JSON Starter Data
const transitData = {
  "agency": "Lehigh Transit",
  "updated": "2026-10-17",
  "dataType": "starter",
  "routes": [
    {
      "id": "packer-express",
      "name": "Packer Express",
      "shortName": "PE",
      "type": "campus-shuttle",
      "color": "#653819",
      "description": "Shuttle serving Asa Packer Campus.",
      "campuses": ["Asa Packer"],
      "service": {
        "weekdays": { "start": "06:45", "end": "02:30", "frequencyMinutes": 20 },
        "weekends": { "start": "10:00", "end": "02:30", "frequencyMinutes": 18 }
      },
      "stops": []
    },
    {
      "id": "goodman-connector",
      "name": "Goodman Connector",
      "shortName": "GC",
      "type": "campus-shuttle",
      "color": "#8B5E3C",
      "description": "Connects Asa Packer Campus and Goodman Campus.",
      "campuses": ["Asa Packer", "Goodman"],
      "service": {
        "weekdays": { "start": "06:50", "end": "20:20", "frequencyMinutes": 30 },
        "weekends": null
      },
      "stops": []
    },
    {
      "id": "mountaintop-connector",
      "name": "Mountaintop Connector",
      "shortName": "MC",
      "type": "campus-shuttle",
      "color": "#5C7A4F",
      "description": "Connects Asa Packer Campus and Mountaintop Campus.",
      "campuses": ["Asa Packer", "Mountaintop"],
      "service": {
        "weekdays": { "start": "06:45", "end": "20:15", "frequencyMinutes": 30 },
        "weekends": null
      },
      "stops": []
    },
    {
      "id": "campus-connector",
      "name": "Campus Connector",
      "shortName": "CC",
      "type": "campus-shuttle",
      "color": "#3D6657",
      "description": "Connects stops across Asa Packer, Mountaintop, Goodman, and Saucon Village.",
      "campuses": ["Asa Packer", "Mountaintop", "Goodman", "Saucon Village"],
      "service": {
        "weekdays": { "start": "19:30", "end": "00:00", "frequencyMinutes": 30 },
        "weekends": { "start": "10:00", "end": "00:00", "frequencyMinutes": 60 }
      },
      "stops": []
    }
  ],
  "connections": [
    {
      "id": "bethlehem-transportation-center",
      "name": "Bethlehem Transportation Center",
      "type": "public-transit-hub",
      "address": "635 Guetter Street, Bethlehem, PA 18018",
      "agency": "LANTA",
      "routes": ["102", "103", "105", "108"],
      "officialWebsite": "https://www.lantabus.com/"
    }
  ],
  "links": {
    "liveTracking": "https://bus.lehigh.edu/",
    "officialSchedules": "https://auxiliaryservices.lehigh.edu/transit-route-information"
  }
};

document.addEventListener('DOMContentLoaded', () => {
    const routeListEl = document.getElementById('route-list');
    const displayArea = document.getElementById('display-area');
    const connectionsContainer = document.getElementById('connections-container');
    const externalLinksEl = document.getElementById('external-links');
    const searchForm = document.getElementById('search-form');

    // 1. Render Links Header
    externalLinksEl.innerHTML = `
        <a href="${transitData.links.liveTracking}" target="_blank" style="margin-right: 1rem; color: var(--lehigh-brown); font-weight: 600;">📡 Live Bus Tracking</a>
        <a href="${transitData.links.officialSchedules}" target="_blank" style="color: var(--text-muted);">📋 Official Schedules</a>
    `;

    // 2. Render Sidebar Routes from JSON
    transitData.routes.forEach(route => {
        const li = document.createElement('li');
        li.className = 'route-item';
        li.dataset.routeId = route.id;
        li.innerHTML = `
            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${route.color}; margin-right:8px;"></span>
            <strong>[${route.shortName}]</strong> ${route.name}
        `;
        
        li.addEventListener('click', () => selectRoute(route, li));
        routeListEl.appendChild(li);
    });

    // 3. Render Regional Connections (LANTA)
    transitData.connections.forEach(conn => {
        const div = document.createElement('div');
        div.style.fontSize = '0.85rem';
        div.style.color = 'var(--text-muted)';
        div.innerHTML = `
            <p><strong>${conn.name}</strong> (${conn.agency})</p>
            <p>${conn.address}</p>
            <p style="margin-top: 4px;">Routes: <strong>${conn.routes.join(', ')}</strong></p>
            <a href="${conn.officialWebsite}" target="_blank" style="color: var(--lehigh-brown); text-decoration: underline;">Visit LANTA</a>
        `;
        connectionsContainer.appendChild(div);
    });

    // 4. Helper Function: Format Route Information Card
    function selectRoute(route, clickedEl) {
        document.querySelectorAll('.route-item').forEach(el => el.classList.remove('active'));
        if (clickedEl) clickedEl.classList.add('active');

        const formatService = (service) => {
            if (!service) return '<span style="color: #c0392b;">No Service</span>';
            return `<strong>${service.start} - ${service.end}</strong> (Every ${service.frequencyMinutes} mins)`;
        };

        displayArea.innerHTML = `
            <div style="padding: 1.5rem; text-align: left; width: 100%;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                    <span style="background: ${route.color}; color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: bold;">${route.shortName}</span>
                    <h2 style="margin: 0; font-size: 1.4rem;">${route.name}</h2>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">${route.description}</p>
                
                <div style="margin-bottom: 1rem;">
                    <strong>Campuses Served:</strong> ${route.campuses.map(c => `<span style="background: #e2e2e2; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; margin-right: 4px;">${c}</span>`).join('')}
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-top: 1rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Service Schedules</h3>
                    <p style="margin-bottom: 0.25rem;">📅 <strong>Weekdays:</strong> ${formatService(route.service.weekdays)}</p>
                    <p>🗓️ <strong>Weekends:</strong> ${formatService(route.service.weekend)}</p>
                </div>
            </div>
        `;
    }

    // 5. Route Search Form Handler
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const start = document.getElementById('start-stop').value.trim();
        const end = document.getElementById('end-stop').value.trim();

        document.querySelectorAll('.route-item').forEach(el => el.classList.remove('active'));

        displayArea.innerHTML = `
            <div style="text-align: center; padding: 1.5rem;">
                <h3 style="color: var(--lehigh-brown); margin-bottom: 0.5rem;">🔍 Direct Connections Found</h3>
                <p>Searching connections between <strong>${start}</strong> and <strong>${end}</strong>.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Check live arrivals on <a href="${transitData.links.liveTracking}" target="_blank" style="color: var(--lehigh-brown);">bus.lehigh.edu</a>.</p>
            </div>
        `;
    });
});