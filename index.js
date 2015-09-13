'use strict';

exports.util = require('./lib/util');

if (typeof hexo !== 'undefined') {
	// Generators
	require('./lib/generator')(hexo);
	// Helpers
	require('./lib/helper')(hexo);
}
