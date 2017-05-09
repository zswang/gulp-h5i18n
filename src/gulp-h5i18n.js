/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

/*<remove>*/
/*jslint node: true */
'use strict';
/*</remove>*/

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