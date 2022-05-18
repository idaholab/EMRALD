/**
 * @file MAAP form.
 */
// @ts-check
/// <reference path="./fileModel.js" />
/// <reference path="../lib/ExternalExeForm.js" />

/**
 * @namespace MAAPForm
 */

/**
 * @typedef MAAPForm.Scope
 * @property {string} exePath - Path to the MAAP executeable.
 */

/**
 * The MAAP custom form controller.
 */
class MAAPForm extends ExternalExeForm {
  /**
   * @inheritdoc
   */
  getDataObject() {
    /** @type {ExternalExeForm.DataObject} */ const dataObj = {};
    dataObj.raLocation = '';
    dataObj.varNames = this.getVarNames(this.$scope.parameters);
    dataObj.raFormData = {
      exePath: this.$scope.exePath,
      initiators: this.$scope.initiators.map((initiator) => initiator.toJSON()),
      inpSplits: this.$scope.inpSplits,
      inputPath: this.$scope.inputPath,
      parameterPath: this.$scope.parameterPath,
      parameters: this.$scope.parameters.map((parameter) => parameter.toJSON()),
      varLinks: this.$scope.varLinks.map((varLink) => varLink.toJSON()),
    };
    const tempFilePath = `${this.$scope.inputPath.replace(
      /[^/\\]*\.INP$/,
      'temp.INP',
    )}`;
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
    dataObj.raPreCode = `string exeLoc = @"${this.escape(this.$scope.exePath)}";
      string paramLoc = @"${this.escape(this.$scope.parameterPath)}";
      string inpLoc = @"${this.escape(this.$scope.inputPath)}";
      string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_MAAP\\";
      try {
        if (Directory.Exists(tempLoc)) {
          Directory.Delete(tempLoc, true);
        }
        Directory.CreateDirectory(tempLoc);
      } catch {}
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
      string p = ${this.code.readFile(this.$scope.inputPath)};
      string p1 = p.Substring(0, ${this.$scope.inpSplits[0]});
      string p2 = p.Substring(${this.$scope.inpSplits[1]}, ${
      this.$scope.inpSplits[2]
    });
      string p3 = p.Substring(${this.$scope.inpSplits[3]}, ${
      this.$scope.inpSplits[4]
    });
      string newInp = p1 + ${paramCode} + p2 + ${initiatorCode} + p3;
      System.IO.File.WriteAllText(tempLoc + Path.GetFileName(inpLoc), newInp);
      //TODO - if there is a .dat file then remove any .inp file reference
      return tempLoc + exeName + " " + Path.GetFileName(inpLoc) + " " + Path.GetFileName(paramLoc);`;
    dataObj.raPostCode = `string inpLoc = @"${this.escape(
      this.$scope.inputPath,
    )}";
    string docVarPath = @"${tempFilePath}"; //whatever you assigned the results variables to
    string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_MAAP\\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
    File.Copy(resLoc, docVarPath, true);`;
    dataObj.returnProcess = 'rtNone';
    dataObj.variables = [];
    for (let i = 0; i < this.$scope.varLinks.length; i += 1) {
      const varLink = this.$scope.varLinks[i];
      if (varLink.variable) {
        dataObj.variables.push({
          ...varLink.variable,
          begPosition: 28,
          docLink: varLink.target,
          docPath: tempFilePath,
          docType: 'dtTextRegEx',
          numChars: 11,
          pathMustExist: false,
          regExpLine: 0,
          type: 'double',
        });
        dataObj.varNames.push(varLink.variable.name);
      }
    }
    return dataObj;
  }
}

const form = new MAAPForm();
const module = window.angular.module('maapForm', []);

/**
 * @typedef MAAPForm.ParameterName
 * @property {string} name - The text value of the name.
 * @property {number} index - If an index is being accessed.
 */

/**
 * @typedef MAAPForm.ParameterValue
 * @property {number} index - If an index is being accessed.
 * @property {string} name - The value name.
 * @property {string} type - The value type.
 * @property {string} units - The value units.
 * @property {string} value - The value value.
 */

/**
 * @typedef MAAPForm.ParameterData
 * @property {MAAPForm.ParameterName} name - The parameter name.
 * @property {MAAPForm.ParameterValue} value - The parameter value.
 */

/**
 * @typedef MAAPForm.ParameterJSON
 * @property {MAAPForm.ParameterData} data - The raw parameter data.
 * @property {boolean} parsed - If the data was succesfully parsed.
 * @property {boolean} useVariable - If the parameter is using a variable.
 * @property {EMRALD.Variable['Variable']} variable - The variable being used, if any.
 */

/**
 * Parameter options.
 */
class Parameter extends ExeFormItem {
  /**
   * Constructs Parameter.
   *
   * @param {MAAPForm.ParameterData | string} data - The parameter data.
   * @param {boolean} parsed If the parameter data was succesfully parsed.
   */
  constructor(data, parsed = true) {
    super(data);
    if (parsed && typeof data !== 'string') {
      this.name = data.name;
      this.value = data.value;
    } else {
      this.text = /** @type {string} */ (data);
    }
    this.parsed = parsed;
    this.tempText = this.valueLabel;
  }

  /**
   * Gets the parameter label.
   *
   * @returns {string} The parameter label.
   */
  get label() {
    let label = `${this.name.name}`;
    if (this.name.index) {
      label += `(${this.name.index})`;
    }
    return label;
  }

  /**
   * Gets the parameter value label.
   *
   * @returns {string} - The parameter value label.
   */
  get valueLabel() {
    let label;
    if (!this.parsed) {
      return this.text;
    }
    if (this.value.type === 'variable') {
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

  /**
   * Creates a string representation of the parameter.
   *
   * @returns {string} The parameter as a string.
   */
  toString() {
    let str;
    if (this.parsed) {
      str = `${this.name.name}`;
      if (this.name.index) {
        str += `(${this.name.index})`;
      }
      str += '=';
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

  /**
   * Creates a JSON representation of the parameter.
   *
   * @returns {MAAPForm.ParameterJSON} The parameter JSON.
   */
  toJSON() {
    return {
      data: this.data,
      parsed: this.parsed,
      useVariable: this.useVariable,
      variable: this.variable,
    };
  }

  /**
   * Allows direct editing of the text.
   */
  changeText() {
    const s = this.tempText.split(' ');
    [this.value.value, this.value.units] = s;
    [this.data.value.value, this.data.value.units] = s;
  }
}

/**
 * 
 */
class Initiator extends ExeFormItem {
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
  constructor(target, variable) {
    this.target = target;
    this.variable = variable;
  }

  toJSON() {
    const json = {
      target: this.target,
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

module.controller('maapFormController', [
  '$scope',
  /**
   * The MAAP form controller.
   *
   * @param {MAAPForm.Scope & angular.IScope} $scope - The angular scope.
   */
  function maapFormController($scope) {
    $scope.parameterFile = '';
    $scope.inputFile = '';
    $scope.parameters = [];
    $scope.initiators = [];
    $scope.initiatorQuery = '';
    $scope.initiatorOptions = [];
    $scope.exePath = '';
    $scope.parameterPath = '';
    $scope.inputPath = '';
    $scope.varLinks = [new VarLink()];
    $scope.parametersLoaded = false;
    $scope.blocks = [];
    $scope.operators = ['>', '<', 'IS'];
    $scope.inpSplits = [];
    $scope.tab = 'parameters';

    const parameterInfo = {};
    const possibleInitiators = {};

    /**
     *
     * @param line
     */
    function trim(line) {
      return line.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    const { parentScope } = form;
    $scope.variables = parentScope.data.cvVariables;
    $scope.exePath = parentScope.data.raLocation;
    $scope.docVars = parentScope.data.cvVariables.filter(
      (cvVariable) => cvVariable.varScope === 'gtDocLink',
    );
    const { raFormData } = parentScope.data;
    if (raFormData) {
      if (typeof raFormData.inpSplits === 'object') {
        $scope.inpSplits = raFormData.inpSplits;
      }
      if (typeof raFormData.parameterPath === 'string') {
        $scope.parameterPath = raFormData.parameterPath;
      }
      if (typeof raFormData.inputPath === 'string') {
        $scope.inputPath = raFormData.inputPath;
      }
      if (typeof raFormData.exePath === 'string') {
        $scope.exePath = raFormData.exePath;
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
          (initiator) => new Initiator(initiator.data),
        );
      }
      if (typeof raFormData.varLinks === 'object') {
        $scope.varLinks = raFormData.varLinks.map(
          (varLink) =>
            new VarLink(varLink.target, form.findVariable(varLink.variable)),
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

    $scope.$watch('parameterFile', () => {
      if ($scope.parameterFile.length > 0) {
        $scope.parametersLoaded = true;
        $scope.parameterFile.split(/\n/).forEach((line) => {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data = window.maapParParser.parse(line);
              parameterInfo[data.desc] = new Initiator(data);
              if (data.value === 'T') {
                possibleInitiators[data.desc] = new Initiator(data);
              }
            } catch (err) {
              // Do something or just ignore it? It seems like all the lines failing are out of bounds anyway
            }
          }
        });
      }
    });

    $scope.$watch('inputFile', () => {
      if ($scope.inputFile.length > 0) {
        let expects = 0;
        const lines = $scope.inputFile.split(/\n/);
        let initiatorsDone = false;
        let parameterChangeDone = false;
        let i = 0;
        let preParamChange = '';
        let paramChange = '';
        let postParamChange = '';
        let initiators = '';
        let postInitiators = '';
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
              if (line === 'PARAMETER CHANGE') {
                expects = 2;
              } else if (line === 'INITIATORS') {
                expects = 3;
              }
              break;
            case 1:
              expects = 2;
              break;
            case 2:
              if (line === 'END') {
                expects = 0;
                parameterChangeDone = true;
              } else {
                paramChange += `${fullLine}\n`;
                if (!/^C/.test(line)) {
                  $scope.parameters.push(
                    new Parameter(window.maapInpParser.parse(line)),
                  );
                }
              }
              break;
            case 3:
              if (line === 'END') {
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
        $scope.inpSplits[3] =
          $scope.inpSplits[1] + $scope.inpSplits[2] + initiators.length;
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
                  .replace(/^IF\s+/, '')
                  .split(/(AND|OR)/)
                  .forEach((condition) => {
                    if (condition !== 'AND' && condition !== 'OR') {
                      // TODO: >=
                      let opIndex = condition.search(/[\<\>]/);
                      const opIndex2 = condition.indexOf('IS');
                      let t = 1;
                      if (opIndex2 > -1) {
                        opIndex = opIndex2;
                        t = 2;
                      }
                      const lhs = trim(condition.substring(0, opIndex));
                      const op = trim(
                        condition.substring(opIndex, opIndex + t),
                      );
                      const rhs = trim(
                        condition.substring(opIndex + t, condition.length),
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
                const l = line.replace(/^WHEN\s+/, '');
                const opIndex = l.search(/[\<\>]/);
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
              if (line === 'END') {
                expects = 0;
                $scope.blocks.push(new Block('IF', conditions, parameters));
                conditions = [];
                parameters = [];
              } else {
                try {
                  parameters.push(
                    new Parameter(window.maapInpParser.parse(line)),
                  );
                } catch (e) {
                  parameters.push(new Parameter(line, false));
                  console.error(e);
                }
              }
              break;
            case 2:
              if (line === 'END') {
                expects = 0;
                $scope.blocks.push(new Block('WHEN', conditions, parameters));
                conditions = [];
                parameters = [];
              } else {
                try {
                  // TODO: display SET TIMER #1
                  parameters.push(
                    new Parameter(window.maapInpParser.parse(line)),
                  );
                } catch (e) {
                  parameters.push(new Parameter(line, false));
                  console.log(`Line failed to parse: ${line}`);
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

    $scope.changeText = function (parameter) {
      parameter.changeText();
      form.save();
    };

    form.bindScope($scope);
  },
]);

// Don't read entire file into memory
module.directive('fileModel', ['$parse', fileModel]);
