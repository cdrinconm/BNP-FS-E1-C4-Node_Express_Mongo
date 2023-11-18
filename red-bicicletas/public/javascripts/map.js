var map = L.map('main_map').setView([4.648974, -74.086304], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([4.648874, -74.086404]).addTo(map);
var marker = L.marker([4.658874, -74.086404]).addTo(map);
var marker = L.marker([4.668874, -74.086504]).addTo(map);