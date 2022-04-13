class MAAPForm extends ExternalExeForm {
  getDataObject() {
    const dataObj = {};
    dataObj.raLocation = this.$scope.exePath;
    dataObj.varNames = this.getVarNames(this.$scope.parameters);
    dataObj.raFormData = {
      inpSplits: this.$scope.inpSplits,
      parameterPath: this.$scope.parameterPath,
      inputPath: this.$scope.inputPath,
      parameters: this.$scope.parameters.map((parameter) => parameter.toJSON()),
      initiators: this.$scope.initiators.map((initiator) => initiator.toJSON()),
    };
    const exeRootPath = this.$scope.exePath.replace(/[^\/\\]*\.exe$/, "");
    const tempFilePath = `${this.$scope.inputPath.replace(/[^\/\\]*\.INP$/, "temp.INP")}`;
    const inputFilePath = `${exeRootPath}input.INP`;
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
    dataObj.raPreCode = `string exeLoc = @"${this.escape(this.$scope.exePath)}";
      string paramLoc = @"${this.escape(this.$scope.parameterPath)}";
      string inpLoc = @"${this.escape(this.$scope.inputPath)}";
      string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_MAAP\\";
      if (Directory.Exists(tempLoc)) {
        Directory.Delete(tempLoc, true);
      }
      Directory.CreateDirectory(tempLoc);
      if (File.Exists(paramLoc)) {
        File.Copy(paramLoc, tempLoc + Path.GetFileName(paramLoc));
      }
      if (File.Exists(inpLoc)) {
        File.Copy(inpLoc, tempLoc + Path.GetFileName(inpLoc));
      }
      //TODO - if there is a .dat file specified in the .inp copy that here as well.
      string exeName = Path.GetFileName(exeLoc);
      if(File.Exists(exeLoc)) {
        File.Copy(exeLoc, tempLoc + exeName);
      }
      string dllPath = Path.GetDirectoryName(exeLoc)+ @"\\" + exeName.Substring(0, exeName.Length - 7) + ".dll";
      if (File.Exists(dllPath)) {
        File.Copy(dllPath, tempLoc + Path.GetFileName(dllPath));
      }
      string p = ${this.code.readFile(
        this.$scope.inputPath
      )};
      string p1 = p.Substring(0, ${this.$scope.inpSplits[0]});
      string p2 = p.Substring(${this.$scope.inpSplits[1]}, ${this.$scope.inpSplits[2]});
      string p3 = p.Substring(${this.$scope.inpSplits[3]}, ${this.$scope.inpSplits[4]});
      string newInp = p1 + ${paramCode} + p2 + ${initiatorCode} + p3;
      ${this.code.writeFile("Path.GetFileName(inpLoc)", 'newInp')}
      //TODO - if there is a .dat file then remove any .inp file reference
      return Path.GetFileName(inpLoc) + " " + Path.GetFileName(paramLoc);`;
    dataObj.raPostCode = `string inpLoc = @"${this.escape(this.$scope.inputPath)}";
    string docVarPath = @"${tempFilePath}"; //whatever you assigned the results variables to
    string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_MAAP\\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
    File.Copy(resLoc, docVarPath);`;
    dataObj.returnProcess = "rtNone";
    dataObj.variables = [];
    for (var i = 0; i < this.$scope.varLinks.length; i += 1) {
      dataObj.variables.push({
        ...this.$scope.varLinks[i].variable,
        docType: "dtTextRegEx",
        docLink: `[0-9\.]+`,
        docPath: tempFilePath,
        pathMustExist: false,
        type: "double",
        regExpLine: 0,
        begPosition: 0,
        numChars: -1,
      });
    }
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

  toJSON() {
    return {
      data: this.data,
      parsed: this.parsed,
      useVariable: this.useVariable,
      variable: this.variable,
    };
  }
}

class Initiator extends FormData {
  constructor(data) {
    super(data);
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

  toJSON() {
    return {
      data: this.data,
    };
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
      if (typeof raFormData.inpSplits === "object") {
        $scope.inpSplits = raFormData.inpSplits;
      }
      if (typeof raFormData.parameterPath === "string") {
        $scope.parameterPath = raFormData.parameterPath;
      }
      if (typeof raFormData.inputPath === "string") {
        $scope.inputPath = raFormData.inputPath;
      }
      if (raFormData.parameters) {
        $scope.parameters = raFormData.parameters.map((parameter) => {
          const param = new Parameter(parameter.data, parameter.parsed);
          param.useVariable = parameter.useVariable;
          if (parameter.useVariable) {
            param.variable = form.findVariable(parameter.variable);
          }
          return param;
        });
      }
      if (raFormData.initiators) {
        $scope.initiators = raFormData.initiators.map(
          (initiator) => new Initiator(initiator.data)
        );
      }
    }

    $scope.removeInitiator = function (index) {
      $scope.initiators.splice(index, 1);
      form.save();
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
      form.save();
    };

    $scope.addOutput = function () {
      $scope.varLinks.push(new VarLink());
      form.save();
    };

    $scope.removeOutput = function (index) {
      $scope.varLinks.splice(index, 1);
      form.save();
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
        $scope.inpSplits[1] = preParamChange.length + paramChange.length;
        $scope.inpSplits[2] = postParamChange.length + 3;
        $scope.inpSplits[3] = $scope.inpSplits[1] + $scope.inpSplits[2] + initiators.length;
        $scope.inpSplits[4] = postInitiators.length + 4;
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

    $scope.save = function () {
      form.save();
    };

    form.bindScope($scope);
  },
]);

// Don't read entire file into memory
module.directive("fileModel", ["$parse", fileModel]);
