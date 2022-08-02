// Copyright 2021 Battelle Energy Alliance
// @ts-check
/// <reference path="../jsdoc-types.js" />

/* this file is code for all functions having to do with upper menu bar (save, open, new project ... ext)
		Also, please note that demo function is empty as of July 27*/
"use strict";
//------------------
function adjustWindowPos(container, el) {
  var w = parseInt(el.style.width);
  var h = parseInt(el.style.height);
  var px = parseInt(container.style.left);
  var py = parseInt(container.style.top);
  var dx = (container.clientWidth - w) / 2;
  var dy = (container.clientHeight - h) / 2;

  el.style.left = dx + 'px';
  el.style.top = dy + 'px';
}

function downloadSolver() {
  var link = document.createElement("a");
  link.target = "_blank";
  link.href = "https://github.com/idaholab/EMRALD/releases/latest/download/EMRALD_SimEngine.zip";  //The file to download.
  link.click();
}

function downloadClientTester() {
  var link = document.createElement("a");
  link.target = "_blank";
  link.href = "https://github.com/idaholab/EMRALD/releases/latest/download/XMPPClientTester.zip";  //The file to download.
  link.click();
}

function downloadClientTesterSource() {
  var link = document.createElement("a");
  link.target = "_blank";
  link.href = "https://github.com/idaholab/EMRALD/tree/main/XmppClient";  //The file to download.
  link.click();
}

//------------------
//a proxy function responding to menu.
function saveProject() {
  simApp.mainApp.saveProject();
}
function saveTemplate() {
  simApp.mainApp.saveTemplate();
}
function clearTemplates() {
  localStorage.removeItem('templates');
}

//------------------
//var deleteSimulationDone = false;
function deleteSimulation(apiUrl, simId) {
  var ws = new WcfService(apiUrl);
  ws.get("DelSimulation?id=" + simId).then(
    function onSuccess(data) {
      var retData = JSON.parse(data);
      if (retData.error == 0) {
        // deleteSimulationDone = true;
      }
      else {
        console.log("Error : " + retData.error + " - " + retData.errorStr);
      }
    },
    function onError(err) {
      console.log("Error deleting simulation, cause:", err.message);
    });
}
//------------------
// This creates a new simulation (it handles all data, it is a level higher than sidebar data)
function newSimulation(apiUrl, simName, simDesc) {
  var ws = new WcfService(apiUrl);
  var inData = JSON.stringify({ name: simName, desc: simDesc });
  ws.post("newSimulation", inData).then(
    function onSuccess(data) {
      var retData = JSON.parse(data);
      if (retData.error == 0) {
        var idObj = JSON.parse(retData.jsonStr);
        appConfig.simInfo = { name: simName, desc: simDesc, id: idObj.id }
        simApp.newProjectCreated = true;
      }
      else {
        console.log("Error : " + retData.error + " - " + retData.errorStr);
      }
    },
    function onError(err) {
      console.log("Error creating new simulation, cause:", err.message);
    });
}
//------------------
function newProject() {
  var url = 'EditForms/NewProjectPrompt.html';
  var dataObj = { projectName: "Sim1", projectDescription: "" };
  var wnd = mxWindow.createFrameWindow(
  url,
  'OK, Cancel',  //command buttons
  'close', //top buttons
  function (btn, retObj) {
    if (btn === 'OK') {
      simApp.newProjectCreated = false;
      fetch('defaultModel.json').then((response) => response.text().then((data) => {
        var model = JSON.parse(data);
        appConfig.simInfo = { name: retObj.projectName, desc: retObj.projectDescription };
        model.name = retObj.projectName;
        model.desc = retObj.projectDescription;
        var modelStr = JSON.stringify(model);
        simApp.mainApp.loadSidebar(modelStr);
        simApp.mainApp.updateProjectTitle(model.name);
      }));
    }
    return true;
  }.bind(this),
  dataObj,
  true, //ismodal
  null,
  null,
  500, //width
  220 //height
  );
  document.body.removeChild(wnd.div);
  var contentPanel = document.getElementById("ContentPanel");
  adjustWindowPos(contentPanel, wnd.div);
  contentPanel.appendChild(wnd.div);
}
//------------------
function openProject() {
  var el = document.getElementById("OpenFileDialogInput");
  if (el) el.remove();

  var dialog = document.createElement('input');
  dialog.id = "OpenFileDialogInput";
  dialog.value = "";
  dialog.type = 'file';
  dialog.style.display = 'none';
  dialog.accept = "application/json,.json"; //only support in chrome and IE.  FF doesn't work with hint.

  var handleFileSelected = function (evt) {
    if (!evt.target.files || !evt.target.files[0]) return;
    var afile = evt.target.files[0];
    var el = document.getElementById("project_name");
    var aname = afile.name.substring(0, afile.name.indexOf('.'));
    if (aname == "") aname = afile.name;
    if (el)
      el.innerText = aname;
    var ext = /\.[0-9a-z]+$/.exec(afile.name);
    ext = ext && ext.length > 0 ? ext[0] : "";
    switch (ext) {
      case '.json':
        var reader = new FileReader();
        reader.onload = function (evt) {
          var content = evt.target.result;
          simApp.mainApp.loadSidebar(content);
        }.bind(this);
        reader.readAsText(afile);
        break;
    }

  }.bind(this);

  dialog.addEventListener("change", handleFileSelected, false);
  document.body.appendChild(dialog);
  dialog.click();
}

//------------------
function mergeIntoCurrentProject() {
  let el = document.getElementById("MergeIntoCurrentProjectDialogInput");
  if (el) el.remove();

  let dialog = document.createElement('input');
  dialog.id = "MergeIntoCurrentProjectDialogInput";
  dialog.value = "";
  dialog.type = 'file';
  dialog.style.display = 'none';
  dialog.accept = "application/json,.json"; //only support in chrome and IE.  FF doesn't work with hint.

  let handleFileSelected = function (evt) {
    if (!evt.target.files || !evt.target.files[0]) return;
    var afile = evt.target.files[0];
    var aname = afile.name.substring(0, afile.name.indexOf('.'));
    if (aname == "") aname = afile.name;
    var ext = /\.[0-9a-z]+$/.exec(afile.name);
    ext = ext && ext.length > 0 ? ext[0] : "";
    switch (ext) {
      case '.json':
        var reader = new FileReader();
        reader.onload = function (evt) {
          var content = evt.target.result;
          Navigation.Sidebar.prototype.importDiagram(JSON.parse(content));
        }.bind(this);
        reader.readAsText(afile);
        break;
    }

  }.bind(this);

  dialog.addEventListener("change", handleFileSelected, false);
  document.body.appendChild(dialog);
  dialog.click();
}

function loadTemplate() {
  const el = document.getElementById('OpenFileDialogInput');
  if (el) {
    el.remove();
  }
  const dialog = document.createElement('input');
  dialog.id = 'OpenFileDialogInput';
  dialog.value = '';
  dialog.type = 'file';
  dialog.style.display = 'none';
  dialog.accept = 'application/json,.json';
  const handleFileSelected = (evt) => {
    if (!evt.target.files || !evt.target.files[0]) {
      return;
    }
    const afile = evt.target.files[0];
    const el = document.getElementById('project_name');
    let aname = afile.name.substring(0, afile.name.indexOf('.'));
    if (aname === '') {
      aname = afile.name;
    }
    if (el) {
      el.innerText = aname;
    }
    let ext = /\.[0-9a-z]+$/.exec(afile.name);
    ext = ext && ext.length > 0 ? ext[0] : '';
    switch (ext) {
      case '.json':
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = JSON.parse(evt.target.result);
          if (Array.isArray(content)) {
            // Load template list
            content.forEach((template) => {
              simApp.mainApp.loadTemplate(template);
            });
          } else {
            // Load single template
            simApp.mainApp.loadTemplate(content);
          }
        };
        reader.readAsText(afile);
        break;
    }
  };
  dialog.addEventListener('change', handleFileSelected, false);
  document.body.appendChild(dialog);
  dialog.click();
}

//------------------
function testMakeCompDiagram() {
  var diagramData = simApp.mainApp.getCleanDataModel();

  var modelJson = JSON.stringify(diagramData);
  var ws = new WcfService(appConfig.apiUrl);
  ws.post("MakeCompDiagram?name=CompDiagram1&desc=Make+new+diagram&failsToStartRate=0.2&failsToRunRate=0.1&startEvent=Start&resetEvent=Reset", modelJson).then(
    function onSuccess(data) {
      var retData = JSON.parse(data);
      if (retData.error == 0) {
        var jsonStr = retData.jsonStr;
        jsonStr = jsonStr.replace(/\r\n/g, " ");
        var diagram = JSON.parse(jsonStr);
        simApp.mainApp.sidebar.openDiagramWindow(diagram);
      }
      else {
        console.log("Error : " + retData.error + " - " + retData.errorStr);
      }
    },
    function onError(err) {
      console.log("Error calling API function 'MakeCompDiagram', cause:", err.message);
    });
}
//------------------
function createTestProject() {
  var ws = new WcfService(appConfig.apiUrl);
  ws.get("GetCreateTestProject?id=" + appConfig.simInfo.id).then(
    function onSuccess(data) {
      var retData = JSON.parse(data);
      if (retData.error == 0) {
        alert("Test project data created successful.");
      }
      else {
        console.log("Error : " + retData.error + " - " + retData.errorStr);
      }
    },
    function onError(err) {
      console.log("Error deleting simulation, cause:", err.message);
    });
}
//------------------
function createTestProject2() {
  simApp.newProjectCreated = false;
  newProject();
  waitToSync(function () { return simApp.newProjectCreated; },
    function () {
      var ws = new WcfService(appConfig.apiUrl);
      ws.get("GetCreateTestProject2?id=" + appConfig.simInfo.id).then(
        function onSuccess(data) {
          var retData = JSON.parse(data);
          if (retData.error == 0) {
            alert("Test project data created successful.");
          }
          else {
            console.log("Error : " + retData.error + " - " + retData.errorStr);
          }
        },
        function onError(err) {
          console.log("Error deleting simulation, cause:", err.message);
        });
    }, 10000, "New Project");
}
//------------------
function createDemo() {

}

function noSpaces(text) {
  if (text) return text.replace(/ /g, '');
  return text;
}

function setCookie(cname, cvalue, exdays) {
  if (!cname) return;
  cname = noSpaces(cname); //spaces are not allowed in cookie variable name
  let expires = "expires=";
  if (exdays === undefined) {
      expires += new Date(2147483647 * 1000).toUTCString();
  } else {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      expires += d.toUTCString();
  }
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function clearAllCookies() {
  // this effectively logs user out
  var cookies = document.cookie.split(";");
  cookies.forEach(function (cookie) {
    while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);
    var eqidx = cookie.indexOf("=");
    if (eqidx > 0) {
      var name = cookie.substring(0, eqidx);
      setCookie(name, "");
    }
  }); //for
}
//------------------
function saveDiagramProperties(dProperties) {
  //saving diagram's properties only,  without actual diagram states.
  var ws = new WcfService(appConfig.apiUrl);
  ws.post("SaveDiagram?id=" + appConfig.simInfo.id, dProperties).then(
    function onSuccess(data) {
      var retData = JSON.parse(data);
      if (retData.error == 0) {
        alert("Diagram properties saved successful.");
      }
      else {
        console.log("Error : " + retData.error + " - " + retData.errorStr);
      }
    },
    function onError(err) {
      console.log("Error saving diagram properties, cause:", err.message);
    });
}
//------------------
function openAbout() {
  window.open("https://emrald.inl.gov/SitePages/Overview.aspx");
  /* var wnd = mxWindow.createFrameWindow(
   'About.html',
   'Close',  //command buttons
   'Close', //top buttons
   function (btn, dataObj) {
     if (btn === 'Close') {
     }
     return true;
   },
   null,
   true, //ismodal
   null,
   null,
   600, //width
   430 //height
 );
   document.body.removeChild(wnd.div);
   var contentPanel = document.getElementById("ContentPanel");
   adjustWindowPos(contentPanel, wnd.div);
   contentPanel.appendChild(wnd.div);*/
}
//------------------
function openHelp() {
  window.open("../docs");
  //var wnd = mxWindow.createFrameWindow(
  //    'Help.html',
  //    'Close',  //command buttons
  //    'Close', //top buttons
  //    function (btn, dataObj) {
  //      if (btn === 'Close') {
  //      }
  //      return true;
  //    },
  //    null,
  //    true, //ismodal
  //    null,
  //    null,
  //    700, //width
  //    800 //height
  //);
  //document.body.removeChild(wnd.div);
  //var contentPanel = document.getElementById("ContentPanel");
  //adjustWindowPos(contentPanel, wnd.div);
  //contentPanel.appendChild(wnd.div);
}
//------------------
function isIENavigator() {
  var av = window.navigator.appVersion;
  if (av.indexOf('.NET') >= 0) {
    return true;
  }
  return false;
}

//---------------------------------------------------------------
//convert any image into transparent background with the key color on
//the upper left corner.
function rgba(r, g, b, a) {
  return (r + g + b) * a / 255;
}
//------------------
function makeTransparent(img) {
  if (img.loaded) return;
  img.loaded = true;
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);

  var imgData;
  waitToSync(
    function waitFor() {
      try {
        imgData = context.getImageData(0, 0, img.width, img.height);
        return true;
      }
      catch (ex) {
        return false;
      }
    },
    function occured() {
      var data = imgData.data;

      //any color match upper left corner color, make it transparent.
      var tol = (255 * 3) * 0.2; //within 20% of alpha tollerange.
      var color = rgba(data[5], data[6], data[7], data[8]);
      var cnt = 0;
      for (var i = 0; i < data.length; i += 4) {
        var c = rgba(data[i], data[i + 1], data[i + 2], data[i + 3]);
        if (Math.abs(c - color) < tol)
          data[i + 3] = 0; // making it transparent;
        cnt++;
      }

      context.putImageData(imgData, 0, 0);
      img.src = canvas.toDataURL("image/png");
    }, 5000);
}
//------------------
var simApp;
(function (simApp) {
  var SimApp = (function () {

    function SimApp(modelName) {
      this.defaultModel = "DefaultModel.json";
      this.modelFileName = modelName || this.defaultModel;
      this.newProjectCreated = false;
      simApp.mainApp = this;
      this.start();
    }
    //------------------
    SimApp.prototype.loadSidebar = function (modelStr) {
      var sideBarContainer = document.getElementById('SidePanelContainer');
      var sideBar = document.getElementById('SidePanel');
      var contentPanel = document.getElementById('ContentPanel');
      sideBar.innerHTML = "";
      contentPanel.innerHTML = "";
      $(sideBarContainer).resizable({
        handle: 'w',
        resize: function (evt, ui) {
          $('#ContentPanel').css({
            left: sideBar.clientWidth +
              $('.ui-resizable-handle.ui-resizable-e').width() + parseInt(sideBarContainer.style.marginLeft) + parseInt(sideBarContainer.style.marginRight) + 24
            //,"border-style": "solid", "border-color": "red", "border-width": "1px"
          });
        }
      });

      this.sidebar = new Navigation.Sidebar(sideBar, "resources/sidebar.json", modelStr);
    }
    //------------------
    SimApp.prototype.updateProjectTitle = function (atitle) {
      var titleEl = document.getElementById("project_name");
      if (titleEl) {
        titleEl.innerText = atitle;
      }
    }
    SimApp.prototype.makeProjectNameEditable = function() {
      var titleEl = document.getElementById("project_name");
      if (titleEl) {
        titleEl.style.cursor = 'Pointer';
        titleEl.onclick = function() {
          var newName = prompt('Enter New Name');
          if (newName && newName.trim()) {
            newName = newName.trim();
            simApp.mainApp.updateProjectTitle(newName);
            simApp.allDataModel.name = newName;
          }
        }
      }         
    }
    SimApp.prototype.start = function () {
      //var img = document.getElementById('logo');
      //makeTransparent(img);
      new Navigation.Menu("resources/menu.json");

      fetch(this.modelFileName).then((response) => response.text().then((retData) => {
        simApp.mainApp.loadSidebar(retData);
        var model = JSON.parse(retData);
        if (model.name.isNullOrUndefined || model.name === '') {
          model.name = 'Click Here to Name Project';
          simApp.allDataModel.name = 'Untitled_EMRALD_Project';
        }
        this.updateProjectTitle(model.name);
        this.makeProjectNameEditable();
      }));
      //this.loadSidebar();
    }
    //------------------
    SimApp.prototype.cloneDataModel = function (item) {
      if (!item) { return item; } // null, undefined values check

      var types = [Number, String, Boolean],
          result;

      // normalizing primitives if someone did new String('aaa'), or new Number('444');
      types.forEach(function (type) {
        if (item instanceof type) {
          result = type(item);
        }
      });

      if (typeof result == "undefined") {
        if (Object.prototype.toString.call(item) === "[object Array]") {
            result = [];
            var prop;
          item.forEach(function (child, index) {
            if (child.nodeType || (child instanceof mxCell)) { /* not interested in node element*/ }
            else if (child in SetOf(["dataType", "itemId", "actionId", "sourceRow", "targetRow", "actionCell", "eventCell", "iActions", "iEvents", "ownerCell", "ownerID", "ui_el", "wnd", "tempVariableList"]))
            { /* not copy these */ }
            else {
              //child is an object, store array of object
              result[index] = this.cloneDataModel(child);
            }
          }.bind(this));
        } else if (typeof item == "object") {
          // testing that this is DOM
          if (item.nodeType && typeof item.cloneNode == "function") {
            //var result = item.cloneNode(true);
          } else if (!item.prototype) { // check that this is a literal
            if (item instanceof Date) {
              result = new Date(item);
            } else {
              // it is an object literal
              result = {};
              for (var i in item) {
                if (i in SetOf(["dataType", "itemID", "actionId", "sourceRow", "targetRow", "actionCell", "eventCell", "iActions", "iEvents", "ownerCell", "ownerID", "ui_el", "wnd"])
                  || (item[i] instanceof mxCell)) { /*Do not copy these properties*/ }
                else
                  result[i] = this.cloneDataModel(item[i]);
              }
            }
          } else {
            result = item;
          }
        } else {
          result = item;
        }
      }

      return result;
    }
    //-------------------------
    SimApp.prototype.getCleanDataModel = function () {
      var model = simApp.allDataModel; //NOTE: 'this' <> simApp.
      var diagramData = {
        id: model.id,
        name: model.name,
        desc: model.desc,
        version: model.version
      };

      diagramData.DiagramList = this.cloneDataModel(model.DiagramList);
      diagramData.ExtSimList = this.cloneDataModel(model.ExtSimList);
      diagramData.StateList = this.cloneDataModel(model.StateList);
      diagramData.ActionList = this.cloneDataModel(model.ActionList);
      diagramData.EventList = this.cloneDataModel(model.EventList);
      diagramData.LogicNodeList = this.cloneDataModel(model.LogicNodeList);
      diagramData.VariableList = this.cloneDataModel(model.VariableList);

      diagramData.templates = this.getTemplatesUsedInProject();

      return diagramData;
    }

    /**
     * Gets a list of the templates used in the project.
     * 
     * @returns {EMRALD.Model[]} - The templates used in the project.
     */
    SimApp.prototype.getTemplatesUsedInProject = function () {
      const templateNames = [];
      simApp.allDataModel.DiagramList.forEach((diagram) => {
        if (
          diagram.diagramTemplate &&
          diagram.diagramTemplate.length > 0 &&
          templateNames.indexOf(diagram.diagramTemplate) < 0
        ) {
          templateNames.push(diagram.diagramTemplate);
        }
      });
      return templateNames.map((name) => simApp.mainApp.sidebar.getTemplateByName(name));
    }

    //-------------------------
    SimApp.prototype.getCleanAllTemplateModel = function () {
      var model = simApp.allTemplates; //NOTE: 'this' <> simApp.
      var diagramData = {};
      diagramData.DiagramList = this.cloneDataModel(model.DiagramList);
      diagramData.StateList = this.cloneDataModel(model.StateList);
      diagramData.ActionList = this.cloneDataModel(model.ActionList);
      diagramData.EventList = this.cloneDataModel(model.EventList);

      return diagramData;
    }
    //-------------------------
    SimApp.prototype.getCleanGlobalTemplateModel = function () {
      var model = simApp.globalTemplates; //NOTE: 'this' <> simApp.
      var diagramData = {};
      diagramData.DiagramList = this.cloneDataModel(model.DiagramList);
      diagramData.StateList = this.cloneDataModel(model.StateList);
      diagramData.ActionList = this.cloneDataModel(model.ActionList);
      diagramData.EventList = this.cloneDataModel(model.EventList);

      return diagramData;
    }
    //-------------------------
    SimApp.prototype.getCleanUserTemplateModel = function () {
      var model = simApp.userTemplates; //NOTE: 'this' <> simApp.
      var diagramData = {};
      diagramData.DiagramList = this.cloneDataModel(model.DiagramList);
      diagramData.StateList = this.cloneDataModel(model.StateList);
      diagramData.ActionList = this.cloneDataModel(model.ActionList);
      diagramData.EventList = this.cloneDataModel(model.EventList);

      return diagramData;
    }
    
    /**
     * Saves the user's templates to a file.
     */
    SimApp.prototype.saveTemplate = function () {
      if (localStorage.getItem('templates')) {
        const blob = new Blob([localStorage.getItem('templates')], {
          type: 'data:text/plain',
        });
        saveAs(blob, `Templates_${simApp.mainApp.modelFileName}`);
      }
    }

    /**
     * Loads a template into the project.
     *
     * @param {EMRALD.Model} dataObj - The template to load.
     */
    SimApp.prototype.loadTemplate = function (dataObj) {
      simApp.mainApp.sidebar.addLocalTemplate(dataObj);
    }


    SimApp.prototype.saveProject = function () {
      if (this.modelFileName == this.defaultModel) {
        MessageBox.prompt("Saving State", "Please enter a name for this State Diagram.",
         this.modelFileName, function (nDialog, fileName, btn) {
           if (btn != "OK") return true;
           if (fileName.length == 0) {
             MessageBox.alert("Invalid name", "Cannot save state diagram to a blank file name.");
             return false;
           }
           var ext = /\.[0-9a-z]+$/.exec(fileName);
           if (ext) {
             ext = ext[0];
             if (ext.toLowerCase() !== ".json")
               fileName = fileName.replace(ext, ".json");
           }
           else
             fileName = fileName + ".json";

           var diagram = this.getCleanDataModel();
           var jsonStr = JSON.stringify(diagram, null, 2);


           var blob = new Blob([jsonStr], { type: "data:text/plain" });
           saveAs(blob, fileName);
           simApp.modelFileName = fileName;
           return true;//to close the prompt box.
         }.bind(this));
      }
      else {
        var diagram = this.getCleanDataModel();
        var jsonStr = JSON.stringify(diagram, null, 2);

        var blob = new Blob([jsonStr], { type: "data:text/plain" });
        //saveAs(blob, simApp.mainApp.modelFileName);
        // JB: 10/10/2019 - Make default file name the name of the project
        saveAs(blob, simApp.allDataModel.name + ".json");
      }
    }

    return SimApp;
  })();
  simApp.SimApp = SimApp;
})(simApp || (simApp = {}));
//------------------
//launch the application when DOM is done loading.
document.addEventListener('DOMContentLoaded', function () {
  //For production use this
  //new simApp.SimApp();

  //For development testing only.
  new simApp.SimApp("EMRALD.json");
});

window.onbeforeunload = function () {
  if (simApp.modelChanged)
    return "browser will provide generic message.";
  else
    return null;
}

