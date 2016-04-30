'use strict';

module.exports = function filters(hexo) {
  var filter = hexo.extend.filter;

  filter.register('template_locals', require('./configuration'));
  filter.register('template_locals', require('./theme'));
};
