/*!
 * confy
 * Copyright(c) 2011 Kazuhito Hokamura
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var temp = require('temp')
  , fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn
  ;

/**
 * Library version.
 */
exports.version = '0.0.1';

/**
 * Config file name.
 */
exports.configFile = process.env['HOME'] + '/.confy';

/**
 * Get _name_ setting to current profile.
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Object}
 * @api public
 */
exports.get = function(name, opts) {
  var data = _load();
  return data.profiles[data.setting.profile][name];
};

/**
 * Set _name_ setting to current profile.
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Object}
 * @api public
 */
exports.set = function(name, opts) {
  var data = _load();
  var tempFile = temp.openSync('confy');
  var editorCmd = process.env.EDITOR;
  if (!editorCmd) return {};
  var editor = spawn(editorCmd, [tempFile.path], {
    customFds: [ process.stdin, process.stdout, process.stderr ]
  });
  editor.on('exit', function() {
    var resultStr = fs.readFileSync(tempFile.path, 'utf8');
    var result = JSON.parse(resultStr);
    var profile = data.setting.profile;
    if (!data.profiles[profile]) {
      data.profiles[profile] = {};
    }
    data.profiles[profile][name] = result;
    _writeFile(data);
  });
};

/**
 * Use the _name_ profile.
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Object}
 * @api public
 */
exports.use = function(name, opts) {
  var data = _load();
  name = name || 'default';
  data.setting.profile = name;
  _writeFile(data);
};

function _load() {
  if (!path.existsSync(exports.configFile)) {
    _initFile();
  }

  try {
    return JSON.parse(fs.readFileSync(exports.configFile, 'utf8'));
  }
  catch (e) {
    console.error('JSON parse error');
    console.error('See and edit', exports.configFile);
    console.error('or exec `confy clean`');
    process.exit();
  }
}

function _initFile() {
  var fd = fs.openSync(exports.configFile, 'w', '0600');
  fs.closeSync(fd);

  _writeFile({
    setting: { profile: 'default' },
    profiles: {}
  });
}

function _writeFile(data) {
  var file = exports.configFile;
  var str = JSON.stringify(data, null, '  ');
  fs.writeFileSync(file, str, 'utf8');
}
