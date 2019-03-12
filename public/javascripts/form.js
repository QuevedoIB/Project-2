'use strict';
const mainForm = () => {
  const displayTab = (event, button) => {
    const selectedForm = document.querySelector('.add-item');
    selectedForm.removeAttribute('id');
  };
  const selectedButton = document.querySelector('.add');
  selectedButton.addEventListener('click', (event) => {
    displayTab(event, selectedButton);
  });
};
window.addEventListener('load', mainForm);
