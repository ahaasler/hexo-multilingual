var gulp = require('gulp');
var shell = require('gulp-shell');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')();
var rirmaf = require('rimraf');

var lib = 'lib/**/*.js';

gulp.task('coverage', function(){
	return gulp.src(lib)
		.pipe($.istanbul())
		.pipe($.istanbul.hookRequire());
});

gulp.task('coverage:clean', function(callback){
	rirmaf('coverage', callback);
});

gulp.task('mocha', ['coverage'], function(){
	return gulp.src('test/index.js')
		.pipe($.mocha({
			reporter: 'spec'
		}))
		.pipe($.istanbul.writeReports());
});

gulp.task('jshint', function(){
	return gulp.src(lib)
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('watch', function(){
	gulp.watch(lib, ['mocha', 'jshint']);
	gulp.watch(['test/index.js'], ['mocha']);
});

gulp.task('test', ['mocha', 'jshint']);

gulp.task('git-show', shell.task([
	'git show -1'
]));

gulp.task('git-push', shell.task([
	'git push',
	'git push --tags'
]));

gulp.task('git-push:confirm', ['git-show'], function(done) {
	inquirer.prompt([{
		type: 'confirm',
		message: 'Push version?',
		default: false,
		name: 'push'
	}], function(answers) {
		if(answers.push) {
			gulp.start('git-push');
		}
		done();
	});
});

gulp.task('release', ['git-push:confirm']);
