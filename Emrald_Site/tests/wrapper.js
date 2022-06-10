/* eslint-disable no-eval */
/**
 * @file Tests wrapper function.
 */
// @ts-check
import fs from 'fs';
import path from 'path';

/**
 * @typedef {object | string} ExportParam
 */

/**
 * Helper function for resolving export definitions to a common format.
 *
 * @param {ExportParam} exp The export definition.
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
 * @param {string} testSuite - The name of the test suite to prevent dependency issues.
 * @param {string} filename - The path to the file to wrap.
 * @param {ExportParam[]} exports - The names of global variables to export.
 * @param {object} imports - File dependencies.
 * @returns {Promise<object>} An object containing the values of the variables listed in exports.
 */
export default async function wrapper(testSuite, filename, exports, imports = {}) {
  let wrapped = '/* eslint-disable */\nimport { JSDOM } from \'jsdom\';\nvar context = {};\nvar { window } = new JSDOM(\'...\');\n';
  Object.keys(imports).forEach(async (i) => {
    wrapper(testSuite, i, imports[i].exports, imports[i].imports);
    const importVarName = i.replace(/[^a-zA-Z]/g, '');
    wrapped += `import ${importVarName} from 'file://${path
      .resolve('Emrald_Site', 'tests', 'temp', testSuite, path.parse(i).base)
      .replace(/\\/g, '\\\\')}'\n`;
    imports[i].exports.forEach((k) => {
      const exp = handleExport(k);
      wrapped += `var {${exp.name}} = ${importVarName};\n`;
    });
  });
  wrapped += 'var m = (function() {\n';
  wrapped += fs.readFileSync(filename).toString();
  exports.forEach((e) => {
    const exp = handleExport(e);
    wrapped += `context['${exp.name}'] = ${exp.value};\n`;
  });
  wrapped += '}).bind(window);\nm();\n';
  wrapped += 'export default context;\n';
  const tempPath = path.resolve(
    'Emrald_Site',
    'tests',
    'temp',
    testSuite,
    path.parse(filename).base,
  );
  if (!fs.existsSync(path.resolve('Emrald_Site', 'tests', 'temp'))) {
    fs.mkdirSync(path.resolve('Emrald_Site', 'tests', 'temp'));
  }
  if (!fs.existsSync(path.resolve('Emrald_Site', 'tests', 'temp', testSuite))) {
    fs.mkdirSync(path.resolve('Emrald_Site', 'tests', 'temp', testSuite));
  }
  fs.writeFileSync(tempPath, wrapped);
  return (await import(`file://${tempPath}`)).default;
}
