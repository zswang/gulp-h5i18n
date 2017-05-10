/**
 * @file gulp-h5i18n
 *
 * A mobile page of internationalization development framework
 * @author
 *    ()
 * @version 0.0.3
 * @date 2017-05-11
 */
var h5i18n_compiler = require('h5i18n/lib/compiler');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = require('gulp-util/lib/PluginError');
var pluginName = 'gulp-h5i18n';
var fs = require('fs');
var url = require('url');
var path = require('path');
/**
 * 创建异常对象
 *
 * @param {GulpFile} file 当前文件对象
 * @param {string} err 异常信息
 * @return {PluginError} 返回异常对象
 */
function createError(file, err) {
  return new PluginError(pluginName, file.path + ': ' + err, {
    fileName: file.path,
    showStack: false
  });
}
/**
 * 处理 h5i18n 任务
 *
 * @param {Object} options 配置项
 * @return {Object} 返回 gulp 任务处理器对象
 */
module.exports = function (options) {
  options = options || {};
  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      return callback(createError(file, 'Streaming not supported'));
    }
    if (file.isBuffer()) {
      var map;
      if (options.map) {
        map = options.map;
      } else if (options.mapfile) {
        map = JSON.parse(fs.readFileSync(options.mapfile));
      }
      var contents = h5i18n_compiler.Compiler.replace(file.contents, {
        defaultLang: options.defaultLang,
        lang: options.lang,
        map: map,
      });
      file.contents = new Buffer(contents);
    }
    return callback(null, file);
  });
};
