class MAAPForm extends ExternalExeForm {
  getDataObject() {
    const dataObj = {};
    dataObj.raLocation = this.$scope.exePath;
    dataObj.varNames = this.getVarNames(this.$scope.parameters);
    dataObj.raFormData = {
      inputFile: this.$scope.inputFile,
      parameterFile: this.$scope.parameterFile,
    };
    const exeRootPath = this.$scope.exePath.replace(/[^\/\\]*\.exe$/, "");
    const inputFilePath = `${exeRootPath}input.INP`;
    const paramFilePath = `${exeRootPath}parameters.PAR`;
    dataObj.raPreCode = this.code.writeFile(
      paramFilePath,
      this.$scope.parameterFile
    );
    dataObj.raPreCode += this.code.writeFile(
      inputFilePath,
      this.code.insertVariables(dataObj.varNames, this.$scope.inputFile),
    );
    dataObj.raPostCode = "";
    dataObj.returnProcess = "rtNone";
    dataObj.variables = [];
    return dataObj;
  }
}

const form = new MAAPForm();
const module = angular.module("maapForm", []);

class Parameter extends FormData {
  constructor(data) {
    super(data);
    this.name = data.name;
    this.units = data.units;
    this.value = data.value;
    this.index = data.index;
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
    $scope.inputBlocks = ["", "", ""];

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
    const { raFormData } = parentScope.data;
    if (raFormData) {
      if (typeof raFormData.parameterFile === "string") {
        $scope.parameterFile = raFormData.parameterFile;
      }
      if (typeof raFormData.inputFile === "string") {
        $scope.inputFile = raFormData.inputFile;
      }
    }

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
        let preParamChange = "";
        let postParamChange = "";
        while (!initiatorsDone || !parameterChangeDone) {
          const line = lines[i];
          if (!parameterChangeDone && (expects < 1 || expects > 2)) {
            preParamChange += `${line}\n`;
          } else if (parameterChangeDone && !initiatorsDone && expects !== 3) {
            postParamChange += `${line}\n`;
          }
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
        let postInitiators = lines.slice(i, lines.length - 1).join("\n");
        $scope.inputBlocks = [
          preParamChange,
          postParamChange,
          postInitiators,
        ];
        form.save();
      }
    });

    form.bindScope($scope);
  },
]);

// Don't read entire file into memory
module.directive("fileModel", ["$parse", fileModel]);
