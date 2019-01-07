define('foo', ['https://vuejs.org/js/vue.min.js', 'bar'], function(require, exports, module) {
  // console.log(arguments)
  var bar = require('bar');

  new Vue({
    el: '#app',
    data: {
      msg: bar.bar()
    }
  });

  require('https://vuejs.org/js/vue.min.js');
});