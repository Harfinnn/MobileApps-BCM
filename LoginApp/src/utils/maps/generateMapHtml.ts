export function generateMapHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0">

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css"/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

<style>
html,body,#map{
height:100%;
margin:0;
}

.marker-dot{
border-radius:50%;
border:3px solid white;
}

.popup-title{
font-weight:bold;
font-size:14px;
margin-bottom:3px;
}

.popup-address{
font-size:12px;
color:#64748B;
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


L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19,
  maxNativeZoom: 18,
}).addTo(map);



let cluster = L.markerClusterGroup({
chunkedLoading:true,
chunkInterval:200,
chunkDelay:50,
maxClusterRadius:60,
spiderfyOnMaxZoom:true,
showCoverageOnHover:false,
removeOutsideVisibleBounds:true,
animate:false
});

map.addLayer(cluster);


let bounds = L.latLngBounds([]);
let markerMap = {};
let activeMarker = null;


function iconNormal(){
return L.divIcon({
html:'<div class="marker-dot" style="width:26px;height:26px;background:#3B82F6"></div>',
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



/* ========= ADD MARKERS BATCH ========= */

function addMarkers(list){

list.forEach(function(item){

if(markerMap[item.mjs_id]) return;

if(!item.mjs_lat || !item.mjs_long) return;

const lat = Number(item.mjs_lat);
const lng = Number(item.mjs_long);

const marker = L.marker(
[lat,lng],
{icon:iconNormal()}
);


/* lazy popup */
marker.on('click',function(){

if(!marker.getPopup()){

marker.bindPopup(
'<div class="popup-title">'+item.mjs_nama+'</div>'+
'<div class="popup-address">'+item.mjs_alamat+'</div>'
);

}

setActive(item.mjs_id);

window.ReactNativeWebView.postMessage(
JSON.stringify({
type:'MARKER_CLICK',
payload:item.mjs_id
})
);

});


markerMap[item.mjs_id] = marker;

cluster.addLayer(marker);

bounds.extend([lat,lng]);

});

}



/* ========= MESSAGE ========= */

document.addEventListener('message',function(e){

try{

const msg = JSON.parse(e.data);


/* reset markers */

if(msg.type === 'RESET_MARKERS'){

cluster.clearLayers();
markerMap = {};
bounds = L.latLngBounds([]);

}


/* add batch markers */

if(msg.type === 'ADD_MARKERS'){

addMarkers(msg.payload);

}


/* focus marker */

if(msg.type === 'FOCUS'){

map.flyTo(
[msg.payload.lat,msg.payload.lng],
17,
{duration:0.7}
);

setActive(msg.payload.id);

}


/* zoom */

if(msg.type === 'ZOOM_IN') map.zoomIn();
if(msg.type === 'ZOOM_OUT') map.zoomOut();


/* reset bounds */

if(msg.type === 'RESET' && bounds.isValid()){
map.fitBounds(bounds.pad(0.25));
}


}catch(err){}

});


/* map ready */

window.ReactNativeWebView.postMessage(
JSON.stringify({type:'MAP_READY'})
);

</script>
</body>
</html>
`;
}
