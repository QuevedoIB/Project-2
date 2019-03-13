'use strict';
const mainDiv = () => {
  const displayTab = (event, button) => {
    const selectedDiv = document.querySelector('.comments');
    if (selectedDiv.hasAttribute('id')) {
      selectedDiv.removeAttribute('id');
    } else {
      selectedDiv.setAttribute('id', 'hide');
    }
  };
  const selectedButton = document.querySelector('.comment-h3');
  selectedButton.addEventListener('click', (event) => {
    displayTab(event, selectedButton);
  });
};
window.addEventListener('load', mainDiv);
