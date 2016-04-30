'use strict';

var common = require('../common');

module.exports = function themeConfigurationFilter(locals) {
  locals.theme = common.configuration(
    locals.page.lang,
    locals.theme,
    this.locals.getters.data(),
    'theme'
  );
  locals.theme.default = locals.theme;
  return locals;
};
