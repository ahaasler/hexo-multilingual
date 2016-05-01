'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var fs = require('hexo-fs');
var pathFn = require('path');
var util = require('../lib/util');

describe('util', function() {
  var Hexo = require('hexo');
  var baseDir = pathFn.join(__dirname, 'data_test');
  var hexo = new Hexo(baseDir);
  var processor = require('../node_modules/hexo/lib/plugins/processor/data')(hexo);
  var process = Promise.method(processor.process).bind(hexo);
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

  before(function() {
    hexo.config.complex = {
      first: 'default',
      second: 'should be overriden'
    }
    return fs.mkdirs(baseDir).then(function() {
      hexo.init();
      var enFile = newFile({
        path: 'config_en.yml',
        type: 'create'
      });
      var esFile = newFile({
        path: 'config_es.yml',
        type: 'create'
      });
      return fs.writeFile(enFile.source, new Buffer('description: English description\ncomplex:\n  second: english\n  third: new value')).then(function() {
        return process(enFile);
      }).then(function() {
        return fs.writeFile(esFile.source, new Buffer('description: Descripción en español\ncomplex:\n  second: español\n  third: nuevo valor')).then(function() {
          return process(esFile);
        });
      });
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  it('_c: simple - english - yaml', function() {
    util._c('description', 'en', hexo.config, hexo.locals.toObject()).should.eql('English description');
  });

  it('_c: simple - español - yaml', function() {
    util._c('description', 'es', hexo.config, hexo.locals.toObject()).should.eql('Descripción en español');
  });

  it('_c: simple - default - yaml', function() {
    util._c('title', 'en', hexo.config, hexo.locals.toObject()).should.eql('Hexo');
    util._c('title', 'es', hexo.config, hexo.locals.toObject()).should.eql('Hexo');
  });

  it('_c: simple - unknown language - yaml', function() {
    util._c('title', 'fr', hexo.config, hexo.locals.toObject()).should.eql('Hexo');
  });

  it('_c: complex - unknown config value - yaml', function() {
    should.not.exist(util._c('does.not.exist', 'en', hexo.config, hexo.locals.toObject()));
    should.not.exist(util._c('does.not.exist', 'es', hexo.config, hexo.locals.toObject()));
    should.not.exist(util._c('does.not.exist', 'fr', hexo.config, hexo.locals.toObject()));
  });

  it('configuration: english - yaml', function() {
    var enConfig = util.configuration('en', hexo.config, hexo.locals.toObject(), 'config');
    enConfig.title.should.eql('Hexo');
    enConfig.description.should.eql('English description');
    enConfig.complex.first.should.eql('default');
    enConfig.complex.second.should.eql('english');
    enConfig.complex.third.should.eql('new value');
  });

  it('configuration: default type - yaml', function() {
    var enConfig = util.configuration('en', hexo.config, hexo.locals.toObject());
    enConfig.title.should.eql('Hexo');
    enConfig.description.should.eql('English description');
    enConfig.complex.first.should.eql('default');
    enConfig.complex.second.should.eql('english');
    enConfig.complex.third.should.eql('new value');
  });

  it('configuration: español - yaml', function() {
    var esConfig = util.configuration('es', hexo.config, hexo.locals.toObject(), 'config');
    esConfig.title.should.eql('Hexo');
    esConfig.description.should.eql('Descripción en español');
    esConfig.complex.first.should.eql('default');
    esConfig.complex.second.should.eql('español');
    esConfig.complex.third.should.eql('nuevo valor');
  });

  it('configuration: unknown language - yaml', function() {
    var frConfig = util.configuration('fr', hexo.config, hexo.locals.toObject(), 'config');
    frConfig.title.should.eql('Hexo');
    frConfig.description.should.eql('');
    frConfig.complex.first.should.eql('default');
    frConfig.complex.second.should.eql('should be overriden');
    should.not.exist(frConfig.complex.third);
  });
});
