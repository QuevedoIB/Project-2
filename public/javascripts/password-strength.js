'use strict';

const main = () => {
  let strength = {
    0: 'Worst',
    1: 'Bad',
    2: 'Weak',
    3: 'Good',
    4: 'Strong'
  };

  const password = document.getElementById('pass');
  const meter = document.getElementById('password-strength-meter');
  const strengthText = document.getElementById('password-strength-text');

  password.addEventListener('input', function () {
    let val = password.value;

    if (!val) {
      meter.className = 'hide';
    }

    let result = zxcvbn(val);

    // Update the password strength meter
    switch (result.score) {
    case 1:
      meter.className = 'red-bg';
      break;
    case 2:
      meter.className = 'yellow-bg';
      break;
    case 3:
      meter.className = 'orange-bg';
      break;
    case 4:
      meter.className = 'green-bg';
      break;
    }
    meter.value = result.score;

    // Update the text indicator
    if (val !== '') {
      strengthText.innerHTML = 'Password Strength: ' + strength[result.score];
    } else {
      strengthText.innerHTML = '';
    }
  });
};

window.addEventListener('load', main);
