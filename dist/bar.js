define('file:///D:/zengxiaoluan/learn_seajs/dist/bar.js', ['file:///D:/zengxiaoluan/learn_seajs/dist/bar2.js'], function(require, exports, module) {
  var bar2 = require('file:///D:/zengxiaoluan/learn_seajs/dist/bar2.js');

  module.exports = {
    bar: function () {
      return 'Come from bar.js' + bar2.bar2();
    }
  };
});
