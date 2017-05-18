'use strict';

var h5i18n = require('../');
var gutil = require('gulp-util');
var should = require('should');
var fs = require('fs');

function generateFile(contents) {
  contents = contents || '';

  return new gutil.File({
    path: './testfile.js',
    cwd: './',
    base: './',
    contents: new Buffer(contents)
  });
}

function expect_equals(options, input, output, done) {
  var stream = h5i18n(options);

  stream.on('data', function (file) {
    String(file.contents).should.equal(output);
    done();
  });

  stream.write(generateFile(input));
  stream.end();
}

describe('fixtures', function () {
  it('case1', function (done) {
    var input = 'console.log(1)';
    var output = 'console.log(1)';
    expect_equals(null, input, output, done);
  });

  it('case2', function (done) {
    var input = 'console.log(languages.get("中文<!--{en}English-->"))';
    var output = 'console.log("English")';
    expect_equals({
      locale: 'en'
    }, input, output, done);
  });

  it('case map', function (done) {
    var input = 'console.log(languages.get("点击<!--{*}click-->"))';
    var output = 'console.log("クリック")';
    expect_equals({
      locale: 'jp',
      map: {
        click: '<!--{jp}クリック-->'
      }
    }, input, output, done);
  });

  it('case map 2', function (done) {
    var input = 'console.log(languages.get("click<!--{*}-->"))';
    var output = 'console.log("クリック")';
    expect_equals({
      locale: 'jp',
      map: {
        click: '<!--{jp}クリック-->'
      }
    }, input, output, done);
  });

  it('case mapfile', function (done) {
    var input = 'console.log(languages.get("双击<!--{*}dblclick-->"))';
    var output = 'console.log("Двойной щелчок")';
    expect_equals({
      locale: 'ru',
      mapfile: './test/map.json'
    }, input, output, done);
  });

});

describe('null', function () {
  it('does nothing', function (done) {
    var file = new gutil.File({
      contents: null
    });
    var stream = h5i18n();
    stream.on('data', function (file) {
      done();
    });
    stream.write(file);
    stream.end();
  });
});

describe('Streaming not supported', function () {
  it('does nothing', function (done) {
    var file = new gutil.File({
      path: 'test/fixtures/hello.js',
      cwd: 'test',
      base: 'test/fixtures',
      contents: new fs.createReadStream('test/fixtures/hello.js')
    });
    var stream = h5i18n({});
    stream.on('error', function (err) {
      done();
    });
    stream.write(file);
    stream.end();
  });
});