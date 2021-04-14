// Copyright 2021 Battelle Energy Alliance


//switch between detail panels.
function handleSelection() {
}

function SetOf(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = arr[i];
  }
  return obj;
}

//inline filter for number entry.  support scientific notation as well.
var numberKeys = SetOf([43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 69, 101]);
function validateNumber(elt, evt) {
  var code = (evt.which) ? evt.which : event.keyCode;
  code = code == 101 ? 69 : code;
  if (!(code in numberKeys)) return false;
  //digits: 0-9, period (.), minus (-), Plus (+), Scientific (e or E).
  var period = 46, minus = 45, plus = 43, E = 69;
  //if ((code < 48 || code > 57) && code !== period && code !== minus && code !==plus && code !== e && code !== E) return false;
  var ch = elt.selectionStart > 0 ? elt.value.toUpperCase()[elt.selectionStart - 1] : null;

  if (elt.value.toUpperCase().indexOf('E') >= 0 && code == E) return false;

  if (code == period) {
    //there can be one period in a SN number, ie: -5.24E+10, which the period is on the left side of the 'E'
    if (elt.value.toUpperCase().indexOf('E') > elt.value.indexOf('.')) return false;
    if (elt.value.indexOf('.') >= 0) return false;  // already a point, not allow another.
  }

  if (code == plus) {
    if (ch !== 'E') return false;
    else {
      if (elt.value.indexOf('+') > 0) return false;
    }
  }

  //all these just to make sure the minus(-) is keyed at correct location.
  if (code == minus) {
    var n = elt.value.indexOf('-', 0);
    var m = elt.value.indexOf('-', 1);
    if (ch !== 'E') {
      if (n == 0 && elt.selectionStart <= 1) return false;
      if (n == 0 && m > 0) return false;
      if (n < 0 && m > 0 && elt.selectionStart > 0) return false;
      if (m < 0 && elt.selectionStart >= 1) return false;
    }
    else {
      if (m > 0) return false;
    }
  }
  return true;
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

var linkData = null;
function OnLoad(dataObj) {
  linkData = dataObj;
  var scope = angular.element(document.querySelector("#linkControllerPanel")).scope();

  scope.$apply(function () {
    scope.toState = linkData.toState;
    scope.prob = linkData.prob;
    scope.failDesc = linkData.failDesc;
  });
}

function GetDataObject() {
  var dataObj = linkData || {};
  var scope = angular.element(document.querySelector('#linkControllerPanel')).scope();
  dataObj.toState = scope.toState;
  dataObj.failDesc = scope.failDesc;
  dataObj.prob = scope.prob;
  //NOTE: attributes here must match the FTItem class.
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


var actionModule = angular.module('linkModule', []);
actionModule.controller('linkController', ['$scope', function ($scope) {
  $scope.toState = "";
  $scope.prob = -1;
  $scope.failDesc = "";

  $scope.$watch('prob', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      somethingChanged();
    }
  });
  $scope.$watch('failDesc', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      somethingChanged();
    }
  });

}]);

