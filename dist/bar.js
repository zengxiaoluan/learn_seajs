define('https://zengxiaoluan.github.io/learn_seajs/dist/bar.js', ['https://zengxiaoluan.github.io/learn_seajs/dist/bar2.js'], function(require, exports, module) {
  var bar2 = require('https://zengxiaoluan.github.io/learn_seajs/dist/bar2.js');

  module.exports = {
    bar: function () {
      return 'Come from bar.js' + bar2.bar2();
    }
  };
});
