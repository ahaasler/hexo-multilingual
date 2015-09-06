'use strict';

exports.util = require('./lib/util');

// Helpers
if (typeof hexo !== 'undefined') {
	require('./lib/helper')(hexo);
}
