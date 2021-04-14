// Copyright 2021 Battelle Energy Alliance



// table row selection: rather background highlighting.
//This is copied from ActionEditor.js
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

//switch between detail panels.
function handleSelection() {
    var gateType = document.getElementById("ScopeOption");

}

//Gets the data from JSON and html
var gateData = null;
function OnLoad(dataObj) {
    gateData = dataObj || {};
    var scope = angular.element(document.querySelector("#gateControllerPanel")).scope();

    scope.$apply(function () {
        scope.id = gateData.id;
        scope.dbID = gateData.dbID;
        scope.name = gateData.name;
        scope.desc = gateData.desc;
        scope.type = gateData.gateType;

        if (scope.types && scope.types.length > 0) {
            var aInst = scope.types.find(function (typ) {
                return (typ.value == gateData.gateType);
            });
            if (aInst) {
                scope.type = aInst;
            }
        }
    });
    
}

//Sets JSON data from html
function GetDataObject() {
    var dataObj = gateData || {};
    var scope = angular.element(document.querySelector('#gateControllerPanel')).scope();
    dataObj.name = scope.name;
    dataObj.desc = scope.desc;
    dataObj.gateType = scope.type.value;
  
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


var gateModule = angular.module('gateModule', []);
gateModule.controller('gateController', ['$scope', function ($scope) {
    $scope.name = "";
    $scope.desc = "";
    $scope.types = [
        { name: "AND", value: "gtAnd" },
        { name: "OR", value: "gtOr" }],
        $scope.type = $scope.types[0];

 

    $scope.$watch('name', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('desc', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
    $scope.$watch('type', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
  
}]);
