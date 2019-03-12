'use strict';

const mainMap = () => {
  const mapIcon = document.getElementById('map-icon');
  let mapElement = document.getElementById('map');

  function showMap (mapElement) {
    if (mapElement.classList.contains('map-height-none')) {
      mapElement.classList.remove('map-height-none');
      mapElement.classList.add('map-height');
      console.log('hola');
    } else {
      mapElement.classList.remove('map-height');
      mapElement.classList.add('map-height-none');
    }
  }

  mapIcon.addEventListener('click', () => showMap(mapElement));

  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }

  function error (error) {
    console.log(`There was an error: ${error} `);
  }

  function hasLocation (position) {
    let coords;

    const locationElement = document.getElementById('location');

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    coords = [longitude, latitude];
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhbm1hcHMiLCJhIjoiY2pzeDNkZHo0MGU2ZjQ1bzV3ZGExNXRmMCJ9.Yc4_1JYlXjBEZ-mXzuETgA';

    let eventLocation;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationElement.innerText}.json?proximity=${longitude},${latitude}&access_token=pk.eyJ1IjoiaXZhbm1hcHMiLCJhIjoiY2pzeDNkZHo0MGU2ZjQ1bzV3ZGExNXRmMCJ9.Yc4_1JYlXjBEZ-mXzuETgA`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        eventLocation = myJson.features[0].center;
        // distance(coords[0], coords[1], eventLocation[0], eventLocation[1]);
        fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${longitude},${latitude};${eventLocation[0]},${eventLocation[1]}?steps=true&voice_instructions=true&banner_instructions=true&voice_units=imperial&waypoint_names=Home;Work&access_token=pk.eyJ1IjoiaXZhbm1hcHMiLCJhIjoiY2pzeDNkZHo0MGU2ZjQ1bzV3ZGExNXRmMCJ9.Yc4_1JYlXjBEZ-mXzuETgA`)
          .then(function (response) {
            return response.json();
          })
          .then(function (myJson) {
            let directions = myJson;
            const kms = directions.routes[0].distance / 1000;
            const twoDecDistance = Math.round((kms) * 100) / 100;
            document.getElementById('distance-location').innerText = `${twoDecDistance} km away of the event`;
          });
      });

    const mapDiv = document.getElementById('map');

    const map = new mapboxgl.Map({
      container: mapDiv,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords,
      zoom: 15
    });

    map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    }));

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.on('load', function () {
      map.loadImage('../images/location-map.png', function (error, image) {
        if (error) throw error;
        map.addImage('pointer', image);
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': coords
                }
              }]
            }
          },
          'layout': {
            'icon-image': 'pointer',
            'icon-size': 1
          }
        });
      });
      map.loadImage('../images/event-map.png', function (error, image) {
        if (error) throw error;
        map.addImage('event', image);
        map.addLayer({
          'id': 'event',
          'type': 'symbol',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': eventLocation
                }
              }]
            }
          },
          'layout': {
            'icon-image': 'event',
            'icon-size': 1
          }
        });
      });
      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                coords,
                eventLocation
              ]
            }
          }
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 8
        }
      });
    });

    // function distance (lat1, lon1, lat2, lon2) {
    //   var p = 0.017453292519943295; // Math.PI / 180
    //   var c = Math.cos;
    //   var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    //     c(lat1 * p) * c(lat2 * p) *
    //     (1 - c((lon2 - lon1) * p)) / 2;

    //   const answer = Math.round((12742 * Math.asin(Math.sqrt(a))) * 100) / 100;// 2 * R; R = 6371 km

    //   document.getElementById('distance-location').innerText = `${answer} km away of the event`;
    // }

    // -------------------------------------------------

    // base path = https://api.mapbox.com
    // request    = /geocoding/v5/{endpoint}/{search_text}.json

    // Cambiar el centro y el zoom del mapa para tu ubicación
    // Crear una ruta o añadir las coordernadas en el template usando elementos hidden
    // añadir un marker con la coordenadas de la tortilla
  };
};

window.addEventListener('load', mainMap);
