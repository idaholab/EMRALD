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
 * @typedef {Record<string, ExportParam[]>} Dependencies
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
 * Helper function to extract the exports of all other dependencies.
 * 
 * @param {string} currentModule - The module to generate context vars for.
 * @param {Dependencies} dependencies - The complete dependency list.
 * @returns {string[]} The list of context var names.
 */
function getContextVars(currentModule, dependencies) {
  const contextVars = [];
  Object.keys(dependencies).forEach((key) => {
    if (key !== currentModule) {
      dependencies[key].forEach((exportObj) => {
        const e = handleExport(exportObj);
        if (contextVars.indexOf(e.name) < 0) {
          contextVars.push(e.name);
        }
      });
    }
  });
  return contextVars;
}

/**
 * Converts a IIFE module into CJS modules that can be required by tests.
 *
 * @param {string} testSuite - The name of the test suite to prevent dependency issues.
 * @param {Dependencies} dependencies - The paths to all the files to wrap and their export options.
 * @param {boolean} [useCache] - If true, the generated files will not be overwritten.
 * @returns {Promise<object>} An object containing the window and exported objects.
 */
export default async function wrapper(testSuite, dependencies, overrides = {}, useCache = false,) {
  let wrapped = '/* eslint-disable */\nimport fs from \'fs\';\nimport path from \'path\';\nimport { JSDOM } from \'jsdom\';\nvar { window } = new JSDOM(\'...\');\nvar { document } = window;\n';
  const overrideNames = Object.keys(overrides);
  Object.keys(dependencies).forEach(async (key, i) => {
    const fullPath = path.join('Emrald_Site', key);
    const moduleVar = `module${i}`;
    wrapped += `/* ${fullPath} */\nvar ${moduleVar} = (function () {\n`;
    getContextVars(key, dependencies).forEach((contextVar) => {
      if (overrideNames.indexOf(contextVar) < 0) {
        wrapped += `var ${contextVar} = window['${contextVar}'];\n`;
      }
    });
    Object.keys(overrides).forEach((contextVar) => {
      wrapped += `var ${contextVar} = ${overrides[contextVar]}\n`;
    });
    wrapped += `${fs.readFileSync(fullPath).toString()}\n`;
    dependencies[key].forEach((exportObj) => {
      const e = handleExport(exportObj);
      if (typeof e.value === 'object') {
        wrapped += `${e.value.pre}\nwindow['${e.name}'] = ${e.value.value};\n`;
      } else {
        wrapped += `window['${e.name}'] = ${e.value};\n`;
      }
    });
    wrapped += `}).bind(window);\n${moduleVar}();\n`;
  });
  wrapped += 'export default window;';
  const tempPath = path.resolve(
    'Emrald_Site',
    'tests',
    'temp',
    `${testSuite}.js`,
  );
  if (!fs.existsSync(path.resolve('Emrald_Site', 'tests', 'temp'))) {
    fs.mkdirSync(path.resolve('Emrald_Site', 'tests', 'temp'));
  }
  if (!useCache) {
    fs.writeFileSync(tempPath, wrapped);
  }
  return (await import(`file://${tempPath}`)).default;
}
