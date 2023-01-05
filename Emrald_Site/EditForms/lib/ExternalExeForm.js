/* eslint-disable class-methods-use-this */
/**
 * @file ExternalExeForm class.
 */
// @ts-nocheck
/// <reference path="../../scripts/jsdoc-types.js" />

/**
 * @namespace ExternalExeForm
 */

/**
 * @typedef ExternalExeForm.DataObject
 * @property {string} raLocation - The location of the executeable to run.
 * @property {object} raFormData - Custom form data.
 * @property {string} raPreCode - The C# preprocessing code.
 * @property {string} raPostCode - The C# postprocessing code.
 * @property {string[]} varNames - Names of variables used in C# code.
 * @property {string} returnProcess - The return process type.
 * @property {EMRALD.Variable['Variable'][]} variables - Variables in the project to override.
 */

/**
 * @typedef ExternalExeForm.VariableMatchingData
 * @property {string} name - The name of the variable.
 * @property {number} id - The variable ID.
 */

/**
 * Provides utilities for custom run application forms.
 *
 * @global
 * @template T - The individual form scope type.
 */
class ExternalExeForm {
  /**
   * Constructs ExternalExeForm.
   *
   * @constructs
   * @param {T & import('angular').IScope} $scope The angular scope.
   */
  constructor($scope) {
    const parentWindow = /** @type {ActionEditor.Window & Window} */ (
      /** @type {unknown} */ (window.frameElement.ownerDocument.defaultView)
    );
    if (parentWindow === null || parentWindow === undefined) {
      throw new Error('Custom forms must be embedded in an action editor.');
    }
    /** @type {ActionEditor.Window & Window} */
    this.parentWindow = parentWindow;
    /** @type {ActionEditor.Scope & angular.IScope} */
    this.parentScope = parentWindow.getScope();
    this.$scope = $scope;
    this.bindScope($scope);
  }

  /**
   * Constructs the data object to be passed to the parent window.
   * Must be overriden by custom forms.
   *
   * @abstract
   * @returns {ExternalExeForm.DataObject} The constructed data object.
   */
  getDataObject() {
    return {
      raFormData: {},
      raLocation: '',
      raPostCode: '',
      raPreCode: '',
      returnProcess: 'rtNone',
      variables: [],
      varNames: [],
    };
  }

  /**
   * Saves the data object in the parent frame.
   */
  save() {
    this.parentWindow.postMessage({
      payload: this.getDataObject(),
      type: 'saveTemplate',
    });
  }

  /**
   * Binds the angular scope to the form.
   *
   * @param {import('angular').IScope} $scope The angular scope.
   */
  bindScope($scope) {
    this.$scope = $scope;
    Object.keys($scope).forEach((key) => {
      if (key !== 'this' && !/^\$/.test(key)) {
        $scope.$watch(key, () => {
          this.save();
        });
      }
    });
  }

  /**
   * Finds the matching variable object in the parent scope.
   *
   * @param {ExternalExeForm.VariableMatchingData} variable1 The variable to find.
   * @returns {EMRALD.Variable['Variable']} The matching variable, if any.
   */
  findVariable(variable1) {
    let id;
    if (variable1.Variable) {
      id = variable1.Variable.id;
    } else {
      id = variable1.id;
    }
    return this.parentScope.data.cvVariables.find(
      (variable2) => id === variable2.id,
    );
  }

  /**
   * Generates varNames for the form data object.
   *
   * @param {ExeFormItem[]} objs Arrays of ExeFormItem objects to gather variables from.
   * @returns {string[]} The varNames.
   */
  getVarNames(objs) {
    return this.removeDuplicates(
      objs
        .filter((obj) => obj.useVariable)
        .map((obj) => obj.variable.name),
    );
  }

  /**
   * Removes duplicate elements from an array.
   *
   * @template T - The type of elements in the array.
   * @param {T[]} arr The array to modify.
   * @returns {T[]} The modified array.
   */
  removeDuplicates(arr) {
    const newArr = [];
    arr.forEach((el) => {
      if (newArr.indexOf(el) < 0) {
        newArr.push(el);
      }
    });
    return newArr;
  }

  /**
   * Escapes quotes in a string.
   *
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  escape(str) {
    return str.replace(/(["\\])/g, '\\$1');
  }
}

/**
 * Helper functions for generating pre/post code fragments.
 */
ExternalExeForm.prototype.code = {
  /**
   * Escapes quotes in a string.
   *
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  escape(str) {
    return str.replace(/(["\\])/g, '\\$1');
  },

  /**
   * Properly formats EMRALD variable names within a file.
   *
   * @name ExternalExeForm#code#insertVariables
   * @function
   * @param {string[]} varNames Variable names to find.
   * @param {string} str The file contents to modify.
   * @returns {string} The formatted file.
   */
  insertVariables(varNames, str) {
    let contents = str;
    varNames.forEach((varName) => {
      contents = contents.replace(
        new RegExp(`%%${varName}`, 'g'),
        `"+${varName}+"`,
      );
    });
    return contents;
  },

  /**
   * Generates code for reading a file.
   *
   * @name ExternalExeForm#code#readFile
   * @function
   * @param {string} path The path to the file.
   * @returns {string} The C# code for reading the file.
   */
  readFile(path) {
    return `System.IO.File.ReadAllText("${this.escape(path)}")`;
  },

  /**
   * Generates code for writing to a file.
   *
   * @param {string} path The path to the file.
   * @param {string} contents The file contents.
   * @returns {string} The C# code for writing the file.
   */
  writeFile(path, contents) {
    return `System.IO.File.WriteAllText("${this.escape(path)}", ${contents});`;
  },
};

/**
 * Stores form data with some useful properties and methods.
 *
 * @global
 * @template T - The type of data stored in the item.
 */
class ExeFormItem {
  /**
   * Constructs ExeFormItem.
   *
   * @param {T} data - The stored data.
   */
  constructor(data) {
    /** @type {T} */ this.data = data;
    /** @type {boolean} */ this.useVariable = false;
    /** @type {EMRALD.Variable['Variable']} */ this.variable = null;
  }
}
