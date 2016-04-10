'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var fs = require('hexo-fs');
var pathFn = require('path');
var list_head_alternates = require('../../lib/helper/list_head_alternates');

describe('list_head_alternates', function() {
  var Hexo = require('hexo');
  var baseDir = pathFn.join(__dirname, 'data_test');
  var hexo = new Hexo(baseDir);

  function _list_head_alternates(alternates, lang) {
    return list_head_alternates.bind({
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

  it('empty', function() {
    _list_head_alternates([], 'en')().should.eql('');
    _list_head_alternates([], 'es')().should.eql('');
  });

  it('two languages', function() {
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_head_alternates(alternates, 'en')().should.eql('<link rel="alternate" href="/uno/" hreflang="es" />');
    _list_head_alternates(alternates, 'es')().should.eql('<link rel="alternate" href="/one/" hreflang="en" />');
  });

  it('three languages', function() {
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }, {
      title: 'eins',
      lang: 'de',
      path: 'eins/'
    }];
    _list_head_alternates(alternates, 'en')().should.eql('<link rel="alternate" href="/eins/" hreflang="de" /><link rel="alternate" href="/uno/" hreflang="es" />');
    _list_head_alternates(alternates, 'es')().should.eql('<link rel="alternate" href="/eins/" hreflang="de" /><link rel="alternate" href="/one/" hreflang="en" />');
    _list_head_alternates(alternates, 'de')().should.eql('<link rel="alternate" href="/one/" hreflang="en" /><link rel="alternate" href="/uno/" hreflang="es" />');
  });
});
