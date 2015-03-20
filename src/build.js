var util = require('util');
var fs = require('fs-extra');
var colors = require('colors');
var exec = require('child_process').exec;

/**
 * Build geojson output files per admin_level found in the input pbf file.
 *
 * @param {string} inputFile
 * @param {string} outputDir
 * @param {function} [callback] optional
 */
module.exports = function build(inputFile, outputDir, callback) {
  fs.ensureDir(outputDir);

  var cmd = util.format('./node_modules/.bin/fences-builder --inputFile=%s --outputDir=%s', inputFile, outputDir);
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

    if (callback) {
      callback();
    }
    else {
      console.log(colors.green('All done!'));
    }
  });
};