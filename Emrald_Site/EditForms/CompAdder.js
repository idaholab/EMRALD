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

//switch between detail panels.
function handleSelection() {
		var element = document.getElementById("ScopeOption");

}

//Gets the data from JSON and html
var gateData = null;
function OnLoad(dataObj) {
		gateData = dataObj || {};
		var scope = angular.element(document.querySelector("#gateControllerPanel")).scope();

		scope.$apply(function () {
				for (var i = 0; i < gateData.length; i++) {
						var option = { name: gateData[i].name, value: gateData[i] };
						scope.types.add(option);
				}
				scope.type = scope.types[0];
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
		dataObj.element = scope.type.value;

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

		$scope.types = [],
				$scope.type = null;

		
		$scope.$watch('types', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('type', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

}]);
