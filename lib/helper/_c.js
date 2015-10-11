'use strict';

var common = require('../common');

module.exports = function(string) {
  return common._c(string, this.page.lang, this.config, this.site.data);
};
