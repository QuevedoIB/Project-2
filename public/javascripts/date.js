const mainDate = () => {
  const date = document.querySelector('.date');
  date.innerHTML = moment(date.innerHTML).format('LL');
  const dateComment = document.querySelectorAll('.date-comment');
  dateComment.forEach(e => { e.innerHTML = moment(e.innerHTML).format('LL'); });
};

window.addEventListener('load', mainDate);
