'use strict';

const mainAjax = async () => {
  const fullUrl = window.location.href;
  const urlArray = fullUrl.split('/');
  const id = urlArray[urlArray.length - 1];

  const messagesRequest = await fetch(`/api/events/${id}/comments`);

  const messages = await messagesRequest.json();

  const chat = document.querySelector('div.comment-text');

  chat.innerHTML = '';

  console.log(chat);

  messages.comments.forEach(message => {
    const messageText =
      `<img src='${message.userImage}' />
        <p>
          <span class="user-comment">${message.user}:</span> ${message.message} <span class="date-comment">${message.date}</span>
        </p>`;

    chat.appendChild(messageText);
  });
};

window.addEventListener('load', mainAjax);
