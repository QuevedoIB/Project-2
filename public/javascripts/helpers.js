'use estrict';

const main = () => {
  Handlebars.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) { accum += block.fn(i); }
    return accum;
  });
};

window.addEventListener('load', main);
