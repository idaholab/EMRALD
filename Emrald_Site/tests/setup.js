/* eslint-disable import/no-extraneous-dependencies */
/**
 * @file Confirugation for the Karma testing framework.
 */

/**
 * Configures Karma.
 *
 * @param {*} config - The Karma config object.
 */
module.exports = function karmaConfig(config) {
  config.set({
    autoWatch: true,
    basePath: '../',
    browsers: ['Chrome'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          file: 'coverage.json',
          subdir: '.',
          type: 'json',
        },
        {
          subdir: 'report-html',
          type: 'html',
        },
      ],
    },
    files: [
      // Load the same scripts as index.html, in the same order
      'scripts/mxGraph/js_min/mxClient.js',
      'scripts/UI/Common.js',
      'scripts/UI/Blob.js',
      'scripts/UI/FileSaver.js',
      'config.js',
      'scripts/UI/wcfService.js',
      'scripts/UI/CustomEvent.js',
      'scripts/UI/CustomWindowHandler.js',
      'scripts/UI/Window.js',
      'scripts/UI/WindowFrame.js',
      'scripts/UI/menu.js',
      'scripts/UI/upgrade.js',
      'scripts/UI/Sidebar.js',
      'scripts/UI/simApp.js',
      'tests/util.js',
      {
        included: false,
        pattern: 'tests/test-data/**/*.json',
        served: true,
        watched: true,
      },
      'tests/*.test.js',
    ],
    frameworks: ['jasmine', 'jasmine-matchers', 'fixture'],
    jsonFixturesPreprocessor: {
      variableName: '__json__',
    },
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-matchers',
      'karma-fixture',
      'karma-json-fixtures-preprocessor',
    ],
    port: 5000,
    preprocessors: {
      '**/*.json': ['json_fixtures'],
      '../**.js': ['coverage'],
    },
    reporters: ['progress', 'coverage'],
    singleRun: false,
  });
};
