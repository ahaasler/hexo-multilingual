'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var _c = require('../lib/helper/_c');

describe('_c', function() {
  var Hexo = require('hexo');
  var baseDir = pathFn.join(__dirname, 'data_test');
  var hexo = new Hexo(baseDir);
  var processor = require('../node_modules/hexo/lib/plugins/processor/data');
  var process = processor.process.bind(hexo);
  var source = hexo.source;
  var File = source.File;
  var Data = hexo.model('Data');

  function newFile(options) {
    var path = options.path;
    options.params = {
      path: path
    };
    options.path = '_data/' + path;
    options.source = pathFn.join(source.base, options.path);
    return new File(options);
  }

  function __c(lang) {
    return _c.bind({
      config: hexo.config,
      site: hexo.locals.toObject(),
      page: {
        lang: lang
      }
    });
  }

  before(function() {
    return fs.mkdirs(baseDir).then(function() {
      hexo.init();
      process(newFile({
        path: 'config_en.yml',
        type: 'create',
        content: new Buffer('description: English description')
      }));
      process(newFile({
        path: 'config_es.yml',
        type: 'create',
        content: new Buffer('description: Descripción en español')
      }));
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  it('simple - english - yaml', function() {
    __c('en')('description').should.eql('English description');
  });

  it('simple - español - yaml', function() {
    __c('es')('description').should.eql('Descripción en español');
  });

  it('simple - default - yaml', function() {
    __c('en')('title').should.eql('Hexo');
    __c('es')('title').should.eql('Hexo');
  });

  it('simple - unknown language - yaml', function() {
    __c('fr')('title').should.eql('Hexo');
  });

  it('complex - unknown config value - yaml', function() {
    should.not.exist(__c('en')('does.not.exist'));
    should.not.exist(__c('es')('does.not.exist'));
    should.not.exist(__c('fr')('does.not.exist'));
  });
});
