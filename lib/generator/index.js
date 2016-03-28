'use strict';

module.exports = function generators(ctx) {
  var generator = ctx.extend.generator;

  generator.register('post', require('./post'));
};
