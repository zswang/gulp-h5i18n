/**
 * @file gulp-h5i18n
 *
 * A mobile page of internationalization development framework
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.7.1
 * @date 2017-06-20
 */
var h5i18n = require('h5i18n');
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
      var langs = new h5i18n.Languages(options.defaultLang);
      var map;
      if (options.map) {
        map = options.map;
      } else if (options.mapfile) {
        map = JSON.parse(fs.readFileSync(options.mapfile));
      }
      langs.dictionary(map);
      var contents = '';
      if (options.extract) {
        var lines = [];
        var duplicate = {}; // 排除重复
        langs.replace(file.contents, options.locale, function (type, text) {
          var expr = langs.parse(text, 'cn');
          /* istanbul ignore else */
          if (expr) {
            var origin = langs.build(langs.locale, expr, true);
            if (duplicate[origin]) {
              return;
            }
            duplicate[origin] = true;
            var line = '  - lang:\n';
            Object.keys(expr.optionsLang).forEach(function (lang) {
              var text = expr.optionsLang[lang].trim();
              if (/["\n{}\[\]:]/.test(text)) {
                text = JSON.stringify(text);
              }
              if (/["\n{}\[\]:*]/.test(lang)) {
                lang = JSON.stringify(lang);
              }
              line += '      ' + lang + ': ' + text + '\n';
            });
            lines.push(line);
          }
        });
        if (lines.length) {
          var filename;
          if (options.extractDir) {
            filename = path.relative(options.extractDir, file.path);
            /* istanbul ignore else */
          } else if (process.env.PWD) {
            filename = path.relative(process.env.PWD, file.path);
          } else {
            filename = file.relative;
          }
          contents = '- file: ' + filename + '\n  i18n:\n' + lines.join('');
        }
      } else {
        contents = langs.replace(file.contents, options.locale);
      }
      file.contents = new Buffer(contents);
    }
    return callback(null, file);
  });
};
