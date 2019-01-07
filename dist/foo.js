define('foo', function(require, exports, module) {
  var bar = require('bar');

  new Vue({
    el: '#app',
    data: {
      msg: bar.bar()
    }
  });

  require('https://vuejs.org/js/vue.min.js');
});
