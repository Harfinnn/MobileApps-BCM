export function generateMapHTML({ showZoomControl = false } = {}) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css"/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

<style>
html,body,#map{
  height:100%;
  margin:0;
  background-color: #F8FAFC;
}

.marker-dot{
  border-radius:50%;
  border:3px solid white;
}

.popup-title{
  font-weight:bold;
  font-size:14px;
  margin-bottom:3px;
  font-family: sans-serif;
}

.popup-address{
  font-size:12px;
  color:#64748B;
  font-family: sans-serif;
}

/* 🔴 Titik Gempa */
.pulse-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.core-eq {
  width: 16px;
  height: 16px;
  background-color: #EF4444;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(239,68,68,0.5);
}
.pulse-eq {
  position: absolute;
  width: 48px;
  height: 48px;
  background-color: rgba(239, 68, 68, 0.4);
  border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  z-index: 1;
}
@keyframes ping {
  0% { transform: scale(0.5); opacity: 1; }
  75%, 100% { transform: scale(1.5); opacity: 0; }
}

</style>
</head>

<body>
<div id="map"></div>

<script>

let map = L.map('map',{
  zoomControl:false,
  attributionControl:false,
  preferCanvas:true
}).setView([-2.5,118],5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);

${
  showZoomControl
    ? `
L.control.zoom({
  position:'bottomright'
}).addTo(map);
`
    : ''
}


/* ================= CLUSTER ================= */
let cluster = L.markerClusterGroup({
  chunkedLoading:true,
  maxClusterRadius:60,
  spiderfyOnMaxZoom:true,
  showCoverageOnHover:false,
  removeOutsideVisibleBounds:true,
  animate:false
});

map.addLayer(cluster);

/* ================= STATE ================= */
let useCluster = true; 
let bounds = L.latLngBounds([]);
let markerMap = {};
let activeMarker = null;
let epicenterMarker = null;
let impactCircle = null;
let markerColor = '#3B82F6';


/* ================= ICON ================= */
function iconNormal(){
  return L.divIcon({
    html:\`<div class="marker-dot" style="width:26px;height:26px;background:\${markerColor}"></div>\`,
    iconSize:[26,26],
    iconAnchor:[13,13],
    className:''
  });
}

function iconActive(){
  return L.divIcon({
    html:'<div class="marker-dot" style="width:36px;height:36px;background:#0F172A"></div>',
    iconSize:[36,36],
    iconAnchor:[18,18],
    className:''
  });
}

/* ================= MARKER ================= */
function setActive(id){
  if(activeMarker){
    activeMarker.setIcon(iconNormal());
  }
  const marker = markerMap[id];
  if(marker){
    marker.setIcon(iconActive());
    activeMarker = marker;
  }
}

function addMarkers(list){
  list.forEach(function(item){
    if(markerMap[item.mjs_id]) return;
    if(!item.mjs_lat || !item.mjs_long) return;

    const lat = Number(item.mjs_lat);
    const lng = Number(item.mjs_long);

    const marker = L.marker([lat,lng], {icon:iconNormal()});

    marker.on('click',function(){
      if(!marker.getPopup()){
        marker.bindPopup(
          '<div class="popup-title">'+item.mjs_nama+'</div>'+
          '<div class="popup-address">'+item.mjs_alamat+'</div>'
        );
      }
      setActive(item.mjs_id);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type:'MARKER_CLICK',
        payload:item.mjs_id
      }));
    });

    markerMap[item.mjs_id] = marker;
    if(useCluster){
      cluster.addLayer(marker);
    }else{
      marker.addTo(map);
    }
    bounds.extend([lat,lng]);
  });
}

/* ================= MESSAGE ================= */
document.addEventListener('message',function(e){
  try{
    const msg = JSON.parse(e.data);

    if(msg.type === 'SET_CLUSTER_MODE'){
      useCluster = msg.payload.enabled;

      // reset layer biar clean
      cluster.clearLayers();

      Object.values(markerMap).forEach(marker => {
        map.removeLayer(marker);
      });

      markerMap = {};
      bounds = L.latLngBounds([]);
    }

    /* RESET */
    if(msg.type === 'RESET_MARKERS'){
      cluster.clearLayers();

      Object.values(markerMap).forEach(marker => {
        map.removeLayer(marker);
      });

      markerMap = {};
      bounds = L.latLngBounds([]);
    }

    if(msg.type === 'SET_MARKER_COLOR'){
      markerColor = msg.payload.color || '#3B82F6';
    }

    if(msg.type === 'ADD_MARKERS'){
      addMarkers(msg.payload);
    }

    /* 🔴 EPICENTER */
    if(msg.type === 'SET_EPICENTER'){
      if(epicenterMarker) map.removeLayer(epicenterMarker);

      const eqLat = Number(msg.payload.lat);
      const eqLng = Number(msg.payload.lng);

      const pulseIcon = L.divIcon({
        className: 'pulse-marker',
        html: '<div class="pulse-eq"></div><div class="core-eq"></div>',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      epicenterMarker = L.marker([eqLat, eqLng], { icon: pulseIcon }).addTo(map);
      map.setView([eqLat, eqLng], 8);
    }

    /* 🟠 IMPACT RADIUS */
    if(msg.type === 'SET_RADIUS'){
      if(impactCircle){
        map.removeLayer(impactCircle);
      }

      const lat = Number(msg.payload.lat);
      const lng = Number(msg.payload.lng);
      const radius = Number(msg.payload.radius);

      impactCircle = L.circle([lat, lng], {
        radius: radius,
        color: '#F97316',
        fillColor: '#FDBA74',
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);
    }

    /* OTHER CONTROLS */
    if(msg.type === 'FOCUS'){
      map.flyTo([msg.payload.lat,msg.payload.lng], 17, {duration:0.7});
      setActive(msg.payload.id);
    }

    if(msg.type === 'ZOOM_IN') map.zoomIn();
    if(msg.type === 'ZOOM_OUT') map.zoomOut();

    if(msg.type === 'RESET' && bounds.isValid()){
      map.fitBounds(bounds.pad(0.25));
    }

  }catch(err){}
});

/* READY */
window.ReactNativeWebView.postMessage(JSON.stringify({type:'MAP_READY'}));

</script>
</body>
</html>
  `;
}
