// Copyright 2021 Battelle Energy Alliance

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

function loadCustomDiagramLabels(diagramType, diagramLabel) {
    var scope = angular.element(document.querySelector('#diagramControllerPanel')).scope();
    fetch('../resources/CustomDiagramLabels.json')
        .then(res => res.json())
        .then(json => {
            scope.diagramTypes = json.LabelList;
            updateDiagramTypeSelection(diagramType, diagramLabel);
            scope.$apply();
        });
}

function updateDiagramTypeSelection(diagramType, diagramLabel) {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();
    if (scope.diagramTypes && scope.diagramTypes.length > 0) {
        if (diagramType === null && diagramLabel === null) {
            scope.diagramType = scope.diagramTypes[0];
        }

        var dInst = scope.diagramTypes.find(function (dt) {
            if (diagramLabel) {
                return (dt.value === diagramType && dt.name === diagramLabel);
            }
            else {
                return (dt.value === diagramType);
            }
        });

        if (dInst) {
            scope.diagramType = dInst;
        }
        else {
            scope.diagramType = scope.diagramTypes[0];
        }
    }
    scope.initialChange = false;
    scope.timeout(() => scope.loading = false);
}

function tryChangeDiagramType(oldType, newType) {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();
    console.log("Old Type: " + oldType);
    console.log("New Type: " + newType);
    if (!scope.changeDiagramTypeSidebarCallbackFunction(scope.name, oldType, newType)) {
        alert("Cannot Change Diagram Type.");
        return false;
    }
    return true;
}

var diagramData = null;
function OnLoad(dataObj) {
    diagramData = dataObj;
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();

    scope.$apply(function () {
        scope.id = diagramData.id;
        //scope.dbID = diagramData.dbID;
        scope.name = diagramData.name;
        scope.desc = diagramData.desc;
        loadCustomDiagramLabels(dataObj.diagramType ?? null, dataObj.diagramLabel ?? null);
        scope.states = diagramData.states;

        if (dataObj.diagramType == "dtComponent" || dataObj.diagramType == "dtSystem") {
            scope.singleStates = diagramData.singleStates;
            if (scope.singleStates)
                scope.singleStates.forEach(function (state) {
                    state.inSingleStateGroup = state.okState.toUpperCase() == "TRUE";
                });
            var el = document.getElementById("singleStatePanel");
            if (el) {
                el.style.display = "block";
            }
        }
        scope.diagramTemplates = diagramData.diagramTemplates;
        if (scope.diagramTemplates && scope.diagramTemplates.length > 0) {
            var aInst = scope.diagramTemplates.find(function (temp) {
                return (temp == diagramData.diagramTemplate);
            });
            if (aInst) {
                scope.diagramTemplate = aInst;
            }

        }
        else {
            var templateElement = document.getElementById("TemplateOption");
            var templateLabelElement = document.getElementById("TemplateOptionLabel");
            templateElement.style.visibility = "hidden";
            templateLabelElement.style.visibility = "hidden";
        }
        if (dataObj.changeDiagramType) {
            scope.changeDiagramTypeSidebarCallbackFunction = dataObj.changeDiagramType;
        }
    });
}

function GetDataObject() {
    diagramData = diagramData || {};
    var scope = angular.element(document.querySelector('#diagramControllerPanel')).scope();
    diagramData.name = scope.name;
    diagramData.desc = scope.desc;
    diagramData.diagramLabel = scope.diagramType.name;
    diagramData.diagramType = scope.diagramType.value;
    if (diagramData.diagramType == 'dtComponent' || diagramData.diagramType == 'dtSystem') {
        if (diagramData.singleStates)
            diagramData.singleStates.forEach(
                function (state) {
                    state.okState = "" + state.inSingleStateGroup;
                    delete state.inSingleStateGroup;
                });
    }

    diagramData.diagramTemplate = scope.diagramTemplate;
    return diagramData;
}

function OnSave() {
    console.log("Diagram saved.");
    isDirty = false;
}

function DataChanged(dataObj) {
    console.log("Diagram data changed received.");
    OnLoad(dataObj);
}

function somethingChanged() {
    isDirty = true;
    if (typeof UpdateBttns === "function")
        UpdateBttns();
}

//Default diagram editor values
var diagramModule = angular.module('diagramModule', []);
diagramModule.controller('diagramController', function ($scope, $timeout) {
    $scope.name = "diagram1";
    $scope.desc = "new diagram";
    $scope.diagramTypes = [
        { name: "Component", value: "dtComponent" },
        { name: "System", value: "dtSystem" },
        { name: "Plant Response", value: "dtPlant" },
        { name: "Other", value: "dtOther" }
    ];
    $scope.diagramTemplates = [];
    $scope.diagramTemplate = "";
    $scope.singleStatesHeader = [{ column: "Name" }, { column: "Success State" }];
    $scope.singleStates = [];
    $scope.changeDiagramTypeSidebarCallbackFunction = null;
    $scope.loading = true;
    $scope.initialChange = true;
    $scope.diagramType = $scope.diagramTypes[0];
    $scope.timeout = $timeout;


    $scope.$watch('name', function () {
        somethingChanged();
    }, true);
    $scope.$watch('desc', function () {
        somethingChanged();
    }, true);
    $scope.$watch('diagramType', function (newValue, oldValue) {
        if ($scope.initialChange) {
            return;
        }
        if ($scope.loading) {
            $timeout(() => $scope.loading = false);
        }
        else if (tryChangeDiagramType(oldValue.value, newValue.value)) {
            $scope.onTypeChanged();
            somethingChanged();
        }
        else {
            updateDiagramTypeSelection(oldValue.value, oldValue.name);
            $scope.loading = true;
        }
    }, true);
    $scope.$watch('diagramTemplate', function (newV, oldV) { if (newV !== oldV) somethingChanged(); }, true);

    $scope.$watch('singleStates', function () {
        somethingChanged();
    }, true);

    $scope.onTypeChanged = function () {
        var el = document.getElementById("singleStatePanel");
        if (el) {
            if ($scope.diagramType.value <= 1) {
                el.style.display = 'block';
            }
            else {
                el.style.display = 'none';
            }
        }
    }

});
