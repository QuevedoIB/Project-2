const main = () => {
  const date = document.querySelector('.date');
  date.innerHTML = moment(date.innerHTML).format('LL');
};

window.addEventListener('load', main);
