var proxyquire = require('proxyquire');

module.exports.tests = {};

// test exports
module.exports.tests.interface = function(test/*, common*/) {
  test('spawn', function(t) {

    var inputDir = 'fooDir';
    var outputDir = 'barDir';
    var regionFile = 'regions.json';
    var callback = 'callback';

    var checks = {
      spawnCalled: false,
      ensureDirCalled: false,
      existsCalled: {}
    };

    var spawnMock = function (command, args, cb, stdio) {
      t.true(endsWith(command, 'node_modules/.bin/fences-slicer'), 'spawn called with correct command');
      t.true(Array.isArray(args), 'spawn called with an args array');
      t.equal(args[0], '--regionFile=' + regionFile, 'spawn called with --regionFile');
      t.equal(args[1], '--inputDir=' + inputDir, 'spawn called with --inputDir');
      t.equal(args[2], '--outputDir=' + outputDir, 'spawn called with --outputDir');
      t.equal(cb, callback, 'spawn called with proper callback');
      t.true(typeof stdio === 'undefined', 'spawn inherits parent I/O');
      checks.spawnCalled = true;
    };

    var fsMock = {
      ensureDirSync: function(dir) {
        t.equal(dir, outputDir, 'ensure output directory exists');
        checks.ensureDirCalled = true;
      },
      existsSync: function (dir) {
        checks.existsCalled[dir] = true;
        return true;
      }
    };

    // mock spawner and fs-extra
    var slice = proxyquire('../src/slice', { './spawner': spawnMock, 'fs-extra': fsMock });

    slice(regionFile, inputDir, outputDir, null, callback);
    t.true(checks.spawnCalled, 'spawn called');
    t.true(checks.ensureDirCalled, 'ensureDirSync called');
    t.true(checks.existsCalled[regionFile], 'checked if region file exists');
    t.true(checks.existsCalled[inputDir], 'checked if input dir exists');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('slice: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}