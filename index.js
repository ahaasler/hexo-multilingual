'use strict';

exports.util = require('./lib/util');

if (typeof hexo !== 'undefined') {
  // Filter
  require('./lib/filter')(hexo);
  // Generators
  require('./lib/generator')(hexo);
  // Helpers
  require('./lib/helper')(hexo);
}
