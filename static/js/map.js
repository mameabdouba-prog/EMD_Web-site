// Coordonnées approximatives (modifiable plus tard)
const LAT = 14.7644340;
const LNG = -16.9148230;

// Initialisation de la carte
const map = L.map('map').setView([LAT, LNG], 15);

// Fond OpenStreetMap (gratuit)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marqueur
L.marker([LAT, LNG])
    .addTo(map)
    .bindPopup('<b>Groupe Scolaire EMD</b><br>Notre établissement')
    .openPopup();
