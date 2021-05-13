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
    });



    var opEl = document.getElementById("TypeOption");
    if (dataObj.dbID >= 0)
        opEl.disabled = true;
    else
        opEl.disabled = false;
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
diagramModule.controller('diagramController', function ($scope) {
    $scope.name = "diagram1";
    $scope.desc = "new diagram";
    $scope.diagramTypes = [
        { name: "Component", value: "dtComponent" },
        { name: "System", value: "dtSystem" },
        { name: "Plant Response", value: "dtPlant" },
        { name: "Other", value: "dtOther" }
    ];
    $scope.diagramType = $scope.diagramTypes[0];
    $scope.diagramTemplates = [];
    $scope.diagramTemplate = "";
    $scope.singleStatesHeader = [{ column: "Name" }, { column: "Success State" }];
    $scope.singleStates = [];


    $scope.$watch('name', function () {
        somethingChanged();
    }, true);
    $scope.$watch('desc', function () {
        somethingChanged();
    }, true);
    $scope.$watch('diagramType', function () {
        $scope.onTypeChanged();
        somethingChanged();
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
