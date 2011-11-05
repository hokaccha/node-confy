var confy = require('../index');
var testCase = require('nodeunit').testCase;

confy.configFile = __dirname + '/.confy';
confy.clean();
process.env.EDITOR = __dirname + '/editorcmd';

module.exports = testCase({
  setUp: function (callback) {
    confy.clean();
    callback();
  },
  tearDown: function (callback) {
    confy.clean();
    callback();
  },
  editor: function(t) {
    confy.get('foo', { require: { foo: "" } }, function(err, res) {
      t.ok(!err, 'error is null');
      t.deepEqual(res, { foo: 'bar' }, 'editor write file');
      t.done();
    });
  }
});
