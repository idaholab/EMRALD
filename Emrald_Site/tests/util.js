/**
 * @file The readTestData function.
 */
// @ts-check
const fs = require('fs');
const path = require('path');

/**
 * Helper function for reading test data files.
 *
 * @param {string} filename - The name of the file to read (no path or extension).
 * @returns {Promise<object>} The data JSON object.
 */
module.exports.readTestData = async function readTestData(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve('tests', 'test-data', `${filename}.json`),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (e) {
            reject(e);
          }
        }
      },
    );
  });
};

/**
 * Helper function to quickly get the names out of an array of objects.
 *
 * @param {object[]} data - The objects to get names from.
 * @returns {string[]} The names of the objects.
 */
module.exports.names = function getNames(data) {
  return data.map((d) => d.name);
};
