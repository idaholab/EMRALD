// Copyright 2021 Battelle Energy Alliance

function setAsNewChecked() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var btn = parent.document.getElementById('btn_OK');
    if (scope.saveAsNew) {
        btn.innerHTML = 'Save As New';
    }
    else {
        btn.innerHTML = 'OK';
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
    try {
        scope.name = scope.namingPatterns.find(x => x.Type === scope.data.action.name).NamePattern;
    } catch (ex) {
        scope.name = '';
    }
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
    var result = false;
    scope.namingPatterns.forEach(defaultName => {
        if (scope.name === defaultName.NamePattern) {
            result = true;
            return;
        }
    });
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
    if (numStr.toUpperCase() === 'REMAINING') {
        return true;
    }
    var num = parseFloat(numStr);
    var good = !isNaN(num) && isFinite(numStr);
    good = good && (num >= 0.0 && num <= 1.0)
    if (!good) {
        //var el = elt
        elt.style.color = 'red';
        setTimeout(function () { elt.focus(); }, 20);
    }
    else {
        elt.style.color = 'black';
    }
    return good;
}

function toTimespan(ts) {
    if (!ts) {
        return 'P0DT0H0M0S';
    }
    var duration = 'P'
        + ((isNumeric(ts.days) && (ts.days !== '')) ? ts.days + 'D' : '')
        + (((isNumeric(ts.hours) && (ts.hours !== '')) || (isNumeric(ts.minutes) && (ts.minutes !== '')) || (isNumeric(ts.seconds) && (ts.seconds !== ''))) ? 'T' : '')
        + ((isNumeric(ts.hours) && (ts.hours !== '')) ? ts.hours + 'H' : '')
        + ((isNumeric(ts.minutes) && (ts.minutes !== '')) ? ts.minutes + 'M' : '')
        + ((isNumeric(ts.seconds) && (ts.seconds !== '')) ? ts.seconds + 'S' : '');
    duration = (duration === 'P') ? 'P0DT0H0M0S' : duration;
    return duration;
}

function isNumeric(stringOrNumber) {
    return isNaN(stringOrNumber)
        ? false
        : (parseFloat(stringOrNumber) ? true : (parseFloat(stringOrNumber) === 0 ? true : false));
}

function fromTimespan(tpStr) {
    var regex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/;
    var newTpStr = tpStr;
    if (!tpStr) {
        newTpStr = 'P0DT0H0M0S';
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

    if (typeof (preEl) !== 'undefined') {
        preEl.bgColor = orgBColor;
        try { ChangeTextColor(preEl, orgTColor); } catch (e) { ; }
    }
    orgBColor = el.bgColor;
    orgTColor = el.style.color;
    el.bgColor = backColor;

    try { ChangeTextColor(el, textColor); } catch (e) { ; }
    preEl = el;

    document.getElementById('btnRemoveTransition').disabled = false;
}

var isDirty = false;
function isModified() {
    return isDirty;
}

function ValidateData() {
    return '';
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
            var index = scope.varNames.indexOf(value.Variable.name);
            scope.varNames.splice(index, 1);
        }
        else {
            scope.varNames.push(value.Variable.name);
        }
    }
}

function mutuallyExclusiveHandler(el) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    if (el) {
        scope.mutExcl = el.checked;
    }
}
function handleExtSimSelection() {
    var extSimOpt = document.getElementById('extSimSelection');
    var index = extSimOpt.selectedIndex;
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    scope.data.extSim = scope.data.extSimList[index].name;
}

var actionData = null;
function OnLoad(dataObj) {
    loadNamePatterns();
    actionData = dataObj || {};
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();

    scope.$apply(function () {
        scope.id = actionData.id;
        scope.dbID = actionData.dbID;
        scope.name = actionData.name;
        scope.desc = actionData.desc;
        if (actionData.moveFromCurrent === true) {
            scope.data.actionData.moveFromCurrentTrue = true;
        }
        if (actionData.moveFromCurrent === false) {
            scope.data.actionData.moveFromCurrentFalse = true;
        }
        scope.data.extSimList = [];
        if (actionData.tempExtSimList) {
            for (let j = 0; j < actionData.tempExtSimList.length; j++) {
                scope.data.extSimList.push(actionData.tempExtSimList[j].ExtSim);
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
                for (let i = 0; i < variableList.length; i++) {
                    if (variableList[i].Variable.varScope == 'gt3DSim')
                        scope.data.simVariables.push(variableList[i].Variable);
                    scope.data.cvVariables.push(variableList[i].Variable);
                }
                scope.varsLoaded = true;
            }
        }
        if (actionData.codeVariables)
            scope.varNames = actionData.codeVariables;
        if (scope.varNames) {
            scope.data.varMap = actionData.tempVariableList.map(function (value, index) {
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
        var actTypeEl = document.getElementById('ScopeOption');
        switch (actionData.actType) {
            case 'atTransition':
                actTypeEl.selectedIndex = 0;
                if (actionData.newStates) {
                    actionData.newStates.forEach(function (aState) {
                        //todo if aState.prob == "remaining" then set to -1
                        if (aState.prob >= 0) {
                            scope.data.transitions.push({ checked: false, To_State: aState.toState, Probability: aState.prob.toString(), varProb: aState.varProb, failDesc: aState.failDesc });
                        }
                        else {
                            scope.data.transitions.push({ checked: false, To_State: aState.toState, Probability: 'Remaining', varProb: aState.varProb, failDesc: aState.failDesc });
                        }
                    });
                }
                scope.mutExcl = actionData.mutExcl;
                break;
            case 'atCngVarVal':
                actTypeEl.selectedIndex = 1;
                scope.data.cvCode = actionData.scriptCode;
                for (let i = 0; i < scope.data.cvVariables.length; i++) {
                    if (scope.data.cvVariables[i].name === actionData.variableName) {
                        scope.data.cvVariable = scope.data.cvVariables[i];
                        break;
                    }
                }
                break;
            case 'at3DSimMsg':
                actTypeEl.selectedIndex = 2;
                for (let i = 0; i < scope.data.simVariables.length; i++) {
                    if (scope.data.simVariables[i].name === actionData.sim3DVariable) {
                        scope.data.simVariable = scope.data.simVariables[i];
                        break;
                    }
                }
                for (let i = 0; i < scope.data.extSimList.length; i++) {
                    if (scope.data.extSimList[i].name === actionData.extSim) {
                        scope.data.extSim = scope.data.extSimList[i];
                        break;
                    }
                }
                for (let i = 0; i < scope.data.simMessages.length; i++) {
                    if (scope.data.simMessages[i].value === actionData.sim3DMessage) {
                        scope.data.simMessage = scope.data.simMessages[i];
                        break;
                    }
                }

                scope.data.simEndTime = fromTimespan(actionData.simEndTime);
                scope.data.simModelRef = actionData.sim3DModelRef;
                scope.data.simConfigData = actionData.sim3DConfigData;
                if ((typeof actionData.openSimVarParams !== 'undefined') && actionData.openSimVarParams) {
                    scope.data.openSimVarParams = actionData.openSimVarParams;
                }
                break;
            case 'atRunExtApp':
                actTypeEl.selectedIndex = 3;
                scope.data.raType = actionData.raType || 'template';
                scope.data.raPreCode = actionData.makeInputFileCode;
                scope.data.raLocation = actionData.exePath;
                scope.data.raPostCode = actionData.processOutputFileCode;
                scope.data.raFormData = actionData.formData;
                if (actionData.template) {
                    scope.data.raTemplate = scope.raTemplates.find((template) => template.name === actionData.template.name);
                }
                break;
        }

        if (scope.data.actions && scope.data.actions.length > 0) {
            var aInst = scope.data.actions.find(function (act) {
                return (act.value === actionData.actType);
            });
            if (aInst) {
                scope.data.action = aInst;
            }
        }

        // Do not allow change type if not new.
        if (actionData.id > 0) {
            actTypeEl.disabled = true;
        }
    });

    var transitionPanel = document.getElementById('TransitionPanel');
    if (transitionPanel) {
        transitionPanel.ondragover = function (evt) {
            var isStateEvent = false;
            for (var i = 0; i < evt.dataTransfer.types.length; i++) {
                var type = evt.dataTransfer.types[i].toLowerCase();
                if (type === 'states') {
                    isStateEvent = true;
                    break;
                }
            }
            if (isStateEvent) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        }.bind(transitionPanel);

        transitionPanel.ondrop = function (evt) {
            var state = evt.dataTransfer.getData('states');
            state = JSON.parse(state);
            var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
            scope.$apply(function () {
                var found = false;
                for (var i = 0; i < scope.data.transitions.length; i++) {
                    if (scope.data.transitions[i].To_State === state.name) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    if (scope.data.transitions.length === 0) {
                        scope.data.transitions.push({ checked: false, To_State: state.name, Probability: '1.0', failDesc: '' });
                        addStateToName(state.name);
                    }
                    //TODO ASK ABOUT THIS LINE
                    //else if (scope.data.transitions[scope.data.transitions.length - 1].toUpperCase() == "REMAINING") {
                    //scope.data.transitions.push({ checked: false, To_State: state.name, Probability: "0.0", failDesc: "" });
                    //}
                    else {
                        scope.data.transitions.push({ checked: false, To_State: state.name, Probability: 'Remaining', failDesc: '' });
                    }
                }
            });
        }
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
    dataObj.actType = scope.data.action.value;

    switch (dataObj.actType) {
        case 'atTransition':
            if (scope.data.transitions && scope.data.transitions.length > 0) {
                dataObj.newStates = [];
                scope.data.transitions.forEach(function (tr) {
                    var { varProb } = tr;
                    if (varProb === null) {
                        varProb = "null";
                    }
                    if (tr.Probability.toUpperCase() === 'REMAINING') {
                        dataObj.newStates.push({ toState: tr.To_State, prob: -1, varProb, failDesc: tr.failDesc });
                    }
                    else {
                        dataObj.newStates.push({ toState: tr.To_State, prob: Number(tr.Probability), varProb, failDesc: tr.failDesc });
                    }
                });
            }
            else {
                dataObj.newStates = [];
            }

            dataObj.mutExcl = scope.mutExcl;
            break;
        case 'atCngVarVal':
            dataObj.scriptCode = scope.data.cvCode;
            if (scope.data.cvVariable) {
                dataObj.variableName = scope.data.cvVariable.name;
            }
            dataObj.codeVariables = scope.varNames;
            break;
        case 'at3DSimMsg':
            dataObj.sim3DMessage = scope.data.simMessage.value;
            if (scope.data.extSim && scope.data.extSim.name.length > 0) {
                dataObj.extSim = scope.data.extSim.name;
            }
            if (dataObj.sim3DMessage === 'atCompModify') {
                if (scope.data.simVariable && scope.data.simVariable.name) {
                    dataObj.sim3DVariable = scope.data.simVariable.name;
                }
            }
            else if (dataObj.sim3DMessage === 'atOpenSim') {
                dataObj.openSimVarParams = scope.data.openSimVarParams;
                if (scope.data.openSimVarParams) {
                    //todo once variable selection boxes are done get the text from there instead of the text boxes.
                    dataObj.sim3DModelRef = scope.data.simModelRef;
                    dataObj.sim3DConfigData = scope.data.simConfigData;
                    dataObj.simEndTime = toTimespan(scope.data.simEndTime);
                }
                else {
                    dataObj.sim3DModelRef = scope.data.simModelRef;
                    dataObj.sim3DConfigData = scope.data.simConfigData;
                    dataObj.simEndTime = toTimespan(scope.data.simEndTime);
                }
            }
            else {
                delete dataObj.sim3DVariable;
            }
            break;
        case 'atRunExtApp':
            dataObj.raType = scope.data.raType;
            dataObj.makeInputFileCode = scope.data.raPreCode;
            dataObj.exePath = scope.data.raLocation;
            dataObj.processOutputFileCode = scope.data.raPostCode;
            dataObj.codeVariables = scope.varNames;
            dataObj.formData = scope.data.raFormData;
            dataObj.returnProcess = scope.returnProcess;
            dataObj.template = scope.data.raTemplate;
            dataObj.updateVariables = scope.updateVariables;
            // update variables
            var root = window.top.simApp.allDataModel;
            if (scope.updateVariables) {
                scope.updateVariables.forEach((variable) => {
                    for (var i = 0; i < root.VariableList.length; i += 1) {
                        var v = root.VariableList[i].Variable;
                        if (v.id === variable.id && v.name === variable.name) {
                            Object.keys(variable).forEach((key) => {
                                root.VariableList[i].Variable[key] = variable[key];
                            });
                        }
                    }
                });
            }
            break;
    }
    return dataObj;
}

function OnSave() {
    console.log('State saved.');
    isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
    console.log('State data changed received.');
    OnLoad(dataObj);
}

function somethingChanged() {
    isDirty = true;
    if (typeof UpdateBttns === 'function')
        UpdateBttns();
}

function deleteTransition() {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    scope.$apply(function () {
        var checkedList = [];
        for (let i = 0; i < scope.data.transitions.length; i++) {
            if (scope.data.transitions[i].checked)
                checkedList.push(i);
        }

        for (let i = 0; i < checkedList.length; i++) {
            scope.data.transitions.splice(checkedList[i], 1);
        }
        if (checkedList.length > 0) somethingChanged();

        toStateChecked();
    });
}

function toStateChecked(el, evt) {
    var scope = angular.element(document.querySelector('#actionControllerPanel')).scope();
    var cnt = 0;
    for (var i = 0; i < scope.data.transitions.length; i++) {
        if (el) {
            if (scope.data.transitions[i].To_State === el.getAttribute('rowValue'))
                scope.data.transitions[i].checked = true;
        }
        if (scope.data.transitions[i].checked)
            ++cnt;
    }
    var delEl = document.getElementById('delBtn-' + scope.name);
    if (delEl)
        delEl.disabled = cnt === 0;
}

var actionModule = angular.module('actionModule', []);
actionModule.controller('actionController', ['$scope', function ($scope) {
    $scope.name = '';
    $scope.desc = '';
    $scope.data = {
        actions: [
            { name: 'Transition', value: 'atTransition' },
            { name: 'Change Var Value', value: 'atCngVarVal' },
            { name: 'Ext. Sim Message', value: 'at3DSimMsg' },
            { name: 'Run Application', value: 'atRunExtApp' }
        ],
        action: {},
        actionData: {
            moveFromCurrentTrue: false,
            moveFromCurrentFalse: false
        },
        transitions: [],
        transHeader: [
            { column: 'To State', width: 250 },
            { column: 'Prob 0.0-1.0', width: 30 },
            { column: 'variable Prob', width: 30 },
            { column: 'Command', width: 40 }
        ],
        cvVariables: [],
        cvVariable: null,
        cvCode: '',
        varMap: new Map(),

        simMessages: [
            { name: 'Comp Modify', value: 'atCompModify' },
            { name: 'Open Sim', value: 'atOpenSim' },
            { name: 'Cancel Sim', value: 'atCancelSim' },
            //{ name: "Pause Sim", value: "atPauseSim" },
            //{ name: "Continue", value: "atContinue" },
            //{ name: "Reset", value: "atReset" },
            //{ name: "Restart At Time", value: "atRestartAtTime" },
            { name: 'Ping', value: 'atPing' },
            //{ name: "Status", value: "atStatus" },
        ],
        simMessage: '',
        extSimList: [],
        extSim: '',
        simVariables: [],
        simVariable: null,
        simEndTime: {
            days: '',
            hours: '',
            minutes: '',
            seconds: ''
        },
        openSimVarParams: false,
        simModelRef: '',
        simConfigData: '',
        raPreCode: '',
        raLocation: '',
        raPostCode: '',
        raType: 'template',
        raTemplate: {},
        raTemplateTemp: {},
        raFormData: {},
    };

    $scope.raTemplates = window.customForms;

    $scope.data.action = $scope.data.actions[0];
    $scope.data.simMessage = $scope.data.simMessages[0];

    $scope.varNames = [];
    $scope.mutExcl = true;
    $scope.saveAsNew = false;

    $scope.namingPatterns = [];

    $scope.readPath = function (row, path) {
        return jsonPath(row, path);
    }

    $scope.$watch('name', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('desc', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.action', function (newV, oldV) { if (newV !== oldV) { somethingChanged(); updateName(); } });
    $scope.$watch('data.transitions', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.cvCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.cvVariable', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.$watch('data.simVariable', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.simMessage', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.$watch('data.raPreCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.raLocation', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.raPostCode', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('data.raType', function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch('data.raTemplate', function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch('data.raFormData', function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    $scope.$watch('varNames', function (newVal, oldVal) { if (newVal !== oldVal) somethingChanged(); });
    //$scope.$watch('row.Probability', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

    $scope.varsLoaded = false;

    window.getScope = function () {
        return $scope;
    };

    window.addEventListener('message', (ev) => {
        var { payload } = ev.data;
        switch (ev.data.type) {
            case 'saveTemplate':
                $scope.data.raLocation = payload.raLocation;
                $scope.data.raFormData = payload.raFormData;
                $scope.data.raPreCode = payload.raPreCode;
                $scope.data.raPostCode = payload.raPostCode;
                $scope.varNames = payload.varNames;
                $scope.returnProcess = payload.returnProcess;
                $scope.updateVariables = payload.variables;
                break;
            default:
        }
    });
}]);
