'use strict';

const main = () => {
  document.addEventListener('click', (event) => {
    if (event.target.className === 'attendees') {
      if (event.target.childNodes[0].className === 'hide') {
        event.target.childNodes.forEach(child => { child.className = 'show'; });
      } else {
        event.target.childNodes.forEach(child => { child.className = 'hide'; });
      }
    }
  });
};

window.addEventListener('load', main);
