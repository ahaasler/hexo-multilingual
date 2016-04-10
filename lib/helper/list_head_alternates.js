'use strict';

var common = require('../common');

module.exports = function listHeadAlternatesHelper() {
  return common.listAlternates({
    element: '<link rel="alternate" href="%url" hreflang="%lang" />',
    prepend: '',
    append: '',
    showCurrent: false
  }, this.page.alternates, this.page.lang, this.url_for);
};
