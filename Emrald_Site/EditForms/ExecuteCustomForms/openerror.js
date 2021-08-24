var openErrorForm = angular.module("openErrorForm", []);

class Condition {
  constructor(data) {
    this.name = data.name;
    this.comparison = data.comparison;
    this.value = data.value;
    this.hasOp = typeof data.op !== "undefined";
    this.op = data.op;
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
  constructor(data) {
    this.probability = data.probability;
    this.useVariable = false;
    this.then = data.then;
  }

  toString() {
    var outcomes = this.then
      .map((then) => {
        if (typeof then.value === "object") {
          if (then.value.op !== undefined) {
            return `(${then.name}'=${then.value.name}${then.value.op}${then.value.value})`;
          }
        }
        return `(${then.name}'=${then.value})`;
      })
      .join("&");
    if (this.useVariable) {
      return `"+${this.variable.name}+":${outcomes}`;
    }
    return `${this.probability}:${outcomes}`;
  }
}

class EPC {
  constructor(node) {
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
    this.then = parsed.then.map((then) => new Then(then));
  }

  toString() {
    var conditions = this.conditions
      .map((condition) => condition.toString())
      .join("");
    var outcomes = this.then.map((then) => then.toString()).join("+");
    return `${conditions}->${outcomes};`;
  }
}

class Element {
  constructor(node) {
    this.node = node;
    this.name = node.getAttribute("name");
    this.epcs = Array.from(node.getElementsByTagName("epc")).map(
      (epc) => new EPC(epc)
    );
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

var parentWindow = window.frameElement.ownerDocument.defaultView;

function GetDataObject($scope) {
  var dataObj = {
    data: {},
  };
  dataObj.data.raLocation = $scope.exePath;

  dataObj.varNames = [];
  $scope.elements.forEach((element) => {
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

  var model = $scope.model;
  $scope.elements.forEach((element) => {
    element.epcs.forEach((epc) => {
      epc.node.innerHTML = "";
      var text = model.createTextNode(epc.toString());
      epc.node.appendChild(text);
    });
  });
  function escape(str) {
    return str.replace(/([\"\\])/g, "\\$1");
  }
  var xml = escape(
    new XMLSerializer().serializeToString(model).replace(/[\n\t]/g, "")
  );
  dataObj.data.raPreCode = `System.IO.File.WriteAllText("./model_temp.xml", "${xml}");`;
  dataObj.data.raPreCode += `\nreturn "--model \\"./model_temp.xml\\" --method ${
    $scope.prismMethod
  } --target \\"${$scope.methodParam}\\" --prism \\"${escape(
    $scope.prismPath
  )}\\"`;
  dataObj.data.raPreCode += '";';
  dataObj.data.raPostCode =
    "List<String> retStates = new List<String>();\nreturn retStates;";

  return dataObj;
}

openErrorForm.controller("openErrorController", [
  "$scope",
  function ($scope) {
    $scope.model = null;
    $scope.modelFile = "";
    $scope.elements = [];
    $scope.failures = [];
    $scope.dataNodes = [];
    $scope.rows = [];
    $scope.prismPath = "";
    $scope.exePath = "";
    $scope.methodParam = "";
    $scope.prismMethod = null;
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

    $scope.$watch("modelFile", function () {
      $scope.model = new DOMParser().parseFromString(
        $scope.modelFile,
        "text/xml"
      );
      $scope.dataNodes = Array.from(
        $scope.model.getElementsByTagName("data")
      ).map((node) => new DataNode(node));
      $scope.elements = Array.from(
        $scope.model.getElementsByTagName("element")
      ).map((node) => new Element(node));
      $scope.failures = Array.from(
        $scope.model.getElementsByTagName("failure")
      ).map((node) => node.getAttribute("name"));
    });

    $scope.getDataValues = function (name) {
      return $scope.dataNodes.find((node) => node.name === name).values;
    };

    var parentScope = parentWindow.getScope();
    $scope.cvVariables = parentScope.data.cvVariables;
    $scope.exePath = parentScope.data.raLocation;

    $scope.save = function () {
      parentWindow.postMessage({
        type: "saveTemplate",
        payload: GetDataObject($scope),
      });
    };

    $scope.$watch("exePath", () => {
      var re = /[\/\\]/g;
      let lastIndex = 0;
      while (re.test($scope.exePath) == true) {
        lastIndex = re.lastIndex;
      }
      $scope.configFile = `${$scope.exePath.substring(0, lastIndex)}config.txt`;
      $scope.save();
    });
    $scope.$watch("configFile", $scope.save);
    $scope.$watch("prismMethod", $scope.save);
  },
]);

openErrorForm.directive("fileModel", ["$parse", fileModel]);
