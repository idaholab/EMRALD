class MAAPForm extends ExternalExeForm {
  getDataObject() {
    const dataObj = {};
    dataObj.raLocation = this.$scope.exePath;
    dataObj.varNames = this.getVarNames(this.$scope.parameters);
    dataObj.raFormData = {
      inputFile: this.$scope.inputFile,
      parameterFile: this.$scope.parameterFile,
      inpSplits: this.$scope.inpSplits,
    };
    const exeRootPath = this.$scope.exePath.replace(/[^\/\\]*\.exe$/, "");
    const inputFilePath = `${exeRootPath}input.INP`;
    const paramFilePath = `${exeRootPath}parameters.PAR`;
    let paramCode = '"';
    this.$scope.parameters.forEach((parameter) => {
      paramCode += `${parameter.toString()}\\n`;
    });
    paramCode += '"';
    let initiatorCode = '"';
    this.$scope.initiators.forEach((initiator) => {
      initiatorCode += `${initiator.toString()}\\n`;
    });
    initiatorCode += '"';
    let blocksCode = '"';
    /**
     * p1
     * Parameters
     * p2
     * Initiators
     * p3
     * Input Blocks
     */
    dataObj.raPreCode = `string p = ${this.code.readFile(
      this.$scope.inputPath
    )};`;
    dataObj.raPreCode += `string p1 = p.Substring(0, ${this.$scope.inpSplits[0]});`;
    dataObj.raPreCode += `string p2 = p.Substring(${this.$scope.inpSplits[1]}, ${this.$scope.inpSplits[2]});`;
    dataObj.raPreCode += `string p3 = p.Substring(${this.$scope.inpSplits[3]}, ${this.$scope.inpSplits[4]});`;
    dataObj.raPreCode += this.code.writeFile(
      inputFilePath,
      `p1 + ${paramCode} + p2 + ${initiatorCode} + p3`
    );
    console.log(dataObj.raPreCode);
    dataObj.raPostCode = "";
    dataObj.returnProcess = "rtNone";
    dataObj.variables = [];
    return dataObj;
  }
}

const form = new MAAPForm();
const module = angular.module("maapForm", []);

class Parameter extends FormData {
  constructor(data, parsed = true) {
    super(data);
    if (parsed) {
      this.name = data.name;
      this.value = data.value;
    } else {
      this.text = data;
    }
    this.parsed = parsed;
  }

  get label() {
    let label = `${this.name.name}`;
    if (this.name.index) {
      label += `(${this.name.index})`;
    }
    return label;
  }

  get valueLabel() {
    let label;
    if (this.value.type === "variable") {
      label = `${this.value.name}`;
      if (this.value.index) {
        label += `(${this.name.index})`;
      }
    } else {
      label = `${this.value.value}`;
      if (this.value.units) {
        label += ` ${this.value.units}`;
      }
    }
    return label;
  }

  toString() {
    let str;
    if (this.parsed) {
      str = `${this.name.name}`;
      if (this.name.index) {
        str += `(${this.name.index})`;
      }
      str += "=";
      if (this.useVariable) {
        str += `"+${this.variable.name}+"`;
      } else {
        str += `${this.value.value}`;
        if (this.value.units) {
          str += ` ${this.value.units}`;
        }
      }
    } else {
      str = this.text;
    }
    return str;
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

  toString() {
    return this.desc;
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

class BlockData {
  constructor(value) {
    this.value = value;
    this.useVariable = false;
  }
}

class Block {
  constructor(type, ...data) {
    this.type = type;
    this.data = data;
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
    $scope.parameterPath = "";
    $scope.inputPath = "";
    $scope.varLinks = [new VarLink()];
    $scope.parametersLoaded = false;
    $scope.blocks = [];
    $scope.operators = [">", "<", "IS"];
    $scope.inpSplits = [];
    $scope.tab = "parameters";

    const parameterInfo = {};
    const possibleInitiators = {};

    function trim(line) {
      return line.replace(/^\s*/, "").replace(/\s*$/, "");
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
      if (typeof raFormData.inpSplits === "object") {
        $scope.inpSplits = raFormData.inpSplits;
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
        $scope.parametersLoaded = true;
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
        const lines = $scope.inputFile.split(/\n/);
        let initiatorsDone = false;
        let parameterChangeDone = false;
        let i = 0;
        let preParamChange = "";
        let paramChange = "";
        let postParamChange = "";
        let initiators = "";
        let postInitiators = "";
        // TODO: process files with sections in a different order
        // TODO: use line numbers for the preprocessing code
        lines.forEach((fullLine) => {
          const line = trim(fullLine);
          if (!parameterChangeDone && (expects < 1 || expects > 2)) {
            preParamChange += `${fullLine}\n`;
          } else if (parameterChangeDone && !initiatorsDone && expects !== 3) {
            postParamChange += `${fullLine}\n`;
          } else if (initiatorsDone) {
            postInitiators += `${fullLine}\n`;
          }
          switch (expects) {
            case 0:
              if (line === "PARAMETER CHANGE") {
                expects = 2;
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
                paramChange += `${fullLine}\n`;
                if (!/^C/.test(line)) {
                  $scope.parameters.push(
                    new Parameter(window.maapInpParser.parse(line))
                  );
                }
              }
              break;
            case 3:
              if (line === "END") {
                expects = 0;
                initiatorsDone = true;
              } else {
                initiators += `${fullLine}\n`;
                $scope.initiators.push(new Initiator(parameterInfo[line]));
              }
              break;
            default:
          }
          i += 1;
        });
        $scope.inpSplits[0] = preParamChange.length;
        $scope.inpSplits[1] = $scope.inpSplits[0] + paramChange.length;
        $scope.inpSplits[2] = $scope.inpSplits[1] + postParamChange.length + 3;
        $scope.inpSplits[3] = $scope.inpSplits[2] + initiators.length;
        $scope.inpSplits[4] = $scope.inpSplits[3] + postInitiators.length + 4;
        expects = 0;
        let conditions = [];
        let parameters = [];
        // TODO: make more efficient
        postInitiators.split(/\n/).forEach((l) => {
          const line = trim(l);
          switch (expects) {
            case 0:
              if (/^IF/.test(line)) {
                let nextJoiner = null;
                line
                  .replace(/^IF\s+/, "")
                  .split(/(AND|OR)/)
                  .forEach((condition) => {
                    if (condition !== "AND" && condition !== "OR") {
                      // TODO: >=
                      let opIndex = condition.search(/[\<\>]/);
                      const opIndex2 = condition.indexOf("IS");
                      let t = 1;
                      if (opIndex2 > -1) {
                        opIndex = opIndex2;
                        t = 2;
                      }
                      const lhs = trim(condition.substring(0, opIndex));
                      const op = trim(
                        condition.substring(opIndex, opIndex + t)
                      );
                      const rhs = trim(
                        condition.substring(opIndex + t, condition.length)
                      );
                      conditions.push({
                        joiner: nextJoiner,
                        lhs: new BlockData(lhs),
                        op,
                        rhs: new BlockData(rhs),
                      });
                      nextJoiner = null;
                    } else {
                      nextJoiner = condition;
                    }
                  });
                expects = 1;
              } else if (/^WHEN/.test(line)) {
                const l = line.replace(/^WHEN\s+/, "");
                let opIndex = l.search(/[\<\>]/);
                const lhs = trim(l.substring(0, opIndex));
                const op = trim(l.substring(opIndex, opIndex + 1));
                const rhs = trim(l.substring(opIndex + 1, l.length));
                conditions.push({
                  lhs: new BlockData(lhs),
                  op,
                  rhs: new BlockData(rhs),
                });
                expects = 2;
              }
              break;
            case 1:
              if (line === "END") {
                expects = 0;
                $scope.blocks.push(new Block("IF", conditions, parameters));
                conditions = [];
                parameters = [];
              } else {
                try {
                  parameters.push(
                    new Parameter(window.maapInpParser.parse(line))
                  );
                } catch (e) {
                  parameters.push(new Parameter(line, false));
                  console.error(e);
                }
              }
              break;
            case 2:
              if (line === "END") {
                expects = 0;
                $scope.blocks.push(new Block("WHEN", conditions, parameters));
                conditions = [];
                parameters = [];
              } else {
                try {
                  // TODO: display SET TIMER #1
                  parameters.push(
                    new Parameter(window.maapInpParser.parse(line))
                  );
                } catch (e) {
                  parameters.push(new Parameter(line, false));
                  console.log(`Line failed to parse: ` + line);
                  console.error(e);
                }
              }
              break;
            default:
          }
        });
        form.save();
      }
    });

    form.bindScope($scope);
  },
]);

// Don't read entire file into memory
module.directive("fileModel", ["$parse", fileModel]);
