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
    let result = zxcvbn(val);

    // Update the password strength meter
    meter.value = result.score;

    // Update the text indicator
    if (val !== '') {
      strengthText.innerHTML = 'Strength: ' + strength[result.score];
    } else {
      strengthText.innerHTML = '';
    }
  });
};

window.addEventListener('load', main);
