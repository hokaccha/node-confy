var confy = require('../index');
var testCase = require('nodeunit').testCase;

confy.configFile = __dirname + '/.confy';
confy.clean();

module.exports = testCase({
  set: function(t) {
    confy.set('foo', { data: { 'bar': 'baz' } } ,function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, { bar: 'baz' }, 'set data');
      t.done();
    });
  },
  get: function(t) {
    confy.get('foo', function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, { bar: 'baz' }, 'get data');
      t.done();
    });
  },
  ues : function(t) {
    confy.use('dev');
    confy.get('foo', function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, undefined, 'switch profile, data is undef');
      t.done();
    });
  },
  use_default: function(t) {
    confy.use('dev');
    confy.get('foo', function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, undefined, 'use not set name be default profile');
      t.done();
    });
  },
  clean: function(t) {
    confy.clean();
    confy.get('foo', function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, undefined, 'clean data');
      t.done();
    });
  }
});
