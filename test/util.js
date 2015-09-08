'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var util = require('../lib/util');

describe('util', function() {
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

	it('config: simple - english - yaml', function() {
		util._c('description', 'en', hexo.config, hexo.locals.toObject()).should.eql('English description');
	});

	it('config: simple - español - yaml', function() {
		util._c('description', 'es', hexo.config, hexo.locals.toObject()).should.eql('Descripción en español');
	});
});
