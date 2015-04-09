var path = require('path');
var async = require('async');
var prep = require('../src/prep');
var build = require('../src/build');
var slice = require('../src/slice');
var colors = require('colors');

/**
 * Create fences from given input file and regions
 *
 * @param {string} inputFile
 * @param {string} regions
 * @param {string} outputDir
 * @param {object} options
 * @param {string} [options.tempDir]
 */
module.exports = function create(inputFile, regions, outputDir, options) {
  if (!options) {
    options = {};
  }
  options.tempDir = options.tempDir || '/tmp';

  var prepResultFile = path.join(options.tempDir, 'prep_result.pbf');

  async.series([
    prep.bind(null, inputFile, prepResultFile, options),
    build.bind(null, prepResultFile, outputDir, options),
    slice.bind(null, regions, outputDir, outputDir, options)
  ],
  function (code) {
    if (code) {
      console.error(colors.red('Error occurred'));
      process.exit(code);
      return;
    }
    console.log(colors.green('All done!'));
  });
};