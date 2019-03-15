'use strict';

const mainComment = (callback) => {
  /*

  */

  const handleSubmit = (evt) => {
    // cancelamos el envío del formulario
    evt.preventDefault();
    // dentro del form cogemos el target (form) y hacemos un query selector para sacar el hijo de ese form
    const input = document.querySelectorAll('#comment-input');

    // llamamos a la función search tortillas y le pasamos el valor del input
    postComment(input[0].value, input[1].value);
  };

  // `/api/event/${event}/comment/create`

  const postComment = async (comment, eventId) => {
    const options = {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      method: 'POST',
      body: JSON.stringify({ comment })
    };
    const commentsResponse = await fetch(`/api/event/${eventId}/comment/create`, options);
    const event = await commentsResponse.json();

    callback(event);
  };
  const buttonSubmit = document.querySelector('a.shadow');

  buttonSubmit.addEventListener('click', handleSubmit);
};
