class MAAPForm extends ExternalExeForm {
  getDataObject() {
    return {};
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

module.controller("maapFormController", [
  "$scope",
  function ($scope) {
    $scope.parameterFile = "";
    $scope.inputFile = "";
    $scope.parameters = [];

    const parameterInfo = {};

    function trim(line) {
      return line.replace(/^\W*/, "").replace(/\W*$/, "");
    }

    const { parentScope } = form;
    $scope.variables = parentScope.data.cvVariables;

    $scope.$watch("parameterFile", function () {
      if ($scope.parameterFile.length > 0) {
        $scope.parameterFile
          .split(/\n/)
          .forEach((line) => {
            if (/^[0-9]{3}/.test(line)) {
              try {
                const data = window.maapParParser.parse(line);
                parameterInfo[data.desc] = data;
              } catch (err) {
                // Do something or just ignore it? It seems like all the lines failing are out of bounds anyway
              }
            }
          });
        console.log(parameterInfo);
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
                console.log(line);
                console.log(parameterInfo[line]);
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
