var proxyquire = require('proxyquire');

module.exports.tests = {};

// test exports
module.exports.tests.interface = function(test/*, common*/) {
  test('spawn', function(t) {

    var inputFile = 'fooFile.ext';
    var outputDir = 'barDir';
    var callback = 'callback';

    var checks = {
      spawnCalled: false,
      ensureDirCalled: false
    };

    var spawnMock = function (command, args, cb, stdio) {
      t.true(endsWith(command, 'node_modules/.bin/fences-builder'), 'spawn called with correct command');
      t.true(Array.isArray(args), 'spawn called with an args array');
      t.equal(args[0], '--inputFile=' + inputFile, 'spawn called with --inputFile');
      t.equal(args[1], '--outputDir=' + outputDir, 'spawn called with --outputDir');
      t.equal(cb, callback, 'spawn called with proper callback');
      t.true(typeof stdio === 'undefined', 'spawn inherits parent I/O');
      checks.spawnCalled = true;
    };

    var fsMock = {
      ensureDirSync: function(dir) {
        t.equal(dir, outputDir, 'ensure output directory exists');
        checks.ensureDirCalled = true;
      }
    };

    // mock spawner and fs-extra
    var build = proxyquire('../src/build', { './spawner': spawnMock, 'fs-extra': fsMock });

    build(inputFile, outputDir, null, callback);
    t.true(checks.spawnCalled, 'spawn called');
    t.true(checks.ensureDirCalled, 'ensureDirSync called');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('build: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}