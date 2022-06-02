/* eslint-disable no-eval */
/**
 * @file Tests wrapper function.
 */
// @ts-check
const fs = require('fs');
const path = require('path');

/**
 * Helper function for resolving export definitions to a common format.
 *
 * @param {object | string} exp The export definition.
 * @returns {object} The export name / value.
 */
function handleExport(exp) {
  if (typeof exp === 'object') {
    const exportName = Object.keys(exp)[0];
    return {
      name: exportName,
      value: exp[exportName],
    };
  }
  return {
    name: exp,
    value: exp,
  };
}

/**
 * Converts a IIFE module into CJS modules that can be required by tests.
 *
 * @param {string} filename - The path to the file to wrap.
 * @param {string[]} exports - The names of global variables to export.
 * @param {object} imports - File dependencies.
 * @returns {object} An object containing the values of the variables listed in exports.
 */
module.exports = function wrapper(filename, exports, imports = {}) {
  let wrapped = 'var context = {};\nwindow = context;\n';
  Object.keys(imports).forEach(async (i) => {
    wrapper(i, imports[i].exports, imports[i].imports);
    const importVarName = i.replace(/[^a-zA-Z]/g, '');
    wrapped += `var ${importVarName} = require('${path
      .resolve('tests', 'temp', path.parse(i).base)
      .replace(/\\/g, '\\\\')}');\n`;
    imports[i].exports.forEach((k) => {
      const exp = handleExport(k);
      wrapped += `var {${exp.name}} = ${importVarName};\n`;
    });
  });
  wrapped += fs.readFileSync(filename).toString();
  exports.forEach((e) => {
    const exp = handleExport(e);
    wrapped += `context['${exp.name}'] = ${exp.value};\n`;
  });
  wrapped += 'module.exports = context;\n';
  const tempPath = path.resolve('tests', 'temp', path.parse(filename).base);
  if (!fs.existsSync(path.resolve('tests', 'temp'))) {
    fs.mkdirSync(path.resolve('tests', 'temp'));
  }
  fs.writeFileSync(tempPath, wrapped);
  return require(tempPath);
  /*
  const context = {};
  let globalsStr = '';
  if (globals) {
    Object.keys(globals).forEach((g) => {
      globalsStr += `var ${g} = globals['${g}'];`;
    });
  }
  eval(`${globalsStr}window=context;${fs.readFileSync(filename).toString()}`);
  exports.forEach((e) => {
    eval(`context['${e}'] = ${e};`);
  });
  return context;
  */
};
