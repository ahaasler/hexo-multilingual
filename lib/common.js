"use strict";

/**
 * Retrieve a localized configuration value or the default if the localization
 * is unavailable.
 *
 * @param {String} configuration value
 * @param {String} language
 * @param {Object} Hexo configuration object
 * @param {String} Hexo data object
 * @returns {*} localized or default configuration value
 */
exports._c = function _c(value, lang, config, data) {
	if (data["config_" + lang] != null) {
		var localized = retrieveItem(data["config_" + lang], value);
		return localized !== undefined ? localized : retrieveItem(config, value);
	}
	return retrieveItem(config, value);
};

/**
 * Retrieve nested item from object/array (http://stackoverflow.com/a/16190716)
 * @param {Object|Array} obj
 * @param {String} path dot separated
 * @param {*} def default value ( if result undefined )
 * @returns {*}
 */
function retrieveItem(obj, path, def) {
	var i, len;
	for (i = 0, path = path.split("."), len = path.length; i < len; i++) {
		if (!obj || typeof obj !== "object") return def;
		obj = obj[path[i]];
	}
	if (obj === undefined) return def;
	return obj;
}
