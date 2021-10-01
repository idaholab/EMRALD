var openErrorForm = angular.module("openErrorForm", []);

class Condition {
  constructor(data) {
    this.name = data.name;
    this.comparison = data.comparison;
    this.value = data.value;
    this.hasOp = typeof data.op !== "undefined";
    this.op = data.op;
  }

  get text() {
    var re = "";
    if (this.hasOp) {
      re += `${this.opName} `;
    }
    re += `${this.name} ${this.comparison} ${this.value}`;
    return re;
  }

  get opName() {
    if (this.op === "&") {
      return "AND";
    }
    if (this.op === "|") {
      return "OR";
    }
  }

  toString() {
    var re = "";
    if (this.hasOp) {
      re += `${this.op}`;
    }
    re += `(${this.name}${this.comparison}${this.value})`;
    return re;
  }
}

class Then {
  constructor(data, cvVariables, epc) {
    this.probability = data.probability;
    this.useVariable = false;
    this.epc = epc;
    if (typeof data.probability === "object" && data.probability.variable) {
      this.useVariable = true;
      this.variable = cvVariables.find(
        (variable) => variable.name === data.probability.variable
      );
    }
    this.then = data.then;
    this.remaining = false;
    this.outcomes = this.then
      .map((then) => {
        if (typeof then.value === "object") {
          if (then.value.op !== undefined) {
            return `(${then.name}'=${then.value.name}${then.value.op}${then.value.value})`;
          }
        }
        return `(${then.name}'=${then.value})`;
      })
      .join("&");
  }

  toString(peers) {
    if (this.useVariable) {
      return `"+${this.variable.name}+":${this.outcomes}`;
    }
    if (this.remaining) {
      var peerProbabilities = peers
        .map((then) => {
          if (then.useVariable) {
            return `-"+${then.variable.name}+"`;
          } else if (!then.remaining) {
            return `-${then.probability}`;
          }
        })
        .join("");
      return `1${peerProbabilities}:${this.outcomes}`;
    }
    return `${this.probability}:${this.outcomes}`;
  }
}

class EPC {
  constructor(node, cvVariables) {
    this.node = node;
    this.raw = node.innerHTML;
    const parsed = PrismParser.parse(this.raw);
    if (typeof parsed.conditions === "string") {
      this.conditions = [parsed.conditions === "true"];
      this.hasConditions = false;
    } else {
      this.conditions = parsed.conditions.map(
        (condition) => new Condition(condition)
      );
      this.hasConditions = true;
    }
    this.then = parsed.then.map((then) => new Then(then, cvVariables, this));
    this.then[this.then.length - 1].remaining = true;
    this.modified = false;
  }

  get label() {
    return this.conditions.map((condition) => condition.text).join(" ");
  }

  toString() {
    var conditions = this.conditions
      .map((condition) => condition.toString())
      .join("");
    var outcomes = this.then.map((then) => then.toString(this.then)).join("+");
    return `${conditions}->${outcomes};`;
  }
}

class Element {
  constructor(node, cvVariables) {
    this.node = node;
    this.name = node.getAttribute("name");
    this.epcs = Array.from(node.getElementsByTagName("epc")).map(
      (epc) => new EPC(epc, cvVariables)
    );
  }

  getModified() {
    return this.epcs.filter((epc) => epc.modified === true);
  }
}

class DataNode {
  constructor(node) {
    this.name = node.getAttribute("name");
    var values = node.getAttribute("values");
    if (values !== null) {
      this.values = node.getAttribute("values").split(/,\s?/);
    } else {
      this.values = [];
    }
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
      prismMethod: this.prismMethod,
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

class OpenErrorForm extends ExternalExeForm {
  getDataObject() {
    var dataObj = {};
    dataObj.raLocation = this.$scope.exePath;

    dataObj.varNames = [];
    this.$scope.elements.forEach((element) => {
      element.epcs.forEach((epc) => {
        epc.then.forEach((outcome) => {
          if (
            outcome.useVariable &&
            dataObj.varNames.indexOf(outcome.variable.name) < 0
          ) {
            dataObj.varNames.push(outcome.variable.name);
          }
        });
      });
    });
    this.$scope.varLinks.forEach((varLink) => {
      if (varLink.variable) {
        if (dataObj.varNames.indexOf(varLink.variable.name) < 0) {
          dataObj.varNames.push(varLink.variable.name);
        }
      }
    });

    var modified = [];
    var model = this.$scope.model;
    var i = 0;
    this.$scope.elements.forEach((element) => {
      element.epcs.forEach((epc) => {
        epc.node.innerHTML = "";
        var text = model.createTextNode(epc.toString());
        epc.node.appendChild(text);
        if (epc.modified) {
          modified.push(i);
        }
        i += 1;
      });
    });
    function escape(str) {
      return str.replace(/([\"\\])/g, "\\$1");
    }
    if (model) {
      var xml = escape(
        new XMLSerializer().serializeToString(model).replace(/[\n\t]/g, "")
      );
      dataObj.raFormData = {
        model: xml,
        prismPath: this.$scope.prismPath,
        varLinks: this.$scope.varLinks.map((varLink) => varLink.toJSON()),
        prismParam: this.$scope.methodParam,
        modified,
      };
      dataObj.raPreCode = `System.IO.File.WriteAllText("./model_temp.xml", "${xml}");`;
      dataObj.raPreCode += `\nreturn "--model \\"./model_temp.xml\\" --method ${this.$scope.varLinks
        .map((varLink) => varLink.prismMethod)
        .join(" ")} --target ${this.$scope.varLinks
        .map((varLink) => `\\"${varLink.target}\\"`)
        .join(" ")} --prism \\"${escape(this.$scope.prismPath)}\\"`;
      dataObj.raPreCode += '";';
      dataObj.raPostCode = "";
      dataObj.returnType = "rtNone";
      dataObj.variables = [];
      for (var i = 0; i < this.$scope.varLinks.length; i += 1) {
        dataObj.variables.push({
          ...this.$scope.varLinks[i].variable,
          docType: "dtJSON",
          docLink: `$.output[${i}].result`,
          docPath: "./results.json",
          type: "double",
        });
      }
    }
    return dataObj;
  }
}

var form = new OpenErrorForm();

openErrorForm.controller("openErrorController", [
  "$scope",
  function ($scope) {
    $scope.hasModel = false;
    $scope.model = null;
    $scope.modelFile = "";
    $scope.elements = [];
    $scope.failures = [];
    $scope.dataNodes = [];
    $scope.rows = [];
    $scope.prismPath = "";
    $scope.exePath = "";
    $scope.prismMethods = [
      "compute_execution_time",
      "compute_P_single",
      "compute_MTTF",
      "compute_P",
      "compute_N_failures",
      "compute_downtime",
      "compute_repetitions",
      "compute_sub_models_and_repetitions_for_element",
      "compute_sub_models_and_repetitions",
    ];
    $scope.addElement = null;
    $scope.addCondition = null;
    $scope.varLinks = [new VarLink()];
    $scope.docVars = [];
    $scope.modified = [];

    function parseModel(xml) {
      $scope.model = new DOMParser().parseFromString(
        xml.replace(/\\"/g, '"'),
        "text/xml"
      );
      $scope.dataNodes = Array.from(
        $scope.model.getElementsByTagName("data")
      ).map((node) => new DataNode(node));
      $scope.elements = Array.from(
        $scope.model.getElementsByTagName("element")
      ).map((node) => new Element(node, $scope.cvVariables));
      $scope.failures = Array.from(
        $scope.model.getElementsByTagName("failure")
      ).map((node) => node.getAttribute("name"));
      $scope.hasModel = true;
    }

    $scope.$watch("modelFile", function () {
      if ($scope.modelFile.length > 0) {
        parseModel($scope.modelFile);
      }
    });

    $scope.getDataValues = function (name) {
      return $scope.dataNodes.find((node) => node.name === name).values;
    };

    var { parentScope } = form;
    // $scope.modified =
    $scope.cvVariables = parentScope.data.cvVariables;
    $scope.docVars = parentScope.data.cvVariables.filter(
      (cvVariable) => cvVariable.varScope === "gtDocLink"
    );
    $scope.exePath = parentScope.data.raLocation;
    if (parentScope.data.raFormData) {
      if (
        parentScope.data.raFormData.model &&
        parentScope.data.raFormData.model.length > 0
      ) {
        parseModel(parentScope.data.raFormData.model);
        $scope.prismPath = parentScope.data.raFormData.prismPath;
        $scope.varLinks = parentScope.data.raFormData.varLinks.map(
          (data) =>
            new VarLink(
              data.prismMethod,
              data.target,
              form.findVariable(data.variable)
            )
        );
      }
    }

    $scope.save = function () {
      form.save();
    };

    // TODO: validate inputs
    $scope.addOutput = function () {
      $scope.varLinks.push(new VarLink());
    };

    $scope.removeOutput = function (index) {
      $scope.varLinks.splice(index, 1);
    };

    $scope.addOutcome = function () {
      $scope.addCondition.then.splice(
        $scope.addCondition.then.length - 1,
        0,
        new Then(
          {
            probability: 1,
            then: [],
          },
          $scope.cvVariables,
          $scope.addCondition
        )
      );
    };

    $scope.removeOutcome = function (index) {
      $scope.addCondition.then.splice(index, 1);
      $scope.setModified($scope.addCondition);
    };

    $scope.getValuesByNodeName = function (name) {
      return $scope.dataNodes.find((node) => node.name === name).values;
    };

    $scope.getConditionDisplay = function () {
      var re = [];
      if ($scope.addCondition !== null) {
        re = re.concat($scope.addCondition.then);
      }
      $scope.elements.forEach((element) => {
        re = re.concat(
          element
            .getModified()
            .map((epc) => epc.then[0])
            .filter((then) => then !== re[0])
        );
      });
      return re;
    };

    $scope.setModified = function (epc) {
      epc.modified = true;
      form.save();
    };

    form.bindScope($scope);
  },
]);

openErrorForm.directive("fileModel", ["$parse", fileModel]);
