var confy = require('../index');
var exec = require('child_process').exec;
var testCase = require('nodeunit').testCase;
var confyPath = __dirname + '/../bin/confy';

confy.configFile = __dirname + '/.confy';
confy.clean();

module.exports = testCase({
  basic: function(t) {
    exec(confyPath, function(err, res) {
      t.equal(err, null);
      t.ok(/Usage: confy/);
      t.done();
    });
  }
});
