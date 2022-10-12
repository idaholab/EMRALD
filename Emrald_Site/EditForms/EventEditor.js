// Copyright 2021 Battelle Energy Alliance
// @ts-check

function setAsNewChecked() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    var btn = parent.document.getElementById("btn_OK");
    if (scope.saveAsNew) {
        btn.innerHTML = "Save As New";
    }
    else {
        btn.innerHTML = "OK";
    }
}

function SetOf(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = arr[i];
    }
    return obj;
}

function loadNamePatterns() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    fetch('../resources/DefaultNamingPatterns.json')
        .then(res => res.json())
        .then(json => {
            scope.namingPatterns = json.EventTypes;
            updateName();
            scope.$apply();
        });
}

function updateName() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    if (!nameIsDefaultValue()) {
        return;
    }
    scope.name = scope.namingPatterns.find(x => x.Type === scope.typeOption.name).NamePattern;
}

function nameIsDefaultValue() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
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

//inline filter for number entry.  support scientific notation as well.
function validateNumber(elt) {
    var numStr = elt.value;//.value.substring(0, elt.selectionStart) + evt.key + elt.value.substring(elt.selectionStart, elt.value.length);
    var good = !isNaN(parseFloat(numStr)) && isFinite(numStr);
    //var errTxt = document.getElementById("LambdaError");
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    if (!good) {
        //var el = elt
        setTimeout(function () { elt.focus(); }, 20);
        scope.$apply(function () {
            scope.lambdaError = { "display": "block" };
        });
    }
    else {
        //errTxt.style.display = "none";
        scope.$apply(function () {
            scope.lambdaError = { "display": "none" };
        });
    }
    return good;
}

function toTimespan(ts) {
    if (!ts) {
        return "P0DT0H0M0S";
    }
    var duration = 'P'
        + ((isNumeric(ts.days) && (ts.days !== "")) ? ts.days + 'D' : '')
        + (((isNumeric(ts.hours) && (ts.hours !== "")) || (isNumeric(ts.minutes) && (ts.minutes !== "")) || (isNumeric(ts.seconds) && (ts.seconds !== ""))) ? 'T' : '')
        + ((isNumeric(ts.hours) && (ts.hours !== "")) ? ts.hours + 'H' : '')
        + ((isNumeric(ts.minutes) && (ts.minutes !== "")) ? ts.minutes + 'M' : '')
        + ((isNumeric(ts.seconds) && (ts.seconds !== "")) ? ts.seconds + 'S' : '');

    return duration;
}

function fromTimespan(tpStr) {
    var regex = /P((([0-9.]+([eE][-+]?[0-9.]+)?)Y)?(([0-9.]+([eE][-+]?[0-9.]+)?)M)?(([0-9.]+([eE][-+]?[0-9.]+)?)W)?(([0-9.]+([eE][-+]?[0-9.]+)?)D)?)?(T(([0-9.]+([eE][-+]?[0-9.]+)?)H)?(([0-9.]+([eE][-+]?[0-9.]+)?)M)?(([0-9.]+([eE][-+]?[0-9.]+)?)S)?)?/
    var newTpStr = tpStr;
    if (!tpStr) {
        newTpStr = "P0DT0H0M0S";
    }
    var matches = newTpStr.match(regex);
    return {
        days: +parseFloat(matches[12]), hours: +parseFloat(matches[16]), minutes: +parseFloat(matches[19]), seconds: +parseFloat(matches[22])
    };
}


var isDirty = false;
function isModified() {
    return isDirty;
}

function ValidateData() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    if (scope.typeOption.value === 'et3dSimEv' && !scope.data.variable) {
        return "Please specify an External Sim Variable before saving the event.";
    }
    if (scope.typeOption.value === 'etComponentLogic' && !scope.data.logicTop) {
        return "Please specify a top logic gate before saving the event.";
    }
    return "";
}

function setModified(state) {
    isDirty = state;
}

function handleStateDelete() {
    var state = arguments[0].id;
    if (confirm("Are you sure you want to delete: " + state + "?")) {
        var scope = angular.element(document.querySelector("#EEControllerPanel")).scope();
        scope.$apply(function () {
            var idx = scope.data.states.indexOf(state);
            if (idx >= 0)
                scope.data.states.splice(idx, 1);
            somethingChanged();
        });
    }
}

// table row selection: rather background highlighting.
var preEl;
var orgBColor;
var orgTColor;
function HighLightTR(el, backColor, textColor) {
    var ChangeTextColor = function (aobj, acolor) {
        ;
        for (var i = 0; i < aobj.cells.length; i++)
            aobj.cells(i).style.color = acolor;
    }

    if (typeof (preEl) != 'undefined') {
        preEl.bgColor = orgBColor;
        try { ChangeTextColor(preEl, orgTColor); } catch (e) { ; }
    }
    orgBColor = el.bgColor;
    orgTColor = el.style.color;
    el.bgColor = backColor;

    try { ChangeTextColor(el, textColor); } catch (e) { ; }
    preEl = el;

    document.getElementById("btnRemoveTransition").disabled = false;
}

function moveFromCurrentHandler(el) {
    var scope = angular.element(document.querySelector('#movePanel')).scope();
    if (el) {
        scope.moveFromCurrent = el.checked;
    }
}

function isNumeric(stringOrNumber) {
  return isNaN(stringOrNumber) ? false : (parseFloat(stringOrNumber) ? true : (parseFloat(stringOrNumber) === 0 ? true : false))
}

//Holding the data model for the form.
var eventData = null;
//When the form first created, it calls this function to pass along the dataObj
//which is the data for the form.
function OnLoad(dataObj) {

    loadNamePatterns();
    if (!dataObj) return;
    eventData = dataObj;
    var scope = angular.element(document.querySelector("#EEControllerPanel")).scope();

    if (eventData.moveFromCurrent == true || eventData.moveFromCurrent == false) {
        var moveFromCurrent = document.getElementById("movePanel");
        moveFromCurrent.style.visibility = "visible";
        scope.moveFromCurrent = eventData.moveFromCurrent;
    }

    //hide "save as new" if it is a new item
    var sanElement = document.getElementById('AsNewItem');
    var sanText = document.getElementById('AsNewItemText');
    if ((dataObj.id < 0) && (sanElement.style.display != 'none')) {
        sanElement.style.display = 'none';
        sanText.style.display = 'none';
    } else {
        sanElement.style.display = '';
    }


    scope.$apply(function () {
        scope.id = eventData.id;
        scope.name = eventData.name;
        scope.desc = eventData.desc;
        if (scope.typeOptions && scope.typeOptions.length > 0) {
            var oInst = scope.typeOptions.find(function (tOp) {
                return (tOp.value == eventData.evType);
            });

            if (oInst) {
                scope.typeOption = oInst;
            }
        }

        scope.variables = eventData.tempVariableList;
        PopulateAllowedVariablesArrays();
        scope.varNames = eventData.varNames || [];
        scope.varMap = eventData.tempVariableList.map(function (value, index) {
            var checkValue = false;
            if (scope.varNames.indexOf(value.name) > -1) {
                checkValue = true;
            }
            return {
                value: value,
                check: checkValue
            }
        });

        scope.logicTops = eventData.tempLogicTopList;


        if (eventData.triggerStates)
            for (var i = 0; i < eventData.triggerStates.length; i++) {
                scope.data.states.push(eventData.triggerStates[i]);
            }

        if (eventData.id >= 0) {
            var opTypeEl = document.getElementById("typeOptionSelector");
            opTypeEl.disabled = true;  // Do not allow change type if not new.
            if (eventData.onVarChange) {
                scope.data.onVarChange = scope.distChangeTypes.find((type) => type.value === eventData.onVarChange);
            }
            switch (eventData.evType) {
                case "etVarCond":
                    scope.data.conditionCode = eventData.code;
                    opTypeEl.selectedIndex = 0;
                    break;
                case "etStateCng":
                    scope.data.isInState = eventData.ifInState;
                    scope.data.isAllItems = eventData.allItems;
                    scope.data.states = deepClone(eventData.triggerStates);
                    opTypeEl.selectedIndex = 1;
                    break;
                case "etComponentLogic":
                    scope.data.onSuccess = eventData.onSuccess;
                    var lt = scope.logicTops.find((o) => o.name == eventData.logicTop);
                    if (lt)
                        scope.data.logicTop = lt;
                    opTypeEl.selectedIndex = 2;
                    break;
                case "etTimer":
                    opTypeEl.selectedIndex = 3;
                    scope.data.timer.useVariable = eventData.useVariable;
                    if (eventData.useVariable) {
                        scope.data.timer.variableName = scope.data.timer.allowedVariables.find(x => { return x.name === eventData.time });
                        scope.data.timer.variableUnit = eventData.timeVariableUnit;
                    } else {
                        scope.time = fromTimespan(eventData.time);
                    }
                    scope.data.fromSimStart = eventData.fromSimStart || false;


                    break;
                case "etFailRate":                    
                    scope.lambdaTimeRate = fromTimespan(eventData.lambdaTimeRate);

                    if (isNumeric(eventData.lambda)) {
                        scope.data.failureRate.lambda.lambda = eventData.lambda;
                    }
                    else {
                        scope.data.failureRate.lambda.variableName = scope.data.failureRate.lambda.allowedVariables.find(x => { return x.name === eventData.lambda });
                    }

                    scope.data.failureRate.lambda.useVariable = eventData.useVariable;
                    //scope.missionTime = fromTimespan(eventData.missionTime);
                    opTypeEl.selectedIndex = 4;
                    break;
                case "etDistribution":
                    scope.distParameters = eventData.parameters;
                    scope.dfltTimeRate = eventData.dfltTimeRate;
                    scope.data.distType = scope.distTypes.find((type) => type.value === eventData.distType);
                case "et3dSimEv":
                    var vb = scope.variables.find((v) => v.name == eventData.variable);
                    if (vb)
                        scope.data.variable = vb;
                    opTypeEl.selectedIndex = 8;
                    scope.data.var3DCode = dataObj.code;
                    if (!dataObj.extEventType) {
                      scope.data.extEventType = scope.extEventTypeOptions[0];
                    } else {
                      scope.data.extEventType = scope.extEventTypeOptions.find((type) => type.value === dataObj.extEventType);
                    }
                    break;
            }
        }
        scope.handleSelection();
    });

}

function GetTimeOptionIdx(trString, scope) {
    for (var i = 0; i < scope.timeOptions.length; i++) {
        if (scope.timeOptions[i].value == trString)
            return scope.timeOptions[i];
    }

    return scope.timeOptions[2]; //default to hour
}

function GetDataObject() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    var dataObj = scope.saveAsNew ? {} : eventData;
    if (scope.saveAsNew) {
        dataObj.id = scope.id;
    }
    dataObj.name = scope.name;
    dataObj.desc = scope.desc;
    dataObj.moveFromCurrent = scope.moveFromCurrent;
    dataObj.evType = scope.typeOption.value;
    switch (eventData.evType) {
        case "etVarCond":
            dataObj.code = scope.data.conditionCode;
            dataObj.varNames = scope.varNames;
            break;
        case "et3dSimEv":
            dataObj.extEventType = scope.data.extEventType.value;
            if (dataObj.extEventType === 'etCompEv') {
              dataObj.variable = scope.data.variable.name;
              dataObj.code = scope.data.var3DCode;
              dataObj.varNames = scope.varNames;
            } else {
              delete dataObj.variable;
              delete dataObj.code;
              delete dataObj.varNames;
            }
            break;
        case "etStateCng":
            dataObj.ifInState = scope.data.isInState;
            dataObj.allItems = scope.data.isAllItems;
            dataObj.triggerStates = scope.data.states;
            break;
        case "etComponentLogic":
            dataObj.onSuccess = scope.data.onSuccess;
            if (scope.data.logicTop) {
                dataObj.logicTop = scope.data.logicTop.name;
            }
            break;
        case "etTimer":
            dataObj.useVariable = scope.data.timer.useVariable;
            if (scope.data.timer.useVariable) {
                dataObj.time = scope.data.timer.variableName.name;
                dataObj.timeVariableUnit = scope.data.timer.variableUnit;
            } else {
                dataObj.time = toTimespan(scope.time);
                dataObj.timeVariableUnit = "";
            }
            if (scope.data.onVarChange) {
                dataObj.onVarChange = scope.data.onVarChange.value;
            }
            dataObj.fromSimStart = scope.data.fromSimStart;
            break;
        case "etFailRate":
            if (scope.data.failureRate.lambda.useVariable) {
                dataObj.lambda = scope.data.failureRate.lambda.variableName.name;
            } else {
                dataObj.lambda = parseFloat(scope.data.failureRate.lambda.lambda);
            }
            dataObj.lambdaTimeRate = toTimespan(scope.lambdaTimeRate);
            dataObj.useVariable = scope.data.failureRate.lambda.useVariable;
            //dataObj.missionTime = toTimespan(scope.missionTime);
            if (scope.data.onVarChange) {
                dataObj.onVarChange = scope.data.onVarChange.value;
            }
            break;
        case "etDistribution":
            dataObj.distType = scope.data.distType.value;
            // Remove variable property from parameters not using variables.
            const distParameters = scope.distParameters;
            distParameters.forEach((p, i) => {
                if (!p.useVariable) {
                    delete distParameters[i].variable;
                }
            });
            dataObj.parameters = distParameters;
            dataObj.dfltTimeRate = scope.dfltTimeRate;
            if (scope.data.onVarChange) {
                dataObj.onVarChange = scope.data.onVarChange.value;
            }
    }
    return dataObj;
}

function OnSave() {
    console.log("State saved.");
    isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
    console.log("State data changed received.");
    OnLoad(dataObj);
}

function somethingChanged() {
    isDirty = true;
    if (typeof UpdateBttns === "function")
        UpdateBttns();
}

function PopulateAllowedVariablesArrays() {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    scope.data.timer.allowedVariables = GetVariableList(["double", "int"]);
    scope.data.failureRate.lambda.allowedVariables = GetVariableList(["double", "int"]);
}

// varScopes should be an array of strings (current options: "int", "string", "double", "bool")
function GetVariableList(varTypes) {
    var scope = angular.element(document.querySelector('#EEControllerPanel')).scope();
    var allowedVariables = [];
    scope.variables.forEach(availableVariable => {
        if (varTypes.includes(availableVariable.type)) {
            allowedVariables.push(availableVariable);
        }
    });
    return allowedVariables;
}


var EEApp = angular.module("EventEditor", ['codeEditor']);
EEApp.controller("EEController", function ($scope) {
    $scope.name = "";
    $scope.namingPatterns = [];
    $scope.desc = "";
    $scope.moveFromCurrent;
    $scope.typeOptions = [
        { "name": "Var Condition", value: "etVarCond" },
        { "name": "State Change", value: "etStateCng" },
        { "name": "Component Logic", value: "etComponentLogic" },
        { "name": "Timer", value: "etTimer" },
        { "name": "Failure Rate", value: "etFailRate" },
        { "name": "Ext Simulation", value: "et3dSimEv" },
        { "name": "Distribution", value: "etDistribution" },
    ];
    $scope.typeOption = $scope.typeOptions[0];
    $scope.lambdaError = { "display": "none" };

    $scope.distTypes = [
        { "name": "Norm. Distribution", value: "dtNormal" },
        { "name": "Exp. Distribution", value: "dtExponential" },
        { "name": "Weibull. Distribution", value: "dtWeibull" },
        { "name": "LogNorm. Distribution", value: "dtLogNormal" },
        { "name": "Uniform Distribution", value: "dtUniform" },
        { "name": "Triangular Distribution", value: "dtTriangular" },
        { "name": "Gamma Distribution", value: "dtGamma" },
        { "name": "Gompertz Distribution", value: "dtGompertz" },
    ];
    $scope.distChangeTypes = [
        { "name": "Ignore", value: "ocIgnore", desc: ", keeping the same sampled event time." },
        { "name": "Resample", value: "ocResample", desc: ", a new event time." },
        { "name": "Adjust", value: "ocAdjust", desc: ", use the new variable values to adjust the event time without resampling, if possible." },
    ];
    $scope.distParameters = [];
    $scope.dfltTimeRate = 'trHours';
    $scope.distUsesVariable = function () {
        var re = false;
        $scope.distParameters.forEach((param) => {
            re = re || param.useVariable;
        });
        return re;
    };

    $scope.timeOptions = [
        { "name": "Years", value: "trYears" },
        { "name": "Days", value: "trDays" },
        { "name": "Hours", value: "trHours" },
        { "name": "Minutes", value: "trMinutes" },
        { "name": "Seconds", value: "trSeconds" }
    ];
    $scope.meanTimeRate = $scope.timeOptions[2];
    $scope.stdTimeRate = $scope.timeOptions[2];
    $scope.minTimeRate = $scope.timeOptions[2];
    $scope.maxTimeRate = $scope.timeOptions[2];
    $scope.edTimeRate = $scope.timeOptions[2];
    $scope.wdTimeRate = $scope.timeOptions[2];

    $scope.data = {
        timer: {
            useVariable: false,
            variableName: "",
            variableUnit: $scope.timeOptions[2],
            allowedVariables: [],
            allowedVariableUnits: $scope.timeOptions.slice(1) // Everything except Years
        },
        failureRate: {
            lambda: {
                lambda: 0,
                useVariable: false,
                variableName: "",
                allowedVariables: []
            }
        },
        conditionCode: '',
        variable: null,
        var3DCode: '',
        distType: $scope.distTypes[0],
        onVarChange: null,
        isInState: "true",
        isAllItems: true,
        states: [],
        onSuccess: false,
        logicTop: null,
        fromSimStart: false,
        extEventType: null,
    };

    //var Condition
    $scope.conditionCode = "";
    $scope.var3DCode = "";
    $scope.varMap = [];
    $scope.varNames = [];

    //3D Sim
    $scope.VariablesLoaded = false;
    $scope.variables = [];
    $scope.varNames = [];
    $scope.extEventTypeOptions = [
      {
        description: 'Trigger event when the external variable changes and the code condition is met.',
        label: 'Variable Change',
        value: 'etCompEv',
      }, {
        description: 'Trigger event when the external simulation has ended.',
        label: 'Simulation End',
        value: 'etEndSim',
      }, {
        description: 'Trigger event if the external simulation has sent a error status.',
        label: 'Error Status',
        value: 'etStatus',
      },
    ];
    //Component logic
    $scope.logicTopsLoaded = false;
    $scope.logicTops = [];
    //timer
    $scope.time = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null
    };
    //Fail Probability
    $scope.lambdaTimeRates = [];
    $scope.lambdaTimeRate = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null
    };

    $scope.missionTime = null;

    $scope.ndMean = 24.0;
    $scope.ndStdDev = 1.0;
    $scope.ndMin = 0.0;
    $scope.ndMax = 24.0;

    $scope.edRate = 0.0;

    $scope.wdShape = 0.0;
    $scope.wdScale = 0.0;
    $scope.saveAsNew = false;

    /**
     * Handles switching between distribution type panels.
     */
    $scope.handleDistSelection = () => {
      switch ($scope.data.distType.value) {
        case 'dtNormal':
        case 'dtLogNormal':
          if (
            $scope.distParameters.length === 0 ||
            $scope.distParameters[0].name !== 'Mean'
          ) {
            $scope.distParameters = [
              {
                name: 'Mean',
                value: 24,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Standard Deviation',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
        case 'dtExponential':
          if (
            $scope.distParameters.length === 0 ||
            $scope.distParameters[0].name !== 'Rate'
          ) {
            $scope.distParameters = [
              {
                name: 'Rate',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
        case 'dtWeibull':
          if (
            $scope.distParameters.length === 0 ||
            $scope.distParameters[0].name !== 'Shape'
          ) {
            $scope.distParameters = [
              {
                name: 'Shape',
                value: 1,
                useVariable: false,
              },
              {
                name: 'Scale',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
        case 'dtUniform':
          if (
            $scope.distParameters[0].length === 0 ||
            $scope.distParameters[0].name !== 'Minimum'
          ) {
            $scope.distParameters = [
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
        case 'dtTriangular':
          if (
            $scope.distParameters[0].length === 0 ||
            $scope.distParameters[0].name !== 'Peak'
          ) {
            $scope.distParameters = [
              {
                name: 'Peak',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
        case 'dtGamma':
          if (
            $scope.distParameters[0].length === 0 ||
            $scope.distParameters[0].name !== 'Shape'
          ) {
            $scope.distParameters = [
              {
                name: 'Shape',
                value: 24,
                useVariable: false,
              },
              {
                name: 'Rate',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
          case 'dtGompertz':
          if (
            $scope.distParameters[0].length === 0 ||
            $scope.distParameters[0].name !== 'Shape'
          ) {
            $scope.distParameters = [
              {
                name: 'Shape',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Scale',
                value: 1,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Minimum',
                value: 0,
                timeRate: 'trHours',
                useVariable: false,
              },
              {
                name: 'Maximum',
                value: 1000,
                timeRate: 'trYears',
                useVariable: false,
              },
            ];
          }
          break;
      }
    };

    /**
     * Handles switching between detail panels.
     */
    $scope.handleSelection = () => {
      if ($scope.typeOption.value === 'etDistribution') {
        $scope.handleDistSelection();
      } else if ($scope.typeOption.value === 'etStateCng') {
        // Install the drag/drop handler on the state table
        setTimeout(() => {
          const tblStates = document.getElementById('tblStates');
          if (tblStates) {
            tblStates.ondragover = (evt) => {
              if (evt.dataTransfer.types.indexOf('states') >= 0) {
                //call preventDefault() to allow drop.
                evt.preventDefault();
              }
            };
            tblStates.ondrop = (evt) => {
              evt.preventDefault();
              if (evt.dataTransfer.types.indexOf('states') >= 0) {
                const state = JSON.parse(evt.dataTransfer.getData('states'));
                if ($scope.data.states.indexOf(state.name) < 0) {
                  $scope.$apply(() => {
                    $scope.data.states.push(state.name);
                  });
                  somethingChanged();
                } else {
                  alert(
                    "The state '" +
                      state.name +
                      "' already exists in the list.",
                  );
                }
              }
            };
          }
        }, 1);
      }
    };

    $scope.variableChecked = (row) => {
        const index = $scope.varNames.indexOf(row.value.name);
        if (row.check) {
            if (index > -1) {
                $scope.varNames.splice(index, 0, row.value.name);
            } else {
                $scope.varNames.push(row.value.name);
            }
        } else {
            $scope.varNames.splice(index, 1);
        }
    };

    $scope.$watch("name", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("desc", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("typeOption", function (newV, oldV) { if (newV !== oldV) { somethingChanged(); updateName(); } });
    $scope.$watch("moveFromCurrent", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("varNames", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("time.days", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("time.hours", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("time.minutes", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("time.seconds", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("lambda", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("lambdaTimeRate.days", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("lambdaTimeRate.hours", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("lambdaTimeRate.minutes", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("lambdaTimeRate.seconds", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch("missionTime.days", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch("missionTime.hours", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch("missionTime.minutes", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch("missionTime.seconds", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("ndMean", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("ndStdDev", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("ndMin", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("ndMax", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("edRate", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("wdShape", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch("wdScale", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });


});
