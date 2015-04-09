/* jshint ignore:start */
var proxyquire = require('proxyquire');

module.exports.tests = {};

// test exports
module.exports.tests.interface = function(test/*, common*/) {
  test('steps', function(t) {

    var createInputFile = 'fooFile.ext';
    var createRegions = 'regionsFile.json';
    var createOutputDir = 'barDir';
    var tempDir = '/footemp';
    var callback = 'callback';

    var prepResult = '/prep_result.pbf';

    var checks = {
      prepCalled: false,
      buildCalled: false,
      sliceCalled: false
    };

    var prepMock = function (inputFile, outputFile, options, callback) {
      t.equal(inputFile, createInputFile, 'prep called with input file');
      t.equal(outputFile, tempDir + prepResult, 'prep called with output file');
      t.equal(options.tempDir, tempDir, 'prep called with tempDir');
      checks.prepCalled = true;
      callback();
    };

    var buildMock = function (pbfFile, outputDir, options, callback) {
      t.equal(pbfFile, tempDir + prepResult, 'build called with input file');
      t.equal(outputDir, createOutputDir, 'build called with output dir');
      t.equal(options.tempDir, tempDir, 'prep called with tempDir');
      checks.buildCalled = true;
      callback();
    };

    var sliceMock = function (regions, inputDir, outputDir, options, callback) {
      t.equal(regions, createRegions, 'slice called with regions file');
      t.equal(inputDir, createOutputDir, 'slice called with input dir');
      t.equal(outputDir, createOutputDir, 'slice called with output dir');
      t.equal(options.tempDir, tempDir, 'prep called with tempDir');
      checks.sliceCalled = true;
      callback();
    };

    var create = proxyquire('../src/create', {
      '../src/prep': prepMock,
      '../src/build': buildMock,
      '../src/slice': sliceMock
    });

    create(createInputFile, createRegions, createOutputDir, {tempDir: tempDir}, callback);
    t.true(checks.prepCalled, 'prep called');
    t.true(checks.buildCalled, 'build called');
    t.true(checks.sliceCalled, 'slice called');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('create: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};

/* jshint ignore:end */
