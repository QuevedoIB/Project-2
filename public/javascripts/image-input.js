'use strict';

const mainInput = () => {
  const displayTab = (event, button) => {
    const selectedForm = document.getElementById('image-form');

    if (selectedForm.className === 'invisible') {
      selectedForm.className = 'visible';
    } else {
      selectedForm.className = 'invisible';
    }
  };
  const selectedButton = document.querySelector('.add-image');

  selectedButton.addEventListener('click', (event) => {
    displayTab(event, selectedButton);
  });
};

window.addEventListener('load', mainInput);
