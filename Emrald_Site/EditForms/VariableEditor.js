// Copyright 2021 Battelle Energy Alliance

var isDirty = false;
function isModified() {
  return isDirty;
}

function setAsNewChecked() {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  var btn = parent.document.getElementById("btn_OK");
  if (scope.saveAsNew) {
    btn.innerHTML = "Save As New";
  }
  else {
    btn.innerHTML = "OK";
  }
}

function ValidateData() {
  return "";
}

function setModified(state) {
  isDirty = state;
}

function loadNamePatterns() {
    var scope = angular.element(document.querySelector('#variableControllerPanel')).scope();
    fetch('../resources/DefaultNamingPatterns.json')
        .then(res => res.json())
        .then(json => {
            scope.namingPatterns = json.VariableTypes;
            updateName();
            scope.$apply();
        });
}

function updateName() {
    var scope = angular.element(document.querySelector('#variableControllerPanel')).scope();
    if (!nameIsDefaultValue()) {
        return;
    }
    scope.name = scope.namingPatterns.find(x => x.Type === scope.varType).NamePattern;
}

function nameIsDefaultValue() {
    var scope = angular.element(document.querySelector('#variableControllerPanel')).scope();
    if (scope.name === '') {
        return true;
    }
    var result = false;
    scope.namingPatterns.forEach(defaultName => {
        if (scope.name === defaultName.NamePattern) {
            result = true;
            return;
        }
    })
    return result;
}

function typeSelection(useDefaultValue = true) {
  var typeVal = document.getElementById("typeVal");
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  switch (typeVal.selectedIndex) {
    case 0: //int
      if (useDefaultValue) {
        scope.data.value = 0;
      }
      scope.intTypeSelected = true;
      scope.doubleTypeSelected = false;
      scope.boolTypeSelected = false;
      scope.stringTypeSelected = false;
      break;
    case 1://double
      if (useDefaultValue) {
        scope.data.value = 0.0;
      }
      scope.intTypeSelected = false;
      scope.doubleTypeSelected = true;
      scope.boolTypeSelected = false;
      scope.stringTypeSelected = false;
      break;
    case 2://bool
      if (useDefaultValue && scope.varScope !== "gtDocLink") { //only change if it is not a document link variable
        scope.data.value = scope.varBoolVal[0];
      }
      scope.intTypeSelected = false;
      scope.doubleTypeSelected = false;
      scope.boolTypeSelected = true;
      scope.stringTypeSelected = false;
      break;
    case 3://string
      if (useDefaultValue) {
        scope.data.value = "";
      }
      scope.intTypeSelected = false;
      scope.doubleTypeSelected = false;
      scope.boolTypeSelected = false;
      scope.stringTypeSelected = true;
      break;

  }
}


//inline filter for number entry.  support scientific notation as well.
function validateName(elt) { // Called when focus is lost
  var name = elt.value; //.substring(0, elt.selectionStart) + evt.key + elt.value.substring(elt.selectionStart, elt.value.length);
  var letters = /^[a-zA-Z_][0-9a-zA-Z_]*$/;
  if (name.match(letters)) {
    elt.style.color = "black";

    displayErrorMessage(false, "");
    var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
    UpdateFrameTitle("Variable: " + name);
    scope.$apply(function () {
      scope.data.sim3DId = name;
    });
    return true;
  }
  else {
    elt.style.color = "red";
    setTimeout(function () { elt.focus(); }, 20);

    displayErrorMessage(true, "Error: variable name must be valid C# name.");
    return false;
  }
}

function validateValue() {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  var valid = false;
  if (scope.intTypeSelected) {
    if (typeof (scope.data.value) === "number" && scope.data.value.toString().match(/^-?[0-9]*$/)) {
      valid = true;
    }
  }
  else if (scope.doubleTypeSelected) {
    if (typeof (scope.data.value) === "number" && scope.data.value.toString().match(/^-?[0-9]*.[0-9]*$/)) {
      valid = true;
    }
  }
  else if (scope.boolTypeSelected) {
    if (typeof (scope.data.value) === "boolean") {
      valid = true;
    }
  }
  else if (scope.stringTypeSelected) {
    if (typeof (scope.data.value) === "string") {
      valid = true;
    }
  }

  displayErrorMessage(!valid, "Error: Value is invalid for the selected Variable Type.");

  somethingChanged();
}


function displayErrorMessage(display, message) {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
    if (scope.data.showErrorMessage !== display) {
        scope.data.showErrorMessage = display;
        scope.data.errorMessage = message;
        var btn = parent.document.getElementById("btn_OK");
        btn.disabled = display;
    }
}


var variableData = null;
function OnLoad(dataObj) {
  loadNamePatterns();
  variableData = dataObj || {};
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();

  UpdateFrameTitle("Variable: " + dataObj.name);
  scope.$apply(function () {
    scope.id = variableData.id;
    scope.dbID = variableData.dbID;
    scope.name = variableData.name;
    scope.desc = variableData.desc;
    if (typeof variableData.resetOnRuns !== "undefined") {
      scope.data.resetOnRuns = variableData.resetOnRuns;
    }

    if (scope.varScopes && scope.varScopes.length > 0) {
      var aInst = scope.varScopes.find(function (vscope) {
        return (vscope.value == variableData.varScope);
      });

      if (aInst) {
        scope.varScope = aInst;
      }
    }


    scope.data.value = variableData.value;
    if (variableData.type)
      scope.varType = variableData.type;
    switch (scope.varScope.value) {
      case "gtGlobal":
        //nothing special
        break;
      case "gt3DSim":
        scope.data.sim3DId = variableData.sim3DId;
        break;
      case "gtDocLink":
        scope.data.resetOnRuns = false;
        scope.data.docPath = variableData.docPath;
        scope.data.varLink = variableData.docLink;
        scope.data.value = variableData.value;
        scope.data.resetOnRuns = ((typeof dataObj.pathMustExist === "undefined") ? true : dataObj.pathMustExist);
        if (variableData.docType != null) {
          var aInst = scope.docTypes.find(function (dType) {
            return (dType.value == variableData.docType);
          });

          if (aInst) {
            scope.data.docType = aInst;
          }

          //for regular expression items
          if (scope.data.docType.value == "dtTextRegEx") {
            scope.data.useRegExLine = (variableData.regExpLine >= 0); // checked if a line is specified
            scope.data.useRegExNumChars = (variableData.numChars >= 0); //checked if not null
            scope.data.regExLine = variableData.regExpLine;
            scope.data.regExBegPos = variableData.begPosition;
            scope.data.regExNumChars = variableData.numChars;
          }
        }
        break;
      case "gtAccrual":
        scope.accrualStatesData = variableData.accrualStatesData;
        break;
    }
    handleVarScopeChanged();    
  });

  scope.$apply(() => {
    typeSelection(false);
    validateValue();
  });
  
  //hide "save as new" if it is a new item
  var sanElement = document.getElementById("AsNewItem");
  var sanText = document.getElementById("AsNewItemText");
  if ((dataObj.id < 0) && (sanElement.style.display != "none")) {
    sanElement.style.display = "none";
    sanText.style.display = "none";
  } else {
	sanElement.style.display = "";
  }

  // Enable "State" Drag-and-Drop for Accrual Variable
  var dragAndDropDiv = document.getElementById("accrualStates");
  dragAndDropDiv.ondragover = function (evt) {
    var isState = false;
    for (var i = 0; i < evt.dataTransfer.types.length; i++) {
      var type = evt.dataTransfer.types[i].toLowerCase();
      if (type === "states") {
        isState = true;
        break;
      }
    }
    if (isState) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }.bind(dragAndDropDiv);

  dragAndDropDiv.ondrop = function (evt) {
    var varObj = evt.dataTransfer.getData("states");
    varObj = JSON.parse(varObj);
    scope.$apply(function () {
      var found = false;
      for (var i = 0; i < scope.accrualStatesData.length; i++) {
        if (scope.accrualStatesData[i].stateName === varObj.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        var accrualStateData = {
          stateName: varObj.name,
          type: scope.accrualRateType.value,
          accrualMult: 1.0,
          multRate: scope.accrualUnit.value,
          accrualTable: []
        }
        scope.accrualStatesData ? scope.accrualStatesData.push(accrualStateData) : scope.accrualStatesData = [accrualStateData];
      }
    });
  }
}

function GetDataObject() {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  var dataObj = scope.saveAsNew ? {} : variableData;
  
  dataObj.name = scope.name;
  dataObj.desc = scope.desc;
  dataObj.varScope = scope.varScope.value;
  if (dataObj.varScope === "gtDocLink") {
    dataObj.value = scope.data.value;
    dataObj.docLink = scope.data.varLink;
    dataObj.docType = scope.data.docType.value;
    dataObj.docPath = scope.data.docPath;
    dataObj.pathMustExist = scope.data.resetOnRuns;
    if (scope.data.docType.value == "dtTextRegEx") {
      //set the extra regExp options to not used unless checked
      dataObj.regExpLine = -1;
      dataObj.begPosition = 0;
      dataObj.numChars = -1;

      //Assign if checked 
      if (scope.data.useRegExLine) {
        dataObj.regExpLine = scope.data.regExLine;
        dataObj.begPosition = scope.data.regExBegPos;
      }
      if (scope.data.useRegExLine && scope.data.useRegExNumChars) {
        dataObj.numChars = scope.data.regExNumChars;
      }
    }
  }
  else if (dataObj.varScope === "gtAccrual")
  {
    dataObj.value = scope.data.value;
    dataObj.accrualStatesData = SortAccrualTables(scope.accrualStatesData);
	}
  else {
    dataObj.value = scope.data.value;
    dataObj.resetOnRuns = scope.data.resetOnRuns;
  }

  dataObj.type = scope.varType;

  //TODO: check if the id is being used multiple times + add warning
  if (dataObj.varScope == "gt3DSim")
    dataObj.sim3DId = scope.data.sim3DId;
  return dataObj;
}

function SortAccrualTables(states) {
  for (var i = 0; i < states.length; i++) {
    states[i].accrualTable.sort((a, b) => a[0] > b[0] ? 1 : -1);
  }
  return states;
}

function OnSave() {
  isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
  OnLoad(dataObj);
}

function somethingChanged() {
  isDirty = true;
  if (typeof UpdateBttns === "function")
    UpdateBttns();
}

function handleDocTypeChange(newV, oldV) {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();

  switch (scope.data.docType.value) {
    case "dtXML":
    case "dtJSON":
//      setVarType("", true);
      break;
    case "dtTextRegEx":
//     setVarType("string", false);
      break;
  }
}

function setVarType(varType, enabled)
{
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  switch (varType) {
    case "int":
    case 0:
      scope.varType = "int";
      break;
    case "double":
    case 1:
      scope.varType = "double";
      break;
    case "bool":
    case 2:
      scope.varType = "bool";
      break;
    case "string":
    case 3:
      scope.varType = "string";
      break;
  }

  scope.varTypeSelectionEnabled = enabled;

}

function handleVarScopeChanged(newV, oldV) {
  var scope = angular.element(document.querySelector("#variableControllerPanel")).scope();
  
  switch (scope.varScope.value) {
    case "gtGlobal":
      setVarType("", true);
      scope.accrualScopeSelected = false;
      scope.extSimVariableScopeSelected = false;
      scope.globalScopeSelected = true;
      scope.documentLinkScopeSelected = false;
      break;
    case "gt3DSim":
      setVarType("", true);
      scope.accrualScopeSelected = false;
      scope.extSimVariableScopeSelected = true;
      scope.globalScopeSelected = false;
      scope.documentLinkScopeSelected = false;
      break;
    case "gtDocLink":
      setVarType("", true);
      scope.accrualScopeSelected = false;
      scope.extSimVariableScopeSelected = false;
      scope.globalScopeSelected = false;
      scope.documentLinkScopeSelected = true;
      handleDocTypeChange();
      break;
    case "gtAccrual":
      setVarType("double", false);
      scope.accrualScopeSelected = true;
      scope.extSimVariableScopeSelected = false;
      scope.globalScopeSelected = false;
      scope.documentLinkScopeSelected = false;
      break;
  }
 
  somethingChanged();
}

var variableModule = angular.module("variableModule", []);
variableModule.controller("variableController", ["$scope", function ($scope) {
  $scope.name = "";
  $scope.namingPatterns = [];
  $scope.desc = "";

  $scope.docTypes = [
    { name: "XML", value: "dtXML" },
    { name: "JSON", value: "dtJSON" },
    { name: "Text RegEx", value: "dtTextRegEx" }
  ];

  $scope.data = {
    value: "",
    resetOnRuns: true,
    docType: $scope.docTypes[0],
    docPath: "",
    varLink: "",
    
    useRegExLine: false,
    regExLine: -1,
    regExBegPos: 0,
    useRegExNumChars: false,
    regExNumChars: -1,

    sim3DId: "",

    showErrorMessage: false,
    errorMessage: "test"
};

  $scope.varScopes = [
    { name: "Global", value: "gtGlobal" },
    { name: "Ext Sim Variable", value: "gt3DSim" },
    { name: "Document Link", value: "gtDocLink" },
    { name: "Accrual", value: "gtAccrual"}
  ];
  $scope.varScope = $scope.varScopes[0];
  $scope.varTypes = ["int", "double", "bool", "string"];
  $scope.varBoolVal = [true, false];
  $scope.varType = $scope.varTypes[0];
  $scope.saveAsNew = false;

  $scope.$watch("name", function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
  $scope.$watch("desc", function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
  $scope.$watch("varType", function (newV, oldV) { if (newV !== oldV) { somethingChanged(); updateName(); } });
  $scope.$watch("varScope", function (newV, oldV) { if (newV !== oldV) handleVarScopeChanged(newV, oldV); });
  $scope.$watch("data.value", function (newV, oldV) { if (newV !== oldV) validateValue(); });
  $scope.$watch("data.sim3DId", function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
  $scope.$watch("data.docType", function (newV, oldV) { if (newV !== oldV) handleDocTypeChange(); });

  $scope.accrualScopeSelected= false;
  $scope.extSimVariableScopeSelected = false;
  $scope.globalScopeSelected = false;
  $scope.documentLinkScopeSelected = false;

  $scope.intTypeSelected = false;
  $scope.doubleTypeSelected = false;
  $scope.boolTypeSelected = false;
  $scope.stringTypeSelected = false;

  $scope.varTypeSelectionEnabled = true;


  $scope.accrualStatesData = [];
  $scope.accrualRateTypes = [
    { name: "Static", default: true, value: "ctMultiplier" },
    { name: "Dynamic", default: false, value: "ctTable" }
  ];
  $scope.accrualRateType = $scope.accrualRateTypes[0]; // Default to Static
  $scope.accrualUnits = [
    { name: "Day", value: "trDays", abbr: "Day" },
    { name: "Hour", value: "trHours", abbr: "Hr" },
    { name: "Minute", value: "trMinutes", abbr: "Min" },
    { name: "Second", value: "trSeconds", abbr: "Sec" }
  ];
  $scope.accrualUnit = $scope.accrualUnits[1]; // Default to Hours

  /**
   * When the line # checkbox is clicked, this will initialize the value to 0 if it's not already set.
   */
  $scope.initializeRegExLine = function () {
    if ($scope.data.regExLine === -1) {
      $scope.data.regExLine = 0;
      $scope.data.regExBegPos = 0;
    }
  }

  /**
   * When the num chars checkbox is clicked, this will initialize the value to 0 if it's not already set.
   */
  $scope.initializeRegExNumChars = function () {
    if ($scope.data.regExNumChars === -1) {
      $scope.data.regExNumChars = 0;
    }
  }

}]);

