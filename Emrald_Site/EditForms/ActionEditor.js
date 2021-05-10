// Copyright 2021 Battelle Energy Alliance

function setAsNewChecked() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var btn = parent.document.getElementById("btn_OK");
    if (scope.saveAsNew) {
        btn.innerHTML = "Save As New";
    }
    else {
        btn.innerHTML = "OK";
    }
}

function loadNamePatterns() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    fetch('../resources/DefaultNamingPatterns.json')
        .then(res => res.json())
        .then(json => {
            scope.namingPatterns = json.ActionTypes;
            updateName();
            scope.$apply();
        });
}

function updateName() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    if (!nameIsDefaultValue()) {
        return;
    }
    scope.name = scope.namingPatterns.find(x => x.Type === scope.action.name).NamePattern;
}

function addStateToName(stateName) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    if (nameIsDefaultValue()) {
        scope.name += stateName;
    }
}

function nameIsDefaultValue() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    if (scope.name === '') {
        return true;
    }
    result = false;
    scope.namingPatterns.forEach(defaultName => {
        if (scope.name === defaultName.NamePattern) {
            result = true;
            return;
        }
    })
    return result;
}

function SetOf(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = arr[i];
    }
    return obj;
}

//inline filter for number entry.  support scientific notation as well.
function validateNumber(elt) {
    var numStr = elt.value; //.substring(0, elt.selectionStart) + evt.key + elt.value.substring(elt.selectionStart, elt.value.length);

    //todo allow remaining or default for mutually exclusive
    if (numStr.toUpperCase() == "REMAINING") {
        return true;
    }
    var num = parseFloat(numStr);
    var good = !isNaN(num) && isFinite(numStr);
    good = good && (num >= 0.0 && num <= 1.0)
    if (!good) {
        //var el = elt
        elt.style.color = "red";
        setTimeout(function () { elt.focus(); }, 20);
    }
    else {
        elt.style.color = "black";
    }
    return good;
}

function toTimespan(ts) {
    if (!ts) {
        return "P0DT0H0M0S";
    }
    var duration = 'P'
        + (!isNaN(ts.days) ? ts.days + 'D' : '')
        + ((!isNaN(ts.hours) || !isNaN(ts.minutes) || !isNaN(ts.seconds)) ? 'T' : '')
        + (!isNaN(ts.hours) ? ts.hours + 'H' : '')
        + (!isNaN(ts.minutes) ? ts.minutes + 'M' : '')
        + (!isNaN(ts.seconds) ? ts.seconds + 'S' : '');

    return duration;
}

function fromTimespan(tpStr) {
    var regex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/
    var newTpStr = tpStr;
    if (!tpStr) {
        newTpStr = "P0DT0H0M0S";
    }
    var matches = newTpStr.match(regex);
    return {
        days: +parseFloat(matches[9]), hours: +parseFloat(matches[12]), minutes: +parseFloat(matches[14]), seconds: +parseFloat(matches[16])
    };
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

var isDirty = false;
function isModified() {
    return isDirty;
}

function ValidateData() {
    return "";
}

function setModified(state) {
    isDirty = state;
}
function variableChecked(el) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var value;
    if (el) {
        value = JSON.parse(el.value);
    }
    if (value) {
        if (scope.varNames.indexOf(value.Variable.name) > -1) {
            var indx = scope.varNames.indexOf(value.Variable.name);
            scope.varNames.splice(indx, 1);
        }
        else {
            scope.varNames.push(value.Variable.name);
        }
    }
}
function handleSimMessageSelection() {
    var msgTypeEL = document.getElementById("simMessageOptions");
    var simVarEL = document.getElementById("simVariablePanel");
    var varParamsEL = document.getElementById("simOpenSimVarParamsPanel");
    var modelRefEL = document.getElementById("simModelRefPanel");
    var configDataEL = document.getElementById("simConfigDataPanel");
    var simTimerEL = document.getElementById("simEndTimePanel");


    switch (msgTypeEL.selectedIndex) {
        case 0: //Comp Modify
            simVarEL.style.visibility = "visible";
            modelRefEL.style.visibility = "hidden";
            configDataEL.style.visibility = "hidden";
            simTimerEL.style.visibility = "hidden";
            varParamsEL.style.visibility = "hidden";
            break;
        case 1: //Open Sim
            simVarEL.style.visibility = "hidden";
            modelRefEL.style.visibility = "visible";
            configDataEL.style.visibility = "visible";
            simTimerEL.style.visibility = "visible";
            varParamsEL.style.visibility = "visible";
            break;
        default:
            simVarEL.style.visibility = "hidden";
            modelRefEL.style.visibility = "hidden";
            configDataEL.style.visibility = "hidden";
            simTimerEL.style.visibility = "hidden";
            varParamsEL.style.visibility = "hidden";
            break;
    }
}

function handleOpenSimVarParamsChk() {
    //todo hide the text boxes and use selection boxes full of the variable options
}

function mutallyExclusiveHandler(el) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    if (el) {
        scope.mutExcl = el.checked;
    }
}
function handleExtSimSelection() {
    var extSimOpt = document.getElementById("extSimSelction");
    var indx = extSimOpt.selectedIndex;
    var scope = angular.element(document.querySelector("#actionControllerPanel")).scope();
    scope.extSim = scope.extSimList[indx].name;
}

//switch between detail panels.
function handleSelection() {
    var actType = document.getElementById("ScopeOption");
    var transition = document.getElementById("TransitionPanel");
    var changeVar = document.getElementById("ChangeVarPanel");
    var simMsg = document.getElementById("SimMessagePanel");
    var runApp = document.getElementById("RunAppPanel");

    transition.style.visibility = "hidden";
    changeVar.style.visibility = "hidden";
    simMsg.style.visibility = "hidden";
    runApp.style.visibility = "hidden";

    switch (actType.selectedIndex) {
        case 0: //transition
            transition.style.visibility = "visible";
            break;
        case 1: //change var value
            changeVar.style.visibility = "visible";
            break;
        case 2: //external sim msg
            simMsg.style.visibility = "visible";
            handleSimMessageSelection();
            break;
        case 3: //run application
            runApp.style.visibility = "visible";
            break;
    }
}

var actionData = null;
function OnLoad(dataObj) {
    loadNamePatterns();
    actionData = dataObj || {};
    var scope = angular.element(document.querySelector("#actionControllerPanel")).scope();

    scope.$apply(function () {
        scope.id = actionData.id;
        scope.dbID = actionData.dbID;
        scope.name = actionData.name;
        scope.desc = actionData.desc;
        if (actionData.moveFromCurrent == true) {
            var moveFromCurrent = document.getElementById("moveTruePanel");
            moveFromCurrent.style.visibility = "visible";
        }
        if (actionData.moveFromCurrent == false) {
            var moveFromCurrent = document.getElementById("moveFalsePanel");
            moveFromCurrent.style.visibility = "visible";
        }
        scope.extSimList = [];
        if (actionData.tempExtSimList) {
            for (var j = 0; j < actionData.tempExtSimList.length; j++) {
                scope.extSimList.push(actionData.tempExtSimList[j].ExtSim);
            }
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

        var variableList = actionData.tempVariableList;
        //all variables are passed in through the dataModel "actionData"
        if (variableList) {
            if (variableList.length > 0) {
                for (var i = 0; i < variableList.length; i++) {
                    if (variableList[i].Variable.varScope == "gt3DSim")
                        scope.simVariables.push(variableList[i].Variable);
                    scope.cvVariables.push(variableList[i].Variable);
                }
                scope.varsLoaded = true;
            }
        }
        if (actionData.codeVariables)
            scope.varNames = actionData.codeVariables;
        if (scope.varNames) {
            scope.varMap = actionData.tempVariableList.map(function (value, index) {
                var checkValue = false;
                if (scope.varNames.indexOf(value.Variable.name) > -1) {
                    checkValue = true;
                }
                return {
                    value: value,
                    check: checkValue
                }
            });
        }
        var transitionEl = document.getElementById("TransitionPanel");
        var changeVarEl = document.getElementById("ChangeVarPanel");
        var simMsgEl = document.getElementById("SimMessagePanel");
        var runAppEl = document.getElementById("RunAppPanel");
        var actTypeEL = document.getElementById("ScopeOption");
        transitionEl.style.visibility = "hidden";
        changeVarEl.style.visibility = "hidden";
        simMsgEl.style.visibility = "hidden";
        runAppEl.style.visibility = "hidden";
        switch (actionData.actType) {
            case "atTransition":
                actTypeEL.selectedIndex = 0;
                transitionEl.style.visibility = "visible";
                if (actionData.newStates) {
                    actionData.newStates.forEach(function (aState) {
                        //todo if aState.prob = "remaining" then set to -1
                        if (aState.prob >= 0) {
                            scope.transitions.push({ checked: false, To_State: aState.toState, Probability: aState.prob.toString(), varProb: aState.varProb, failDesc: aState.failDesc });
                        }
                        else {
                            scope.transitions.push({ checked: false, To_State: aState.toState, Probability: "Remaining", varProb: aState.varProb, failDesc: aState.failDesc });
                        }
                    });
                }
                scope.mutExcl = actionData.mutExcl;
                break;
            case "atCngVarVal":
                actTypeEL.selectedIndex = 1;
                changeVarEl.style.visibility = "visible";
                scope.cvCode = actionData.scriptCode;
                for (var i = 0; i < scope.cvVariables.length; i++) {
                    if (scope.cvVariables[i].name == actionData.variableName) {
                        scope.cvVariable = scope.cvVariables[i];
                        break;
                    }
                }
                break;
            case "at3DSimMsg":
                actTypeEL.selectedIndex = 2;
                simMsgEl.style.visibility = "visible";
                for (var i = 0; i < scope.simVariables.length; i++) {
                    if (scope.simVariables[i].name == actionData.sim3DVariable) {
                        scope.simVariable = scope.simVariables[i];
                        break;
                    }
                }
                for (var i = 0; i < scope.extSimList.length; i++) {
                    if (scope.extSimList[i].name == actionData.extSim) {
                        var extSimEL = document.getElementById("extSimSelction");
                        extSimEL.selectedIndex = i;
                        scope.extSim = scope.extSimList[i];
                        break;
                    }
                }
                for (var i = 0; i < scope.simMessages.length; i++) {
                    if (scope.simMessages[i].value == actionData.sim3DMessage) {
                        scope.simMessage = scope.simMessages[i];
                        var msgType = document.getElementById("simMessageOptions");
                        msgType.selectedIndex = i;
                        break;
                    }
                }
                scope.simEndTime = fromTimespan(actionData.simEndTime);
                scope.simModelRef = actionData.sim3DModelRef;
                scope.simConfigData = actionData.sim3DConfigData;
                if ((typeof actionData.openSimVarParams !== 'undefined') && actionData.openSimVarParams) {
                    scope.openSimVarParams = actionData.openSimVarParams;
                    handleOpenSimVarParams();
                }
                handleSimMessageSelection();
                break;
            case "atRunExtApp":
                actTypeEL.selectedIndex = 3;
                runAppEl.style.visibility = "visible";
                scope.raPreCode = actionData.makeInputFileCode;
                scope.raLocation = actionData.exePath;
                scope.raPostCode = actionData.processOutputFileCode;
                break;
        }

        if (scope.actions && scope.actions.length > 0) {
            var aInst = scope.actions.find(function (act) {
                return (act.value == actionData.actType);
            });
            if (aInst) {
                scope.action = aInst;
            }
        }

        handleSelection();
        // Do not allow change type if not new.
        if (actionData.id > 0) {
            actTypeEL.disabled = true;
        }
    });

    var pdiv = document.getElementById("TransitionPanel");
    pdiv.ondragover = function (evt) {
        var isStateEvent = false;
        for (var i = 0; i < evt.dataTransfer.types.length; i++) {
            var type = evt.dataTransfer.types[i].toLowerCase();
            if (type == "states") {
                isStateEvent = true;
                break;
            }
        }
        if (isStateEvent) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    }.bind(pdiv);

    pdiv.ondrop = function (evt) {
        var state = evt.dataTransfer.getData("states");
        state = JSON.parse(state);
        var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
        scope.$apply(function () {
            var found = false;
            for (var i = 0; i < scope.transitions.length; i++) {
                if (scope.transitions[i].To_State == state.name) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (scope.transitions.length == 0) {
                    scope.transitions.push({ checked: false, To_State: state.name, Probability: "1.0", failDesc: "" });
                    addStateToName(state.name);
                }
                //TODO ASK ABOUT THIS LINE
                //else if (scope.transitions[scope.transitions.length - 1].toUpperCase() == "REMAINING") {
                //scope.transitions.push({ checked: false, To_State: state.name, Probability: "0.0", failDesc: "" });
                //}
                else {
                    scope.transitions.push({ checked: false, To_State: state.name, Probability: "Remaining", failDesc: "" });
                }
            }
        });
    }
}

function GetDataObject() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var dataObj = scope.saveAsNew ? {} : actionData;
    if (scope.saveAsNew) {
        dataObj.id = scope.id;
    }
    dataObj.name = scope.name;
    dataObj.desc = scope.desc;
    dataObj.actType = scope.action.value;

    switch (dataObj.actType) {
        case "atTransition":
            if (scope.transitions && scope.transitions.length > 0) {
                dataObj.newStates = [];
                scope.transitions.forEach(function (tr) {
                    if (tr.Probability.toUpperCase() === "REMAINING") {
                        dataObj.newStates.push({ toState: tr.To_State, prob: -1, varProb: tr.varProb, failDesc: tr.failDesc });
                    }
                    else {
                        dataObj.newStates.push({ toState: tr.To_State, prob: Number(tr.Probability), varProb: tr.varProb, failDesc: tr.failDesc });
                    }
                });
            }
            else {
                dataObj.newStates = [];
            }

            dataObj.mutExcl = scope.mutExcl;
            break;
        case "atCngVarVal":
            dataObj.scriptCode = scope.cvCode;
            if (scope.cvVariable) {
                dataObj.variableName = scope.cvVariable.name;
            }
            dataObj.codeVariables = scope.varNames;
            break;
        case "at3DSimMsg":
            dataObj.sim3DMessage = scope.simMessage.value;
            if (scope.extSim && scope.extSim.name.length > 0) {
                dataObj.extSim = scope.extSim.name;
            }
            if (dataObj.sim3DMessage == "atCompModify") {
                if (scope.simVariable && scope.simVariable.name) {
                    dataObj.sim3DVariable = scope.simVariable.name;
                }
            }
            else if (dataObj.sim3DMessage == "atOpenSim") {
                dataObj.openSimVarParams = scope.openSimVarParams;
                if (scope.openSimVarParams) {
                    //todo once variable selection boxes are done get the text from there instead of the text boxes.
                    dataObj.sim3DModelRef = scope.simModelRef;
                    dataObj.sim3DConfigData = scope.simConfigData;
                    dataObj.simEndTime = toTimespan(scope.simEndTime);
                }
                else {
                    dataObj.sim3DModelRef = scope.simModelRef;
                    dataObj.sim3DConfigData = scope.simConfigData;
                    dataObj.simEndTime = toTimespan(scope.simEndTime);
                }
            }
            else {
                delete dataObj.sim3DVariable;
            }
            break;
        case "atRunExtApp":
            dataObj.makeInputFileCode = scope.raPreCode;
            dataObj.exePath = scope.raLocation;
            dataObj.processOutputFileCode = scope.raPostCode;
            dataObj.codeVariables = scope.varNames;
            break;
    }
    return dataObj;
}

function OnSave() {
    console.log("State saved.")
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

function deleteTransition() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    scope.$apply(function () {
        var checkedList = [];
        for (var i = 0; i < scope.transitions.length; i++) {
            if (scope.transitions[i].checked)
                checkedList.push(i);
        }

        for (var i = 0; i < checkedList.length; i++) {
            scope.transitions.splice(checkedList[i], 1);
        }
        if (checkedList.length > 0) somethingChanged();

        toStateChecked();
    });
}

function toStateChecked(el, evt) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var cnt = 0;
    for (var i = 0; i < scope.transitions.length; i++) {
        if (el) {
            if (scope.transitions[i].To_State == el.getAttribute('rowValue'))
                scope.transitions[i].checked = true;
        }
        if (scope.transitions[i].checked)
            ++cnt;
    }
    var delEl = document.getElementById("delBtn-" + scope.name);
    if (delEl)
        delEl.disabled = cnt == 0;
}

var actionModule = angular.module('actionModule', []);
actionModule.controller('actionController', ['$scope', function ($scope) {
    $scope.name = "";
    $scope.desc = "";
    $scope.actions = [
        { name: "Transition", value: "atTransition" },
        { name: "Change Var Value", value: "atCngVarVal" },
        { name: "Ext. Sim Message", value: "at3DSimMsg" },
        { name: "Run Application", value: "atRunExtApp" }],
        $scope.action = $scope.actions[0];

    $scope.transHeader = [{ column: "To State", width: 250 }, { column: "Prob 0.0-1.0", width: 30 }, { column: "variable Prob", width: 30 }, { column: "Command", width: 40 },];
    $scope.transitions = [];
    $scope.cvVariables = [];
    $scope.cvVariable = null;
    $scope.cvCode = "";
    $scope.simMessages = [
        { name: "Comp Modify", value: "atCompModify" },
        { name: "Open Sim", value: "atOpenSim" },
        { name: "Cancel Sim", value: "atCancelSim" },
        //{ name: "Pause Sim", value: "atPauseSim" },
        //{ name: "Continue", value: "atContinue" },
        //{ name: "Reset", value: "atReset" },
        //{ name: "Restart At Time", value: "atRestartAtTime" },
        { name: "Ping", value: "atPing" },
        //{ name: "Status", value: "atStatus" },
    ];

    $scope.simMessage = $scope.simMessages[0];
    $scope.simVariables = [];
    $scope.simVariable = null;
    $scope.simEndTime = "";
    $scope.row = [];
    //$scope.row.Probability = 0.5;
    $scope.extSimList = [];
    $scope.extSim = "";
    $scope.simModelRef = "";
    $scope.simConfigData = "";

    $scope.raPreCode = "";
    $scope.raLocation = "";
    $scope.raPostCode = "";
    $scope.varMap = new Map();
    $scope.varNames = [];
    $scope.mutExcl = true;
    $scope.saveAsNew = false;
    $scope.openSimVarParams = false;

    $scope.namingPatterns = [];


    $scope.$watch('name', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('desc', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('action', function (newV, oldV) { if (newV !== oldV) { somethingChanged(); updateName(); }});
    $scope.$watch('transitions', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('cvCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('cvVariable', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.$watch('simVariable', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('simMessage', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.$watch('raPreCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('raLocation', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('raPostCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch("varNames", function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch('row.Probability', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.varsLoaded = false;
}]);
