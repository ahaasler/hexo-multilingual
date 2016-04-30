'use strict';

var common = require('../common');

module.exports = function configurationFilter(locals) {
  locals.config = common.configuration(
    locals.page.lang,
    this.config,
    this.locals.getters.data(),
    'config'
  );
  locals.config.default = this.config;
  return locals;
};
