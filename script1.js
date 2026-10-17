/**
 * Lehigh Bus Navigator - Production Core Engine
 * 核心功能：
 * 1. 按线路严格隔离站点 Marker，实现点击线路仅呈现专属站点。
 * 2. 接入 OSRM 路由引擎，实现轨迹贴合真实公路网延伸。
 * 3. 基于 Leaflet LayerGroup 内存管理机制，实现无缝图层销毁与重构。
 */

// 1. Lehigh 官方站点与线路精细数据库 (基于 Passio GO 数据校准)
const transitData = {
  stops: {
    "saucon": { id: "saucon", name: "Saucon Village", lat: 40.58220, lng: -75.35110 },
    "cundey_nb": { id: "cundey_nb", name: "Cundey Varsity House NB", lat: 40.58610, lng: -75.35280 },
    "goodman_circle_nb": { id: "goodman_circle_nb", name: "Goodman Campus Circle NB", lat: 40.58835, lng: -75.35400 },
    "building_c_nb": { id: "building_c_nb", name: "Building C NB", lat: 40.59850, lng: -75.36210 },
    "iacocca_nb": { id: "iacocca_nb", name: "Iacocca Hall NB", lat: 40.60010, lng: -75.36500 },
    "atlss_nb": { id: "atlss_nb", name: "ATLSS / Imbt Lab NB", lat: 40.60120, lng: -75.36720 },
    "jordan_nb": { id: "jordan_nb", name: "Jordan Hall NB", lat: 40.60310, lng: -75.37050 },
    "house_99": { id: "house_99", name: "House 99", lat: 40.60480, lng: -75.37310 },
    "gamma_phi_beta": { id: "gamma_phi_beta", name: "Gamma Phi Beta", lat: 40.60520, lng: -75.37420 },
    "pi_beta_phi": { id: "pi_beta_phi", name: "Pi Beta Phi", lat: 40.60580, lng: -75.37510 },
    "taylor_nb": { id: "taylor_nb", name: "Taylor College NB", lat: 40.60630, lng: -75.37600 },
    "alumni": { id: "alumni", name: "Alumni Memorial Building", lat: 40.60890, lng: -75.37920 },
    "steps": { id: "steps", name: "S.T.E.P.S.", lat: 40.60730, lng: -75.37880 },
    "packer_ave": { id: "packer_ave", name: "Packer Avenue Bus Stop", lat: 40.60815, lng: -75.37710 },
    "farrington": { id: "farrington", name: "Farrington Square", lat: 40.60910, lng: -75.37580 },
    "whitaker": { id: "whitaker", name: "Whitaker Lab", lat: 40.60780, lng: -75.37520 },
    "williams": { id: "williams", name: "Williams Hall", lat: 40.60710, lng: -75.37610 },
    "drown": { id: "drown", name: "Drown Hall", lat: 40.60660, lng: -75.37680 },
    "taylor_sb": { id: "taylor_sb", name: "Taylor College SB", lat: 40.60620, lng: -75.37610 },
    "sigma_phi_epsilon": { id: "sigma_phi_epsilon", name: "Sigma Phi Epsilon", lat: 40.60560, lng: -75.37500 },
    "house_93": { id: "house_93", name: "House 93", lat: 40.60490, lng: -75.37350 },
    "alpha_phi": { id: "alpha_phi", name: "Alpha Phi", lat: 40.60440, lng: -75.37280 },
    "atlss_sb": { id: "atlss_sb", name: "ATLSS / Imbt Lab SB", lat: 40.60115, lng: -75.36725 },
    "iacocca_sb": { id: "iacocca_sb", name: "Iacocca Hall SB", lat: 40.60005, lng: -75.36505 },
    "building_c_sb": { id: "building_c_sb", name: "Building C SB", lat: 40.59845, lng: -75.36215 },
    "jordan_sb": { id: "jordan_sb", name: "Jordan Hall SB", lat: 40.60305, lng: -75.37055 },
    "cundey_sb": { id: "cundey_sb", name: "Cundey Varsity House SB", lat: 40.58605, lng: -75.35285 },
    "goodman_circle_sb": { id: "goodman_circle_sb", name: "Goodman Campus Circle SB", lat: 40.58830, lng: -75.35405 }
  },

  routes: [
    {
      id: "campus-connector",
      name: "Campus Connector",
      shortName: "CC",
      color: "#3D6657",
      description: "全校区核心干线，连接 Asa Packer, Mountaintop, Goodman 及 Saucon Village。",
      stops: [
        "saucon", "cundey_nb", "goodman_circle_nb", "building_c_nb", "iacocca_nb", 
        "atlss_nb", "jordan_nb", "house_99", "gamma_phi_beta", "pi_beta_phi", 
        "taylor_nb", "alumni", "steps", "packer_ave", "farrington", 
        "whitaker", "williams", "drown", "taylor_sb", "sigma_phi_epsilon", 
        "house_93", "alpha_phi", "atlss_sb", "iacocca_sb", "building_c_sb", 
        "jordan_sb", "cundey_sb", "goodman_circle_sb"
      ]
    },
    {
      id: "packer-express",
      name: "Packer Express",
      shortName: "PE",
      color: "#653819",
      description: "围绕 Asa Packer 主校区的局域高频循环巴士。",
      stops: [
        "house_99", "gamma_phi_beta", "pi_beta_phi", "taylor_nb", "alumni", 
        "steps", "packer_ave", "farrington", "whitaker", "williams", 
        "drown", "taylor_sb", "sigma_phi_epsilon", "house_93", "alpha_phi"
      ]
    },
    {
      id: "mountaintop-connector",
      name: "Mountaintop Connector",
      shortName: "MC",
      color: "#21a19a",
      description: "主校区往返 Mountaintop 山顶校区的专线巴士。",
      stops: ["packer_ave", "alumni", "jordan_nb", "iacocca_nb"]
    },
    {
      id: "goodman-connector",
      name: "Goodman Connector",
      shortName: "GC",
      color: "#8B5E3C",
      description: "主校区往返 Goodman 体育校区与 Stabler Arena 的专线巴士。",
      stops: ["packer_ave", "alumni", "building_c_nb", "goodman_circle_nb", "cundey_nb"]
    }
  ],

  connections: [
    { name: "LANTA Regional Transit Hub", address: "635 Guetter St, Bethlehem, PA", routes: "102, 103, 108" }
  ],
  links: {
    liveTracking: "https://lehigh.passiogo.com/",
    officialSchedules: "https://auxiliaryservices.lehigh.edu/transit-route-information"
  }
};

// 全局 Web GIS 容器定义
let map;
let busStopsLayerGroup;     
let routePolylineLayerGroup; 

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateStopDropdowns();
    renderSidebarRoutes();
    renderExternalLinks();
    renderConnections();

    document.getElementById('search-form').addEventListener('submit', handleRouteSearch);
});

/**
 * 初始化地图与独立图层组
 */
function initMap() {
    map = L.map('map').setView([40.6050, -75.3700], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 实例化隔离的图层组并挂载至地图容器
    busStopsLayerGroup = L.layerGroup().addTo(map);
    routePolylineLayerGroup = L.layerGroup().addTo(map);
}

/**
 * 响应线路点击事件：过滤专属站点，并基于 OSRM 引擎生成贴路拓扑路径
 * @param {Object} route - 目标线路配置对象
 * @param {HTMLElement} clickedEl - 侧边栏 DOM 节点
 */
async function displayRouteOnMap(route, clickedEl) {
    // 切换UI高亮状态
    document.querySelectorAll('.route-item').forEach(el => el.classList.remove('active'));
    if (clickedEl) clickedEl.classList.add('active');

    // 核心清理：销毁现有所有 Marker 与矢量折线
    busStopsLayerGroup.clearLayers();
    routePolylineLayerGroup.clearLayers();

    // 筛选当前线路的专属站点集合
    const currentRouteStops = route.stops
        .map(stopId => transitData.stops[stopId])
        .filter(stop => stop !== undefined);

    // 仅绘制当前线路关联的站点 Marker
    currentRouteStops.forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng]);
        marker.bindPopup(`
            <div style="font-family: sans-serif;">
                <b style="color:${route.color};">🚏 ${stop.name}</b><br>
                <small>Serviced by: <strong>${route.shortName}</strong></small>
            </div>
        `);
        busStopsLayerGroup.addLayer(marker);
    });

    // 构造 OSRM 拓扑匹配 API 请求 URL
    const coordinatesString = currentRouteStops
        .map(stop => `${stop.lng},${stop.lat}`)
        .join(';');

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;

    try {
        updateDisplayCard(route, currentRouteStops, true);

        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // 解析 OSRM 返回的贴合真实道路网的 GeoJSON 对象
            const routeGeoJSON = data.routes[0].geometry;

            const polylineLayer = L.geoJSON(routeGeoJSON, {
                style: {
                    color: route.color,
                    weight: 6,
                    opacity: 0.85,
                    lineJoin: 'round'
                }
            });

            routePolylineLayerGroup.addLayer(polylineLayer);
            map.fitBounds(polylineLayer.getBounds(), { padding: [35, 35] });
        } else {
            throw new Error('OSRM routing request failed.');
        }
    } catch (error) {
        // 异常降级机制：退回使用站点坐标直接生成折线
        const fallbackLatLngs = currentRouteStops.map(stop => [stop.lat, stop.lng]);
        const fallbackPolyline = L.polyline(fallbackLatLngs, {
            color: route.color,
            weight: 5,
            opacity: 0.8,
            dashArray: '6, 8'
        });
        routePolylineLayerGroup.addLayer(fallbackPolyline);
        map.fitBounds(fallbackPolyline.getBounds(), { padding: [35, 35] });
    } finally {
        updateDisplayCard(route, currentRouteStops, false);
    }
}

/**
 * 更新面板路线详情描述卡片
 */
function updateDisplayCard(route, stops, isLoading) {
    const displayArea = document.getElementById('display-area');
    const stopNamesList = stops.map(s => s.name).join(' ➔ ');

    displayArea.innerHTML = `
        <h3 style="color:${route.color}; margin-bottom: 0.5rem; display:flex; align-items:center; gap:8px;">
            <span>🚌 ${route.name} (${route.shortName})</span>
            ${isLoading ? '<small style="font-size:0.75rem; color:#888;">(贴路轨迹计算中...)</small>' : ''}
        </h3>
        <p><strong>线路简介：</strong>${route.description}</p>
        <p style="margin-top:0.4rem; font-size:0.88rem;">
            <strong>专属站点 (${stops.length}个)：</strong><br>
            <span style="color:#555;">${stopNamesList}</span>
        </p>
    `;
}

/**
 * 填充起点与终点下拉选择框
 */
function populateStopDropdowns() {
    const startSelect = document.getElementById('start-stop');
    const endSelect = document.getElementById('end-stop');

    startSelect.innerHTML = '<option value="">请选择出发站点...</option>';
    endSelect.innerHTML = '<option value="">请选择到达站点...</option>';

    Object.values(transitData.stops).forEach(stop => {
        startSelect.add(new Option(stop.name, stop.id));
        endSelect.add(new Option(stop.name, stop.id));
    });
}

/**
 * 渲染侧边栏线路列表
 */
function renderSidebarRoutes() {
    const routeListEl = document.getElementById('route-list');
    routeListEl.innerHTML = '';

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

/**
 * 直达路线规划与匹配算法
 */
function handleRouteSearch(e) {
    e.preventDefault();
    const startId = document.getElementById('start-stop').value;
    const endId = document.getElementById('end-stop').value;
    const displayArea = document.getElementById('display-area');

    if (!startId || !endId) {
        displayArea.innerHTML = `<p style="color: #c0392b;">⚠️ 请同时选择起点和终点站点。</p>`;
        return;
    }

    if (startId === endId) {
        displayArea.innerHTML = `<p style="color: #c0392b; font-weight: bold;">⚠️ 起点与终点相同，请选择不同的站点。</p>`;
        return;
    }

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
                💡 提示：如需查看动态车辆实时位置与预测 ETA，请访问 
                <a href="${transitData.links.liveTracking}" target="_blank" style="color:var(--lehigh-brown); font-weight:600;">Lehigh Passio GO Live ↗</a>。
            </p>
        `;
    } else {
        busStopsLayerGroup.clearLayers();
        routePolylineLayerGroup.clearLayers();

        displayArea.innerHTML = `
            <h3 style="color: #e67e22; margin-bottom: 0.5rem;">ℹ️ 暂无直达线路</h3>
            <p>所选站点之间无直达循环巴士，建议前往 <strong>Packer Avenue Bus Stop</strong> 或 <strong>Farrington Square</strong> 枢纽站点进行换乘。</p>
        `;
    }
}

function renderExternalLinks() {
    document.getElementById('external-links').innerHTML = `
        <a href="${transitData.links.liveTracking}" target="_blank" style="margin-right:1rem; color:var(--lehigh-brown); text-decoration:none; font-weight:600;">📡 Live Passio GO</a>
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
