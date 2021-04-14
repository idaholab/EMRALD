// Copyright 2021 Battelle Energy Alliance

function SetOf(arr) {
		var obj = {};
		for (var i = 0; i < arr.length; i++) {
				obj[arr[i]] = arr[i];
		}
		return obj;
}

function addNewName(elt) {
		var nameStr = elt.value; //.substring(0, elt.selectionStart) + evt.key + elt.value.substring(elt.selectionStart, elt.value.length);

		//todo allow remaining or default for mutually exclusive
		if (nameStr.toUpperCase().indexOf("*****")>-1) {
				return true;
				//TODO add to some map that has old value and new
				
		}
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

var tempData = null;
function OnLoad(dataObj) {
		tempData = dataObj || {};
		var scope = angular.element(document.querySelector("#templateControllerPanel")).scope();
	

		scope.$apply(function () {
				scope.stateElements = tempData.addStates;
				scope.stateExcludeElements = tempData.excludeStates;
				scope.eventElements = tempData.addEvents;
				scope.eventExcludeElements = tempData.excludeEvents;
				scope.eventIncludeElements = tempData.includeEvents;
				scope.actionElements = tempData.addActions;
				scope.actionExcludeElements = tempData.excludeActions;
				scope.actionIncludeElements = tempData.includeActions;
		});
}

function GetDataObject() {
		var dataObj = tempData || {};
		var scope = angular.element(document.querySelector('#templateControllerPanel')).scope();
		scope.$apply(function () {
				tempData.name = scope.name;   
				tempData.addStates = scope.stateElements;
				tempData.excludeStates = scope.stateExcludeElements;
				tempData.addEvents = scope.eventElements;
				tempData.excludeEvents = scope.eventExcludeElements;
				tempData.includeEvents = scope.eventIncludeElements;
				tempData.addActions = scope.actionElements;
				tempData.excludeActions = scope.actionExcludeElements;
				tempData.includeActions = scope.actionIncludeElements;
		});
		return dataObj;
}

function OnSave() {
    console.log("State saved.");
		isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
		console.log("Template addition received.");
		OnLoad(dataObj);
}

function somethingChanged() {
		isDirty = true;
		if (typeof UpdateBttns === "function")
				UpdateBttns();
}


var templateModule = angular.module('templateModule', []);
templateModule.controller('templateController', ['$scope', function ($scope) {
		$scope.name = "";
		$scope.stateElements = [];
		$scope.stateExcludeElements = [];
		$scope.eventElements = [];
		$scope.eventExcludeElements = [];
		$scope.eventIncludeElements = [];
		$scope.actionElements = [];
		$scope.actionExcludeElements = [];
		$scope.actionIncludeElements = [];
		$scope.varsLoaded = false;
}]);
