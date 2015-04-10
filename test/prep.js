var proxyquire = require('proxyquire');

module.exports.tests = {};

// test exports
module.exports.tests.interface = function(test/*, common*/) {

  var inputFile = 'fooFile.ext';
  var outputFile = 'barFile.ext';
  var tempDir = '/tmp';
  var callback = 'callback';

  var o5mFile = '/original.o5m';
  var filteredFile = '/filtered.osm';

  test('spawn', function(t) {
    var checks = {
      spawnCalled: {
        osmfilter: 0,
        osmconvert: 0
      },
      ensureDirCalled: 0
    };

    var spawnMock = function (command, args, cb, stdio) {
      t.true(Array.isArray(args), 'spawn called with an args array');
      switch (command) {
        case 'osmfilter':
          t.equal(args[0], tempDir + o5mFile, 'osmfilter called with input file');
          t.equal(args[1], '--keep=boundary=administrative', 'osmfilter called with correct filter');
          t.equal(args[2], '-o=' + tempDir + filteredFile, 'osmfilter called with output file');
          break;
        case 'osmconvert':
          if (checks.spawnCalled[command] === 0) {
            t.equal(args[0], inputFile, 'osmconvert called with input file');
            t.equal(args[1], '-o=' + tempDir + o5mFile, 'osmconvert called first time with output file');
          }
          else if (checks.spawnCalled[command] === 1) {
            t.equal(args[0], tempDir + filteredFile, 'osmconvert called with input file');
            t.equal(args[1], '-o=' + outputFile, 'osmconvert called second time with output file');
          }
          break;
        default:
          t.fail();
      }
      t.true(typeof cb === 'function', 'spawn called with proper callback');
      t.true(typeof stdio === 'undefined', 'spawn inherits parent I/O');
      checks.spawnCalled[command]++;
      cb();
    };

    var fsMock = {
      ensureDirSync: function(dir) {
        t.equal(dir, tempDir, 'ensure output directory exists');
        checks.ensureDirCalled = true;
      }
    };

    // mock spawner and fs-extra
    var prep = proxyquire('../src/prep', { './spawner': spawnMock, 'fs-extra': fsMock });

    prep(inputFile, outputFile, {}, callback);
    t.equal(checks.spawnCalled.osmfilter, 1, 'osmfilter called');
    t.equal(checks.spawnCalled.osmconvert, 2, 'osmconvert called twice');
    t.true(checks.ensureDirCalled, 'ensureDirSync called');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('prep: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
