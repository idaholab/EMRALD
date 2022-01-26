/**
 * @file ExternalExeForm class.
 */

/**
 * @class ExternalExeForm
 * @classdesc Utilities for custom run application forms.
 */
class ExternalExeForm {
  /**
   * Constructs ExternalExeForm.
   *
   * @constructs
   */
  constructor() {
    const parentWindow = window.frameElement?.ownerDocument.defaultView;
    if (parentWindow === null || parentWindow === undefined) {
      throw new Error("Custom forms must be embedded in an action editor.");
    }
    this.parentWindow = parentWindow;
    this.parentScope = parentWindow.getScope();
  }

  getDataObject() {
    return {};
  }

  /**
   * Saves the data object in the parent frame.
   *
   * @name ExternalExeForm#save
   * @function
   */
  save() {
    this.parentWindow.postMessage({
      payload: this.getDataObject(),
      type: "saveTemplate",
    });
  }

  /**
   * Binds the angular scope to the form.
   *
   * @name ExternalExeForm#bindScope
   * @function
   * @param {angular.IScope} $scope The angular scope.
   */
  bindScope($scope) {
    this.$scope = $scope;
    Object.keys($scope).forEach((key) => {
      if (key !== "this" && !/^\$/.test(key)) {
        $scope.$watch(key, () => {
          this.save();
        });
      }
    });
  }

  /**
   * Finds the matching variable object in the parent scope.
   *
   * @name ExternalExeForm#findVariable
   * @function
   * @param {*} variable1 The variable to find.
   * @returns {*} The matching variable, if any.
   */
  findVariable(variable1) {
    return this.parentScope.data.cvVariables.find(
      (variable2) => variable1.id === variable2.id
    );
  }

  /**
   * Generates varNames for the form data object.
   *
   * @name ExternalExeForm#getVarNames
   * @function
   * @param {*} objs Arrays of FormData objects to gather variables from.
   * @returns {string[]} The varNames.
   */
  getVarNames(objs) {
    return this.removeDuplicates(
      objs
        .filter((obj) => {
          return obj.useVariable;
        })
        .map((obj) => {
          return obj.variable.name;
        })
    );
  }

  /**
   * Removes duplicate elements from an array.
   *
   * @name ExternalExeForm#removeDuplicates
   * @function
   * @param {*} arr The array to modify.
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
   * @name ExternalExeForm#escape
   * @function
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  escape(str) {
    return str.replace(/([\"\\])/g, "\\$1");
  }

  /**
   * Helper functions for generating pre/post code fragments.
   *
   * @name ExternalExeForm#code
   */
  code = {
    escape(str) {
      return str.replace(/([\"\\])/g, "\\$1");
    },

    /**
     * Generates code for writing to a file.
     *
     * @name ExternalExeForm#code#writeFile
     * @function
     * @param {string} path The path to the file.
     * @param {string} contents The file contents.
     * @returns {string} The C# code for writing the file.
     */
    writeFile(path, contents) {
      return `System.IO.File.WriteAllText("${this.escape(
        path
      )}", "${this.escape(contents)}");`;
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
      varNames.forEach((varName) => {
        str = str.replace(new RegExp(`%%${varName}`, 'g'), `"+${varName}+"`);
      });
      return str;
    }
  };
}

class FormData {
  constructor(data) {
    this.data = data;
    this.useVariable = false;
  }
}
