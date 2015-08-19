'use strict';

exports._c = function _c(string, lang, config, locals) {
        if (locals.data['config_' + lang] != null) {
                return retrieveItem(locals.data['config_' + lang], string) || retrieveItem(config, string);
        }
        return retrieveItem(config, string);
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
        for (i = 0, path = path.split('.'), len = path.length; i < len; i++) {
                if (!obj || typeof obj !== 'object') return def;
                obj = obj[path[i]];
        }
        if (obj === undefined) return def;
        return obj;
}

