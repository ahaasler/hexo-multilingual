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
	var processor = require('../node_modules/hexo/lib/plugins/processor/data');
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
		hexo.locals.data = {};
	})

	before(function() {
		return fs.mkdirs(baseDir).then(function() {
			return hexo.init();
		});
	});

	after(function() {
		return fs.rmdir(baseDir);
	});

	it('config: simple - english - yaml', function() {
		var file = newFile({
			path: 'config_en.yml',
			type: 'create',
			content: new Buffer('description: English description')
		});
		return process(file).then(function() {
			hexo.locals.data.config_en = Data.findById('config_en').data;
			util._c('description', 'en', hexo.config, hexo.locals).should.eql('English description');
			return Data.findById('config_en').remove();
		});
	});
	
	it('config: simple - español - yaml', function() {
		var file = newFile({
			path: 'config_es.yml',
			type: 'create',
			content: new Buffer('description: Descripción en español')
		});
		return process(file).then(function() {
			hexo.locals.data.config_es = Data.findById('config_es').data;
			util._c('description', 'es', hexo.config, hexo.locals).should.eql('Descripción en español');
			return Data.findById('config_es').remove();
		});
	});
});
