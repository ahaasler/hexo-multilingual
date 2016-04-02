'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var fs = require('hexo-fs');
var pathFn = require('path');
var list_alternates = require('../../lib/helper/list_alternates');

describe('list_alternates', function() {
  var Hexo = require('hexo');
  var baseDir = pathFn.join(__dirname, 'data_test');
  var hexo = new Hexo(baseDir);

  function _list_alternates(alternates, lang) {
    return list_alternates.bind({
      config: hexo.config,
      site: hexo.locals.toObject(),
      page: {
        lang: lang,
        alternates: alternates
      },
      url_for: function (string) {
        return '/' + string;
      }
    });
  }

  before(function() {
    return fs.mkdirs(baseDir).then(function() {
      hexo.init();
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  it('default - empty', function() {
    _list_alternates([], 'en')().should.eql('<ul class="alternate-list"></ul>');
    _list_alternates([], 'es')().should.eql('<ul class="alternate-list"></ul>');
  });

  it('default - one', function() {
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')().should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link current" href="/one/" hreflang="en" title="one">en</a></li><li class="alternate-list-item"><a class="alternate-list-link " href="/uno/" hreflang="es" title="uno">es</a></li></ul>');
    _list_alternates(alternates, 'es')().should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/one/" hreflang="en" title="one">en</a></li><li class="alternate-list-item"><a class="alternate-list-link current" href="/uno/" hreflang="es" title="uno">es</a></li></ul>');
  });
});
