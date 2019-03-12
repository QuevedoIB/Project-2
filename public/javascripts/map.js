'use strict';

const main = () => {
  mapboxgl.accessToken = process.env.accessToken;
  const mapDiv = document.getElementById('map');
  const map = new mapboxgl.Map({
    container: mapDiv,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: getCoords(),
    zoom: 15
  });

  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }));

  // Cambiar el centro y el zoom del mapa para tu ubicación
  // Crear una ruta o añadir las coordernadas en el template usando elementos hidden
  // añadir un marker con la coordenadas de la tortilla

  function getCoords () {
    const coords = document.getElementById('coords-p');

    let coordsSplit = coords.textContent.split(',');

    let longitude = parseFloat(coordsSplit[0]);

    let latitude = parseFloat(coordsSplit[1]);

    return [longitude, latitude];
  };

  map.on('load', function () {
    map.loadImage('../images/omelette.png', function (error, image) {
      if (error) throw error;
      map.addImage('cat', image);
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
                'coordinates': getCoords()
              }
            }]
          }
        },
        'layout': {
          'icon-image': 'cat',
          'icon-size': 0.1
        }
      });
    });
  });
};

window.addEventListener('load', main);
