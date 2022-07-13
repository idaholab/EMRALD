/**
 * @file OpenErrorPro form.
 */
// @ts-check
/* global PrismParser, ExternalExeForm, cast, fileModel */
/// <reference path="../lib/EditFormUtil.js" />
/// <reference path="../lib/ExternalExeForm.js" />

const openErrorForm = window.angular.module('openErrorForm', []);

/**
 * @namespace OpenErrorForm
 */

/**
 * @typedef OpenErrorForm.ConditionData
 * @property {string} name - The condition name.
 * @property {string} comparison - The condition comparison.
 * @property {string} value - The condition value.
 * @property {string} op - The condition prefix operator.
 */

/**
 * Represents a PRISM condition.
 */
class Condition {
  /**
   * Constructs Condition.
   *
   * @param {OpenErrorForm.ConditionData} data - The condition data.
   */
  constructor(data) {
    this.name = data.name;
    this.comparison = data.comparison;
    this.value = data.value;
    this.hasOp = typeof data.op !== 'undefined';
    this.op = data.op;
  }

  /**
   * Gets a text representation of the condition.
   *
   * @returns {string} The condition text.
   */
  get text() {
    let re = '';
    if (this.hasOp) {
      re += `${this.opName} `;
    }
    re += `${this.name} ${this.comparison} ${this.value}`;
    return re;
  }

  /**
   * Gets the condition operator as a word.
   *
   * @returns {string} The operator.
   */
  get opName() {
    if (this.op === '&') {
      return 'AND';
    }
    if (this.op === '|') {
      return 'OR';
    }
    return '';
  }

  /**
   * Creates a string representation of the condition.
   *
   * @returns {string} The string representation of the condition.
   */
  toString() {
    let re = '';
    if (this.hasOp) {
      re += `${this.op}`;
    }
    re += `(${this.name}${this.comparison}${this.value})`;
    return re;
  }
}

/**
 * @typedef OpenErrorForm.ThenObj
 * @property {{ op: string, name: string, value: string }} value - The parsed value.
 * @property {string} name - The name of the target.
 */

/**
 * @typedef OpenErrorForm.ThenData
 * @property {number | { variable: string }} probability - The probability of the outcome.
 * @property {OpenErrorForm.ThenObj[]} then - The outcome data.
 */

/**
 * Represents a PRISM outcome.
 */
class Then {
  /**
   * Constructs Then.
   *
   * @param {OpenErrorForm.ThenData} data - The outcome data.
   * @param {EMRALD.Variable['Variable'][]} cvVariables - EMRALD variables.
   * @param {EPC} epc - The containing EPC.
   */
  constructor(data, cvVariables, epc) {
    this.probability = data.probability;
    this.useVariable = false;
    this.epc = epc;
    const p = data.probability;
    if (typeof p === 'object' && p.variable) {
      this.useVariable = true;
      this.variable = cvVariables.find(
        (variable) => variable.name === p.variable,
      );
    }
    this.then = data.then;
    this.remaining = false;
    this.outcomes = this.then
      .map((then) => {
        if (typeof then.value === 'object') {
          if (then.value.op !== undefined) {
            // eslint-disable-next-line max-len
            return `(${then.name}'=${then.value.name}${then.value.op}${then.value.value})`;
          }
        }
        return `(${then.name}'=${then.value})`;
      })
      .join('&');
  }

  /**
   * Creates a string representation of the outcome.
   *
   * @param {Then[]} peers - Peer outcomes.
   * @returns {string} The string representation of the outcome.
   */
  toString(peers) {
    if (this.useVariable) {
      return `%%${this.variable.name}:${this.outcomes}`;
    }
    if (this.remaining) {
      const peerProbabilities = peers
        .map((then) => {
          if (then.useVariable) {
            return `-%%${then.variable.name}`;
          }
          if (!then.remaining) {
            return `-${then.probability}`;
          }
          return '';
        })
        .join('');
      return `1${peerProbabilities}:${this.outcomes}`;
    }
    return `${this.probability}:${this.outcomes}`;
  }
}

/**
 * PRISM EPC.
 */
class EPC {
  /**
   * Constructs an EPC.
   *
   * @param {Element} node - The XML node.
   * @param {EMRALD.Variable['Variable'][]} cvVariables - EMRALD project variables.
   */
  constructor(node, cvVariables) {
    this.node = node;
    this.raw = node.innerHTML;
    const parsed = PrismParser.parse(this.raw);
    if (typeof parsed.conditions === 'string') {
      this.conditions = [parsed.conditions === 'true'];
      this.hasConditions = false;
    } else {
      this.conditions = parsed.conditions.map(
        (condition) => new Condition(condition),
      );
      this.hasConditions = true;
    }
    this.then = parsed.then.map((then) => new Then(then, cvVariables, this));
    this.then[this.then.length - 1].remaining = true;
    this.modified = false;
  }

  /**
   * Gets the EPC label.
   *
   * @returns {string} The EPC label.
   */
  get label() {
    return this.conditions.map((condition) => condition.text).join(' ');
  }

  /**
   * Creates a string representation of the EPC.
   *
   * @returns {string} The string representation of the EPC.
   */
  toString() {
    const conditions = this.conditions
      .map((condition) => condition.toString())
      .join('');
    const outcomes = this.then
      .map((then) => then.toString(this.then))
      .join('+');
    return `${conditions}->${outcomes};`;
  }
}

/**
 * A model element.
 */
class ModelElement {
  /**
   * Constructs ModelElement.
   *
   * @param {Element} node - The XML node.
   * @param {EMRALD.Variable['Variable'][]} cvVariables - EMRALD project variables.
   */
  constructor(node, cvVariables) {
    this.node = node;
    this.name = node.getAttribute('name');
    this.epcs = Array.from(node.getElementsByTagName('epc')).map(
      (epc) => new EPC(epc, cvVariables),
    );
  }

  /**
   * Gets EPCs that have been modified.
   *
   * @returns {EPC[]} The modified EPCs.
   */
  getModified() {
    return this.epcs.filter((epc) => epc.modified === true);
  }
}

/**
 * A model data node.
 */
class DataNode {
  /**
   * Constructs DataNode.
   *
   * @param {Element} node - The XML node.
   */
  constructor(node) {
    this.name = node.getAttribute('name');
    const values = node.getAttribute('values');
    if (values !== null) {
      this.values = node.getAttribute('values').split(/,\s?/);
    } else {
      this.values = [];
    }
  }
}

/**
 * @typedef OpenErrorForm.VarLinkJSON
 * @property {EMRALD.Variable['Variable']} initialTime - The initial sim time.
 * @property {string} prismMethod - The target PRISM method.
 * @property {string} target - The target failure state.
 * @property {{ id: number, name: string }} variable The bound variable.
 */

/**
 * A project var link.
 */
class VarLink {
  /**
   * Constructs VarLink.
   *
   * @param {string} [prismMethod] - The name of the PRISM method to target.
   * @param {string} [target] - The name of the failure state to target.
   * @param {EMRALD.Variable['Variable']} [variable] - The document link variable to bind to.
   * @param {EMRALD.Variable['Variable']} [initialTime] - The initial sim time.
   */
  constructor(prismMethod, target, variable, initialTime) {
    this.prismMethod = prismMethod;
    this.target = target;
    this.variable = variable;
    this.initialTime = initialTime;
  }

  /**
   * Creates a JSON representation of the var link.
   *
   * @returns {OpenErrorForm.VarLinkJSON} The JSON object.
   */
  toJSON() {
    const json = {
      initialTime: this.initialTime,
      prismMethod: this.prismMethod,
      target: this.target,
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

/**
 * @typedef OpenErrorForm.Scope
 * @property {string} exePath - The path to the OpenError executeable.
 * @property {ModelElement[]} elements - The model elements.
 * @property {VarLink[]} varLinks - The var links.
 * @property {string} fileName - The name of the model file.
 * @property {string} prismPath - Path to the PRISM installation.
 * @property {boolean} hasModel - If a model has been loaded.
 * @property {string} modelFile - Contents of the uploaded model file.
 * @property {XMLDocument} model - Parsed model file.
 * @property {string[]} failures - Possible failure modes.
 * @property {DataNode[]} dataNodes - Data nodes.
 * @property {string[]} prismMethods - PRISM method options.
 * @property {ModelElement} addElement - The element being added.
 * @property {EPC} addCondition - The condition being added.
 * @property {EMRALD.Variable['Variable'][]} cvVariables - EMRALD project variables.
 * @property {EMRALD.Variable['Variable'][]} docVars - Document link variables.
 * @property {EPC[]} modified - Modified EPCs.
 * @property {() => void} save - Saves the form data.
 * @property {() => void} addOutput - Adds a doc link variable output.
 * @property {(index: number) => void} removeOutput - Removes the doc link output at the specified index.
 * @property {() => void} addOutcome - Adds an outcome.
 * @property {(index: number) => void} removeOutcome - Removes the given outcome.
 * @property {() => any[]} getDataValues - Gets the values out of the data nodes.
 * @property {(target: EPC) => void} setModified - Sets the given EPC as modified.
 * @property {(name: string) => any[]} getValuesByNodeName - Gets the data values of the given node name.
 * @property {() => Condition[]} getConditionDisplay - Gets the conditions that should be displayed.
 */

/**
 * The OpenError custom form.
 */
class OpenErrorForm extends ExternalExeForm {
  /**
   * @inheritdoc
   */
  getDataObject() {
    /** @type {ExternalExeForm.DataObject} */ const dataObj = {};
    /** @type {OpenErrorForm.Scope} */ let s;
    const scope = cast(this.$scope, s);
    dataObj.raLocation = scope.exePath;

    dataObj.varNames = [];
    scope.elements.forEach((element) => {
      element.epcs.forEach((epc) => {
        epc.then.forEach((outcome) => {
          if (
            outcome.useVariable
            && dataObj.varNames.indexOf(outcome.variable.name) < 0
          ) {
            dataObj.varNames.push(outcome.variable.name);
          }
        });
      });
    });
    scope.varLinks.forEach((varLink) => {
      if (varLink.variable) {
        if (dataObj.varNames.indexOf(varLink.variable.name) < 0) {
          dataObj.varNames.push(varLink.variable.name);
        }
      }
      if (varLink.initialTime) {
        if (dataObj.varNames.indexOf(varLink.initialTime.name) < 0) {
          dataObj.varNames.push(varLink.initialTime.name);
        }
      }
    });

    const modified = [];
    const { model } = scope;
    let i = 0;
    scope.elements.forEach((element, x) => {
      element.epcs.forEach((epc, y) => {
        scope.elements[x].epcs[y].node.innerHTML = '';
        const text = model.createTextNode(epc.toString());
        epc.node.appendChild(text);
        if (epc.modified) {
          modified.push(i);
        }
        i += 1;
      });
    });
    /**
     * Escpaes quotes in a string.
     *
     * @param {string} str - The string to escape.
     * @returns {string} The escaped string.
     */
    function escape(str) {
      return str.replace(/(["\\])/g, '\\$1');
    }
    if (model) {
      let xml = escape(
        new XMLSerializer().serializeToString(model).replace(/[\n\t]/g, ''),
      );
      dataObj.varNames.forEach((varName) => {
        xml = xml.replace(new RegExp(`%%${varName}`, 'g'), `"+${varName}+"`);
      });
      dataObj.raFormData = {
        model: xml,
        modelName: scope.fileName,
        modified,
        // prismParam: scope.methodParam,
        prismPath: scope.prismPath,
        varLinks: scope.varLinks.map((varLink) => varLink.toJSON()),
      };
      const exeRootPath = scope.exePath.replace(/[^/\\]*\.exe$/, '');
      const resultsPath = `${exeRootPath}results.json`;
      const modelPath = `${exeRootPath}model.xml`;
      dataObj.raPreCode = `System.IO.File.WriteAllText("${escape(
        modelPath,
      )}", "${xml}");return "--model \\"${escape(
        modelPath,
      )}\\" --method ${scope.varLinks
        .map((varLink) => varLink.prismMethod)
        .join(' ')} --target ${scope.varLinks
        .map((varLink) => `\\"${varLink.target}\\"`)
        .join(' ')} --step-range ${scope.varLinks
        .map((varLink) => {
          let stepRange = '0:10:100';
          if (varLink.initialTime) {
            stepRange = `"+${varLink.initialTime.name}+":"+CurTime+"`;
          }
          return `\\"${stepRange}\\"`;
        })
        .join(' ')} --prism \\"${escape(
        scope.prismPath,
      )}\\" --results \\"${escape(resultsPath)}\\"";`;
      dataObj.raPostCode = '';
      dataObj.returnProcess = 'rtNone';
      dataObj.variables = [];
      for (i = 0; i < scope.varLinks.length; i += 1) {
        dataObj.variables.push({
          ...scope.varLinks[i].variable,
          docLink: `$.output[${i}].result`,
          docPath: resultsPath,
          docType: 'dtJSON',
          pathMustExist: false,
          type: 'double',
        });
      }
    }
    return dataObj;
  }
}

const form = new OpenErrorForm();

openErrorForm.controller('openErrorController', [
  '$scope',
  /**
   * OpenError controller.
   *
   * @param {OpenErrorForm.Scope & angular.IScope} $scope - The angular scope.
   */
  function openErrorController($scope) {
    $scope.hasModel = false;
    $scope.model = null;
    $scope.modelFile = '';
    $scope.elements = [];
    $scope.failures = [];
    $scope.dataNodes = [];
    $scope.prismPath = '';
    $scope.exePath = '';
    $scope.prismMethods = [
      'compute_execution_time',
      'compute_P_single',
      'compute_MTTF',
      'compute_P',
      'compute_N_failures',
      'compute_downtime',
      'compute_repetitions',
      'compute_sub_models_and_repetitions_for_element',
      'compute_sub_models_and_repetitions',
    ];
    $scope.addElement = null;
    $scope.addCondition = null;
    $scope.varLinks = [new VarLink()];
    $scope.docVars = [];
    $scope.modified = [];

    /**
     * Parses the XML model.
     *
     * @param {string} xml - The raw XML file.
     */
    function parseModel(xml) {
      try {
        $scope.model = new DOMParser().parseFromString(
          xml.replace(/\\"/g, '"'),
          'text/xml',
        );
        $scope.dataNodes = Array.from(
          $scope.model.getElementsByTagName('data'),
        ).map((node) => new DataNode(node));
        $scope.elements = Array.from(
          $scope.model.getElementsByTagName('element'),
        ).map((node) => new ModelElement(node, $scope.cvVariables));
        $scope.failures = Array.from(
          $scope.model.getElementsByTagName('failure'),
        ).map((node) => node.getAttribute('name'));
        $scope.hasModel = true;
      } catch (err) {
        console.error('Could not parse model file!');
        throw err;
      }
    }

    $scope.$watch('modelFile', () => {
      if ($scope.modelFile.length > 0) {
        parseModel($scope.modelFile);
      }
    });

    $scope.getDataValues = function getDataValues(name) {
      return $scope.dataNodes.find((node) => node.name === name).values;
    };

    const { parentScope } = form;
    // $scope.modified =
    $scope.cvVariables = parentScope.data.cvVariables;
    $scope.docVars = parentScope.data.cvVariables.filter(
      (cvVariable) => cvVariable.varScope === 'gtDocLink',
    );
    $scope.exePath = parentScope.data.raLocation;
    if (parentScope.data.raFormData) {
      if (
        parentScope.data.raFormData.model
        && parentScope.data.raFormData.model.length > 0
      ) {
        parseModel(parentScope.data.raFormData.model);
        $scope.fileName = parentScope.data.raFormData.modelName;
        $scope.prismPath = parentScope.data.raFormData.prismPath;
        $scope.varLinks = parentScope.data.raFormData.varLinks.map(
          (data) => new VarLink(
            data.prismMethod,
            data.target,
            form.findVariable(data.variable),
            form.findVariable(data.initialTime || {}),
          ),
        );
      }
    }

    $scope.save = function save() {
      form.save();
    };

    // TODO: validate inputs
    $scope.addOutput = function addOutput() {
      $scope.varLinks.push(new VarLink());
    };

    $scope.removeOutput = function removeOutput(index) {
      $scope.varLinks.splice(index, 1);
    };

    $scope.addOutcome = function addOutcome() {
      $scope.addCondition.then.splice(
        $scope.addCondition.then.length - 1,
        0,
        new Then(
          {
            probability: 1,
            then: [],
          },
          $scope.cvVariables,
          $scope.addCondition,
        ),
      );
    };

    $scope.removeOutcome = function removeOutcome(index) {
      $scope.addCondition.then.splice(index, 1);
      $scope.setModified($scope.addCondition);
    };

    $scope.getValuesByNodeName = function getValuesByNodeName(name) {
      return $scope.dataNodes.find((node) => node.name === name).values;
    };

    $scope.getConditionDisplay = function getConditionDisplay() {
      let re = [];
      if ($scope.addCondition !== null) {
        re = re.concat($scope.addCondition.then);
      }
      $scope.elements.forEach((element) => {
        re = re.concat(
          element
            .getModified()
            .map((epc) => epc.then[0])
            .filter((then) => then !== re[0]),
        );
      });
      return re;
    };

    $scope.setModified = function setModified(epc) {
      epc.modified = true;
      form.save();
    };

    form.bindScope($scope);
  },
]);

openErrorForm.directive('fileModel', ['$parse', fileModel]);
