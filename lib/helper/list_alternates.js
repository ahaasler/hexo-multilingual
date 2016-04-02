'use strict';

var common = require('../common');

module.exports = function listAlternatesHelper(options) {
  return common.listAlternates(options, this.page.alternates, this.page.lang, this.url_for);
};
