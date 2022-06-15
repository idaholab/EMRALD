/**
 * @file The readTestData function.
 */
// @ts-check

/**
 * Helper function for reading test data files.
 *
 * @param {string} filename - The name of the file to read (no path or extension).
 * @param {boolean} [json] - If the file is JSON.
 * @returns {Promise<object>} The data JSON object.
 */
function readTestData(filename, json = true) {
  let f = filename;
  if (json) {
    f += '.json';
  }
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', `base/tests/test-data/${f}`, true);
    request.onload = () => {
      if (this.status >= 200 && this.status < 400) {
        if (json) {
          try {
            resolve(JSON.parse(this.response));
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(this.response);
        }
      } else {
        reject(this.status);
      }
    };
    request.onerror = () => {
      reject('Request error!');
    };
    request.send();
  });
}

/**
 * Helper function to quickly get the names out of an array of objects.
 *
 * @param {object[]} data - The objects to get names from.
 * @returns {string[]} The names of the objects.
 */
function names(data) {
  return data.map((d) => {
    if (Object.keys(d).length === 1 && !d.name) {
      return d[Object.keys(d)[0]].name;
    }
    return d.name;
  });
}
