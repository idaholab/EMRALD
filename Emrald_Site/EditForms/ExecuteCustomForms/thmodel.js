class THModelForm extends ExternalExeForm {
  getDataObject() {
    const dataObj = {};
    dataObj.raLocation = this.$scope.exePath;
    dataObj.raPreCode = ''; // generate pre code
    dataObj.raPostCode = ''; // generate post code
    dataObj.variables = [
      {
        ...this.$scope.resultsVariable,
        docLink: '$.Outcome',
        docType: 'dtJSON',
        type: 'int',
      },
    ];
    dataObj.varNames = []; // collect var names
    dataObj.raFormData = {
      failTime: this.$scope.failTime,
      repairTime: this.$scope.repairTime,
      failureMode: this.$scope.failureMode,
      resultsVariable: this.$scope.resultsVariable,
      exePath: this.$scope.exePath,
    };
    return dataObj;
  }
}

/** Mention doc path */
const form = new THModelForm();
const module = angular.module('thModelForm', []);

module.controller('thModelController', [
  '$scope',
  function controller($scope) {
    $scope.variables = form.parentScope.data.cvVariables;
    $scope.failTime = '';
    $scope.repairTime = '';
    $scope.failureMode = '';
    $scope.resultsVariable = '';
    $scope.docVars = $scope.variables.filter(
      (cvVariable) => cvVariable.varScope === 'gtDocLink',
    );
    $scope.exePath = '';

    var formData = form.parentScope.data.raFormData;
    console.log(formData);
    if (formData !== undefined) {
      $scope.failTime = $scope.variables.find((variable) => variable.id === formData.failTime.id);
      $scope.repairTime = $scope.variables.find((variable) => variable.id === formData.repairTime.id);
      $scope.failureMode = formData.failureMode;
      $scope.exePath = formData.exePath;
      $scope.resultsVariable = $scope.variables.find((variable) => variable.id === formData.resultsVariable.id);
    }

    form.bindScope($scope);
  },
]);
