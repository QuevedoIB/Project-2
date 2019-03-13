'use strict';
const mainForm = () => {
  const displayTab = (event, button) => {
    const selectedForm = document.querySelector('.add-item');
    if (selectedForm.hasAttribute('id')) {
      selectedForm.removeAttribute('id');
    } else {
      selectedForm.setAttribute('id', 'hide');
    }
  };
  const selectedButton = document.querySelector('.add');
  selectedButton.addEventListener('click', (event) => {
    displayTab(event, selectedButton);
  });
};
window.addEventListener('load', mainForm);
