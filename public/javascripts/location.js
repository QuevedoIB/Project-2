'use strict';

const main = () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }

  function hasLocation (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const latitudeInputElement = document.querySelector('#latitude');
    const longitudeInputElement = document.querySelector('#longitude');

    latitudeInputElement.value = latitude;
    longitudeInputElement.value = longitude;

    const submitButtonElement = document.querySelector('form.js-create-tortilla button');
    submitButtonElement.removeAttribute('disabled');
  }

  function error (error) {
    console.log(`There was an error: ${error}`);
  }
};

window.addEventListener('load', main);
