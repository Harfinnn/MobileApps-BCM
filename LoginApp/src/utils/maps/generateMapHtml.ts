export function generateMapHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
html, body, #map {
  height: 100%;
  margin: 0;
}
</style>
</head>
<body>
<div id="map"></div>

<script>
  let map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
  }).setView([-6.2, 106.8], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  let markers = [];
  let bounds = L.latLngBounds([]);

  function createIcon(active) {
    const size = active ? 42 : 32;
    const color = active ? '#0F172A' : '#3B82F6';

    return L.divIcon({
      className: 'marker-container',
      html:
        '<div style="width:' + size + 'px;height:' + size + 'px;background:' +
        color +
        ';border-radius:50%;border:3px solid white;"></div>',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  }

  document.addEventListener('message', function (e) {
    try {
      const msg = JSON.parse(e.data);

      if (msg.type === 'SET_MARKERS') {
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        bounds = L.latLngBounds([]);

        msg.payload.forEach(item => {
          if (!item.mjs_lat || !item.mjs_long) return;

          const marker = L.marker(
            [Number(item.mjs_lat), Number(item.mjs_long)],
            { icon: createIcon(false) }
          ).addTo(map);

          markers.push(marker);
          bounds.extend(marker.getLatLng());
        });

        if (markers.length) {
          map.fitBounds(bounds.pad(0.25));
        }
      }

      if (msg.type === 'FOCUS') {
        map.flyTo([msg.payload.lat, msg.payload.lng], 17);
      }

      if (msg.type === 'ZOOM_IN') map.zoomIn();
      if (msg.type === 'ZOOM_OUT') map.zoomOut();
      if (msg.type === 'RESET' && bounds.isValid()) {
        map.fitBounds(bounds.pad(0.25));
      }

    } catch (e) {}
  });

  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: 'MAP_READY' })
  );
</script>
</body>
</html>
`;
}
