'use strict';

const mainMap = () => {
  // const div = document.getElementById('location');

  // const suggestionsElement = document.getElementsByClassName('suggestions');

  // div.appendChild(suggestionsElement);

  mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhbm1hcHMiLCJhIjoiY2pzeDNkZHo0MGU2ZjQ1bzV3ZGExNXRmMCJ9.Yc4_1JYlXjBEZ-mXzuETgA';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.4512, 43.6568],
    zoom: 13
  });

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  });

  const div = document.getElementById('location');

  div.appendChild(geocoder.onAdd(map));

  const input = document.querySelector('#location .mapboxgl-ctrl-geocoder input').setAttribute('name', 'location');

  document.querySelector('#location .mapboxgl-ctrl-geocoder input');

  document.querySelector('#location .mapboxgl-ctrl-geocoder input').placeholder = 'Location';

  // div.mapboxgl-ctrl-geocoder
  // if (!navigator.geolocation) {
  //   console.log('Geolocation is not supported by your browser');
  // } else {
  //   navigator.geolocation.getCurrentPosition(hasLocation, error);
  // }

  // function error (error) {
  //   console.log(`There was an error: ${error} `);
  // }

  // function hasLocation (position) {
  //   let coords;

  //   const latitude = position.coords.latitude;
  //   const longitude = position.coords.longitude;
  //   coords = [longitude, latitude];
  //   mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhbm1hcHMiLCJhIjoiY2pzeDNkZHo0MGU2ZjQ1bzV3ZGExNXRmMCJ9.Yc4_1JYlXjBEZ-mXzuETgA';

  //   const mapDiv = document.getElementById('map');

  //   const map = new mapboxgl.Map({
  //     container: mapDiv,
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center: coords,
  //     zoom: 15
  //   });

  //   map.addControl(new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken
  //   }));

  //   map.addControl(new mapboxgl.GeolocateControl({
  //     positionOptions: {
  //       enableHighAccuracy: true
  //     },
  //     trackUserLocation: true
  //   }));
  // };
};

window.addEventListener('load', mainMap);
