define('a', function(require, exports, module) {

  new Vue({
    el: '#app',
    data: {
      msg: 'load from a.js'
    }
  });

  require('https://vuejs.org/js/vue.min.js');

  module.exports = 'foo';
});
