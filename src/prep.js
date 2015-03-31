var fs = require('fs-extra');
var async = require('async');
var util = require('util');
var colors = require('colors');
var exec = require('child_process').exec;

/**
 * 1. Convert PBF file o5m
 * 2. Filter out admin boundaries
 * 3. Convert back to pbf
 *
 * @param {string} pbfFile
 * @param {string} outputFile
 * @param {object} options
 * @param {string} options.tempDir
 * @param {function} [callback] optional
 */
module.exports = function prep(pbfFile, outputFile, options, callback) {
  fs.ensureDir(options.tempDir);

  var o5mFile = options.tempDir + '/original.o5m';
  var filteredOsmFile = options.tempDir + '/filtered.osm';

  async.series([
      convert.bind(null, pbfFile, o5mFile),
      filterAdminBoundaries.bind(null, o5mFile, filteredOsmFile),
      convert.bind(null, filteredOsmFile, outputFile)
    ],
    function () {
      if (callback && typeof callback === 'function') {
        callback();
      }
      else {
        console.log(colors.green('All done!'));
      }
    });
};

function convert(inputFile, outputFile, callback) {
  var cmd = util.format('./node_modules/.bin/osmconvert %s -o=%s', inputFile, outputFile);
  console.log(colors.blue('[executing]'), cmd);
  exec(cmd, handleExecOutput.bind(null, callback));
}

function filterAdminBoundaries(o5mFile, outputFile, callback) {
  var cmd = util.format('./node_modules/.bin/osmfilter %s --keep="boundary=administrative" > %s', o5mFile, outputFile);
  console.log(colors.blue('[executing]'), cmd);
  exec(cmd, handleExecOutput.bind(null, callback));
}

function handleExecOutput(callback, error, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
  if (error !== null) {
    console.error(colors.red('[exec error]'), error);
  }
  callback();
}
