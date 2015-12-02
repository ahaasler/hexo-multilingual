var gulp = require('gulp');
var child_process = require('child_process');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')();
var rirmaf = require('rimraf');

var lib = 'lib/**/*.js';

function exec(command, cb) {
  child_process.exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

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

gulp.task('eslint', function () {
  return gulp.src(lib)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

gulp.task('watch', function(){
  gulp.watch(lib, ['mocha', 'jshint']);
  gulp.watch(['test/index.js'], ['mocha']);
});

gulp.task('test', ['mocha', 'jshint', 'eslint']);

gulp.task('git-show', function (cb) {
  exec('git show -1', cb);
});

gulp.task('git-push', function (cb) {
  exec('git push & git push --tags', cb);
});

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
