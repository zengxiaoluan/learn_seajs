define('file:///D:/zengxiaoluan/learn_seajs/dist/foo.js', ['file:///D:/zengxiaoluan/learn_seajs/dist/bar.js', 'https://vuejs.org/js/vue.min.js'], function(require, exports, module) {
  var bar = require('file:///D:/zengxiaoluan/learn_seajs/dist/bar.js');

  new Vue({
    el: '#app',
    data: {
      msg: bar.bar()
    }
  });

  require('https://vuejs.org/js/vue.min.js');

  module.exports = 'foo';
});
