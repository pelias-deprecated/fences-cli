var path = require('path');
var async = require('async');
var prep = require('../src/prep');
var build = require('../src/build');
var slice = require('../src/slice');
var colors = require('colors');

module.exports = function create(inputFile, regions, outputDir, options) {
  var prepResultFile = path.join(options.tempDir, 'prep_result.pbf');
  async.series([
    prep.bind(null, inputFile, prepResultFile, options),
    build.bind(null, prepResultFile, outputDir),
    slice.bind(null, regions, outputDir, outputDir)
  ],
  function () {
    console.log(colors.green('All done!'));
  });
};