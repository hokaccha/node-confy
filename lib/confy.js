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
exports.version = '0.1.3';

/**
 * Config file name.
 */
exports.configFile = process.env['HOME'] + '/.confy';

/**
 * Get _name_ setting to current profile.
 *
 * @param {String} name
 * @param {Object} opts
 * @param {Function} callback
 * @api public
 */
exports.get = function(name, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var data = _load();
  var profile = [data.setting.profile];
  if (!data.profiles[profile]) {
    data.profiles[profile] = {};
  }

  if (opts.require) {
    var currentData = data.profiles[profile][name] || {};
    var needSet = false;
    Object.keys(opts.require).forEach(function(key) {
      if (!currentData[key]) {
        currentData[key] = opts.require[key];
        needSet = true;
      }
    });
    if (needSet) {
      exports.set(name, { defaultData: currentData }, callback);
    }
    else {
      callback(null, data.profiles[profile][name]);
    }
  }
  else {
    callback(null, data.profiles[profile][name]);
  }
};

/**
 * Set _name_ setting to current profile.
 *
 * @param {String} name
 * @param {Object} opts
 * @param {Function} callback
 * @api public
 */
exports.set = function(name, opts, callback) {
  var data = _load();
  var profile = data.setting.profile;
  if (!data.profiles[profile]) {
    data.profiles[profile] = {};
  }
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  if (opts.data) {
    data.profiles[profile][name] = opts.data;
    _writeFile(data);
    callback(null, opts.data);
    return;
  }

  var editorCmd = process.env.EDITOR;
  if (!editorCmd) {
    callback(Error('Not set environments `EDITOR`'));
    return;
  }

  var defaultData = opts.defaultData
    || data.profiles[profile][name]
    || {"key":"val"};
  var tempFile = temp.openSync('confy');
  fs.write(tempFile.fd, JSON.stringify(defaultData, null, '  '));

  var editor = spawn(editorCmd, [tempFile.path], {
    customFds: [ 0, 1, 2 ]
  });

  editor.on('exit', function() {
    var resultStr = fs.readFileSync(tempFile.path, 'utf8');
    var result;
    try {
      result = JSON.parse(resultStr);
    }
    catch (e) {
      callback(e);
      return;
    }

    data.profiles[profile][name] = result;
    _writeFile(data);
    callback(null, result);
  });
};

/**
 * Use the _name_ profile.
 *
 * @param {String} name
 * @api public
 */
exports.use = function(name) {
  var data = _load();
  name = name || 'default';
  data.setting.profile = name;
  _writeFile(data);
};

/**
 * Initialize all datas.
 *
 * @api public
 */
exports.clean = function() {
  _initFile();
};


/* private function */

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
