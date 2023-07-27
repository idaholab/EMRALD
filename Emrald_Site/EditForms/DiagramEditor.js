/**
 * @file Diagram Editor logic.
 * @copyright 2021 Battelle Energy Alliance
 */
// @ts-check

/**
 * @namespace DiagramEditor
 */

/**
 * @typedef DiagramEditor.Scope
 * @property {EMRALD.ModelTemplate[]} diagramList - The EMRALD project.
 * 
 */


/** @type {DiagramEditor.Scope} */
const diagramEditorScope = null;


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

function loadCustomDiagramLabels() {
    const parentWindow = window.frameElement.ownerDocument.defaultView;
    const sidebar = parentWindow.simApp.mainApp.sidebar;
    const scope = angular
      .element(document.querySelector('#diagramControllerPanel'))
      .scope();
    scope.diagramTypes = scope.diagramTypes.concat(
      sidebar.getCustomDiagramTypes().map((dt) => {
        return {
          name: dt.label,
          value: dt.type,
        };
      }),
    );
}

function updateDiagramTypeSelection(diagramType, diagramLabel) {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();
    if (scope.diagramTypes && scope.diagramTypes.length > 0) {
        if (diagramType === null && diagramLabel === null) {
            scope.data.diagramType = scope.diagramTypes[0];
        }

        var dInst = scope.diagramTypes.find(function (dt) {
            if (diagramLabel) {
                return (dt.value === diagramType && dt.name === diagramLabel);
            }
            else {
                return (dt.value === diagramType);
            }
        });

        if (dInst) {
            scope.data.diagramType = dInst;
        }
        else {
            scope.data.diagramType = scope.diagramTypes[0];
        }
    }
    scope.initialChange = false;
    scope.timeout(() => scope.loading = false);
}

function tryChangeDiagramType(oldType, newType) {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();
    console.log("Old Type: " + oldType);
    console.log("New Type: " + newType);
    if (!scope.changeDiagramTypeSidebarCallbackFunction(scope.name, oldType, newType)) {
        alert("Cannot Change Diagram Type.");
        return false;
    }
    return true;
}

function mergeIntoCurrentProject() {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();

    let dialog = document.createElement('input');
    dialog.id = "MergeIntoCurrentProjectDialogInput";
    dialog.value = "";
    dialog.type = 'file';
    dialog.style.display = 'none';
    dialog.accept = "application/json"; //only support in chrome and IE.  FF doesn't work with hint.
    dialog.filetype = "json";

    let handleFileSelected = function (evt) {
        if (!evt.target.files || !evt.target.files[0]) return;
        var afile = evt.target.files[0];
        var aname = afile.name.substring(0, afile.name.indexOf('.'));
        if (aname === "") aname = afile.name;
        var ext = /\.[0-9a-z]+$/.exec(afile.name);
        ext = ext.length > 0 ? ext[0] : "";
        switch (ext) {
            case '.json':
                var reader = new FileReader();
                reader.onload = function (evt) {
                    var content = evt.target.result;
                    scope.data.importedContent = JSON.parse(content);
                    if (scope.data.importedContent.DiagramList.length > 1) {
                        alert("More than one diagram in file.  Please choose a file with only one diagram or use the Merge option from the Project menu to import the whole file.");
                        scope.data.importedContent = null;
                        scope.data.fileName = null;
                        scope.$apply();
                        return;
                    }
                    scope.data.fileName = afile.name;
                    scope.data.diagramType = scope.diagramTypes.filter(x => x.value === scope.data.importedContent.DiagramList[0].Diagram.diagramType)[0];
                    scope.name = scope.data.importedContent.DiagramList[0].Diagram.name;
                    scope.desc = scope.data.importedContent.DiagramList[0].Diagram.desc;
                    scope.$apply();
                }.bind(this);
                reader.readAsText(afile);
                break;
        }

    }.bind(this);

    dialog.addEventListener("change", handleFileSelected, false);
    document.body.appendChild(dialog);
    dialog.click();
}

function removeFile() {
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();
    scope.name = '';
    scope.desc = '';
    scope.data.importedContent = null;
    scope.data.fileName = null;
    scope.$apply();
}

var diagramData = null;
function OnLoad(dataObj) {
    diagramData = dataObj;
    var scope = angular.element(document.querySelector("#diagramControllerPanel")).scope();

    scope.$apply(function () {
        if (diagramData.id < 0) {
            scope.createDiagram = true;
        }

        scope.id = diagramData.id;
        //scope.dbID = diagramData.dbID;
        scope.name = diagramData.name;
        scope.desc = diagramData.desc;
        loadCustomDiagramLabels();
        scope.states = diagramData.states;
        const diagramType = scope.diagramTypes.find((type) => type.name === dataObj.diagramLabel);
        if (!diagramType) {
            scope.data.diagramType = scope.diagramTypes[1];
        } else {
            scope.settingInitialDiagramType = true;
            scope.data.diagramType = diagramType;
        }

        if (dataObj.diagramType == "dtComponent" || dataObj.diagramType == "dtSystem") {
            scope.singleStates = diagramData.singleStates;
            if (scope.singleStates)
                scope.singleStates.forEach(function (state) {
                    state.inSingleStateGroup = state.okState.toUpperCase() == "TRUE";
                });
            var el = document.getElementById("singleStatePanel");
            if (el) {
                el.style.display = "block";
            }
        }

        /** @type {EMRALD.ModelTemplate[]} */
        scope.diagramList = diagramData.diagramList;
        scope.diagramTemplates = diagramData.diagramTemplates;
        if (scope.diagramTemplates && scope.diagramTemplates.length > 0) {
            var aInst = scope.diagramTemplates.find(function (temp) {
                return (temp == diagramData.diagramTemplate);
            });
            if (aInst) {
                scope.diagramTemplate = aInst;
            }

        }
        else {
            var templateElement = document.getElementById("TemplateOption");
            var templateLabelElement = document.getElementById("TemplateOptionLabel");
            if (templateElement) {
                templateElement.style.visibility = "hidden";
                templateLabelElement.style.visibility = "hidden";
            }
        }
        if (dataObj.changeDiagramType) {
            scope.changeDiagramTypeSidebarCallbackFunction = dataObj.changeDiagramType;
        }
        scope.initializeGroupView();
    });
}

function GetDataObject() {
    diagramData = diagramData || {};
    var scope = angular.element(document.querySelector('#diagramControllerPanel')).scope();
    diagramData.name = scope.name;
    diagramData.desc = scope.desc;
    if (scope.data.diagramType.value === 'newType') {
        diagramData.diagramLabel = scope.newType.label;
        diagramData.diagramType = scope.newType.type;
    } else {
        diagramData.diagramLabel = scope.data.diagramType.name;
        diagramData.diagramType = scope.data.diagramType.value;
    }
    if (diagramData.diagramType == 'dtComponent' || diagramData.diagramType == 'dtSystem') {
        if (diagramData.singleStates)
            diagramData.singleStates.forEach(
                function (state) {
                    state.okState = "" + state.inSingleStateGroup;
                    delete state.inSingleStateGroup;
                });
    }
    if (scope.data.importedContent) {
        diagramData.importedContent = scope.data.importedContent;
    }
    if (scope.selectedTemplate !== null) {
        diagramData.diagramTemplate = scope.diagramList[scope.selectedTemplate].name;
    }
    diagramData.forceMerge = scope.data.forceMerge;
    return diagramData;
}

function OnSave() {
    console.log("Diagram saved.");
    isDirty = false;
}

function DataChanged(dataObj) {
    console.log("Diagram data changed received.");
    OnLoad(dataObj);
}

function somethingChanged() {
    isDirty = true;
    if (typeof UpdateBttns === "function")
        UpdateBttns();
}

//Default diagram editor values
var diagramModule = angular.module('diagramModule', []);
diagramModule.controller('diagramController', function ($scope, $timeout) {
    $scope.name = "diagram1";
    $scope.desc = "new diagram";
    $scope.diagramTypes = [
        { name: "Create new...", value: "newType" },
        { name: "Plant", value: "dtPlant" },
        { name: "System", value: "dtSystem" },
        { name: "Component", value: "dtComponent" },
        { name: "Other", value: "dtOther" },
    ];
    $scope.diagramTemplates = [];
    $scope.diagramTemplate = "";
    $scope.singleStatesHeader = [{ column: "Name" }, { column: "Success State" }];
    $scope.singleStates = [];
    $scope.changeDiagramTypeSidebarCallbackFunction = () => true;
    $scope.loading = true;
    $scope.initialChange = true;
    $scope.timeout = $timeout;
    $scope.createDiagram = false;
    $scope.templateView = 'tree';
    $scope.currentGroupTemplates = [];
    $scope.currentGroupButtons = [];
    $scope.currentGroupPath = [];
    $scope.groupTree = [];
    $scope.data = {
        diagramType: $scope.diagramTypes[1],
        fileName: "",
        forceMerge: false,
        importedContent: null,
        usingImportedContent: false
    }
    $scope.showNewTypeEditor = false;
    $scope.typeCategories = [
        {
            label: 'Single State',
            value: 'dtComponent'
        }, {
            label: 'Multi State',
            value: 'dtOther',
        },
    ];
    $scope.newType = {
        label: '',
        type: $scope.typeCategories[0],
    };
    $scope.settingInitialDiagramType = false;


    $scope.$watch('name', function () {
        somethingChanged();
    }, true);
    $scope.$watch('desc', function () {
        somethingChanged();
    }, true);
    $scope.$watch('data.diagramType', function (newValue, oldValue) {
        if ($scope.settingInitialDiagramType) {
            $scope.settingInitialDiagramType = false;
        } else if (newValue) {
            if ($scope.loading) {
                $timeout(() => $scope.loading = false);
            }
            else if (tryChangeDiagramType(oldValue.value, newValue.value)) {
                $scope.onTypeChanged();
                somethingChanged();
            }
            else {
                updateDiagramTypeSelection(oldValue.value, oldValue.name);
                $scope.loading = true;
            }
        }
    }, true);
    $scope.$watch('diagramTemplate', function (newV, oldV) { if (newV !== oldV) somethingChanged(); }, true);

    $scope.$watch('singleStates', function () {
        somethingChanged();
    }, true);

    $scope.onTypeChanged = function () {
        var el = document.getElementById("singleStatePanel");
        if (el) {
            if ($scope.data.diagramType.value <= 1) {
                el.style.display = 'block';
            }
            else {
                el.style.display = 'none';
            }
        }
        $scope.showNewTypeEditor = $scope.data.diagramType.value === 'newType';
    }

    $scope.selectedTemplate = null;
    $scope.data.templateIsSelected = false;
    $scope.chooseTemplate = function (index) {
        if ($scope.selectedTemplate === index) {
            $scope.selectedTemplate = null;
            $scope.data.templateIsSelected = false;
            $scope.name = '';
            $scope.desc = '';
        } else {
            if ($scope.diagramList[index].disabledReasons.length > 0){
                alert(`This template cannot be selected because: \n\n${$scope.diagramList[index].disabledReasons.join('\n')}`);
                return;
            }
            $scope.selectedTemplate = index;
            $scope.data.templateIsSelected = true;
            $scope.data.forceMerge = true;
            $scope.name = $scope.diagramList[index].DiagramList[0].Diagram.name;
            $scope.desc = $scope.diagramList[index].DiagramList[0].Diagram.desc;
        }
    };

    $scope.selectedTemplateFromGroup = null;
    $scope.chooseTemplateFromCurrentGroup = function (index) {
        let realIndex = $scope.diagramList.indexOf($scope.currentGroupTemplates[index]);
        //$scope.selectedTemplateFromGroup = index;
        //$scope.chooseTemplate(realIndex);

        if ($scope.selectedTemplateFromGroup === index) {
            $scope.selectedTemplateFromGroup = null;
            $scope.selectedTemplate = null;
            $scope.data.templateIsSelected = false;
            $scope.name = '';
            $scope.desc = '';
        } else {
            if ($scope.diagramList[realIndex].disabledReasons.length > 0){
                alert(`This template cannot be selected because: \n\n${$scope.diagramList[realIndex].disabledReasons.join('\n')}`);
                return;
            }
            $scope.selectedTemplateFromGroup = index;
            $scope.selectedTemplate = realIndex;
            $scope.data.templateIsSelected = true;
            $scope.data.forceMerge = true;
            $scope.name = $scope.diagramList[realIndex].DiagramList[0].Diagram.name;
            $scope.desc = $scope.diagramList[realIndex].DiagramList[0].Diagram.desc;
        }
    }

    $scope.getGroupsFromLocalStorage = () => {
        /** @type {string | null} */
        let groupsString = localStorage.getItem('templates');
        /** @type {EMRALD.ModelTemplate[]} */
        let groups = [];
        if (groupsString && groupsString !== "undefined") {
          groups = JSON.parse(groupsString);
        }

        return groups;
      }

    $scope.stringifyGroup = (group) => {
        let groupString = "";
        if (group !== undefined && group !== null){
          groupString = group.name;
          if (group.subgroup !== null){
            groupString += $scope.stringifySubGroup(group.subgroup)
          }
        }
        return groupString;
      }

    $scope.stringifySubGroup = (group) => {
        let res = " > " + group.name;
        if (group.subgroup !== null) {
            res += $scope.stringifySubGroup(group.subgroup);
        }
        return res;
    }

    $scope.createGroupTree = () => {
        /** @type {EMRALD.TemplateGroups[]} */
        let groups = [];
        /** @type {EMRALD.ModelTemplate[]} */
        let templates = $scope.diagramList;
        templates.forEach(template => {
            let path = [];
            if (template.group !== undefined && template.group !== null){
                path.push(template.group.name);
            }

            /** @type {number} */
            let level = 2;
            while ($scope.getGroupNameForLevelFromTemplate(level, template) !== null){
                path.push($scope.getGroupNameForLevelFromTemplate(level, template));
                level++;
            }

            groups = $scope.mergePathIntoGroups(path, groups);
        });
        $scope.groupTree = groups;
    }

    $scope.expandTree = (event, group, path, currentName) => {
        let action = "";
        if (group !== null){

            if (angular.element(event.target)[0].innerText.includes("+")){
                angular.element(event.target)[0].innerText = " – "; // This is an "en dash" not a normal dash.  This is used because it looks better in the tree view.
                action = "expand";
            } else {
                angular.element(event.target)[0].innerText = " + ";
                action = "collapse";
            }
            group.subgroups.forEach(subgroup => {
                if (action === "expand") {
                    let child = document.createElement('div');
                    angular.element(event.target).parent().append(child);
                    child.outerHTML = `<div style="padding-left:1em"><div><span class="folder" onclick="angular.element(this).scope().expandTree(this, null, ['${group.name}'], '${subgroup.name}')"> + </span><span class="tree-path-option" onclick='angular.element(this).scope().showTemplatesBelongingToPath(["${group.name}"], "${subgroup.name}", this)'>${subgroup.name}</span></div></div>`;
                } else {
                    angular.element(event.target).parent()[0].getElementsByTagName("div")[0].remove();
                }
            });
        } else {
            path.push(currentName);
            let subgroups = $scope.getSubgroupsFromPath(path);

            if (event.innerText.includes("+")){
                event.innerText = " – "; // This is an "en dash" not a normal dash.  This is used because it looks better in the tree view.
                action = "expand";
            } else {
                event.innerText = " + ";
                action = "collapse";
            }

            subgroups.forEach(subgroup => {
                if (action === "expand") {
                    let child = document.createElement('div');
                    event.parentElement.append(child);
                    child.outerHTML = `<div style="padding-left:1em"><div><span class='folder' onclick='angular.element(this).scope().expandTree(this, null, ${JSON.stringify(path)}, "${subgroup.name}")'> + </span><span class="tree-path-option" onclick='angular.element(this).scope().showTemplatesBelongingToPath(${JSON.stringify(path)}, "${subgroup.name}", this)'>${subgroup.name}</span></div></div>`;
                } else {
                    event.parentElement.getElementsByTagName("div")[0].remove();
                }
            });
        }
    }

    $scope.getSubgroupsFromPath = (path) => {
        /** @type {EMRALD.TemplateGroups[] | null} */
        let groups = $scope.groupTree;
        for (let index = 0; index < path.length; index++){
            if (groups !== null) {
                groups = groups.find(group => group.name === path[index])?.subgroups ?? null;
            }
        }
        return groups;
    }

    $scope.showTemplatesBelongingToPath = (path, subgroup, event, needsDigest = true) => {
        /** @type {EMRALD.ModelTemplate[]} */
        let diagramList = $scope.diagramList;
        /** @type {EMRALD.ModelTemplate[]} */
        let groupTemplates = [];

        path.push(subgroup);
        diagramList.forEach(template => {
            let existsInCurrentGroup = true;
            for(let index = 0; index < path.length; index++){
                if ($scope.getGroupNameForLevelFromTemplate(index + 1, template) !== path[index]) {
                    existsInCurrentGroup = false;
                    break;
                }
            }
            if ($scope.getGroupNameForLevelFromTemplate(path.length + 1, template) !== null) {
                // This means that the template belongs to a subgroup of the selected group, so it should not be shown.
                return;
            }
            if(existsInCurrentGroup) {
                groupTemplates.push(template);
            }
        });

        $scope.currentGroupTemplates = groupTemplates;
        $scope.currentGroupPath = path;
        if (needsDigest) {
            $scope.$digest();
        }

      let allTreePathOptions = document.getElementsByClassName('tree-path-option');
      for (let i = 0; i < allTreePathOptions.length; i++) {
        allTreePathOptions[i].classList.remove('active-tree-path');
      }
      if (event.parentElement === undefined) {
        event = angular.element(event.target)[0];
      }
      event.classList.add('active-tree-path')

    }



    $scope.mergePathIntoGroups = (/** @type {string[]} */ path, /** @type {EMRALD.TemplateGroups[]} */ groups) => {
        /** @type {EMRALD.TemplateGroups[] | null} */
        let currentGroups = groups;
        /** @type {EMRALD.TemplateGroups | null} */
        let previousGroup = null;

        for(let index = 0; index < path.length; index ++){
            if (currentGroups === null){
                currentGroups = [];
            }

            /** @type {boolean} */
            let matched = false;
            /** @type {EMRALD.TemplateGroups} */
            let currentGroup = {
                name: path[index],
                subgroups: [],
                parent: previousGroup
            };

            currentGroups.forEach(group => {
                if (path[index] === group.name) {
                    matched = true;
                    currentGroup = group;
                    return;
                }
            });

            if(!matched) {
                currentGroups.push(currentGroup);
            }

            previousGroup = currentGroup;
            currentGroups = currentGroup.subgroups;
        }
        return groups;
    }

    $scope.initializeGroupView = () => {
        /** @type {EMRALD.ModelTemplate[]} */
        let currentGroupTemplates = [];
        /** @type {string[]} */
        let currentGroupButtons = [];
        /** @type {EMRALD.ModelTemplate[]} */
        let templates = $scope.diagramList;
        templates.forEach(template => {
            if (template.group == null){
                currentGroupTemplates.push(template);
            } else if(!currentGroupButtons.includes(template.group.name)) {
                currentGroupButtons.push(template.group.name);
            }
        });

        $scope.currentGroupTemplates = currentGroupTemplates;
        $scope.currentGroupButtons = currentGroupButtons;
        $scope.currentGroupPath = [];
        $scope.selectedTemplateFromGroup = null;

        $scope.createGroupTree();
    }

    $scope.goDownGroupLevel = (groupName) => {
        $scope.selectedTemplateFromGroup = null;
        /** @type {string[]} */
        let path = $scope.currentGroupPath;
        path.push(groupName);
        /** @type {EMRALD.ModelTemplate[]} */
        let diagramList = $scope.diagramList;
        /** @type {EMRALD.ModelTemplate[]} */
        let groupTemplates = [];
        /** @type {string[]} */
        let buttons = [];
        diagramList.forEach(template => {
            let existsInCurrentGroup = true;
            for(let index = 0; index < path.length; index++){
                if ($scope.getGroupNameForLevelFromTemplate(index + 1, template) !== path[index]) {
                    existsInCurrentGroup = false;
                    break;
                }
            }
            if(existsInCurrentGroup) {
                let newGroupButton = $scope.getGroupNameForLevelFromTemplate(path.length + 1, template);
                if (newGroupButton === null) {
                    groupTemplates.push(template);
                } else if(!buttons.includes(newGroupButton)) {
                    buttons.push(newGroupButton);
                }
            }
        });
        $scope.currentGroupTemplates = groupTemplates;
        $scope.currentGroupButtons = buttons;
        $scope.currentGroupPath = path;
    }

    $scope.goUpGroupLevel = () => {
        $scope.selectedTemplateFromGroup = null;
        /** @type {string[]} */
        let path = $scope.currentGroupPath;
        path.pop();
        if (path.length < 1) {
            $scope.initializeGroupView();
            return;
        }
        /** @type {EMRALD.ModelTemplate[]} */
        let diagramList = $scope.diagramList;
        /** @type {EMRALD.ModelTemplate[]} */
        let groupTemplates = [];
        /** @type {string[]} */
        let buttons = [];
        diagramList.forEach(template => {
            let existsInCurrentGroup = true;
            for(let index = 0; index < path.length; index++){
                if ($scope.getGroupNameForLevelFromTemplate(index + 1, template) !== path[index]) {
                    existsInCurrentGroup = false;
                    break;
                }
            }
            if(existsInCurrentGroup) {
                let newGroupButton = $scope.getGroupNameForLevelFromTemplate(path.length + 1, template);
                if (newGroupButton === null) {
                    groupTemplates.push(template);
                } else if(!buttons.includes(newGroupButton)) {
                    buttons.push(newGroupButton);
                }
            }
        });
        $scope.currentGroupTemplates = groupTemplates;
        $scope.currentGroupButtons = buttons;
        $scope.currentGroupPath = path;
    }

    $scope.getGroupNameForLevelFromTemplate = (/** @type {number} */ level, /** @type {EMRALD.ModelTemplate} */template) => {
        /** @type {EMRALD.TemplateGroup | null} */
        let group = template.group;
        if (group === undefined || group === null || level < 1){
            return null;
        }
        for (let l = 1; l <= level; l++) {
            if (group === null) {
                return null;
            } else if (l === level) {
                return group.name;
            } else {
                group = group.subgroup;
            }
        }
    }

    $scope.toggleTemplateView = (/** @type {string} */ view) => {
        view = view.toLowerCase();
        $scope.templateView = view;
        if ($scope.templateView === 'group') {
            $scope.initializeGroupView();
        }
    }

});
