'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurator = exports.walk = exports.writeLine = exports.defaultConfig = undefined;

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultConfig = exports.defaultConfig = {
  rootPath: __dirname,
  output: __dirname,
  order: false
};

var writeLine = exports.writeLine = function writeLine(depth, title, cb) {
  var indent = new Array(depth).fill('').join('  ');
  var href = title.replace(/[/=?&]/g, '').replace(/[\s\r\n]/g, '-');
  return typeof cb === 'function' ? cb(indent, title, href) : indent + '* [' + title + '](#' + href + ')';
};

/**
 * @param {object} branch 
 * @param {object} order - overrides
 * @param {string} pathPart 
 * @param {object} bucket 
 * @param {number} depth 
 */
var walk = exports.walk = function walk(branch, order, pathPart) {
  var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { toc: [], md: [] };
  var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

  return (0, _fs.readdirSync)(branch).reduce(function (acc, f, i) {
    var currPath = branch + '/' + f;
    var dir = pathPart ? f : pathPart + '/' + f;
    var isFolder = (0, _fs.lstatSync)(currPath).isDirectory();

    var _path$parse = _path2.default.parse(f),
        ext = _path$parse.ext,
        name = _path$parse.name;

    var header = new Array(depth + 1).fill('#').join('');
    if (isFolder) {
      var nextAcc = {
        md: [].concat(_toConsumableArray(acc.md), [writeLine(depth, name, function (indent, title, href) {
          return header + ' ' + href;
        })]),
        toc: [].concat(_toConsumableArray(acc.toc), [writeLine(depth, f)])
      };
      return walk(currPath, order, f, nextAcc, depth + 1);
    } else if (ext === '.md') {
      var md = (0, _fs.readFileSync)(currPath, 'utf8');
      return {
        toc: [].concat(_toConsumableArray(acc.toc), [writeLine(depth, name)]),
        md: [].concat(_toConsumableArray(acc.md), [writeLine(depth, name, function (indent, title, href) {
          return header + ' ' + href + '\n' + md + '\n';
        })])
      };
    } else {
      return acc;
    }
  }, bucket);
};

/**
 * configurator
 * @param {object} preConfig - user config
 * @prop {string} rootPath - root folder to read from
 * @prop {string} output - filepath to write concatenated .md
 * @prop {object} order - overrides ordering of TOC
 */
var configurator = exports.configurator = function configurator(preConfig) {
  var config = Object.assign({}, defaultConfig, preConfig);

  var _walk = walk(config.rootPath, config.order),
      toc = _walk.toc,
      md = _walk.md;

  var concatToc = toc.join('\n');
  var concatMd = md.join('\n');
  var text = concatToc + '\n\n' + concatMd;
  return { text: text, config: config };
};

exports.default = function (preConfig) {
  var _configurator = configurator(preConfig),
      text = _configurator.text,
      config = _configurator.config;

  (0, _fs.writeFileSync)(config.output, text);
};