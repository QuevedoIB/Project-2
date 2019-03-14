'use strict';

const mainComment = () => {
  /*

  */

  const form = document.querySelector('form.comment-input');

  const handleSubmit = (event) => {
    // cancelamos el envío del formulario
    event.preventDefault();
    // dentro del form cogemos el target (form) y hacemos un query selector para sacar el hijo de ese form
    const input = event.target.querySelectorAll('input');

    // llamamos a la función search tortillas y le pasamos el valor del input
    postComment(input[0].value, input[1].value);
  };

  // `/api/event/${event}/comment/create`

  const postComment = async (comment, event) => {
    fetch(`/api/event/${event}/comment/create`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(comment)
      })
      .then(function (res) {
        console.log(res);
        return res.json();
      });
  };

  form.addEventListener('submit', handleSubmit);
};

window.addEventListener('load', mainComment);
