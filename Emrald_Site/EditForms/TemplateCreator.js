/**
 * @file TemplateCreator form logic.
 */
// @ts-check
/// <reference path="../scripts/jsdoc-types.js" />
/// <reference path="./lib/EditFormUtil.js" />
/// <reference path="../scripts/UI/Sidebar.js" />

/**
 * @namespace TemplateCreator
 */

/**
 * @typedef TemplateCreator.InputData
 * @property {EMRALD.ModelTemplate} model - The project data.
 */

/**
 * @typedef TemplateCreator.OutputData
 * @property {EMRALD.ModelTemplate} model - The modified model.
 * @property {TemplateCreatorEntry[]} entries - The entries.
 */

/**
 * @typedef TemplateCreator.Scope
 * @property {EMRALD.ModelTemplate} model - The EMRALD project.
 * @property {TemplateCreatorEntry[]} entries - The flattened list of things in the model.
 * @property {EMRALD.TemplateGroups[]} groups - The template groups.
 * @property {EMRALD.TemplateGroups | null} selectedGroup - The template groups.
 * @property {EMRALD.TemplateGroups[]} displayedGroups - The template groups to display.
 * @property {string} selectedGroupString - The template group represented as a string.
 * @property {() => void} stringifySelectedGroup - Stringifies the selected group.
 * @property {(group: EMRALD.TemplateGroup) => string} stringifySubGroup - Stringifies a group.
 * @property {string} find - Text to find to replace.
 * @property {string} replace - Replacement text.
 * @property {string} templateView - The view for browsing template groups.
 * @property {(index: number) => void} checkName - Checks if the name of the object of the given type at the given index conflicts.
 * @property {() => void} apply - Applies the search/replace.
 * @property {() => void} checkAllNames - Checks all names for conflicts.
 * @property {(entry: TemplateCreatorEntry) => void} checkEntryAction - Checks if the conflict message should be displayed for the given entry.
 * @property {(index: number) => void} nameChanged - Handles manually changing names.
 * @property {(state: boolean) => void} toggleLocks - Toggles all locks on/off.
 * @property {(state: string) => void} toggleAction - Sets all unlocked entries's actions.
 * @property {(parent: EMRALD.TemplateGroup | null, group: EMRALD.TemplateGroups) => void} selectGroup - Sets the template group for the model
 * @property {(parent: EMRALD.TemplateGroup | null, group: EMRALD.TemplateGroups) => void} unselectGroup - Sets the template group for the model
 * @property {(parent: EMRALD.TemplateGroup | null, group: EMRALD.TemplateGroups) => void} selectGroupInModel - Sets the template group for the model
 * @property {(parent: EMRALD.TemplateGroup | null, group: EMRALD.TemplateGroups) => void} unselectGroupInModel - Sets the template group for the model
 * @property {() => EMRALD.TemplateGroups[]} getGroupsFromLocalStorage - Adds a new group to local storage
 * @property {(groups: EMRALD.TemplateGroups[]) => void} setGroupsInLocalStorage - Adds a new group to local storage
 * @property {(group: EMRALD.TemplateGroups, refreshOnly: boolean) => void} addGroupToLocalStorage - Adds a new group to local storage
 * @property {(group: EMRALD.TemplateGroups) => void} updateGroupInLocalStorage - Updates a group in local storage
 * @property {(parentGroup: EMRALD.TemplateGroups) => void} assignParentGroupToChildGroups - Recursive: Sets all Child Groups to reference parent groups on the parent property.
 * @property {() => void} createNewGroup - Adds a new group to local storage
 * @property {(selectedGroup: EMRALD.TemplateGroup | null, groupOptions: EMRALD.TemplateGroups[]) => void} setDisplayedGroups - Displays the current list of groups/subgroups
 * @property {(parent: EMRALD.TemplateGroups) => void} createNewSubGroup - Adds a new subgroup to the parent group
 * @property {(child: EMRALD.TemplateGroups) => EMRALD.TemplateGroups} getTopLevelParentGroup - Gets the Group that is not a subgroup.
 * @property {(event: any, group: EMRALD.TemplateGroups, path: string[], currentName: string) => void} expandTree - Expands or collapses the tree view group.
 * @property {(path: string[]) => EMRALD.TemplateGroups[] | null} getSubgroupsFromPath - Gets all subgroups for a specified path.
 * @property {(path: string[], groupName: string, needsDigest: boolean) => void} selectGroupByPath - Selects a group based on the given path and specified group name.
 * @property {(path: string[]) => EMRALD.TemplateGroup | null} createTemplateGroupObjectFromPath - Turns a given path into a EMRALD.TemplateGroup object.
 * @property {(view: string) => void} toggleTemplateView - Changes the view for the group browser.
 */

/**
 * @typedef TemplateCreator.Window
 * @property {import('angular')} angular - AngularJS.
 * @property {(dataObj: TemplateCreator.InputData) => void} OnLoad - Function to load data from the parent window.
 * @property {() => TemplateCreator.OutputData} GetDataObject - Function to construct the returned data object.
 * @property {() => string} ValidateData - Function to validate the form data.
 * @property {SimApp.SimApp} simApp - The SimApp instance.
 */

/**
 * @typedef TemplateCreator.ActionObj
 * @property {string} name - The name of the entry.
 * @property {string} type - The type of the entry.
 */

/** @type {TemplateCreator.Window} */
const w = null;

/** @type {TemplateCreator.Scope} */
const templateCreatorScope = null;

const parentWindow = window.frameElement.ownerDocument.defaultView;
const { sidebar } = window.cast(parentWindow, w).simApp.mainApp;

/**
 * Entries displayed in the editor table.
 */
class TemplateCreatorEntry {
  /**
   * Constructs TemplateCreatorEntry.
   *
   * @param {*} v - The data to display.
   */
  constructor(v) {
    const [type] = Object.keys(v);
    this.type = type;
    this.data = v[this.type];
    this.action = 'ignore';
    this.isLocked = false;
    this.data.required = false;
    this.oldName = this.data.name;
  }
}

window.cast(window, w).OnLoad = (dataObj) => {
  console.log(dataObj);
  const scope = window.getScope(
    'templateCreatorControllerPanel',
    templateCreatorScope,
  );
  scope.$apply(() => {
    scope.groups = scope.getGroupsFromLocalStorage();
    scope.setDisplayedGroups(scope.model.group, scope.groups);
    scope.model = dataObj.model;
    scope.model.name += "_Template";
    scope.entries = [];
    Object.values(scope.model).forEach((value, i) => {
      if (Array.isArray(value)) {
        scope.entries = scope.entries.concat(
          value.map((v) => new TemplateCreatorEntry(v)),
        );
      }
    });
  });
};

window.cast(window, w).GetDataObject = () => {
  const scope = window.getScope(
    'templateCreatorControllerPanel',
    templateCreatorScope,
  );
  return {
    entries: scope.entries,
    model: scope.model,
  };
};

window.cast(window, w).ValidateData = () => {
  let conflictExists = false;
  const scope = window.getScope(
    'templateCreatorControllerPanel',
    templateCreatorScope,
  );
  return '';
};

const templateCreatorModule = window.angular.module('templateCreator', []);

/**
 * Angular controller for the form.
 *
 * @param {TemplateCreator.Scope} $scope - The Angular scope.
 */
const templateCreatorController = ($scope) => {
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
    version: '',
    group: null
  };
  $scope.entries = [];
  $scope.groups = [];
  $scope.displayedGroups = [];
  $scope.find = '';
  $scope.replace = '';
  $scope.selectGroup = null;
  $scope.templateView = 'group';

  $scope.apply = () => {
    $scope.entries.forEach((entry, i) => {
      if (!entry.isLocked) {
        const original = $scope.entries[i].data.name;
        $scope.entries[i].data.name = entry.data.name.replace(
          $scope.find,
          $scope.replace,
        );
        if (
          original !== $scope.entries[i].data.name
        ) {
          $scope.entries[i].isLocked = true;
        }
      }
    });
    $scope.find = '';
    $scope.replace = '';
  };

  $scope.checkEntryAction = (entry) => {
    console.log(entry);
  }

  $scope.nameChanged = (index) => {
    $scope.entries[index].isLocked = true;
  };

  $scope.toggleLocks = (state) => {
    $scope.entries.forEach((entry, i) => {
      $scope.entries[i].isLocked = state;
    });
  };

  $scope.toggleAction = (state) => {
    $scope.entries.forEach((entry, i) => {
      if (!entry.isLocked) {
        $scope.entries[i].action = state;
      }
    });
  };

  $scope.stringifySelectedGroup = () => {
    $scope.selectedGroupString = "";
    if ($scope.model.group !== null) {
      $scope.selectedGroupString = $scope.model.group.name;
      if ($scope.model.group.subgroup !== null) {
        $scope.selectedGroupString += $scope.stringifySubGroup($scope.model.group.subgroup)
      }
    }
  }

  $scope.stringifySubGroup = (group) => {
    let res = " > " + group.name;
    if (group.subgroup !== null) {
      res += $scope.stringifySubGroup(group.subgroup);
    }
    return res;
  }

  $scope.addGroupToLocalStorage = (groupObj, refreshOnly) => {
    /** @type {EMRALD.TemplateGroups[]} */
    let groups = $scope.getGroupsFromLocalStorage();

    if (!refreshOnly) {
      groups.push(groupObj);
    }

    $scope.setGroupsInLocalStorage(groups);
  }

  $scope.updateGroupInLocalStorage = (groupObj) => {
    /** @type {EMRALD.TemplateGroups[]} */
    let groups = $scope.getGroupsFromLocalStorage();

    let foundGroup = groups.findIndex(x => x.name === groupObj.name);
    if (foundGroup > -1) {
      groups.splice(foundGroup, 1);
    }
    groups.push(groupObj);

    $scope.setGroupsInLocalStorage(groups);
  }

  $scope.setGroupsInLocalStorage = (groups) => {
    localStorage.setItem('templateGroups', JSON.stringify(groups, (key, val) => { if (key === "parent") return null; else return val; }));
    $scope.groups = groups;
  }

  $scope.getGroupsFromLocalStorage = () => {
    /** @type {string | null} */
    let groupsString = localStorage.getItem('templateGroups');
    /** @type {EMRALD.TemplateGroups[]} */
    let groups = [];
    if (groupsString && groupsString !== "undefined") {
      groups = JSON.parse(groupsString);
    }
    groups.forEach((baseGroup) => {
      if (baseGroup.subgroups !== null) {
        $scope.assignParentGroupToChildGroups(baseGroup);
      }
    });
    return groups;
  }

  $scope.assignParentGroupToChildGroups = (parentGroup) => {
    if (parentGroup.subgroups !== null) {
      parentGroup.subgroups.forEach(subgroup => {
        subgroup.parent = parentGroup;
        if (subgroup.subgroups !== null) {
          $scope.assignParentGroupToChildGroups(subgroup);
        }
      });
    }
  }

  $scope.createNewGroup = () => {
    /** @type {string | null} */
    var newGroupName = prompt('Enter a New Group Name');
    if (newGroupName && newGroupName.trim()) {
      newGroupName = newGroupName.trim();
      /** @type {EMRALD.TemplateGroups} */
      let newGroupObj = {
        name: newGroupName,
        subgroups: null,
        parent: null
      }
      $scope.addGroupToLocalStorage(newGroupObj, false);
    }
    $scope.setDisplayedGroups($scope.model.group, $scope.groups);
  }

  $scope.createNewSubGroup = (parent) => {
    /** @type {string | null} */
    var newGroupName = prompt('Enter a New Sub Group Name');
    if (newGroupName && newGroupName.trim()) {
      newGroupName = newGroupName.trim();
      /** @type {EMRALD.TemplateGroups} */
      let newGroupObj = {
        name: newGroupName,
        subgroups: null,
        parent: parent
      }
      if (parent.subgroups === null) {
        parent.subgroups = []
      }
      parent.subgroups.push(newGroupObj);
      $scope.updateGroupInLocalStorage($scope.getTopLevelParentGroup(parent));
    }
    $scope.setDisplayedGroups($scope.model.group, $scope.groups);
  }

  $scope.getTopLevelParentGroup = (child) => {
    if (child.parent !== null) {
      return $scope.getTopLevelParentGroup(child.parent);
    } else {
      return child;
    }
  }

  $scope.selectGroup = (parent, group) => {
    $scope.selectedGroup = group;
    $scope.selectGroupInModel(parent, group);
    $scope.stringifySelectedGroup();
  }

  $scope.unselectGroup = (parent, group) => {
    $scope.selectedGroup = group.parent;
    $scope.unselectGroupInModel(parent, group);
    $scope.stringifySelectedGroup();
  }

  $scope.unselectGroupInModel = (parent, group) => {
    if (parent === null) {
      return;
    } else if (parent.subgroup === null) {
      $scope.model.group = null;
    } else if (parent.subgroup.subgroup === null) {
      parent.subgroup = null;
    } else {
      $scope.unselectGroupInModel(parent.subgroup, group);
    }
    $scope.setDisplayedGroups($scope.model.group, $scope.groups);
  }

  $scope.selectGroupInModel = (parent, group) => {
    if (parent === null) {
      $scope.model.group = {
        name: group.name,
        subgroup: null
      };
    } else if (parent.subgroup === null) {
      parent.subgroup = {
        name: group.name,
        subgroup: null
      };
    } else {
      $scope.selectGroupInModel(parent.subgroup, group);
    }
    $scope.setDisplayedGroups($scope.model.group, $scope.groups);
  }

  $scope.setDisplayedGroups = (selectedGroup, groupOptions) => {
    if (selectedGroup === null) {
      $scope.displayedGroups = groupOptions;
    } else {
      let foundGroup = groupOptions.find(x => x.name === selectedGroup.name);
      if (foundGroup) {
        if (selectedGroup.subgroup === null) {
          $scope.displayedGroups = foundGroup.subgroups ?? [];
        } else {
          $scope.setDisplayedGroups(selectedGroup.subgroup, foundGroup.subgroups ?? [])
        }
      } else {
        console.log("No groups found of the selected group.  This should never happen.");
      }
    }
  }



  $scope.expandTree = (event, group, path, currentName) => {
    let action = "";
    if (group !== null) {

      if (angular.element(event.target)[0].innerText.includes("+")) {
        angular.element(event.target)[0].innerText = " – "; // This is an "en dash" not a normal dash.  This is used because it looks better in the tree view.
        action = "expand";
      } else {
        angular.element(event.target)[0].innerText = " + ";
        action = "collapse";
      }
      if (group.subgroups === null) {
        return;
      }
      group.subgroups.forEach(subgroup => {
        if (action === "expand") {
          let child = document.createElement('div');
          angular.element(event.target).parent().append(child);
          child.outerHTML = `<div style="padding-left:1em"><div><span class="folder" onclick="angular.element(this).scope().expandTree(this, null, ['${group.name}'], '${subgroup.name}')"> + </span><span onclick='angular.element(this).scope().selectGroupByPath(["${group.name}"], "${subgroup.name}")'>${subgroup.name}</span></div></div>`;
        } else {
          angular.element(event.target).parent()[0].getElementsByTagName("div")[0].remove();
        }
      });
    } else {
      path.push(currentName);
      let subgroups = $scope.getSubgroupsFromPath(path);

      if (event.innerText.includes("+")) {
        event.innerText = " – "; // This is an "en dash" not a normal dash.  This is used because it looks better in the tree view.
        action = "expand";
      } else {
        event.innerText = " + ";
        action = "collapse";
      }
      if (subgroups === null) {
        return;
      }

      subgroups.forEach(subgroup => {
        if (action === "expand") {
          let child = document.createElement('div');
          event.parentElement.append(child);
          child.outerHTML = `<div style="padding-left:1em"><div><span class='folder' onclick='angular.element(this).scope().expandTree(this, null, ${JSON.stringify(path)}, "${subgroup.name}")'> + </span><span onclick='angular.element(this).scope().selectGroupByPath(${JSON.stringify(path)}, "${subgroup.name}")'>${subgroup.name}</span></div></div>`;
        } else {
          event.parentElement.getElementsByTagName("div")[0].remove();
        }
      });
    }
  }

  $scope.getSubgroupsFromPath = (path) => {
    /** @type {EMRALD.TemplateGroups[] | null} */
    let groups = $scope.groups;
    for (let index = 0; index < path.length; index++) {
      if (groups !== null) {
        groups = groups.find(group => group.name === path[index])?.subgroups ?? null;
      }
    }
    return groups;
  }


  $scope.selectGroupByPath = (path, group, needsDigest = true) => {
    /** @type {EMRALD.TemplateGroups[] | null} */
    let groups = $scope.groups;
    /** @type {EMRALD.TemplateGroups | null} */
    let mainGroup = null;
    /** @type {EMRALD.TemplateGroup} */
    $scope.model.group = $scope.createTemplateGroupObjectFromPath(path);
    path.push(group);
    for (let index = 0; index < path.length; index++) {
      if (groups !== null) {
        mainGroup = groups.find(group => group.name === path[index]) ?? null;
        groups = mainGroup?.subgroups ?? null;
      }
    }
    if (mainGroup) {
      $scope.selectGroup($scope.model.group, mainGroup);
    }

    if (needsDigest) {
      // @ts-ignore
      $scope.$digest();
    }
  }

  $scope.createTemplateGroupObjectFromPath = (path) => {
    if (path.length < 1) { return null; }
    /** @type {EMRALD.TemplateGroup} */
    let mainGroup = {
      name: path[0],
      subgroup: null
    };
    let group = mainGroup;
    for (let index = 1; index < path.length; index++) {
      group.subgroup = {
        name: path[index],
        subgroup: null
      }
      group = group.subgroup;
    }

    return mainGroup;
  }

  $scope.toggleTemplateView = (view) => {
    view = view.toLowerCase();
    $scope.templateView = view;
  }

};


templateCreatorModule.controller('templateCreatorController', [
  '$scope',
  templateCreatorController,
]);
