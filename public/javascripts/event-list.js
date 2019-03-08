'use strict';

const main = () => {
  const displayTab = (event, list) => {
    [owned, participating, finished].map(e => {
      e.className = 'hide';
      return e;
    });
    // event target
    // split del target
    // poner todas las pestañas menos la del target[0] invisibles

    list.className = 'show';
  };

  const ownedTab = document.getElementById('owned-tab');
  const participatingTab = document.getElementById('participating-tab');
  const finishedTab = document.getElementById('finished-tab');

  const owned = document.getElementById('owned-events');
  const participating = document.getElementById('participating-events');
  const finished = document.getElementById('finished-events');

  ownedTab.addEventListener('click', (event) => { displayTab(event, owned); });
  participatingTab.addEventListener('click', (event) => { displayTab(event, participating); });
  finishedTab.addEventListener('click', (event) => { displayTab(event, finished); });
};

window.addEventListener('load', main);
