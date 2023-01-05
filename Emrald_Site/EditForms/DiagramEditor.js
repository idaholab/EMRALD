/**
 * @file Diagram Editor logic.
 * @copyright 2021 Battelle Energy Alliance
 */
// @ts-check

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
        diagramData.diagramTemplate = scope.diagramTemplates[scope.selectedTemplate];
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
        } else {
            $scope.selectedTemplate = index;
            $scope.data.templateIsSelected = true;
        }
    };

});
