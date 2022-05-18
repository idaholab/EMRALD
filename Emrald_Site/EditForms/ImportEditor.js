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
 * @property {EMRALD.Model} model - The EMRALD project.
 * @property {Entry[]} entries - The flattened list of things in the model.
 * @property {string} find - Text to find to replace.
 * @property {string} replace - Replacement text.
 * @property {(index: number) => void} checkName - Checks if the name of the object of the given type at the given index conflicts.
 * @property {() => void} apply - Applies the search/replace.
 * @property {() => void} checkAllNames - Checks all names for conflicts.
 * @property {() => Entry[]} getUnlockedEntries - Gets only unlocked entries.
 * @property {(entry: Entry) => void} checkEntryAction - Checks if the conflict message should be displayed for the given entry.
 */

/**
 * @typedef ImportEditor.Window
 * @property {import('angular')} angular - AngularJS.
 * @property {(dataObj: ImportEditor.InputData) => void} OnLoad - Function to load data from the parent window.
 * @property {() => ImportEditor.OutputData} GetDataObject - Function to construct the returned data object.
 * @property {SimApp.SimApp} simApp - The SimApp instance.
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
   * @param {boolean} hasConflict - If the entry has a name conflict.
   */
  constructor(v, hasConflict) {
    const [type] = Object.keys(v);
    this.type = type;
    this.data = v[this.type];
    this.action = 'rename';
    this.isLocked = false;
    this.hasConflict = hasConflict;
  }

  /**
   * Context-aware conflict flag.
   *
   * @returns {boolean} If the entry is conflicting.
   */
  get isConflicting() {
    return this.hasConflict && this.action === 'rename';
  }
}

window.cast(window, w).OnLoad = (dataObj) => {
  const scope = window.getScope(
    'importEditorControllerPanel',
    importEditorScope,
  );
  scope.$apply(() => {
    scope.model = dataObj.model;
    scope.entries = [];
    Object.values(scope.model).forEach((value, i) => {
      if (typeof value === 'object' && typeof value.length === 'number') {
        scope.entries = scope.entries.concat(
          value.map((v) => new Entry(v, dataObj.conflicts[i])),
        );
      }
    });
    scope.checkAllNames();
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
  $scope.entries = [];
  $scope.find = '';
  $scope.replace = '';

  $scope.getUnlockedEntries = () => $scope.entries.filter(
    (entry) => !entry.isLocked,
  );

  $scope.checkName = (index) => {
    const entry = $scope.entries[index];
    if (entry) {
      entry.hasConflict = sidebar[`${entry.type}Exists`](entry.data.name);
    }
  };

  $scope.checkAllNames = () => {
    $scope.entries.forEach((entry, i) => {
      $scope.checkName(i);
    });
  };

  $scope.apply = () => {
    const entries = $scope.getUnlockedEntries();
    entries.forEach((entry, i) => {
      entries[i].data.name = entry.data.name.replace(
        $scope.find,
        $scope.replace,
      );
    });
    $scope.find = '';
    $scope.replace = '';
    $scope.checkAllNames();
  };
};

importEditorModule.controller('importEditorController', [
  '$scope',
  importEditorController,
]);
