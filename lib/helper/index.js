'use strict';

module.exports = function helpers(ctx) {
  var helper = ctx.extend.helper;

  helper.register('_c', require('./_c'));
  helper.register('list_alternates', require('./list_alternates'));
  helper.register('list_head_alternates', require('./list_head_alternates'));
};
