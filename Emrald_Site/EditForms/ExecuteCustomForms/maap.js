class MAAPForm extends ExternalExeForm {
  getDataObject() {
    const dataObj = {};
    dataObj.raLocation = this.$scope.exePath;
    dataObj.varNames = [];
    this.$scope.parameters.forEach((parameter) => {
      if (
        parameter.useVariable &&
        dataObj.varNames.indexOf(parameter.variable.name) < 0
      ) {
        dataObj.varNames.push(parameter.variable.name);
      }
    });
    dataObj.raFormData = {};
    dataObj.raPreCode = "";
    dataObj.raPostCode = "";
    dataObj.returnProcess = "rtNone";
    dataObj.variables = [];
  }
}

const form = new MAAPForm();
const module = angular.module("maapForm", []);

class Parameter {
  constructor(data) {
    this.name = data.name;
    this.units = data.units;
    this.value = data.value;
    this.index = data.index;
    this.useVariable = false;
  }

  get label() {
    let label = `${this.name}`;
    if (this.index) {
      label += `(${this.index})`;
    }
    return label;
  }
}

class Initiator {
  constructor(data) {
    this.desc = data.desc;
    this.index = data.index;
    this.value = data.value;
  }

  get label() {
    return `${this.index} ${this.value} ${this.desc}`;
  }
}

class VarLink {
  constructor(prismMethod, target, variable) {
    this.prismMethod = prismMethod;
    this.target = target;
    this.variable = variable;
  }

  toJSON() {
    var json = {
      variable: {},
    };
    if (this.variable) {
      json.variable.id = this.variable.id;
      json.variable.name = this.variable.name;
    }
    return json;
  }
}

module.controller("maapFormController", [
  "$scope",
  function ($scope) {
    $scope.parameterFile = "";
    $scope.inputFile = "";
    $scope.parameters = [];
    $scope.initiators = [];
    $scope.initiatorQuery = "";
    $scope.initiatorOptions = [];
    $scope.exePath = "";
    $scope.varLinks = [new VarLink()];

    const parameterInfo = {};
    const possibleInitiators = {};

    function trim(line) {
      return line.replace(/^\W*/, "").replace(/\W*$/, "");
    }

    const { parentScope } = form;
    $scope.variables = parentScope.data.cvVariables;
    $scope.exePath = parentScope.data.raLocation;
    $scope.docVars = parentScope.data.cvVariables.filter(
      (cvVariable) => cvVariable.varScope === "gtDocLink"
    );

    $scope.removeInitiator = function (index) {
      $scope.initiators.splice(index, 1);
    };

    $scope.findInitiators = function () {
      if ($scope.initiatorQuery.length > 0) {
        $scope.initiatorOptions = [];
        Object.keys(possibleInitiators).forEach((key) => {
          if (
            key.toUpperCase().indexOf($scope.initiatorQuery.toUpperCase()) > -1
          ) {
            $scope.initiatorOptions.push(possibleInitiators[key]);
          }
        });
      }
    };

    $scope.addInitiator = function (data) {
      $scope.initiators.push(data);
    };

    $scope.addOutput = function () {
      $scope.varLinks.push(new VarLink());
    };

    $scope.removeOutput = function (index) {
      $scope.varLinks.splice(index, 1);
    };

    $scope.$watch("parameterFile", function () {
      if ($scope.parameterFile.length > 0) {
        $scope.parameterFile.split(/\n/).forEach((line) => {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data = window.maapParParser.parse(line);
              parameterInfo[data.desc] = new Initiator(data);
              if (data.value === "T") {
                possibleInitiators[data.desc] = new Initiator(data);
              }
            } catch (err) {
              // Do something or just ignore it? It seems like all the lines failing are out of bounds anyway
            }
          }
        });
      }
    });

    $scope.$watch("inputFile", function () {
      if ($scope.inputFile.length > 0) {
        let expects = 0;
        const lines = $scope.inputFile.split(/\n/).map((line) => trim(line));
        let initiatorsDone = false;
        let parameterChangeDone = false;
        let i = 0;
        while (!initiatorsDone || !parameterChangeDone) {
          const line = lines[i];
          switch (expects) {
            case 0:
              if (line === "PARAMETER CHANGE") {
                expects = 1;
              } else if (line === "INITIATORS") {
                expects = 3;
              }
              break;
            case 1:
              expects = 2;
              break;
            case 2:
              if (line === "END") {
                expects = 0;
                parameterChangeDone = true;
              } else {
                $scope.parameters.push(
                  new Parameter(window.maapInpParser.parse(line))
                );
              }
              break;
            case 3:
              if (line === "END") {
                expects = 0;
                initiatorsDone = true;
              } else {
                $scope.initiators.push(new Initiator(parameterInfo[line]));
              }
              break;
            default:
          }
          i += 1;
        }
      }
    });
  },
]);

// Don't read entire file into memory
module.directive("fileModel", ["$parse", fileModel]);
