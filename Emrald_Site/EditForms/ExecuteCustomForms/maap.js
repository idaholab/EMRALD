/**
 * @file MAAP form.
 */
// @ts-check
/// <reference path="./fileModel.js" />
/// <reference path="../lib/EditFormUtil.js" />
/// <reference path="../lib/ExternalExeForm.js" />
/* global ExternalExeForm */

// This section tells the editor how to assign types to objects declared in the global scope.

/* eslint-disable prefer-destructuring */
/** @type {*} */ const win = window;
/** @type {import('maap-inp-parser').MAAPInpParser} */
const maapInpParser = win.maapInpParser;
/** @type {import('maap-par-parser').MAAPParParser} */
const maapParParser = win.maapParParser;
/** @type {import('angular')} */
const angular = win.angular;
/* eslint-enable prefer-destructuring */

/**
 * @typedef {import('maap-inp-parser').SourceElement} SourceElement
 */

/**
 * @typedef ScopeData
 * @property {string} initiatorQuery - Initiator query text.
 */

/**
 * @typedef Override
 * @property {number[]} bounds - The substring bounds.
 * @property {*} data - The **key** of the scope property to stringify. Must be an array of objects with a toString method.
 */

/**
 * @typedef Scope
 * @property {string} exePath - Path to the MAAP executeable.
 * @property {string} inputFile - Full contents of the input file.
 * @property {string} parameterFile - Full contents of the parameter file.
 * @property {string} inputPath - Path to the INP file.
 * @property {string} parameterPath - Path to the PAR file.
 * @property {SourceElement[]} parameters - Parameter items.
 * @property {SourceElement[]} initiators - Initiators.
 * @property {VarLink[]} varLinks - Var links.
 * @property {(Comment | SourceElement)[]} blocks - Input blocks.
 * @property {SourceElement[]} initiatorOptions - Initiator options.
 * @property {boolean} parametersLoaded - If the parameters file has been loaded & parsed.
 * @property {string[]} operators - Possible operator choices.
 * @property {string} tab - The current tab.
 * @property {EMRALD.Variable[]} variables - Variables in the EMRALD project.
 * @property {EMRALD.Variable[]} docVars - Document link variables from the EMRALD project.
 * @property {(index: number) => void} removeInitiator - Removes the initiator at the given index.
 * @property {() => void} findInitiators - Finds initiators given the current initiatorQuery.
 * @property {(data: any) => void} addInitiator - Adds the given initiator to initiators.
 * @property {() => void} addOutput - Adds an empty var link.
 * @property {(index: number) => void} removeOutput - Removes the var link at the given index.
 * @property {() => void} save - Saves the form data.
 * @property {(target: any) => void} changeText - Changes the text of a parameter directly.
 * @property {ScopeData} data - Globally scoped form data.
 * @property {Override[]} overrideSections - Sections of the INP file to override.
 * @property {SourceElement[]} sections - File sections.
 * @property {MAAPForm} form - Reference to the form instance.
 * @property {(element: SourceElement) => string} extractName - Extracts the name from a complex object.
 * @property {Record<string, import('maap-par-parser').MAAPParParserOutput>} possibleInitiators - Initiator dropdown list options.
 * @property {import('maap-inp-parser').Comment[]} comments - Comments in the INP file.
 */

/**
 * @typedef RAFormData
 * @property {string} exePath - The executable path.
 * @property {string} inputPath - The INP file path.
 * @property {string} parameterPath - The parameter file path.
 * @property {SourceElement[]} sections - File sections.
 * @property {VarLinkJSON[]} varLinks - Variable links.
 * @property {string[]} possibleInitiators - Initiator options.
 * @property {import('maap-inp-parser').Comment[]} comments - Comments in the INP file.
 */

/**
 * Gets a list of variable names from the blocks.
 *
 * @param {SourceElement | Comment} block - The block to get names from.
 * @returns {string[]} The list of variable names.
 */
function getBlockVarNames(block) {
  /** @type {string[]} */ let names = [];
  Object.values(block)
    .filter((val) => !!val)
    .forEach((val) => {
      if (val.useVariable) {
        names.push(val.variable.name);
      } else if (typeof val === 'object') {
        names = names.concat(getBlockVarNames(val));
      }
    });
  return names;
}

/**
 * Removes the location data from the parser to reduce file size.
 *
 * @param {SourceElement} obj The object to remove data from.
 * @returns {SourceElement} The cleaned object.
 */
function removeLocations(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeLocations(item));
  }
  if (typeof obj === 'object') {
    const re = {
      ...obj,
    };
    const keys = Object.keys(re);
    for (let i = 0; i < keys.length; i += 1) {
      re[keys[i]] = removeLocations(re[keys[i]]);
    }
    delete re.location;
    delete re.$$hashKey;
    return re;
  }
  return obj;
}

/**
 * The MAAP custom form controller.
 *
 * @augments ExternalExeForm<Scope>
 */
class MAAPForm extends ExternalExeForm {
  /**
   * @inheritdoc
   */
  getDataObject() {
    /** @type {ExternalExeForm.DataObject} */ const dataObj = {};
    const scope = this.$scope;
    dataObj.raLocation = '';
    dataObj.varNames = [];
    scope.sections.forEach((section) => {
      getBlockVarNames(section).forEach((name) => {
        if (dataObj.varNames.indexOf(name) < 0) {
          dataObj.varNames.push(name);
        }
      });
    });
    scope.blocks.forEach((block) => {
      getBlockVarNames(block).forEach((name) => {
        if (dataObj.varNames.indexOf(name) < 0) {
          dataObj.varNames.push(name);
        }
      });
    });
    /** @type {RAFormData} */ const raFormData = {
      comments: scope.comments,
      exePath: scope.exePath,
      inputPath: scope.inputPath,
      parameterPath: scope.parameterPath,
      possibleInitiators: Object.keys(scope.possibleInitiators),
      sections: scope.sections.map((section) => removeLocations(section)),
      varLinks: scope.varLinks.map((varLink) => varLink.toJSON()),
    };
    dataObj.raFormData = raFormData;
    const tempFilePath = `${scope.inputPath.replace(
      /[^/\\]*\.(inp|INP)$/,
      'temp.log',
    )}`;
    const overrideCode = `newInp += "${scope.sections
      .map((section) =>
        maapInpParser.default.toString(section).replace(/\n/g, '\\n'),
      )
      .join('\\n')}";`;
    /* eslint-disable max-len */
    dataObj.raPreCode = `string exeLoc = @"${this.escape(scope.exePath)}";
      string paramLoc = @"${this.escape(scope.parameterPath)}";
      string inpLoc = @"${this.escape(scope.inputPath)}";

      if (!Path.IsPathRooted(paramLoc))
        paramLoc = RootPath + paramLoc;

      if (!Path.IsPathRooted(inpLoc))
        inpLoc = RootPath + inpLoc;    

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

      string ext = ".INC";
      string[] filesToCopy = Directory.GetFiles(Path.GetDirectoryName(inpLoc), $"*{ext}");
      foreach (string filePath in filesToCopy)
      {
        string destinationPath = Path.Combine(tempLoc, Path.GetFileName(filePath));
        File.Copy(filePath, destinationPath, true);
      }

      string exeName = Path.GetFileName(exeLoc);
      if(File.Exists(exeLoc)) {
        File.Copy(exeLoc, tempLoc + exeName);
      }
      string dllPath = Path.GetDirectoryName(exeLoc)+ @"\\" + exeName.Substring(0, exeName.Length - 7) + ".dll";
      if (File.Exists(dllPath)) {
        File.Copy(dllPath, tempLoc + Path.GetFileName(dllPath));
      }
      string originalInp = ${this.code.readFile(scope.inputPath)};
      string newInp = "";
      ${overrideCode}
      System.IO.File.WriteAllText(tempLoc + Path.GetFileName(inpLoc), newInp);
      return tempLoc + exeName + " " + Path.GetFileName(inpLoc) + " " + Path.GetFileName(paramLoc);`;
    dataObj.raPostCode = `string inpLoc = @"${this.escape(scope.inputPath)}";
    if (!Path.IsPathRooted(inpLoc))
      inpLoc = RootPath + inpLoc;
    string docVarPath = @"${tempFilePath}"; //whatever you assigned the results variables to
    if (!Path.IsPathRooted(docVarPath))
      docVarPath = RootPath + docVarPath;
    string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_MAAP\\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
    File.Copy(resLoc, docVarPath, true);`;
    /* eslint-enable max-len */
    dataObj.returnProcess = 'rtNone';
    dataObj.variables = [];
    for (let i = 0; i < scope.varLinks.length; i += 1) {
      const varLink = scope.varLinks[i];
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

const maapForm = angular.module('maapForm', win.maapComponents);

/**
 * @typedef VarLinkJSON
 * @property {string} target - The target MAAP output.
 * @property {ExternalExeForm.VariableMatchingData} variable - The document link variable to bind.
 */

/**
 * Document var link option.
 */
class VarLink {
  /**
   * Constructs VarLink.
   *
   * @param {string} [target] - The target MAAP output.
   * @param {EMRALD.Variable['Variable']} [variable] - The document link variable to bind.
   */
  constructor(target, variable) {
    this.target = target;
    this.variable = variable;
  }

  /**
   * Creates a JSON representation of the var link.
   *
   * @returns {VarLinkJSON} The var link json.
   */
  toJSON() {
    /** @type {VarLinkJSON} */ const json = {
      target: this.target || '',
      variable: {
        id: -1,
        name: '',
      },
    };
    if (this.variable) {
      json.variable.id = this.variable.id;
      json.variable.name = this.variable.name;
    }
    return json;
  }
}

maapForm.controller('maapFormController', [
  '$scope',
  /**
   * The MAAP form controller.
   *
   * @param {Scope & angular.IScope} $scope - The angular scope.
   */
  function maapFormController($scope) {
    const form = new MAAPForm($scope);

    $scope.parameterFile = '';
    $scope.inputFile = '';
    $scope.parameters = [];
    $scope.initiators = [];
    $scope.initiatorOptions = [];
    $scope.exePath = '';
    $scope.parameterPath = '';
    $scope.inputPath = '';
    $scope.varLinks = [new VarLink()];
    $scope.parametersLoaded = false;
    $scope.blocks = [];
    $scope.operators = ['>', '<', 'IS'];
    $scope.tab = 'parameters';
    $scope.data = {
      initiatorQuery: '',
    };
    $scope.overrideSections = [];
    $scope.form = form;
    $scope.sections = [];
    $scope.possibleInitiators = {};

    const { parentScope } = form;
    $scope.variables = parentScope.data.cvVariables;
    $scope.exePath = parentScope.data.raLocation;
    $scope.docVars = parentScope.data.cvVariables.filter(
      (cvVariable) => cvVariable.varScope === 'gtDocLink',
    );
    /** @type {RAFormData} */
    // eslint-disable-next-line prefer-destructuring

    // Loads the existing data from the EMRALD project
    const raFormData = parentScope.data.raFormData;
    console.log(raFormData);
    if (raFormData) {
      if (typeof raFormData.parameterPath === 'string') {
        $scope.parameterPath = raFormData.parameterPath;
      }
      if (typeof raFormData.inputPath === 'string') {
        $scope.inputPath = raFormData.inputPath;
      }
      if (typeof raFormData.exePath === 'string') {
        $scope.exePath = raFormData.exePath;
      }
      if (raFormData.possibleInitiators) {
        $scope.possibleInitiators = {};
        raFormData.possibleInitiators.forEach((initiator) => {
          $scope.possibleInitiators[initiator] = {
            desc: initiator,
            index: 0,
            value: 'T',
          };
        });
      }
      if (typeof raFormData.varLinks === 'object') {
        $scope.varLinks = raFormData.varLinks.map(
          (varLink) =>
            new VarLink(varLink.target, form.findVariable(varLink.variable)),
        );
      }
      if (raFormData.comments) {
        $scope.comments = raFormData.comments;
      }
      if (raFormData.sections) {
        $scope.sections = raFormData.sections;
        raFormData.sections.forEach((section, i) => {
          if (
            section.type === 'block' &&
            section.blockType === 'PARAMETER CHANGE'
          ) {
            $scope.parameters = section.value
              .filter((v) => v.type !== 'comment')
              .map((v) => {
                if (v.useVariable) {
                  v.variable = form.findVariable(v.variable);
                }
                return v;
              });
          } else if (
            section.type === 'block' &&
            section.blockType === 'INITIATORS'
          ) {
            $scope.initiators = section.value;
          } else if (section.type === 'conditional_block') {
            /**
             * Binds the variable property of each block to the actual object reference.
             *
             * @param {import('maap-inp-parser').ConditionalBlockStatement} block The block to bind.
             */
            const bindBlockVars = (block) => {
              Object.values(block)
                .filter((val) => !!val)
                .forEach((val) => {
                  if (val.useVariable) {
                    block.variable = form.findVariable(val.variable);
                  } else if (typeof val === 'object') {
                    bindBlockVars(val);
                  }
                });
            };
            bindBlockVars(section);
            if ($scope.comments[i - 1]) {
              $scope.blocks.push($scope.comments[i - 1]);
            }
            $scope.blocks.push(section);
          }
        });
      }
    }

    $scope.removeInitiator = function removeInitiator(index) {
      const removed = $scope.initiators.splice(index, 1)[0];
      $scope.sections.forEach((section) => {
        if (section.type === 'block' && section.blockType === 'INITIATORS') {
          let i = -1;
          section.value.forEach((element, x) => {
            if (element.value === removed.value) {
              i = x;
            }
          });
          section.value.splice(i, 1);
        }
      });
      form.save();
    };

    $scope.findInitiators = function findInitiators() {
      if ($scope.data.initiatorQuery.length > 0) {
        $scope.initiatorOptions = [];
        Object.keys($scope.possibleInitiators).forEach((key) => {
          if (
            key
              .toUpperCase()
              .indexOf($scope.data.initiatorQuery.toUpperCase()) > -1
          ) {
            const choice = $scope.possibleInitiators[key];
            $scope.initiatorOptions.push({
              type: 'parameter_name',
              value: choice.desc,
            });
          }
        });
      }
    };

    /**
     * Adds an item to the initiator section.
     *
     * @param {import('maap-par-parser').MAAPParParserOutput} data The initiator to add.
     */
    $scope.addInitiator = function addInitiator(data) {
      // TODO?
      $scope.initiators.push({
        type: 'parameter_name',
        value: data.value,
      });
      $scope.sections.forEach((section) => {
        if (section.type === 'block' && section.blockType === 'INITIATORS') {
          section.value.push({
            type: 'parameter_name',
            value: data.value,
          });
        }
      });
      form.save();
    };

    $scope.addOutput = function addOutput() {
      $scope.varLinks.push(new VarLink());
      form.save();
    };

    $scope.removeOutput = function removeoutput(index) {
      $scope.varLinks.splice(index, 1);
      form.save();
    };

    $scope.extractName = function extractName(element) {
      /** @type {*} */ const v = element.value;
      if (
        typeof element.value === 'string' ||
        typeof element.value === 'boolean' ||
        typeof element.value === 'number' ||
        element.value === undefined
      ) {
        return `${element.value}`;
      }
      return $scope.extractName(v);
    };

    $scope.$watch('parameterFile', () => {
      if ($scope.parameterFile.length > 0) {
        $scope.parametersLoaded = true;
        $scope.parameterFile.split(/\n/).forEach((line) => {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data = maapParParser.parse(line);
              if (data.value === 'T') {
                $scope.possibleInitiators[data.desc] = data;
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
        $scope.overrideSections = [];
        $scope.parameters = [];
        $scope.initiators = [];
        $scope.blocks = [];
        $scope.sections = [];
        $scope.comments = [];
        /** @type {import('maap-inp-parser').MAAPInpParser} */
        const parser = maapInpParser.default;
        // Turning safeMode on will allow the file to fully parse even if there are syntax errors
        parser.options.safeMode = true;
        const parsed = parser.parse($scope.inputFile, {
          locations: true,
        });
        if (parsed.errors.length > 0) {
          // TODO: Notify of parsing errors
        }
        /** @type {import('maap-inp-parser').Comment[]} */
        parsed.output.value.forEach((sourceElement, i) => {
          if (sourceElement.type === 'comment') {
            $scope.comments[i] = sourceElement;
          }
          $scope.sections.push(sourceElement);
          switch (sourceElement.type) {
            case 'block':
              if (sourceElement.blockType === 'PARAMETER CHANGE') {
                $scope.overrideSections.push({
                  bounds: [
                    sourceElement.location.start.offset,
                    sourceElement.location.end.offset,
                  ],
                  data: $scope.parameters,
                });
                sourceElement.value.forEach((innerElement) => {
                  if (innerElement.type === 'assignment') {
                    $scope.parameters.push(innerElement);
                  } else {
                    // TODO
                  }
                });
              } else if (sourceElement.blockType === 'INITIATORS') {
                $scope.overrideSections.push({
                  bounds: [
                    // TODO: this offset will be off if the block is specified with just INITIATOR
                    sourceElement.location.start.offset,
                    sourceElement.location.end.offset,
                  ],
                  data: $scope.initiators,
                });
                $scope.initiators = $scope.initiators.concat(
                  sourceElement.value,
                );
              }
              break;
            case 'conditional_block':
              if ($scope.comments[i - 1]) {
                $scope.blocks.push($scope.comments[i - 1]);
              }
              $scope.blocks.push(sourceElement);
              $scope.overrideSections.push({
                bounds: [
                  sourceElement.location.start.offset,
                  sourceElement.location.end.offset,
                ],
                data: $scope.blocks.length - 1,
              });
              break;
            default:
          }
        });
        form.save();
      }
    });

    $scope.save = function save() {
      form.save();
    };

    $scope.changeText = function changeText(parameter) {
      parameter.changeText();
      form.save();
    };

    form.bindScope($scope);
  },
]);

maapForm.directive('fileModel', ['$parse', fileModel]);
