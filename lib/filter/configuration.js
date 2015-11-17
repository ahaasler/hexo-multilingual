'use strict';

var common = require('../common');

module.exports = function(locals) {
  locals.config = common.configuration(locals.page.lang, this.config, this.locals.getters.data());
  return locals;
};
