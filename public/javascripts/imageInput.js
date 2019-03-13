'use strict';

const mainInput = () => {
  const displayTab = (event, button) => {
    const selectedForm = document.getElementById('image-form');
    selectedForm.removeAttribute('class');
  };
  const selectedButton = document.querySelector('.add-image');
  selectedButton.addEventListener('click', (event) => {
    displayTab(event, selectedButton);
  });
};

window.addEventListener('load', mainInput);
