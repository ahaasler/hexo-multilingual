'use strict';

var merge = require('deepmerge');
var lodash = require('lodash');

/**
 * Retrieve nested item from object/array (http://stackoverflow.com/a/16190716)
 * @param {Object|Array} obj
 * @param {String} path dot separated
 * @param {*} def default value ( if result undefined )
 * @returns {*}
 */
function retrieveItem(obj, path, def) {
  var i;
  var nodes = path.split('.');
  var len = nodes.length;
  var result = obj;
  for (i = 0; i < len; i++) {
    if (!result || typeof result !== 'object') return def;
    result = result[nodes[i]];
  }
  if (result === undefined) return def;
  return result;
}

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
  var localized;
  if (data['config_' + lang] !== null && data['config_' + lang] !== undefined) {
    localized = retrieveItem(data['config_' + lang], value);
    return localized !== undefined ? localized : retrieveItem(config, value);
  }
  return retrieveItem(config, value);
};

/**
 * Retrieve the whole configuration, localized for the given language.
 *
 * @param {String} language
 * @param {Object} Hexo configuration object
 * @param {String} Hexo data object
 * @param {String} prefix of the configuration file.
 * @returns {*} localized configuration
 */
exports.configuration = function configuration(lang, config, data, filePrefix) {
  var file = filePrefix + '_' + lang;
  if (data[file] !== null && data[file] !== undefined) {
    return merge(config, data[file]);
  }
  return config;
};

exports.listAlternates = function listAlternates(options, alternates, currentLang, generateUrl) {
  var opts = options || {};
  var alts = alternates || [];

  var prepend = opts.hasOwnProperty('prepend') ? opts.prepend : '<ul class="alternate-list">';
  var append = opts.hasOwnProperty('append') ? opts.append : '</ul>';
  var element = opts.hasOwnProperty('element') ? opts.element :
      '<li class="alternate-list-item">' +
      '<a class="alternate-list-link %currentTag" href="%url" hreflang="%lang" title="%title">' +
      '%lang' +
      '</a>' +
      '</li>';
  var showCurrent = opts.hasOwnProperty('showCurrent') ? opts.showCurrent : true;
  var orderBy = opts.hasOwnProperty('orderby') ? opts.orderby : 'lang';
  var order = opts.hasOwnProperty('order') ? opts.order : 1;

  var result = prepend;
  var currentIndex = -1;
  lodash.orderBy(alts, [orderBy], [order === 1 ? 'asc' : 'desc']).forEach(function (alternate, i) {
    if (alternate.lang === currentLang) {
      currentIndex = i;
    }
    if (alternate.lang !== currentLang || showCurrent) {
      result += element
          .replace(/%title/g, alternate.title)
          .replace(/%path/g, alternate.path)
          .replace(/%lang/g, alternate.lang)
          .replace(/%currentTag/g, alternate.lang === currentLang ? 'current' : '')
          .replace(/%isCurrent/g, alternate.lang === currentLang)
          .replace(/%url/g, generateUrl(alternate.path));
    }
  });

  result += append;
  result = result.replace(/%currentIndex/g, currentIndex);
  return result;
};
