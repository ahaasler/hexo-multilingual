'use strict';

module.exports = function(hexo) {
  var filter = hexo.extend.filter;

  filter.register('template_locals', require('./configuration'));
};
