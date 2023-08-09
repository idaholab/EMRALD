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

var stateData = null;
var diagramState = null;
function OnLoad(dataObj) {
  stateData = dataObj;
  var scope = angular.element(document.querySelector("#stateControllerPanel")).scope();

  UpdateFrameTitle("State: " + dataObj.name);
  scope.$apply(function () {
    scope.id = stateData.id;
    //scope.dbID = stateData.dbID;
    scope.name = stateData.name;
    scope.desc = stateData.desc;
    scope.eventActions = stateData.eventActions;
    scope.events = stateData.events;

    //----------------code for Status Value ---------------------
    scope.StatusValue = "Unknown";
    var statusEl = document.getElementById("statusValue_FieldSet");
    //make sure that we passed sidebar in the dataObj as parameter into the StateEditor 
    if (stateData.sidebar && statusEl) {
      var diagram = stateData.sidebar.getDiagramByStateName(stateData.name).Diagram;
      if (diagram) {
        //if the state is a component diagram.
        if (diagram.diagramType != "dtPlant") {

          //Set the StatusValue based on the singleStates's okState value.
          if (diagram.singleStates && diagram.singleStates.length > 0) {
            for (var i = 0; i < diagram.singleStates.length; i++) {
              if (diagram.singleStates[i].stateName == stateData.name) {
                diagramState = diagram.singleStates[i];
                break;
              }
            }
            if (diagramState) {
              scope.StatusValue = diagramState.okState;
            }
          }

          //The Status value is shown if diagram is a component.
          statusEl.style.visibility = "visible";
        }
        else {
          //otherwise the Status value is not shown.
          statusEl.style.visibility = "collapse";
        }
      }
      else {
        //if we can't find the diagram(the edit state never used in any diagram), we don't need to show the StatusValue options.
        statusEl.style.visibility = "collapse";
      }
    }
    //----------------------------------------------

    //Creates a map of events and exit checkboxes
    var eventsArray = scope.events;
    var valueArray = scope.eventActions;
    scope.eventsMap = eventsArray.map(function (value, index) {
      return {
        value: value,
        check: valueArray[index].moveFromCurrent
      }
    });

    if (scope.stateTypes && scope.stateTypes.length > 0) {
      var dInst = scope.stateTypes.find(function (st) {
        return (st.name == dataObj.stateType) || (("st" + st.name) == dataObj.stateType);
      });

      if (dInst) {
        scope.stateType = dInst;
      }
    }
  })
}

function GetDataObject() {
  stateData = stateData || {};
  var scope = angular.element(document.querySelector('#stateControllerPanel')).scope();
  var oldName = stateData.name;
  scope.$apply(function () {
    stateData.name = scope.name;
    stateData.desc = scope.desc;

    //----------------NEW CODE ---------------------
    //This update is to the diagram's singleState that this State belongs to.
    var diagram = stateData.sidebar.getDiagramByStateName(oldName).Diagram;
    //if (!diagram) return stateData;
    if (diagram.diagramType != "dtPlant") {
      if (scope.StatusValue == "Unknown") {
        //remove the singleState from the singleStates list.
        if (diagram && diagramState) {
          var idx = -1;
          for (var i = 0; i < diagram.singleStates.length; i++) {
            if (diagram.singleStates[i].stateName == stateData.name) {
              idx = i;
              break;
            }
          }
          if (idx >= 0)
            diagram.singleStates.splice(idx, 1);
        }
      }
      else if (diagramState)
        //update okState.
        diagramState.okState = scope.StatusValue;
      else {
        //The current State was originally start with as "Unknown" which doesn't exists in the
        //Diagram's singleStates.  Now it is set as "True" or "False", we need to insert new singleState.
        diagram.singleStates.push({ stateName: stateData.name, okState: scope.StatusValue });
      }
    }
    //----------------------------------------------

    stateData.events = scope.events;
    stateData.eventActions = scope.eventActions;
    stateData.stateType = "st" + scope.stateType.name;
    //TODO set the event actions that are to exit the state.      
  });
  //NOTE: attributes here must match the FTItem class.
  return stateData;
}

function OnSave() {
  console.log("State saved.");
  isDirty = false;
}

function DataChanged(dataObj) {
  console.log("State data changed received.");
  var scope = angular.element(document.querySelector('#stateControllerPanel')).scope();
  scope.$apply(function () {
    scope.name = dataObj.name;
    scope.desc = dataObj.desc;
    scope.events = stateData.events;
    scope.eventActions = stateData.eventActions;
    if (scope.stateTypes && scope.stateTypes.length > 0) {
      var sInst = scope.stateTypes.find(function (st) {
        return (st.name == dataObj.stateType) || (("st" + st.name) == dataObj.stateType);
      });

      if (sInst) {
        scope.stateType = sInst;
      }
    }
  });
}

function somethingChanged() {
  isDirty = true;
  if (typeof UpdateBttns === "function")
    UpdateBttns();
}

function eventChecked(el, evt) {
  var scope = angular.element(document.querySelector('#stateControllerPanel')).scope();
  for (var i = 0; i < scope.events.length; i++) {
    if (el) {
      if (scope.events[i] == el.value)
        scope.eventActions[i].moveFromCurrent = el.checked;
    }
  }
}



var stateModule = angular.module('stateModule', ['autosizeTextareaDirective']);
stateModule.controller('stateController', function ($scope) {
  $scope.name = "state1";
  $scope.desc = "new state";

  $scope.stateTypes = [
    { name: "Start", value: 0 },
    { name: "Standard", value: 1 },
    { name: "KeyState", value: 2 },
    { name: "Terminal", value: 3 }
  ],

  $scope.events = [];
  $scope.eventsMap = new Map();
  $scope.eventActions = [];
  $scope.stateType = $scope.stateTypes[0];
  $scope.$watch('name', function () {
    somethingChanged();
  }, true);
  $scope.$watch('desc', function () {
    somethingChanged();
  }, true);
  $scope.$watch('stateType', function () {
    somethingChanged();
  }, true);

  //-------------NEW CODE ----------------------
  $scope.StatusValue = "Unknown";
  $scope.$watch('StatusValue', function () {
    somethingChanged();
  }, true);
  //-------------------------------------------

});

