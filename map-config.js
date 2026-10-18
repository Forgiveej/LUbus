// MapTiler Streets is ready to enable after the owner authorizes a website key.
// Keep the key empty until that step; no MapTiler request is sent without it.
(function () {
  const maptilerApiKey = '';
  const available = Boolean(maptilerApiKey.trim());
  window.LEHIGH_MAP_CONFIG = {
    preferredStyle: 'maptiler',
    effectiveStyle: available ? 'maptiler' : 'road',
    maptilerApiKey,
    tileUrl: available
      ? 'https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key=' + encodeURIComponent(maptilerApiKey)
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: available ? 18 : 19,
    attribution: (available ? '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> ' : '') + '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  };
})();
