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

  it('default - no alternates', function() {
    _list_alternates(null, 'en')().should.eql('<ul class="alternate-list"></ul>');
    _list_alternates(null, 'es')().should.eql('<ul class="alternate-list"></ul>');
  });

  it('default - empty', function() {
    _list_alternates([], 'en')().should.eql('<ul class="alternate-list"></ul>');
    _list_alternates([], 'es')().should.eql('<ul class="alternate-list"></ul>');
  });

  it('default - one post', function() {
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

  it('custom text - empty', function() {
    var config = {
      prepend: '<custom>',
      append: '</custom>'
    };
    _list_alternates([], 'en')(config).should.eql('<custom></custom>');
    _list_alternates([], 'es')(config).should.eql('<custom></custom>');
  });

  it('custom text - one post', function() {
    var config = {
      prepend: '<custom index="%currentIndex">',
      append: '</custom>',
      element: '<element url="%url" path="%path" lang="%lang" current="%isCurrent">%title</element>'
    };
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')(config).should.eql('<custom index="0"><element url="/one/" path="one/" lang="en" current="true">one</element><element url="/uno/" path="uno/" lang="es" current="false">uno</element></custom>');
    _list_alternates(alternates, 'es')(config).should.eql('<custom index="1"><element url="/one/" path="one/" lang="en" current="false">one</element><element url="/uno/" path="uno/" lang="es" current="true">uno</element></custom>');
  });

  it('custom showCurrent - one post', function() {
    var config = {
      showCurrent: false
    };
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/uno/" hreflang="es" title="uno">es</a></li></ul>');
    _list_alternates(alternates, 'es')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/one/" hreflang="en" title="one">en</a></li></ul>');
  });

  it('custom order - lang descending', function() {
    var config = {
      order: -1,
    };
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/uno/" hreflang="es" title="uno">es</a></li><li class="alternate-list-item"><a class="alternate-list-link current" href="/one/" hreflang="en" title="one">en</a></li></ul>');
    _list_alternates(alternates, 'es')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link current" href="/uno/" hreflang="es" title="uno">es</a></li><li class="alternate-list-item"><a class="alternate-list-link " href="/one/" hreflang="en" title="one">en</a></li></ul>');
  });

  it('custom order - title ascending', function() {
    var config = {
      orderby: 'title'
    };
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link current" href="/one/" hreflang="en" title="one">en</a></li><li class="alternate-list-item"><a class="alternate-list-link " href="/uno/" hreflang="es" title="uno">es</a></li></ul>');
    _list_alternates(alternates, 'es')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/one/" hreflang="en" title="one">en</a></li><li class="alternate-list-item"><a class="alternate-list-link current" href="/uno/" hreflang="es" title="uno">es</a></li></ul>');
  });

  it('custom order - title descending', function() {
    var config = {
      orderby: 'title',
      order: -1
    };
    var alternates = [{
      title: 'one',
      lang: 'en',
      path: 'one/'
    }, {
      title: 'uno',
      lang: 'es',
      path: 'uno/'
    }];
    _list_alternates(alternates, 'en')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link " href="/uno/" hreflang="es" title="uno">es</a></li><li class="alternate-list-item"><a class="alternate-list-link current" href="/one/" hreflang="en" title="one">en</a></li></ul>');
    _list_alternates(alternates, 'es')(config).should.eql('<ul class="alternate-list"><li class="alternate-list-item"><a class="alternate-list-link current" href="/uno/" hreflang="es" title="uno">es</a></li><li class="alternate-list-item"><a class="alternate-list-link " href="/one/" hreflang="en" title="one">en</a></li></ul>');
  });
});
