// Copyright 2021 Battelle Energy Alliance

function SetOf(arr) {
		var obj = {};
		for (var i = 0; i < arr.length; i++) {
				obj[arr[i]] = arr[i];
		}
		return obj;
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
		
}


var simData = null;
function OnLoad(dataObj) {
		simData = dataObj || {};
  var scope = angular.element(document.querySelector("#extSimControllerPanel")).scope();

  scope.$apply(function () {
    scope.name = simData.name;
    scope.resourceName = simData.resourceName;
  });
}

function GetDataObject() {
		var dataObj = simData || {};
		var scope = angular.element(document.querySelector('#extSimControllerPanel')).scope();
		dataObj.name = scope.name;
		dataObj.resourceName = scope.resourceName;
		return dataObj;
}

function OnSave() {
    console.log("State saved.");
		isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
		console.log("Ext sim addition received.");
		OnLoad(dataObj);
}

function somethingChanged() {
		isDirty = true;
		if (typeof UpdateBttns === "function")
				UpdateBttns();
}


var extSimModule = angular.module('extSimModule', []);
extSimModule.controller('extSimController', ['$scope', function ($scope) {
		$scope.name = "";
		$scope.resourceName = "";
		$scope.modelRef = "";
		$scope.configData = "";

		$scope.simMaxTime = null;


		$scope.$watch('name', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('resourceName', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		

		$scope.varsLoaded = false;
}]);
