// Inisialisasi peta
const map = L.map('map').setView([-6.903, 107.6510], 13);



// Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Basemap Google Maps
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap Google Satellite
const baseMapSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Satellite by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan salah satu basemap secara default
basemapOSM.addTo(map);

// Daftar semua pilihan basemap
const baseMaps = {
  "OpenStreetMap": basemapOSM,
  "Google Maps": baseMapGoogle,
  "Google Satellite": baseMapSatellite
};


// Tambahkan control layer ke peta
L.control.layers(baseMaps).addTo(map);


/// Tombol "Home"
const homeControl = L.control({ position: 'topleft' });
homeControl.onAdd = function(mapInstance) { // Mengganti 'map' dengan 'mapInstance' agar lebih jelas bedanya dengan variabel global 'map'
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '🏠';
    div.style.backgroundColor = 'white';
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.lineHeight = '30px'; // Pastikan ikon di tengah vertikal
    div.style.fontSize = '20px';   // Sesuaikan ukuran ikon jika perlu
    div.style.textAlign = 'center';
    div.style.cursor = 'pointer';
    div.title = 'Kembali ke Home';
    div.onclick = function() {
        // Gunakan homeCoordinates yang sudah didefinisikan
        mapInstance.setView([homeCoordinates.lat, homeCoordinates.lng], homeCoordinates.zoom);
    };
    return div;
};
homeControl.addTo(map);


// Fitur "My Location"
L.control.locate({
  position: 'topleft',
  flyTo: true,
  strings: {
    title: "Temukan lokasiku"
  },
  locateOptions: {
    enableHighAccuracy: true
  }
}).addTo(map);


const fullscreenControl = L.control({ position: 'topleft' });

fullscreenControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '⛶'; // Ikon fullscreen
    div.style.backgroundColor = 'white';
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.lineHeight = '30px';
    div.style.textAlign = 'center';
    div.style.cursor = 'pointer';
    div.title = 'Fullscreen';

    div.onclick = function() {
        const mapContainer = map.getContainer(); // Dapatkan elemen kontainer peta

        if (!document.fullscreenElement &&    // Standar
            !document.mozFullScreenElement && // Firefox
            !document.webkitFullscreenElement && // Chrome, Safari, Opera
            !document.msFullscreenElement) {  // IE/Edge

            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.mozRequestFullScreen) { /* Firefox */
                mapContainer.mozRequestFullScreen();
            } else if (mapContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) { /* IE/Edge */
                mapContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    };
    return div;
};

fullscreenControl.addTo(map);

// Anda mungkin perlu menangani event perubahan fullscreen untuk memperbarui UI tombol
document.addEventListener('fullscreenchange', () => map.invalidateSize());
document.addEventListener('webkitfullscreenchange', () => map.invalidateSize());
document.addEventListener('mozfullscreenchange', () => map.invalidateSize());
document.addEventListener('MSFullscreenChange', () => map.invalidateSize());

var symbologyPoint = { 
  radius: 5, 
  fillColor: "#9dfc03", 
  color: "#000", 
  weight: 1, 
  opacity: 1, 
  fillOpacity: 0.8 
} 

const jembatanPT = new L.LayerGroup(); 
$.getJSON("./data-spasial/jembatan_pt.geojson", function (OBJECTID) { 
    L.geoJSON(OBJECTID, { 
            pointToLayer: function (feature, latlng) { 
            return L.circleMarker(latlng, symbologyPoint);} 
        }).addTo(jembatanPT); 
    }); 
jembatanPT.addTo(map); ``

const adminKelurahanAR = new L.LayerGroup(); 
$.getJSON("./data-spasial/admin_kelurahan_ln.geojson", function (OBJECTID) { 
L.geoJSON(OBJECTID, { 
style: { 
color : "black", 
weight : 2, 
opacity : 1, 
dashArray: '3,3,20,3,20,3,20,3,20,3,20', 
lineJoin: 'round' 
} 
}).addTo(adminKelurahanAR); 
}); 
adminKelurahanAR.addTo(map); 

const landcover = new L.LayerGroup(); 
$.getJSON("./data-spasial/landcover_ar.geojson", function (REMARK) { 
L.geoJson(REMARK, { 
style: function(feature) { 
switch (feature.properties.REMARK) { 
case 'Danau/Situ': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Empang':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Hutan Rimba': return {fillColor:"#38A800", fillOpacity: 0.8, color: 
"#38A800"}; 
case 'Perkebunan/Kebun':   
return {fillColor:"#E9FFBE", fillOpacity: 0.8, 
color: "#E9FFBE"}; 
case 'Permukiman dan Tempat Kegiatan': return {fillColor:"#FFBEBE", 
fillOpacity: 0.8, weight: 0.5, color: "#FB0101"}; 
case 'Sawah':   return {fillColor:"#01FBBB", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Semak Belukar': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#00A52F"}; 
case 'Sungai':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Tanah Kosong/Gundul': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#000000"}; 
case 'Tegalan/Ladang':   return {fillColor:"#EDFF85", fillOpacity: 0.8, 
color: "#EDFF85"}; 
case 'Vegetasi Non Budidaya Lainnya':   return {fillColor:"#000000", 
fillOpacity: 0.8, weight: 0.5, color: "#000000"}; 
} 
}, 
onEachFeature: function (feature, layer) { 
layer.bindPopup('<b>Tutupan Lahan: </b>'+ feature.properties.REMARK) 
} 
}).addTo(landcover); 
}); 
landcover.addTo(map); 

const Component = {
    "Jembatan": jembatanPT,
    "Batas Administrasi": adminKelurahanAR,
    "Penggunaan Lahan": landcover
  };
  
  L.control.layers(baseMaps, Component).addTo(map); // Pastikan panel kontrol tetap ada
  
  let legend = L.control({ position: "topright" });
  
  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "legend");
      div.style.fontSize = "10px"; // Mengecilkan ukuran font
      div.style.padding = "5px"; // Mengurangi padding
  
      div.innerHTML =
          '<p style="font-size: 14px; font-weight: bold; margin-bottom: 3px; margin-top: 5px;">Legenda</p>' +
          '<p style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">Infrastruktur</p>' +
          '<div><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#D8A7D1" /></svg></div>Jembatan<br>' +
          '<p style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">Batas Administrasi</p>' +
          '<div><svg width="25" height="10"><line x1="0" y1="5" x2="25" y2="5" style="stroke-width:1;stroke:rgb(0,0,0);stroke-dasharray:5 2"/></svg></div>Batas Desa/Kelurahan<br>' +
          '<p style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">Tutupan Lahan</p>' +
          '<div style="background-color: #97DBF2; height: 8px; width: 40px;"></div>Danau/Situ<br>' +
          '<div style="background-color: #97DBF2; height: 8px; width: 40px;"></div>Empang<br>' +
          '<div style="background-color: #38A800; height: 8px; width: 40px;"></div>Hutan Rimba<br>' +
          '<div style="background-color: #E9FFBE; height: 8px; width: 40px;"></div>Perkebunan/Kebun<br>' +
          '<div style="background-color: #FFBEBE; height: 8px; width: 40px;"></div>Permukiman<br>' +
          '<div style="background-color: #01FBBB; height: 8px; width: 40px;"></div>Sawah<br>' +
          '<div style="background-color:rgb(164, 250, 160); height: 8px; width: 40px;"></div>Semak Belukar<br>' +
          '<div style="background-color: #97DBF2; height: 8px; width: 40px;"></div>Sungai<br>' +
          '<div style="background-color:#D3D3D3; height: 8px; width: 40px;"></div>Tanah Kosong/Gundul<br>' +
          '<div style="background-color: #EDFF85; height: 8px; width: 40px;"></div>Tegalan/Ladang<br>' +
          '<div style="background-color: #000000; height: 8px; width: 40px;"></div>Vegetasi Non Budidaya<br>';
      return div;
  };
  
  legend.addTo(map);

  
