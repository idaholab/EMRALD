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
		var cType = document.getElementById("ScopeOption");
		var standardGate = document.getElementById("GatePanel");
		var diagramGate = document.getElementById("DiagramPanel");
		standardGate.style.visibility = "hidden";
		diagramGate.style.visibility = "hidden";

		switch (cType.selectedIndex) {
				case 0:
						standardGate.style.visibility = "visible";
						break;
				case 1:
						diagramGate.style.visibility = "visible";
						break;
		}
}
//switch between gate types
function handleGateSelection() {
		var newGateType = document.getElementById("GateOptions");
}

//switch between diagrams
function handleDiagramSelection() {
		var newDiagram = document.getElementById("DiagramOption");
}

var gateData = null;
function OnLoad(dataObj) {
		gateData = dataObj || {};
		var scope = angular.element(document.querySelector("#gateControllerPanel")).scope();

		scope.$apply(function () {
				var standardEl = document.getElementById("GatePanel");
				var diagramEl = document.getElementById("DiagramPanel");
				standardEl.style.visibility = "hidden";
				diagramEl.style.visibility = "hidden";
				switch (gateData.addType) {
						case "standard":
								standardEl.style.visibility = "visible";
								break;
						case "diagram":
								diagramEl.style.visibility = "visible";
								break;
						default:
								standardEl.style.visibility = "visible";
								break;
				}

				if (scope.compTypes && scope.compTypes.length > 0) {
						var aInst = scope.compTypes.find(function (comp) {
								return (comp.value == gateData.addType);
						});
						if (aInst) {
								scope.compType = aInst;
						}
				}
		});
		/*var pdiv = document.getElementById("DiagramPanel");
		pdiv.ondragover = function (evt) {
				var isCompDiagram = false;
				for (var i = 0; i < evt.dataTransfer.types.length; i++) {
						var type = evt.dataTransfer.types[i].toLowerCase();
						if (type == "dtcomponent") {
								isCompDiagram = true;
								break;
						}
				}
				if (isCompDiagram) {
						evt.preventDefault();
						evt.stopPropagation();
				}
		}.bind(pdiv);

		pdiv.ondrop = function (evt) {
				var dtcomp = evt.dataTransfer.getData("diagrams");
				dtcomp = JSON.parse(dtcomp);
				var scope = angular.element(document.querySelector('#gateControllerPanel')).scope();
				//scope.newDiagram = dtcomp;
				//var diagramInput = document.getElementById("newDiagramInput");
				//diagramInput.value = dtcomp.name;
		}*/
		var scope = angular.element(document.querySelector('#gateControllerPanel')).scope();
		for (var i = 0; i < gateData.length; i++) {
				var option = { name: gateData[i].name, value: gateData[i] };
						scope.newDiagramOptions.add(option);
		}
		scope.newDiagramOption = scope.newDiagramOptions[0];
}

function GetDataObject() {
		var dataObj = gateData || {};
		var scope = angular.element(document.querySelector('#gateControllerPanel')).scope();
		dataObj.name = scope.name;
		dataObj.desc = scope.desc;
		dataObj.addType = scope.compType.value;
		switch (dataObj.addType) {
				case "standard":
						dataObj.newGateType = scope.newGateType.value;
						dataObj.newName = scope.newName;
						dataObj.newDesc = scope.newDesc;
						break;
				case "diagram":
						dataObj.newDiagram = scope.newDiagramOption.value;
						break;
		}
		return dataObj;
}

function OnSave() {
    console.log("State saved.");
		isDirty = false;
}

//a new data package is sent from the parent window frame.
function DataChanged(dataObj) {
		console.log("Logic node addition received.");
		OnLoad(dataObj);
}

function somethingChanged() {
		isDirty = true;
		if (typeof UpdateBttns === "function")
				UpdateBttns();
}



var gateModule = angular.module('gateModule', []);
gateModule.controller('gateController', ['$scope', function ($scope) {
		$scope.newName = "";
		$scope.newDesc = "";
		$scope.compTypes = [
				{ name: "Standard Gate", value: "standard" },
				{ name: "Gate from Component Diagram", value: "diagram" }],
				$scope.compType = $scope.compTypes[0];

		$scope.newGateTypes = [
				{ name: "AND", value: "gtAnd" },
				{ name: "OR", value: "gtOr" }],
				$scope.newGateType = $scope.newGateTypes[0];
		$scope.newDiagramOptions = [];

		$scope.newDiagramOption = null;
		$scope.$watch('newName', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('newDesc', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('compType', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('newGateType', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('newDiagram', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });
		$scope.$watch('newDiagramOptions', function (newV, oldV) { if (newV !== oldV) somethingChanged(); });

		$scope.varsLoaded = false;
}]);
