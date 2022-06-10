/**
 * @file The readTestData function.
 */
// @ts-check
import fs from 'fs';
import path from 'path';

/**
 * Helper function for reading test data files.
 *
 * @param {string} filename - The name of the file to read (no path or extension).
 * @returns {Promise<object>} The data JSON object.
 */
export async function readTestData(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve('Emrald_Site', 'tests', 'test-data', `${filename}.json`),
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
}

/**
 * Helper function to quickly get the names out of an array of objects.
 *
 * @param {object[]} data - The objects to get names from.
 * @returns {string[]} The names of the objects.
 */
export function names(data) {
  return data.map((d) => {
    if (Object.keys(d).length === 1 && !d.name) {
      return d[Object.keys(d)[0]].name;
    }
    return d.name;
  });
}
