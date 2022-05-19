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
 * @property {EMRALD.Model} model - The modified model.
 * @property {Entry[]} entries - The entries.
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
 * @property {(index: number) => void} nameChanged - Handles manually changing names.
 * @property {(state: boolean) => void} toggleLocks - Toggles all locks on/off.
 * @property {(state: string) => void} toggleAction - Sets all unlocked entries's actions.
 */

/**
 * @typedef ImportEditor.Window
 * @property {import('angular')} angular - AngularJS.
 * @property {(dataObj: ImportEditor.InputData) => void} OnLoad - Function to load data from the parent window.
 * @property {() => ImportEditor.OutputData} GetDataObject - Function to construct the returned data object.
 * @property {() => string} ValidateData - Function to validate the form data.
 * @property {SimApp.SimApp} simApp - The SimApp instance.
 */

/**
 * @typedef ImportEditor.ActionObj
 * @property {string} name - The name of the entry.
 * @property {string} type - The type of the entry.
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
    this.oldName = this.data.name;
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
    scope.entries.forEach((entry, i) => {
      if (!entry.isConflicting) {
        scope.entries[i].isLocked = true;
      }
    });
  });
};

window.cast(window, w).GetDataObject = () => {
  const scope = window.getScope(
    'importEditorControllerPanel',
    importEditorScope,
  );
  return {
    entries: scope.entries,
    model: scope.model,
  };
};

window.cast(window, w).ValidateData = () => {
  let conflictExists = false;
  const scope = window.getScope(
    'importEditorControllerPanel',
    importEditorScope,
  );
  scope.entries.forEach((entry) => {
    conflictExists = conflictExists || entry.isConflicting;
  });
  if (conflictExists) {
    return 'Please resolve conflicting names.';
  }
  return '';
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
      const original = entries[i].data.name;
      entries[i].data.name = entry.data.name.replace(
        $scope.find,
        $scope.replace,
      );
      $scope.checkName(i);
      if (original !== entries[i].data.name && !entries[i].isConflicting) {
        entries[i].isLocked = true;
      }
    });
    $scope.find = '';
    $scope.replace = '';
  };

  $scope.nameChanged = (index) => {
    $scope.checkName(index);
    $scope.entries[index].isLocked = true;
  };

  $scope.toggleLocks = (state) => {
    $scope.entries.forEach((entry, i) => {
      $scope.entries[i].isLocked = state;
    });
  };

  $scope.toggleAction = (state) => {
    const entries = $scope.getUnlockedEntries();
    entries.forEach((entry, i) => {
      entries[i].action = state;
    });
  };
};

importEditorModule.controller('importEditorController', [
  '$scope',
  importEditorController,
]);
