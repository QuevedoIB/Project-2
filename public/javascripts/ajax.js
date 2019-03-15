'use strict';

const mainAjax = async () => {
  const functionComments = (comments) => {
    const chat = document.querySelector('.comments');

    chat.innerHTML = '';

    comments.forEach(message => {
      console.log(message);
      const messageText =
        `<div class='each-comment'>
        <img class="user-image" src='${message.userImage}' />
          <div class="comment-text">
        <p id="comments-chat">
          <span class="user-comment">${message.user}:</span> ${message.message} <span class="date-comment">${message.date}</span>
        </p>
      </div>
      </div>`;

      chat.innerHTML += messageText;
    });
  };
  const fullUrl = window.location.href;
  const urlArray = fullUrl.split('/');
  const id = urlArray[urlArray.length - 1];

  let messagesRequest;

  let messages;

  async function onRequest () {
    try {
      messagesRequest = await fetch(`/api/events/${id}/comments`);

      messages = await messagesRequest.json();

      functionComments(messages.comments);
    } catch (err) {
      console.error(err);
    }
  }

  onRequest();

  mainComment(functionComments);
};

window.addEventListener('load', mainAjax);
