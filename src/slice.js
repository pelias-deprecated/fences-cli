// this function has too many parameters, but the are coming from commander and cannot be refactored
/* jshint ignore:start */

var util = require('util');
var fs = require('fs');
var fs_extra = require('fs-extra');
var colors = require('colors');
var exec = require('child_process').exec;

/**
 * Slice the geojson files found in inputDir by specified regions.
 *
 * @param {string} regionFile
 * @param {string} inputDir
 * @param {string} outputDir
 * @param {object} [options] commander will pass this argument, not used
 * @param {function} [callback] optional
 */
module.exports = function slice(regionFile, inputDir, outputDir, options, callback) {
  if (!fs.existsSync(regionFile) || !fs.existsSync(inputDir)) {
    console.error(colors.red('[Error]:'), 'Region file or inputDir do not exist');
    process.exit(1);
  }

  // create output dir if it doesn't exist
  fs_extra.ensureDirSync(outputDir);

  var cmd = util.format('./node_modules/.bin/fences-slicer --config=%s --inputDir=%s --outputDir=%s',
    regionFile, inputDir, outputDir);
  console.log(colors.blue('[executing]'), cmd);
  exec(cmd, function (error, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    if (error !== null) {
      console.error(colors.red('[exec error]'), error);
    }

    if (callback && typeof callback === 'function') {
      callback();
    }
    else {
      console.log(colors.green('All done!'));
    }
  });
};
/* jshint ignore:end */
