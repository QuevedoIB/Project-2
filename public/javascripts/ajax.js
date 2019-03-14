'use strict';

const mainAjax = async () => {
  const fullUrl = window.location.href;
  const urlArray = fullUrl.split('/');
  const id = urlArray[urlArray.length - 1];

  let messagesRequest;

  let messages;

  async function onRequest () {
    try {
      messagesRequest = await fetch(`/api/events/${id}/comments`);

      messages = await messagesRequest.json();

      const chat = document.querySelector('div.comment-text');

      chat.innerHTML = '';

      messages.comments.forEach(message => {
        const messageText =
          `<div class="each-comment">
      <img src='${message.userImage}' />
        <p>
          <span class="user-comment">${message.user}:</span> ${message.message} <span class="date-comment">${message.date}</span>
        </p>
      </div>`;

        chat.innerHTML += messageText;
      });
    } catch (err) {
      console.error(err);
    }
  }

  onRequest();
};

window.addEventListener('load', mainAjax);
