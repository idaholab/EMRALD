/**
 * @file THModel form (demo).
 */
// @ts-check
/// <reference path="../lib/EditFormUtil.js" />
/// <reference path="../lib/ExternalExeForm.js" />
/* global ExternalExeForm, cast */

/**
 * @namespace THModelForm
 */

/**
 * @typedef THModelForm.Scope
 * @property {string} exePath - Path to the THModel executeable.
 * @property {EMRALD.Variable['Variable']} resultsVariable - The results variable.
 * @property {EMRALD.Variable['Variable']} failTime - Fail time variable.
 * @property {EMRALD.Variable['Variable']} failureMode - Failure mode variable.
 * @property {EMRALD.Variable['Variable']} repairTime - Repair time variable.
 * @property {EMRALD.Variable['Variable'][]} variables - EMRALD project variables.
 * @property {EMRALD.Variable['Variable'][]} docVars - Document link variables.
 */

/**
 * THModel form.
 */
class THModelForm extends ExternalExeForm {
  /**
   * @inheritdoc
   */
  getDataObject() {
    /** @type {ExternalExeForm.DataObject} */ const dataObj = {};
    /** @type {THModelForm.Scope} */ let s;
    const scope = cast(this.$scope, s);
    dataObj.raLocation = scope.exePath;
    dataObj.raPreCode = ''; // generate pre code
    dataObj.raPostCode = ''; // generate post code
    dataObj.variables = [
      {
        ...scope.resultsVariable,
        docLink: '$.Outcome',
        docType: 'dtJSON',
        type: 'int',
      },
    ];
    dataObj.varNames = []; // collect var names
    dataObj.raFormData = {
      exePath: scope.exePath,
      failTime: scope.failTime,
      failureMode: scope.failureMode,
      repairTime: scope.repairTime,
      resultsVariable: scope.resultsVariable,
    };
    return dataObj;
  }
}

/** Mention doc path. */
const form = new THModelForm();
const module = window.angular.module('thModelForm', []);

module.controller('thModelController', [
  '$scope',
  /**
   * ThModel Controller.
   *
   * @param {THModelForm.Scope & angular.IScope} $scope - The angular scope.
   */
  function controller($scope) {
    $scope.variables = form.parentScope.data.cvVariables;
    $scope.failTime = null;
    $scope.repairTime = null;
    $scope.failureMode = null;
    $scope.resultsVariable = null;
    $scope.docVars = $scope.variables.filter(
      (cvVariable) => cvVariable.varScope === 'gtDocLink',
    );
    $scope.exePath = '';

    const formData = form.parentScope.data.raFormData;
    if (formData !== undefined) {
      $scope.failTime = $scope.variables.find(
        (variable) => variable.id === formData.failTime.id,
      );
      $scope.repairTime = $scope.variables.find(
        (variable) => variable.id === formData.repairTime.id,
      );
      $scope.failureMode = formData.failureMode;
      $scope.exePath = formData.exePath;
      $scope.resultsVariable = $scope.variables.find(
        (variable) => variable.id === formData.resultsVariable.id,
      );
    }

    form.bindScope($scope);
  },
]);
