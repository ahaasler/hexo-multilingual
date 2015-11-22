'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var configuration = require('../lib/filter/configuration');

describe('configuration', function() {
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

  function _configuration() {
    return configuration.bind({
      config: hexo.config,
      locals: {
        getters: {
          data: function() {
            return hexo.locals.toObject().data
          }
        }
      }
    });
  }

  before(function() {
    hexo.config.complex = {
      first: 'default',
      second: 'should be overriden'
    }
    return fs.mkdirs(baseDir).then(function() {
      hexo.init();
      process(newFile({
        path: 'config_en.yml',
        type: 'create',
        content: new Buffer('description: English description\ncomplex:\n  second: english\n  third: new value')
      }));
      process(newFile({
        path: 'config_es.yml',
        type: 'create',
        content: new Buffer('description: Descripción en español\ncomplex:\n  second: español\n  third: nuevo valor')
      }));
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  it('english - yaml', function() {
    var localizedLocals = _configuration()({
      page: {
        lang: 'en'
      }
    });
    localizedLocals.config.title.should.eql('Hexo');
    localizedLocals.config.description.should.eql('English description');
    localizedLocals.config.complex.first.should.eql('default');
    localizedLocals.config.complex.second.should.eql('english');
    localizedLocals.config.complex.third.should.eql('new value');
    // Default config
    localizedLocals.config.default.title.should.eql('Hexo');
    localizedLocals.config.default.description.should.eql('');
    localizedLocals.config.default.complex.first.should.eql('default');
    localizedLocals.config.default.complex.second.should.eql('should be overriden');
    should.not.exist(localizedLocals.config.default.complex.third);
  });

  it('español - yaml', function() {
    var localizedLocals = _configuration()({
      page: {
        lang: 'es'
      }
    });
    localizedLocals.config.title.should.eql('Hexo');
    localizedLocals.config.description.should.eql('Descripción en español');
    localizedLocals.config.complex.first.should.eql('default');
    localizedLocals.config.complex.second.should.eql('español');
    localizedLocals.config.complex.third.should.eql('nuevo valor');
    // Default config
    localizedLocals.config.default.title.should.eql('Hexo');
    localizedLocals.config.default.description.should.eql('');
    localizedLocals.config.default.complex.first.should.eql('default');
    localizedLocals.config.default.complex.second.should.eql('should be overriden');
    should.not.exist(localizedLocals.config.default.complex.third);
  });

  it('unknown language - yaml', function() {
    var localizedLocals = _configuration()({
      page: {
        lang: 'fr'
      }
    });
    localizedLocals.config.title.should.eql('Hexo');
    localizedLocals.config.description.should.eql('');
    localizedLocals.config.complex.first.should.eql('default');
    localizedLocals.config.complex.second.should.eql('should be overriden');
    should.not.exist(localizedLocals.config.complex.third);
    // Default config
    localizedLocals.config.default.title.should.eql('Hexo');
    localizedLocals.config.default.description.should.eql('');
    localizedLocals.config.default.complex.first.should.eql('default');
    localizedLocals.config.default.complex.second.should.eql('should be overriden');
    should.not.exist(localizedLocals.config.default.complex.third);
  });
});
