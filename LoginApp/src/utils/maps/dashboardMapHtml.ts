import { TodayMarker } from '../../types/bencana';

export function generateDashboardMapHTML(markers: TodayMarker[]) {
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
  const markers = ${JSON.stringify(markers)};

  function getMarkerColor(type) {
    const t = type.toLowerCase();

    if (t.includes('kebakaran')) return '#DC2626';
    if (t.includes('banjir bandang')) return '#1D4ED8';
    if (t.includes('banjir')) return '#2563EB';
    if (t.includes('tsunami')) return '#0EA5E9';
    if (t.includes('tanah longsor')) return '#92400E';
    if (t.includes('letusan gunung')) return '#7C2D12';
    if (t.includes('angin besar')) return '#0D9488';
    if (t.includes('demonstrasi')) return '#7C3AED';
    if (t.includes('ancaman bom')) return '#991B1B';
    if (t.includes('gangguan utilitas')) return '#4B5563';
    if (t.includes('sengatan listrik')) return '#FACC15';

    return '#6B7280';
  }

  function createIcon(color) {
    return L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:' + color + ';width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.6);"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  }

  const map = L.map('map', { attributionControl: false, zoomControl: false, });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

  const bounds = L.latLngBounds([]);

  markers.forEach(m => {
    const marker = L.marker(
      [m.lat, m.lng],
      { icon: createIcon(getMarkerColor(m.title)) }
    ).addTo(map);

    marker.bindPopup(m.title);

    marker.on('click', () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ id: m.id })
      );
    });

    bounds.extend([m.lat, m.lng]);
  });

  if (markers.length === 1) {
    map.setView([markers[0].lat, markers[0].lng], 12);
  } else {
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }

  document.addEventListener('message', function (event) {
  try {
    const msg = JSON.parse(event.data);

    if (msg.type === 'ZOOM_IN') {
      map.zoomIn();
    }

    if (msg.type === 'ZOOM_OUT') {
      map.zoomOut();
    }

    if (msg.type === 'RESET_ZOOM') {
      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], 12);
      } else {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }
    }
  } catch (e) {}
});

</script>

</body>
</html>
`;
}
