'use strict';

module.exports = function helpers(ctx) {
  var helper = ctx.extend.helper;

  helper.register('_c', require('./_c'));
};
