/**
 * @file ImportEditor form logic.
 */
// @ts-check
/// <reference path="../scripts/jsdoc-types.js" />
/// <reference path="./lib/EditFormUtil.js" />
/// <reference path="../scripts/UI/Sidebar.js" />

/**
 * @namespace ImportEditor
 */

/**
 * @typedef ImportEditor.InputData
 * @property {EMRALD.Model} model - The project data.
 * @property {boolean[]} conflicts - A list of conflicts.
 */

/**
 * @typedef ImportEditor.OutputData
 * @property {string} name - The name of the diagram.
 */

/**
 * @typedef ImportEditor.Scope
 * @property {boolean[]} conflicts - The name conflicts.
 * @property {EMRALD.Model} model - The EMRALD project.
 * @property {Entry[]} entries - The flattened list of things in the model.
 * @property {(index: number) => void} checkName - Checks if the name of the object of the given type at the given index conflicts.
 */

/**
 * @typedef ImportEditor.SimApp
 * @property {ImportEditor.SimApp} mainApp - The main app instance.
 * @property {*} sidebar - The global sidebar.
 */

/**
 * @typedef ImportEditor.Window
 * @property {import('angular')} angular - AngularJS.
 * @property {(dataObj: ImportEditor.InputData) => void} OnLoad - Function to load data from the parent window.
 * @property {() => ImportEditor.OutputData} GetDataObject - Function to construct the returned data object.
 * @property {ImportEditor.SimApp} simApp - The SimApp instance.
 */

/** @type {ImportEditor.Window} */
const w = null;

/** @type {ImportEditor.Scope} */
const importEditorScope = null;

const parentWindow = window.frameElement.ownerDocument.defaultView;
const { sidebar } = window.cast(parentWindow, w).simApp.mainApp;

/**
 * Entries displayed in the editor table.
 */
class Entry {
  /**
   * Constructs Entry.
   *
   * @param {*} v - The data to display.
   */
  constructor(v) {
    const [type] = Object.keys(v);
    this.type = type;
    this.data = v[this.type];
  }
}

window.cast(window, w).OnLoad = (dataObj) => {
  const scope = window.getScope(
    'importEditorControllerPanel',
    importEditorScope,
  );
  scope.$apply(() => {
    scope.conflicts = dataObj.conflicts;
    scope.model = dataObj.model;
    scope.entries = [];
    Object.values(scope.model).forEach((value) => {
      if (typeof value === 'object' && typeof value.length === 'number') {
        scope.entries = scope.entries.concat(
          value.map((v) => new Entry(v)),
        );
      }
    });
    scope.entries.forEach((entry, i) => {
      scope.checkName(i);
    });
  });
};

window.cast(window, w).GetDataObject = () => {
  const scope = window.getScope(
    'importEditorControllerPanel',
    importEditorScope,
  );
  return {
    name: scope.model.name,
  };
};

const importEditorModule = window.angular.module('importEditor', []);

/**
 * Angular controller for the form.
 *
 * @param {ImportEditor.Scope} $scope - The Angular scope.
 */
const importEditorController = ($scope) => {
  $scope.model = {
    ActionList: [],
    desc: '',
    DiagramList: [],
    EventList: [],
    ExtSimList: [],
    id: 0,
    LogicNodeList: [],
    name: '',
    StateList: [],
    VariableList: [],
  };
  $scope.conflicts = [];
  $scope.entries = [];

  $scope.checkName = (index) => {
    const entry = $scope.entries[index];
    if (entry) {
      $scope.conflicts[index] = sidebar[`${entry.type}Exists`](entry.data.name);
    }
  };
};

importEditorModule.controller('importEditorController', [
  '$scope',
  importEditorController,
]);
