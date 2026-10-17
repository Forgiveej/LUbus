// Lehigh Transit 校园真实站点与路线数据库
const transitData = {
  // 1. 校准后的真实校园公交站点位置
  stops: {
    "fml": { id: "fml", name: "Fairchild-Martindale Library (FML)", lat: 40.60815, lng: -75.37710 },
    "uc": { id: "uc", name: "University Center (UC)", lat: 40.60615, lng: -75.37755 },
    "stem": { id: "stem", name: "STEPS Building", lat: 40.60730, lng: -75.37880 },
    "alumni": { id: "alumni", name: "Alumni Memorial Building", lat: 40.60890, lng: -75.37920 },
    "mountaintop": { id: "mountaintop", name: "Iacocca Hall (Mountaintop)", lat: 40.60010, lng: -75.36500 },
    "goodman": { id: "goodman", name: "Goodman Campus / Stabler Arena", lat: 40.58835, lng: -75.35400 },
    "saucon": { id: "saucon", name: "Saucon Village", lat: 40.58220, lng: -75.35110 }
  },

  // 2. 四条 Lehigh 官方线路数据
  routes: [
    {
      id: "packer-express",
      name: "Packer Express",
      shortName: "PE",
      color: "#653819",
      description: "主校区 (Asa Packer) 循环穿梭巴士。",
      stops: ["fml", "uc", "stem", "alumni"],
      path: [
        [40.60815, -75.37710],
        [40.60615, -75.37755],
        [40.60730, -75.37880],
        [40.60890, -75.37920],
        [40.60815, -75.37710]
      ]
    },
    {
      id: "mountaintop-connector",
      name: "Mountaintop Connector",
      shortName: "MC",
      color: "#21a19a",
      description: "连接 Asa Packer 主校区与 Mountaintop 山顶校区。",
      stops: ["uc", "fml", "mountaintop"],
      path: [
        [40.60615, -75.37755],
        [40.60815, -75.37710],
        [40.60420, -75.37100],
        [40.60010, -75.36500]
      ]
    },
    {
      id: "goodman-connector",
      name: "Goodman Connector",
      shortName: "GC",
      color: "#8B5E3C",
      description: "连接 Asa Packer 校区与 Goodman 体育校区及体育馆。",
      stops: ["fml", "uc", "goodman"],
      path: [
        [40.60815, -75.37710],
        [40.60615, -75.37755],
        [40.59800, -75.36200],
        [40.58835, -75.35400]
      ]
    },
    {
      id: "campus-connector",
      name: "Campus Connector",
      shortName: "CC",
      color: "#3D6657",
      description: "覆盖 Packer, Mountaintop, Goodman 及 Saucon Village 的全校区核心线路。",
      stops: ["fml", "uc", "mountaintop", "goodman", "saucon"],
      path: [
        [40.60815, -75.37710],
        [40.60615, -75.37755],
        [40.60010, -75.36500],
        [40.58835, -75.35400],
        [40.58220, -75.35110]
      ]
    }
  ],

  connections: [
    { name: "LANTA Regional Transit Hub", address: "635 Guetter St, Bethlehem, PA", routes: "102, 103, 108" }
  ],
  links: {
    liveTracking: "https://bus.lehigh.edu/",
    officialSchedules: "https://auxiliaryservices.lehigh.edu/transit-route-information"
  }
};

// 全局 Leaflet 地图变量
let map;
let activePolyline = null;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateStopDropdowns();
    renderSidebarRoutes();
    renderExternalLinks();
    renderConnections();

    // 监听路线查询表单提交事件
    document.getElementById('search-form').addEventListener('submit', handleRouteSearch);
});

// 1. 初始化地图并绘制校园 Bus Stops
function initMap() {
    // 以 Lehigh University 为中心
    map = L.map('map').setView([40.6063, -75.3721], 14);

    // 加载 OpenStreetMap 地图底图
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 在地图上标出所有真实校园公交站
    Object.values(transitData.stops).forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng]).addTo(map);
        marker.bindPopup(`<b>🚏 ${stop.name}</b><br>Lehigh Campus Bus Stop`);
    });
}

// 2. 下拉菜单填充起点和终点选项
function populateStopDropdowns() {
    const startSelect = document.getElementById('start-stop');
    const endSelect = document.getElementById('end-stop');

    Object.values(transitData.stops).forEach(stop => {
        const opt1 = new Option(stop.name, stop.id);
        const opt2 = new Option(stop.name, stop.id);
        startSelect.add(opt1);
        endSelect.add(opt2);
    });
}

// 3. 渲染左侧线路列表
function renderSidebarRoutes() {
    const routeListEl = document.getElementById('route-list');
    transitData.routes.forEach(route => {
        const li = document.createElement('li');
        li.className = 'route-item';
        li.innerHTML = `
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${route.color}; margin-right:8px;"></span>
            <strong>[${route.shortName}]</strong>&nbsp;${route.name}
        `;
        li.addEventListener('click', () => displayRouteOnMap(route, li));
        routeListEl.appendChild(li);
    });
}

// 4. 地图上高亮线路路径 Polyline
function displayRouteOnMap(route, clickedEl) {
    document.querySelectorAll('.route-item').forEach(el => el.classList.remove('active'));
    if (clickedEl) clickedEl.classList.add('active');

    // 清除上一次画的线路
    if (activePolyline) {
        map.removeLayer(activePolyline);
    }

    // 绘制新选中的线路路径
    activePolyline = L.polyline(route.path, {
        color: route.color,
        weight: 6,
        opacity: 0.85
    }).addTo(map);

    // 缩放地图，完整显示该线路范围
    map.fitBounds(activePolyline.getBounds(), { padding: [30, 30] });

    // 更新信息显示区域
    const displayArea = document.getElementById('display-area');
    const stopNames = route.stops.map(id => transitData.stops[id].name).join(' ➔ ');

    displayArea.innerHTML = `
        <h3 style="color:${route.color}; margin-bottom: 0.5rem;">🚌 ${route.name} (${route.shortName})</h3>
        <p><strong>线路简介：</strong>${route.description}</p>
        <p style="margin-top:0.4rem;"><strong>途经站点：</strong> ${stopNames}</p>
    `;
}

// 5. 路线规划算法 (Find Route)
function handleRouteSearch(e) {
    e.preventDefault();
    const startId = document.getElementById('start-stop').value;
    const endId = document.getElementById('end-stop').value;
    const displayArea = document.getElementById('display-area');

    if (startId === endId) {
        displayArea.innerHTML = `<p style="color: #c0392b; font-weight: bold;">⚠️ 起点和终点相同，请重新选择不同的站点。</p>`;
        return;
    }

    // 查找包含起点和终点的直达线路，且起点在终点之前
    const directRoutes = transitData.routes.filter(r => {
        const startIdx = r.stops.indexOf(startId);
        const endIdx = r.stops.indexOf(endId);
        return startIdx !== -1 && endIdx !== -1 && startIdx < endIdx;
    });

    if (directRoutes.length > 0) {
        const recommended = directRoutes[0];
        displayRouteOnMap(recommended, null);

        displayArea.innerHTML = `
            <h3 style="color: #27ae60; margin-bottom: 0.5rem;">✅ 推荐直达线路：${recommended.name} (${recommended.shortName})</h3>
            <p><strong>📍 上车站：</strong> ${transitData.stops[startId].name}</p>
            <p><strong>🏁 下车站：</strong> ${transitData.stops[endId].name}</p>
            <p style="margin-top:0.6rem; font-size: 0.85rem; color: var(--text-muted);">
                💡 提示：如需查看更准确的车辆位置与到站预测，请访问 <a href="${transitData.links.liveTracking}" target="_blank" style="color:var(--lehigh-brown); font-weight:600;">Lehigh Live Tracker ↗</a>。
            </p>
        `;
    } else {
        displayArea.innerHTML = `
            <h3 style="color: #e67e22; margin-bottom: 0.5rem;">ℹ️ 暂无直达线路</h3>
            <p>所选站点之间无直达线路。建议搭乘线路至 <strong>University Center (UC)</strong> 站点进行换乘。</p>
        `;
    }
}

// 外部链接与区域枢纽渲染
function renderExternalLinks() {
    document.getElementById('external-links').innerHTML = `
        <a href="${transitData.links.liveTracking}" target="_blank" style="margin-right:1rem; color:var(--lehigh-brown); text-decoration:none; font-weight:600;">📡 Live Bus Tracking</a>
        <a href="${transitData.links.officialSchedules}" target="_blank" style="color:var(--text-muted); text-decoration:none;">📅 Schedules</a>
    `;
}

function renderConnections() {
    const connContainer = document.getElementById('connections-container');
    transitData.connections.forEach(conn => {
        connContainer.innerHTML = `
            <p style="font-size:0.85rem; color:var(--text-muted);">
                <strong>${conn.name}</strong><br>
                ${conn.address}<br>
                Routes: <strong>${conn.routes}</strong>
            </p>
        `;
    });
}