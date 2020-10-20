mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'cluster-map',
style: 'mapbox://styles/mapbox/light-v10',
center: [83.513833, 24.410144],
zoom:3.6
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
'circle-color': [
'step',
['get', 'point_count'],
'#BBDEFB',
4,
'#81D4FA',
10,
'#1E88E5',
20,
'#1976D2',
30,
'#1565C0',
40,
'#0D47A1',
],
'circle-radius': [
'step',
['get', 'point_count'],
10,
4,
12,
10,
15,
20,
18,
30,
20,
40,
25
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#00BCD4',
'circle-radius': 6,
'circle-stroke-width': 2,
'circle-stroke-color': '#90A4AE'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', function (e) {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campgrounds').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', function (e) {
const { popUpMarkup } = e.features[0].properties;
const coordinates = e.features[0].geometry.coordinates.slice();
 
// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(popUpMarkup)
    .addTo(map)
});
 
map.on('mouseenter', 'clusters', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
map.getCanvas().style.cursor = '';
});
});
