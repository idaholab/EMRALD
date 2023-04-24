// Copyright 2021 Battelle Energy Alliance
// @ts-check
/// <reference path="../jsdoc-types.js" />
/// <reference path="../../EditForms/ImportEditor.js" />

"use strict";

if (typeof Navigation === 'undefined')
  var Navigation;
(function (Navigation) {
  var Sidebar = (function (_super) {
    __extends(_super, Sidebar);
    function Sidebar(container, url, modelStr) {
      _super.apply(this, arguments);
      this.syncCount = 0;
      this.simId = appConfig.simInfo.id;
      //this.simModelFile = appConfig.simInfo.name + ".json"
      this.serverUrl = appConfig.apiUrl;
      this.lookupLoaded = false;
      this.lookupError = false;
      this.jsonStr = null;
      var sidebar = this;
      if (!modelStr) {
        this.loadLookup();  //get lookup data information from backend server -- through service.
        waitToSync(
          function () {
            return this.lookupLoaded || this.lookupError;
          }.bind(this),
          function () {
            if (this.jsonStr && !this.lookupError) {
              //var newWindow = window.open();
              //newWindow.document.writeln(this.jsonStr);
              var idx = this.jsonStr.indexOf("Error");
              if (idx >= 0 && idx < 10) {
                console.log("Lookup " + this.jsonStr);
                return;
              }
              //JSON can not parse data like "data has \r\n a second line."
              //we need to strip them all out.
              this.jsonStr = this.jsonStr.replace(/\r\n/g, " ");
              console.log("Data received: Length: " + this.jsonStr.length + ", decoding...");
              var jobj = JSON.parse(this.jsonStr);
              console.log("...data decoded!");
              simApp.allDataModel = jobj;
              sidebar.sortVariables();
              this.upgrade(simApp.allDataModel);
              this.assignList(jobj);
              //load templates
              this.loadTemplates();
              this.createSidebar(container, url || "resources/sidebar.json");
            }
          }.bind(this),
          60000 //30 seconds wait time.
        );
      }
      else {
        this.jsonStr = modelStr;
        this.lookupLoaded = true;
        var jobj = JSON.parse(this.jsonStr);
        simApp.allDataModel = jobj;
        sidebar.sortVariables();
        this.upgrade(simApp.allDataModel);
        this.assignList(jobj);
        //load templates
        this.loadTemplates(jobj.templates);
        this.createSidebar(container, url || "resources/sidebar.json");
      }
    }

    //this will load all diagram templates when the project is first opened and save it within simApp
    Sidebar.prototype.loadTemplates = function (templates) {
      if (templates) {
        templates.forEach((template) => {
          this.addLocalTemplate(template);
        });
      }
    }
    
    Sidebar.prototype.assignList = function (objList) {
      for (var propName in objList) {
        var item = objList[propName];
        if (item instanceof Array) {
          this[propName] = item;
        }
      }
    }
    Sidebar.prototype.upgrade = window.upgrade;
    //this will make the sidebar sections have the accordion function 
    Sidebar.prototype.ApplyJqueryUi = function (id) {

      $('#' + id).accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }

      });
    }

    //this will make the sidebar sections have the accordion function (similar to above but different setting for heightStyle)
    Sidebar.prototype.ApplyJqueryUiFill = function (id) {
      $('#' + id).accordion({
        collapsible: true,
        heightStyle: "fill"
      });
    }

    //this will open up the diagram edit form and then add the diagram to the sidebar
    Sidebar.prototype.createNewDiagram = function () {
      var url = 'EditForms/DiagramEditor.html';
      var dataObj = {
        id: -1,
        name: "",
        desc: "",
        diagramType: "",
        diagramTemplate: "",
        changeDiagramType: function () { return true; }
      };

      var diagramList = this.getLocalTemplates();
      var diagramTemplates = [];
      for (var i = 0; i < diagramList.length; i++) {
        diagramTemplates.push(diagramList[i].name);
      }
      dataObj.diagramTemplates = diagramTemplates;

      var wnd = mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, outDataObj) {
          if (btn === 'OK') {
            if (outDataObj.importedContent) {
              Sidebar.prototype.importDiagram(outDataObj.importedContent);
              delete outDataObj.importedContent;
              return true;
            }
            else {
              if (this.existsDiagramName(outDataObj.name)) {
                MessageBox.alert("New Diagram", "A diagram with the name '" + outDataObj.name + "' exists, please try a different name.");
                return false;
              }
              if (outDataObj.name.length <= 0) {
                MessageBox.alert("New Diagram", "Please fill in a name");
                return false;
              }
            }
            outDataObj.states = [];
            if (outDataObj.diagramType == 'dtComponent' || outDataObj.diagramType == 'dtSystem')
              outDataObj.singleStates = [];
            if (!outDataObj.diagramLabel)
              outDataObj.diagramLabel = outDataObj.diagramType.substring(2, outDataObj.diagramType.length);
            var container = document.getElementById("DiagramsPanel_id");
            delete outDataObj.diagramLabels;
            delete outDataObj.diagramTemplates;
            var diagram = { Diagram: outDataObj };
            //If you choose template, populate diagram with appropriate items
            if (outDataObj.diagramTemplate && outDataObj.diagramTemplate.length > 0) {
              const template = this.getTemplateByName(outDataObj.diagramTemplate);
              template.DiagramList[0] = {
                ...template.DiagramList[0],
                ...outDataObj,
              };
              // Automatically replace names
              Object.keys(template).forEach((key) => {
                const type = key.replace('List', '');
                if (Array.isArray(template[key])) {
                  template[key].forEach((item) => {
                    const oldName = item[type].name;
                    const newName = item[type].name.replace(outDataObj.diagramTemplate, outDataObj.name);
                    if (newName !== oldName) {
                      this.replaceNames(
                        oldName,
                        newName,
                        type,
                        template,
                        false,
                      );
                    }
                  });
                }
              });
              template.name = outDataObj.name;
              template.id = outDataObj.id;
              template.desc = outDataObj.desc;
              this.importDiagram(template, outDataObj.forceMerge).then((importedContent) => {
                this.openDiagram(importedContent.DiagramList[0].Diagram);
                this.onLoadLocal(diagram.Diagram);
              });
            }
            else {
              this.addNewDiagram(diagram, outDataObj.diagramTemplate);
              this.openDiagram(diagram.Diagram);
            }
          }
          return true;
        }.bind(this),
      dataObj,
      true, //ismodal
        null,
        null,
        450, //width
        300 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
      // wnd.div.setMaximizable=true;
    }

    // this creates the sidebar (including local, global and all)
    Sidebar.prototype.createSidebar = function (container, url) {

      var getContextMenu = function (cat, el) {
        var titleForNew = cat.title;
        if (titleForNew.endsWith("s")) {
          titleForNew = titleForNew.substring(0, titleForNew.length - 1);
        }
        var cmenu = null;
        if (cat.title == 'States') {
          cmenu = {
            delegate: el,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Refresh", cmd: "Refresh" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Refresh":
                  alert("Not yet implemented.");
                  break;
              }
            }.bind(this)
          }
        }
        else if (cat.id.indexOf("Local_") > -1) {
          cmenu = {
            delegate: el,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
                { title: "Refresh", cmd: "Refresh" }
            ],
            select: function (evt, ui) {

            }.bind(this)

          }
        }
        //if not global only have refresh in menu for Actions and Events
        else if (cat.id.indexOf("Global_") == -1 && (cat.title == "Actions" || cat.title == "Events")) {
          cmenu = {
            delegate: el,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
                { title: "Refresh", cmd: "Refresh" }
            ],
            select: function (evt, ui) {

            }.bind(this)

          }
        }
        else {
          cmenu = {
            delegate: el,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "New " + titleForNew, cmd: "New" },
              { title: "Refresh", cmd: "Refresh" },
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "New":
                  switch (cat.title) {
                    case "Variables":
                      var dataObj = { id: -1, name: "", desc: "", varScope: "gtGlobal", value: 0.0 };
                      this.editVariableProperties(dataObj);
                      break;
                    case "Logic Tree":
                      var dataObj = { id: -1, name: "", desc: "", gateType: "gtAnd", rootName: "", compChildren: [], gateChildren: [] };
                      this.editLogicProperties(dataObj);
                      break;
                    case "Actions":
                      var dataObj = { id: -1, name: "", desc: "", actType: "atTransition", mainItem: true, mutExcl: true, newStates: [] };
                      this.editActionProperties(dataObj);
                      break;
                    case "Events":
                      var eventObj = { id: -1, name: "", desc: "", mainItem: true, evType: "etVarCode", };
                      this.editEventProperties(eventObj);
                      break;
                    case "Diagrams":
                      var dataObj = { id: -1, name: "", desc: "", diagramType: "dtPlant", states: [] };
                      this.createNewDiagram();
                      break;
                    case "External Sims":
                      var dataObj = { id: -1, name: "", resourceName: "", modelRef: "", states: [], configData: "", simMaxTime: "" };
                      this.editExtSimProperties(dataObj);
                      break;
                  }
                  break;
                case "Refresh":
                  break;
                case "Paste Diagram":
                  navigator.clipboard.readText()
                    .then((clipped) => {
                      this.importDiagram(JSON.parse(clipped)).then((importedContent) => {
                        this.openDiagramWindow(importedContent.DiagramList[0].Diagram)
                      });
                    })
                    .catch((err) => { throw err });
              }
            }.bind(this)

          }
          if (titleForNew === 'Diagram') {
            cmenu.menu.push({ title: "Paste", cmd: "Paste Diagram" });
          }
        }
        return cmenu;
      }.bind(this);

      fetch(url).then((response) => response.text().then((jsonStr) => {
        var sbObj = JSON.parse(jsonStr);
        var div = document.createElement('div');
        div.id = "Sidebar_Accordion";

        sbObj.sidebar.categories.forEach(function (cat) {
          var h3 = document.createElement('h3');
          switch (cat.title) {
            case "Diagrams":
              h3.textContent = cat.title;
              break;
            default:
              h3.textContent = cat.title;
          }
          //h3.textContent = cat.title;
          var cMenu = getContextMenu(cat, h3);
          $(h3).contextmenu(cMenu);
          div.appendChild(h3);

          var cdiv = document.createElement('div');
          cdiv.id = cat.id; //Assign the id from the sidebar.json "DiagramsPanel_id", "StatesPanel_id", "LogicTreesPanel_id", "ActionsPanel_id", "EventsPanel_id", "VariablesPanel_id", "ExtSimPanel_id"

          cdiv.className = "CategorySection";
          div.appendChild(cdiv);
          this.loadContent(cdiv, cat);

        }.bind(this));

        var spacer = document.createElement('hr');

        var sidebar = this;
        ///////////////////////////////////////////////////////////
        //Add local button that displays global variables
        var buttonLocal = document.createElement('button');
        buttonLocal.id = "Button_Dynamic_local"
        buttonLocal.innerHTML = 'Local';
        buttonLocal.className = "SidebarButton";
        var setUpLocal = function () {
          //Reset the color of global button to default and set color of local to be dark
          buttonLocal.style.backgroundColor = '#d7ebf9';
          buttonGlobal.style.backgroundColor = '';
          buttonAll.style.backgroundColor = '';
          var divLocal = document.createElement('div');
          divLocal.id = "Sidebar_Dynamic_Local";
          sbObj.sidebar.dynamCategories.forEach(function (cat) {
            if (cat.title != "Variables") {
              var h3 = document.createElement('h3');
              switch (cat.title) {
                case "States":
                  h3.textContent = "Local " + cat.title;
                  cat.id = "Local_StatesPanel_id";
                  break;
                case "Actions":
                  h3.textContent = "Local " + cat.title;
                  cat.id = "Local_ActionsPanel_id";
                  break;
                case "Events":
                  h3.textContent = "Local " + cat.title;
                  cat.id = "Local_EventsPanel_id";
                  break;
                default:
                  h3.textContent = "Local " + cat.title;
                  cat.id = "Local_" + cat.id;
              }
              var cMenu = getContextMenu(cat, h3);
              $(h3).contextmenu(cMenu);
              divLocal.appendChild(h3);
              var cdiv = document.createElement('div');
              cdiv.id = cat.id; //Assign the id from the sidebar.json "DiagramsPanel_id", "StatesPanel_id", "LogicTreesPanel_id", "ActionsPanel_id", "EventsPanel_id", "VariablesPanel_id", "ExtSimPanel_id"

              cdiv.className = "CategorySection";
              divLocal.appendChild(cdiv);
            }
          }.bind(this));
          container.appendChild(divLocal);
          sidebar.ApplyJqueryUi(divLocal.id);
        };
        ///////////////////////////////////////////////////////////
        //Add All button that displays all variables
        var buttonAll = document.createElement('button');
        buttonAll.id = "Button_Dynamic_All";
        buttonAll.className = "ButtonSection";
        buttonAll.className = "SidebarButton";
        buttonAll.innerHTML = 'All';
        var setUpAll = function () {
          //Reset the color of global button to default and set color of local to be dark
          buttonLocal.style.backgroundColor = '';
          buttonGlobal.style.backgroundColor = '';
          buttonAll.style.backgroundColor = '#d7ebf9';
          var divAll = document.createElement('div');
          divAll.id = "Sidebar_Dynamic_All";
          sbObj.sidebar.dynamCategories.forEach(function (cat) {
            var h3 = document.createElement('h3');
            switch (cat.title) {
              case "States":
                h3.textContent = "All " + cat.title;
                cat.id = "StatesPanel_id";
                break;
              case "Actions":
                h3.textContent = "All " + cat.title;
                cat.id = "ActionsPanel_id";
                break;
              case "Events":
                h3.textContent = "All " + cat.title;
                cat.id = "EventsPanel_id";
                break;
              case "Variables":
                h3.textContent = "All " + cat.title;
                cat.id = "VariablesPanel_id";
                break;
            }
            var cMenu = getContextMenu(cat, h3);
            $(h3).contextmenu(cMenu);
            divAll.appendChild(h3);

            var cdiv = document.createElement('div');
            cdiv.id = cat.id; //Assign the id from the sidebar.json "DiagramsPanel_id", "StatesPanel_id", "LogicTreesPanel_id", "ActionsPanel_id", "EventsPanel_id", "VariablesPanel_id", "ExtSimPanel_id"

            cdiv.className = "CategorySection";
            divAll.appendChild(cdiv);
            sidebar.loadContent(cdiv, cat);

          }.bind(this));
          container.appendChild(divAll);
          sidebar.ApplyJqueryUi(divAll.id);
        };

        ///////////////////////////////////////////////////////////
        //Add global button that displays global variables
        var buttonGlobal = document.createElement('button');
        buttonGlobal.className = "SidebarButton";

        buttonGlobal.id = "Button_Dynamic_global";
        buttonGlobal.innerHTML = 'Global';



        var setUpGlobal = function () {
          //Reset the color of global button to default and set color of local to be dark
          buttonLocal.style.backgroundColor = '';
          buttonGlobal.style.backgroundColor = '#d7ebf9';
          buttonAll.style.backgroundColor = '';
          var divGlobal = document.createElement('div');
          divGlobal.id = "Sidebar_Dynamic_Global";
          sbObj.sidebar.dynamCategories.forEach(function (cat) {
            if (cat.title != "States") {
              var h3 = document.createElement('h3');
              switch (cat.title) {
                case "States":
                  break;
                case "Actions":
                  h3.textContent = "Global " + cat.title;
                  cat.id = "Global_ActionsPanel_id";
                  break;
                case "Events":
                  h3.textContent = "Global " + cat.title;
                  cat.id = "Global_EventsPanel_id";
                  break;
                case "Variables":
                  h3.textContent = "Global " + cat.title;
                  cat.id = "Global_VariablesPanel_id";
                  break;

              }
              var cMenu = getContextMenu(cat, h3);
              $(h3).contextmenu(cMenu);
              divGlobal.appendChild(h3);

              var cdiv = document.createElement('div');
              cdiv.id = cat.id; //Assign the id from the sidebar.json "DiagramsPanel_id", "StatesPanel_id", "LogicTreesPanel_id", "ActionsPanel_id", "EventsPanel_id", "VariablesPanel_id", "ExtSimPanel_id"

              cdiv.className = "CategorySection";
              divGlobal.appendChild(cdiv);
              sidebar.loadContent(cdiv, cat);
            }

          }.bind(this));
          container.appendChild(divGlobal);
          sidebar.ApplyJqueryUi(divGlobal.id);
        };


        var label = document.createElement('h1');
        label.className = "modelLabel";
        label.textContent = "Modeling Items";

          var spacer2 = document.createElement('hr');
          spacer.className = "sidebarSpace";

        buttonLocal.onclick = function () { sidebar.showDynamicSidebar("local"); }
        buttonAll.onclick = function () { sidebar.showDynamicSidebar("all"); }
        buttonGlobal.onclick = function () { sidebar.showDynamicSidebar("global"); }

        container.appendChild(div);
        this.ApplyJqueryUi(div.id);
        container.appendChild(spacer);
        //container.appendChild(label);
        var buttonGroup = document.createElement('btn-group');
        buttonGroup.appendChild(buttonAll);
        buttonGroup.appendChild(buttonGlobal);
        buttonGroup.appendChild(buttonLocal);
        container.appendChild(buttonGroup);
        //container.appendChild(spacer2);
        setUpLocal();
        setUpAll();
        setUpGlobal();
        this.showDynamicSidebar("all");

        // Initialize ContentPanel position
        const sideBarContainer = document.getElementById('SidePanelContainer');
        const sideBar = document.getElementById('SidePanel');
        $('#ContentPanel').css({
          left: sideBar.clientWidth + $('.ui-resizable-handle.ui-resizable-e').width() + parseInt(sideBarContainer.style.marginLeft) + parseInt(sideBarContainer.style.marginRight) + 24
        });
      }));

    }

    //---------------------------------------------------  
    Sidebar.prototype.showDynamicSidebar = function (type) {
      var localElement = document.getElementById("Sidebar_Dynamic_Local");
      var globalElement = document.getElementById("Sidebar_Dynamic_Global");
      var allElement = document.getElementById("Sidebar_Dynamic_All");


      var localButton = document.getElementById("Button_Dynamic_local");
      var globalButton = document.getElementById("Button_Dynamic_global");
      var allButton = document.getElementById("Button_Dynamic_All");

      if (type == "global") {
        localElement.parentNode.insertBefore(localElement, allElement);
        globalElement.parentNode.insertBefore(globalElement, localElement);

        localElement.style.visibility = 'hidden';
        globalElement.style.visibility = 'visible';
        allElement.style.visibility = 'hidden';
        globalButton.style.backgroundColor = '#d7ebf9';
        localButton.style.backgroundColor = '';
        allButton.style.backgroundColor = '';
      }
      else if (type == "all") {
        localElement.parentNode.insertBefore(localElement, globalElement);
        allElement.parentNode.insertBefore(allElement, localElement);
        localElement.style.visibility = 'hidden';
        globalElement.style.visibility = 'hidden';
        allElement.style.visibility = 'visible';
        allButton.style.backgroundColor = '#d7ebf9';
        localButton.style.backgroundColor = '';
        globalButton.style.backgroundColor = '';
      }
      else {
        ///localElement.clone().insertBefore(globalElement);
        globalElement.parentNode.insertBefore(globalElement, allElement);
        localElement.parentNode.insertBefore(localElement, globalElement);
        localElement.style.visibility = 'visible';
        globalElement.style.visibility = 'hidden';
        allElement.style.visibility = 'hidden';
        globalButton.style.backgroundColor = '';
        localButton.style.backgroundColor = '#d7ebf9';
        allButton.style.backgroundColor = '';
      }
    }

    /**
     * Gets a list of ExtSims that are required by the given state list.
     * 
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} [model] - The model to use (defaults to allDataModel). 
     * @returns {EMRALD.ExtSim[]} The list of ExtSims.
     */
    Sidebar.prototype.getExtSimList = function (states, model = simApp.allDataModel) {
      if (states) {
        /** @type {EMRALD.ExtSim[]} */ const extSimList = [];
        /** @type {string[]} */ const extSimNames = [];
        const stateNames = states.map((state) => state.name);
        if (model.ExtSimList) {
          model.ExtSimList.forEach((extSim) => {
            this.actionsReferencing(
              model,
              extSim.ExtSim.name,
              'ExtSim',
            ).forEach((action) => {
              this.statesReferencing(model, action.name, 'Action').forEach(
                (state) => {
                  if (
                    stateNames.indexOf(state.name) >= 0 &&
                    extSimNames.indexOf(extSim.ExtSim.name) < 0
                  ) {
                    extSimList.push(extSim);
                    extSimNames.push(extSim.ExtSim.name);
                  }
                },
              );
            });
          });
        }
        return extSimList;
      }
      return simApp.allDataModel.ExtSimList;
    }
    
    /**
     * Gets a list of logic nodes required by the given state list.
     * 
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} [model] - The data model to use (defaults to allDataModel).
     * @returns {EMRALD.LogicNode[]} The list of logic nodes.
     */
    Sidebar.prototype.getLogicNodeList = function (states, model = simApp.allDataModel) {
      /** @type {EMRALD.LogicNode[]} */ let logicNodeList = [];
      /** @type {string[]} */ const logicNodeNames = [];
      const stateNames = states.map((state) => state.name);
      if (model.LogicNodeList) {
        model.LogicNodeList.forEach((logicNode) => {
          this.eventsReferencing(
            model,
            logicNode.LogicNode.name,
            'LogicNode',
          ).forEach((event) => {
            this.statesReferencing(model, event.name, 'Event').forEach(
              (state) => {
                if (
                  stateNames.indexOf(state.name) >= 0 &&
                  logicNodeNames.indexOf(logicNode.LogicNode.name) < 0
                ) {
                  logicNodeList.push(logicNode);
                  logicNodeNames.push(logicNode.LogicNode.name);
                }
              },
            );
          });
        });
      }
      return logicNodeList;
    }
    
    /**
     * Gets a list of variables required by the given states.
     *
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} [model] - The data model to use (default to allDataModel).
     * @returns {EMRALD.Variable[]} The variables.
     */
    Sidebar.prototype.getVariableList = function (states, model = simApp.allDataModel) {
      /** @type {EMRALD.Variable[]} */ let variableList = [];
      /** @type {string[]} */ const variableNames = [];
      const stateNames = states.map((state) => state.name);
      if (model.VariableList) {
        model.VariableList.forEach((variable) => {
          /** @type {EMRALD.State['State'][]} */ let states = [];
          this.eventsReferencing(
            model,
            variable.Variable.name,
            'Variable',
          ).forEach((event) => {
            states = states.concat(
              this.statesReferencing(model, event.name, 'Event'),
            );
          });
          this.actionsReferencing(
            model,
            variable.Variable.name,
            'Variable',
          ).forEach((action) => {
            states = states.concat(
              this.statesReferencing(model, action.name, 'Action'),
            );
          });
          states.forEach((state) => {
            if (
              stateNames.indexOf(state.name) >= 0 &&
              variableNames.indexOf(variable.Variable.name) < 0
            ) {
              variableList.push(variable);
              variableNames.push(variable.Variable.name);
            }
          });
        });
      }
      return variableList;
    }
    
    /**
     * Gets a list of diagrams required by the given states.
     *
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} [model] - The data model to use (defaults to allDataModel).
     * @returns {EMRALD.Diagram[]} The list of diagrams.
     */
    Sidebar.prototype.getDiagramList = function (states, model = simApp.allDataModel) {
      /** @type {EMRALD.Diagram[]} */ let diagramList = [];
      /** @type {string[]} */ const diagramNames = [];
      const stateNames = states.map((state) => state.name);
      if (model.DiagramList) {
        model.DiagramList.forEach((diagram) => {
          let states = this.statesReferencing(
            model,
            diagram.Diagram.name,
            'Diagram',
          );
          this.logicNodesReferencing(
            model,
            diagram.Diagram.name,
            'Diagram',
          ).forEach((logicNode) => {
            this.eventsReferencing(
              model,
              logicNode.name,
              'LogicNode',
            ).forEach((event) => {
              states = states.concat(
                this.statesReferencing(model, event.name, 'Event'),
              );
            });
          });
          states.forEach((state) => {
            if (
              stateNames.indexOf(state.name) >= 0 &&
              diagramNames.indexOf(diagram.Diagram.name) < 0
            ) {
              diagramList.push(diagram);
              diagramNames.push(diagram.Diagram.name);
            }
          });
        });
      }
      return diagramList;
    }

    //---------------------------------------------------
    Sidebar.prototype.deleteDynamicSidebar = function () {
      var localElement = document.getElementById("Sidebar_Dynamic_Local");
      if (localElement != null)
        localElement.parentNode.removeChild(localElement);
      var globalElement = document.getElementById("Sidebar_Dynamic_Global");
      if (globalElement != null)
        globalElement.parentNode.removeChild(globalElement);
    }
    //---------------------------------------------------
    Sidebar.prototype.loadLookup = function () {
      console.log("Requesting Simulation from " + this.serverUrl);
      var ws = new WcfService(this.serverUrl);
      ws.get("GetSimulation?id=" + this.simId).then(
        function onSuccess(data) {
          var resultObj = JSON.parse(data);
          if (resultObj.error == 0) {
            this.jsonStr = resultObj.jsonStr;
            this.lookupLoaded = true;
          }
          else {
            console.log("Error code: " + resultObj.error + " - " + resultObj.errorStr);
          }
        }.bind(this),
        function onError(err) {
          this.lookupError = true;
          console.log("Error getting diagrams lookup, cause:", err.message);
        }.bind(this));
    }
    //---------------------------------------------------
    //A trick to keep the value when delegate function is call. Like function below if we have a delegate "ondragstart" to be call later, but
    //we want to reference immediate array values, the last element on the loop index will be used instead.  But if we pass the index value
    //into a Mixin function, it keeps the value statically.
    var makeDeferred = function (value) {
      var jsonValue = JSON.stringify(value);
      return function () {
        return jsonValue;
      }
    }

    //---------------------------------------------------
    Sidebar.prototype.getByName = function (itemType, model, aName) {
      switch (itemType) {
        case "Action":
          return this.getActionByName(model, aName);
        case "Event":
          return this.getEventByName(model, aName);
        case "Variable":
          return this.getVariableByName(model, aName);
        case "ExtSim":
          return this.getExtSimByName(model, aName);
        case "LogicNode":
          return this.getLogicNodeByName(model, aName);
        case "Diagram":
          return this.getDiagramByName(model, aName);
        case "State":
          return this.getStateByName(model, aName);
      }
      return null;
    }
    //---------------------------------------------------
    Sidebar.prototype.getActionByName = function (model, aName) {
      var aList
      if (model == null)
        aList = simApp.allDataModel.ActionList;
      else
        aList = model.ActionList; 

      var actObj = null;

      for (var i = 0; i < aList.length; i++) {
        if (aList[i].Action.name.toUpperCase() == aName.toUpperCase()) {
          actObj = aList[i];
          break;
        }
      }

      return actObj;
    }
    //---------------------------------------------------
    Sidebar.prototype.getEventByName = function (model, aName) {
      var aList
      if (model == null)
        aList = simApp.allDataModel.EventList;
      else
        aList = model.EventList;

      var evtObj = null;

      for (var i = 0; i < aList.length; i++) {
        if (aList[i].Event.name.toUpperCase() == aName.toUpperCase()) {
          evtObj = aList[i];
          break;
        }
      }

      return evtObj;
    }
    //---------------------------------------------------
    Sidebar.prototype.getVariableByName = function (model, aName) {
      var aList
      if (model == null)
        aList = simApp.allDataModel.VariableList;
      else
        aList = model.VariableList;

      var varObj = null;

      for (var i = 0; i < aList.length; i++) {
        if (aList[i].Variable.name && aList[i].Variable.name.toUpperCase() == aName.toUpperCase()) {
          varObj = aList[i];
          break;
        }
      }
      return varObj;
    }
    //---------------------------------------------------
    Sidebar.prototype.getExtSimByName = function (model, aName) {
      var aList
      if (model == null)
        aList = simApp.allDataModel.ExtSimList;
      else
        aList = model.ExtSimList;

      var simObj = null;

      for (var i = 0; i < aList.length; i++) {
        if (aList[i].ExtSim.name && aList[i].ExtSim.name.toUpperCase() == aName.toUpperCase()) {
          simObj = aList[i];
          break;
        }
      }
      return simObj;
    }
    //---------------------------------------------------
    Sidebar.prototype.getLogicNodeByName = function (model, aName) {
      var aList
      if (model == null)
        aList = simApp.allDataModel.LogicNodeList;
      else
        aList = model.LogicNodeList;

      var simObj = null;

      for (var i = 0; i < aList.length; i++) {
        if (aList[i].LogicNode.name && aList[i].LogicNode.name.toUpperCase() == aName.toUpperCase()) {
          simObj = aList[i];
          break;
        }
      }
      return simObj;
    }
    //---------------------------------------------------
    Sidebar.prototype.getDiagramByName = function (model, aName) {
      var dia = null;
      if (model.DiagramList) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          if (model.DiagramList[i].Diagram.name.toUpperCase() == aName.toUpperCase()) {
            dia = model.DiagramList[i];
            break;
          }
        }
      }
      return dia;
    }
    //---------------------------------------------------
    Sidebar.prototype.getDiagramByStateName = function (sName) {
      var dia = null;
      if (this.DiagramList) {
        for (var i = 0; i < this.DiagramList.length; i++) {
          if (this.DiagramList[i].Diagram.states) {
            for (var j = 0; j < this.DiagramList[i].Diagram.states.length; j++) {
              if (this.DiagramList[i].Diagram.states[j].toUpperCase() == sName.toUpperCase()) {
                dia = this.DiagramList[i];
                break;
              }
            }
          }
          if (dia) break;
        }
      }
      return dia;
    }
    //---------------------------------------------------
    Sidebar.prototype.buildLogicTree = function (logicNode) {
      /*
      tree {
        "LogicNode" : {logicnode info}
        "gateChildren": [{
            "LogicNode" : {loginnode info}
            "gateChildren" : [ {...}] or null
          },
          { ... }
         ]
      }
      */
      var LogicNodeList = simApp.allDataModel.LogicNodeList;
      var getLogicNode = function (nodeName) {
        var aNode = null;
        if (LogicNodeList) {
          for (var i = 0; i < LogicNodeList.length; i++) {
            if (LogicNodeList[i].LogicNode.name == nodeName) {
              aNode = LogicNodeList[i].LogicNode;
              break;
            }
          }
        }
        return aNode;
      }

      var addChildren = function (node) {
        var logicNode = node.LogicNode.LogicNode;
        node.LogicNode.gateChildren = [];
        if (logicNode.gateChildren && logicNode.gateChildren.length > 0) {
          for (var i = 0; i < logicNode.gateChildren.length; i++) {
            var lnName = logicNode.gateChildren[i]; //logicNode.gateChildren is array[string]
            var clgNode = getLogicNode(lnName);     //return LogicNode object.
            if (clgNode) {
              var newNode = {
                LogicNode: {
                  LogicNode: clgNode,
                  gateChildren: undefined,
                  compChildren: undefined
                }
              };   //create new node
              node.LogicNode.gateChildren.push(newNode);
              addChildren(newNode);          //Recursively add children node.
            }
          }
        }

        node.LogicNode.compChildren = [];
        if (logicNode.compChildren && logicNode.compChildren.length > 0) {          
          for (var i = 0; i < logicNode.compChildren.length; i++) {
            var cmpName = logicNode.compChildren[i]; //logicNode.compChildren here is array[string]
            var cmpNode = this.getDiagramByName(simApp.allDataModel, cmpName); //cmpNode is a diagram
            if (cmpNode) {
              node.LogicNode.compChildren.push(cmpNode.Diagram);
            }
          }
        }
      }.bind(this);

      var root = {
        LogicNode: {
          LogicNode: logicNode,
          gateChildren: undefined,
          compChildren: undefined,
        }
      };
      addChildren(root);

      root.DiagramList = simApp.allDataModel.DiagramList;
      root.sidebar = this;
      return root;
    }
    //---------------------------------------------------
    Sidebar.prototype.getStateByName = function (model, aName) {
      var state = null;
      for (var i = 0; i < model.StateList.length; i++) {
        if (model.StateList[i].State.name.toUpperCase() == aName.toUpperCase()) {
          state = model.StateList[i];
          break;
        }
      }
      return state;
    }
    //---------------------------------------------------
    Sidebar.prototype.getStateNamesForDiagram = function (model, dName) {
      if (!model)
        model = this;
      var stateNames;
      for (var i = 0; i < model.DiagramList.length; i++) {
        if (model.DiagramList[i].Diagram.name == dName) {
          stateNames = model.DiagramList[i].Diagram.states;
          break;
        }
      }
      
      return stateNames;
    }
    //---------------------------------------------------
    Sidebar.prototype.getStateDataObjectsForDiagram = function (model, dName) {
      if (!model)
        model = this;
      var names = this.getStateNamesForDiagram(model, dName);
      var stateList = [];
      
      for (var i = 0; i < model.StateList.length; i++) {
        if (names.includes(model.StateList[i].State.name)) {
          stateList.push(model.StateList[i]);
        }
      }

      return stateList;
    }
    
    /**
     * Gets a list of actions required by the given states.
     * 
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} model - The data model to use (defaults to allDataModel).
     * @returns {EMRALD.Action[]} The list of actions.
     */
    Sidebar.prototype.getActionList = function (states, model = simApp.allDataModel) {
      /** @type {EMRALD.Action[]} */ let actionList = [];
      /** @type {string[]} */ const actionNames = [];
      const stateNames = states.map((state) => state.name);
      if (model.ActionList) {
        model.ActionList.forEach((action) => {
          this.statesReferencing(model, action.Action.name, 'Action').forEach(
            (state) => {
              if (
                stateNames.indexOf(state.name) >= 0 &&
                actionNames.indexOf(action.Action.name) < 0
              ) {
                actionList.push(action);
                actionNames.push(action.Action.name);
              }
            },
          );
        });
      }
      return actionList;
    }
    //---------------------------------------------------
    Sidebar.prototype.getActionListWithoutRepeats = function (states) {
      var actionList = [];
      var actionNames = [];
      if (states instanceof Array) {
        states.forEach(function (state) {
          if (state.immediateActions && state.immediateActions.length > 0) {
            state.immediateActions.forEach(function (actionName) {
              var actionObj = this.getActionByName(simApp.allDataModel, actionName);
              if (actionObj && (actionNames.indexOf(actionName) < 0)) {
                actionList.push(actionObj);
                actionNames.push(actionName);
              }
            }.bind(this));
          }
          if (state.eventActions && state.eventActions.length > 0) {
            state.eventActions.forEach(function (eaObj) {
              if (eaObj.actions && eaObj.actions.length > 0) {
                eaObj.actions.forEach(function (actionName) {
                  var actionObj = this.getActionByName(simApp.allDataModel, actionName);
                  if (actionObj && (actionNames.indexOf(actionName) < 0)) {
                    actionList.push(actionObj);
                    actionNames.push(actionName);
                  }
                }.bind(this));
              }
            }.bind(this));
          }
        }.bind(this));
      }
      return actionList;
    }
    
    /**
     * Gets events required by the given states.
     * 
     * @param {EMRALD.State['State'][]} states - The states to process.
     * @param {EMRALD.Model} model - The data model to use (defaults to allDataModel).
     * @returns {EMRALD.Event[]} The list of events.
     */
    Sidebar.prototype.getEventList = function (states, model = simApp.allDataModel) {
      /** @type {EMRALD.Event[]} */ let eventList = [];
      /** @type {string[]} */ const eventNames = [];
      const stateNames = states.map((state) => state.name);
      if (model.EventList) {
        model.EventList.forEach((event) => {
          this.statesReferencing(model, event.Event.name, 'Event').forEach(
            (state) => {
              if (
                stateNames.indexOf(state.name) >= 0 &&
                eventNames.indexOf(event.Event.name) < 0
              ) {
                eventList.push(event);
                eventNames.push(event.Event.name);
              }
            },
          );
        });
      }
      return eventList;
    }
    //---------------------------------------------------
    Sidebar.prototype.getEventListWithoutRepeats = function (states) {
      var eventList = [];
      var eventNames = [];
      if (states instanceof Array) {
        states.forEach(function (state) {
          if (state.events && state.events.length > 0) {
            state.events.forEach(function (eventName) {
              var eventObj = this.getEventByName(simApp.allDataModel, eventName);
              if (eventObj && (eventNames.indexOf(eventName) < 0)) {
                eventList.push(eventObj);
                eventNames.push(eventName);
              }
            }.bind(this));
          }
        }.bind(this));
      }
      return eventList;
    }
    //---------------------------------------------------
    Sidebar.prototype.getEvent = function (diagram, eventName) {
      var model = simApp.allDataModel;
      var event = null;
      if (model.EventList) {
        for (var i = 0; i < model.EventList.length; i++) {
          var evt = model.EventList[i];
          if (evt.Event.name == eventName) {
            event = evt;
            break;
          }
        }
      }
      return event;
    }
    //---------------------------------------------------
    Sidebar.prototype.getAction = function (diagram, actionName) {
      var action = null;
      var model = simApp.allDataModel;
      if (model.ActionList) {
        for (var i = 0; i < model.ActionList.length; i++) {
          var act = model.ActionList[i];
          if (act.Action.name == actionName) {
            action = act;
            break;
          }
        }
      }
      return action;
    }
    //---------------------------------------------------
    //Get the state along with any events, immediateActions and the eventAction's actions object.
    //Note: the objects are merely reference and any modification made will effect the main data model.
    Sidebar.prototype.getState = function (diagram, stateName) {
      var state = null;
      var action, event, aName;
      var model = simApp.allDataModel;
      if (model.StateList) {
        for (var i = 0; i < model.StateList.length; i++) {
          var st = model.StateList[i];
          if (st.State.name == stateName) {
            state = st;
            st = st.State;
            //get the immediateAction objects.
            if (st.immediateActions.length > 0) {
              for (var j = 0; j < st.immediateActions.length; j++) {
                aName = st.immediateActions[j];
                action = this.getAction(diagram, aName);
                if (action && (!diagram.ActionList.find(function (act) {
                  var found = (act.Action.name == action.Action.name);
                  return found;
                })))
                  diagram.ActionList.push(action);
              }
            }

            //get the events objects.
            if (st.events.length > 0) {
              for (var k = 0; k < st.events.length; k++) {
                var eName = st.events[k];
                event = this.getEvent(diagram, eName);
                if (event && (!diagram.EventList.find(function (evt) {
                  var found = evt.Event.name == event.Event.name;
                  return found;
                })))
                  diagram.EventList.push(event);
              }
            }

            //get the eventActions objects.
            if (st.eventActions) {
              for (var m = 0; m < st.eventActions.length; m++) {
                var ea = st.eventActions[m];
                if (ea.actions) {
                  for (var n = 0; n < ea.actions.length; n++) {
                    aName = ea.actions[n];
                    action = this.getAction(diagram, aName);
                    if (action && (!diagram.ActionList.find(function (act) {
                      var found = (act.Action.name == action.Action.name);
                      return found;
                    })))
                      diagram.ActionList.push(action);
                  }
                }
              }
            }
            break;
          }
        }
      }
      return state;
    }
    //---------------------------------------------------
    //create a diagram model off the simApp.allDataModel.  Note that all object of mere reference, not copy.  
    //Any modification will effect the main model object.

    Sidebar.prototype.getDiagram = function (inData) {
      var model = simApp.allDataModel;
      var diagram = {
        id: inData.id, name: inData.name, desc: inData.desc,
        DiagramList: [],
        ActionList: [],
        StateList: [],
        EventList: [],
        LogicNodeList: model.LogicNodeList,  //tag along for lookup purpose
        VariableList: model.VariableList      // same here.
      };

      if (model.DiagramList) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          var d = model.DiagramList[i];
          if (d.Diagram.name == inData.name) {
            diagram.DiagramList.push(d);
            d = d.Diagram;
            if (d.states) {
              for (var i = 0; i < d.states.length; i++) {
                var sName = d.states[i];

                //all actions, events and variables belongs to a state are also copied inside this function.
                var aState = this.getState(diagram, sName);
                if (aState && !diagram.StateList.find(function (st) { return (st.State.name == aState.State.name) }))
                  diagram.StateList.push(aState);
              }
            }

            break;
          }
        }
      }



      return diagram;
    }

    //loop through each item in the model for the given item types and call the callback function.
    Sidebar.prototype.forEachItemDo = function (model, itemTypes, doFunc)
    {
      if (model.DiagramList && itemTypes.includes("Diagram")) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          doFunc(this, model, model.DiagramList[i].Diagram, "Diagram");
        }
      }
      if (model.StateList && itemTypes.includes("State")) {
        for (var i = 0; i < model.StateList.length; i++) {
          doFunc(this, model, model.StateList[i].State, "State");
        }
      }
      if (model.ActionList && itemTypes.includes("Action")) {
        for (var i = 0; i < model.ActionList.length; i++) {
          doFunc(this, model, model.ActionList[i].Action, "Action");
        }
      }
      if (model.EventList && itemTypes.includes("Event")) {
        for (var i = 0; i < model.EventList.length; i++) {
          doFunc(this, model, model.EventList[i].Event, "Event");
        }
      }
      if (model.LogicNodeList && itemTypes.includes("LogicNode")) {
        for (var i = 0; i < model.LogicNodeList.length; i++) {
          doFunc(this, model, model.LogicNodeList[i].LogicNode, "LogicNode");
        }
      }
      if (model.VariableList && itemTypes.includes("Variable")) {
        for (var i = 0; i < model.VariableList.length; i++) {
          doFunc(this, model, model.VariableList[i].Variable, "Variable");
        }
      }
      if (model.VariableList && itemTypes.includes("ExtSim")) {
        if (model.ExtSimList) {
          for (var i = 0; i < model.ExtSimList.length; i++) {
            doFunc(this, model, model.ExtSimList[i].ExtSim, "ExtSim");
          }
        }
      }
    }

    //begin-----------------Rename functions for different items-------------------------------
    //Replace a state name through out the entire model and update the effected state view's textContent.
    Sidebar.prototype.replaceNames = function (oldName, newName, type, model, updateSidebar = true)
    {
      if (model == null)
        model = simApp.allDataModel;
      //try and replace for all object referencing calls
      this.statesReferencing(model, oldName, type, false, false, false, newName);
      this.variableReferencing(model, oldName, type, false, newName);
      this.eventsReferencing(model, oldName, type, false, newName);
      this.actionsReferencing(model, oldName, type, false, newName);
      this.diagramsReferencing(model, oldName, type, false, newName);
      this.logicNodesReferencing(model, oldName, type, false, newName);
      this.extSimsReferencing(model, oldName, type, false, newName);

      //update the names in the left side bar view
      if (updateSidebar) {
        this.alterSideBarListsItem(oldName, newName, new Set(["All", "Global", "Local"]), type);
      }
    }
    Sidebar.prototype.replaceEventName = function (oldName, newName) {
        this.replaceNames(oldName, newName, "Event");
    }
    Sidebar.prototype.replaceActionName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Action");
    }    
    Sidebar.prototype.replaceStateName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "State");
    }
    Sidebar.prototype.replaceDiagramName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Diagram");
      //update the html for the item, the name has already changed
      this.diagramsReferencing(simApp.allDataModel, newName, "Diagram", false, newName);
    }
    Sidebar.prototype.replaceLogicNodeName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "LogicNode");
      //update the html for the item, the name has already changed
      this.logicNodesReferencing(simApp.allDataModel, newName, "LogicNode", false, newName);
    }
    Sidebar.prototype.replaceVariableName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Variable");
    }
    Sidebar.prototype.replaceExtSimName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "ExtSim");   
      //update the html for the item, the name has already changed
      this.extSimsReferencing(simApp.allDataModel, newName, "ExtSim", false, newName);
    }
    //end-------------------Rename functions for different items-------------------------------


    //---------------------------------------------------
    Sidebar.prototype.existsStateName = function (aName) {
      var model = simApp.allDataModel;
      var found = false;
      if (model.StateList) {
        for (var i = 0; i < model.StateList.length; i++) {
          var state = model.StateList[i].State;
          if (state.name == aName) {
            found = true;
            break;
          }
        }
      }
      return found;
    }
    //---------------------------------------------------
    Sidebar.prototype.existsDiagramName = function (aName) {
      var model = simApp.allDataModel;
      var found = false;
      if (model.DiagramList) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          if (model.DiagramList[i].Diagram.name == aName) {
            found = true;
            break;
          }
        }
      }
      return found;
    }
    //------------------------------------------------------
    Sidebar.prototype.existsLogicName = function (aName) {
      var model = simApp.allDataModel;
      var found = false;
      if (model.LogicNodeList) {
        for (var i = 0; i < model.LogicNodeList.length; i++) {
          if (model.LogicNodeList[i].LogicNode.name == aName) {
            found = true;
            break;
          }
        }
      }
      return found;
    }
    //------------------------------------------------------
    Sidebar.prototype.existsTemplateName = function (aName) {
      var model = simApp.allTemplates;
      var found = false;
      if (model.DiagramList) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          if (model.DiagramList[i].Diagram.name == aName) {
            found = true;
            break;
          }
        }
      }
      return found;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewDiagram = function (newDiagram, parent) {
      var mainModel = simApp.allDataModel;
      if (mainModel.DiagramList) {
        var dia = this.getDiagramByName(mainModel, newDiagram.Diagram.name);
        if (!dia) {
          var idx = mainModel.DiagramList.push(newDiagram);
          newDiagram.Diagram.id = idx;
          if (parent) {
            parent.push(newDiagram.Diagram.name);
          }

          var container = document.getElementById("DiagramsPanel_id");
          if (container) {
            this.addDiagramToSection(container, newDiagram);
          }

          return true;
        }
      }
      return false;
    }

    //------------------------------------
    Sidebar.prototype.getDefaultActionID = function () {
      var mainModel = simApp.allDataModel;
      var maxID = 0;
      var ActionList = mainModel.ActionList;
      for (var i = 0; i < ActionList.length; i++) {
        if (ActionList[i].Action.id > maxID) {
          maxID = ActionList[i].Action.id;
        }
      }
      return (maxID + 1);
    }
    //------------------------------------
    Sidebar.prototype.getDefaultEventID = function () {
      var mainModel = simApp.allDataModel;
      var maxID = 0;
      var EventList = mainModel.EventList;
      for (var i = 0; i < EventList.length; i++) {
        if (EventList[i].Event.id > maxID) {
          maxID = EventList[i].Event.id;
        }
      }
      return (maxID + 1);
    }
    //------------------------------------
    Sidebar.prototype.getDefaultStateID = function () {
      var mainModel = simApp.allDataModel;
      var maxID = 0;
      var StateList = mainModel.StateList;
      for (var i = 0; i < StateList.length; i++) {
        if (StateList[i].State.id > maxID) {
          maxID = StateList[i].State.id;
        }
      }
      return (maxID + 1);
    }
    //------------------------------------
    Sidebar.prototype.getDefaultDiagramID = function () {
      var mainModel = simApp.allDataModel;
      var maxID = 0;
      var DiagramList = mainModel.DiagramList;
      for (var i = 0; i < DiagramList.length; i++) {
        if (DiagramList[i].Diagram.id > maxID) {
          maxID = DiagramList[i].Diagram.id;
        }
      }
      return (maxID + 1);
    }
    //------------------------------------

    //newAction - the new action object to be add.
    //parent - either the ImmediateAction array or the EventAction's actions array.
    //isImmediate - true if this is an immediate action add, false EventAction's action.
    Sidebar.prototype.addNewAction = function (newAction, parent, isImmediate) {
      var mainModel = simApp.allDataModel;
      if (mainModel.ActionList) {
        var act = this.getActionByName(mainModel, newAction.Action.name);
        if (!act) {
          var idx = mainModel.ActionList.push(newAction);
          newAction.Action.id = idx;
          if (isImmediate) {
            parent.push(newAction.Action.name);
          }
          else if (parent) {
            parent.actions.push(newAction.Action.name);
          }

          var globalContainer = document.getElementById("Global_ActionsPanel_id");
          var container = document.getElementById("ActionsPanel_id");
          if (container) {
            newAction.ui_el = this.addSectionItem(container, "Actions", newAction.Action.name, newAction.Action);
            sortDOMList(container);
          }

          if (globalContainer) {
            newAction.ui_el = this.addSectionItem(globalContainer, "Actions", newAction.Action.name, newAction.Action);
            sortDOMList(container);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    //newAction - the new action object to be add.
    //parent - either the ImmediateAction array or the EventAction's actions array.
    //isImmediate - true if this is an immediate action add, false EventAction's action.
    Sidebar.prototype.addNewLocalAction = function (newAction, parent, isImmediate) {
      var mainModel = simApp.allDataModel;
      if (mainModel.ActionList) {
        var act = this.getActionByName(mainModel, newAction.Action.name);
        //if the action does not exist
        if (!act) {
          var idx = mainModel.ActionList.push(newAction);
          newAction.Action.id = idx;
          if (isImmediate) {
            parent.push(newAction.Action.name);
          }
          else if (parent) {
            parent.actions.push(newAction.Action.name);
          }

          var container = document.getElementById("Local_ActionsPanel_id");
          if (container) {
            newAction.ui_el = this.addSectionItem(container, "Actions", newAction.Action.name, newAction.Action);
            sortDOMList(container);
          }
          var allContainer = document.getElementById("ActionsPanel_id");
          if (allContainer) {
            newAction.ui_el = this.addSectionItem(allContainer, "Actions", newAction.Action.name, newAction.Action);
            sortDOMList(allContainer);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewEvent = function (newEvent, parent) {
      var mainModel = simApp.allDataModel;
      if (mainModel.EventList) {
        var evt = this.getEventByName(mainModel, newEvent.Event.name);
        if (!evt) {
          var idx = mainModel.EventList.push(newEvent);
          newEvent.Event.id = idx;
          if (parent) { //parent is the state's events array.
            parent.push(newEvent.Event.name);
          }

          var container = document.getElementById("EventsPanel_id");
          if (container) {
            newEvent.ui_el = this.addSectionItem(container, "Events", newEvent.Event.name, newEvent.Event);
            sortDOMList(container);
          }
          var globalContainer = document.getElementById("Global_EventsPanel_id");
          if (globalContainer && newEvent.Event.mainItem) {
            newEvent.ui_el = this.addSectionItem(globalContainer, "Events", newEvent.Event.name, newEvent.Event);
            sortDOMList(globalContainer);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewLocalEvent = function (newEvent, parent, existingAsNew) {
      var mainModel = simApp.allDataModel;
      if (mainModel.EventList) {
        var evt = this.getEventByName(mainModel, newEvent.Event.name);
        if (!evt) {
          var idx = mainModel.EventList.push(newEvent);
          newEvent.Event.id = idx;
          if (!existingAsNew && parent) { //parent is the state's events array if set. If not set then it exists in parent and is just being saved as a new item.
            parent.push(newEvent.Event.name);
          }

          var container = document.getElementById("Local_EventsPanel_id");
          if (container) {
            newEvent.ui_el = this.addSectionItem(container, "Events", newEvent.Event.name, newEvent.Event);
            sortDOMList(container);
          }
          var allContainer = document.getElementById("EventsPanel_id");
          if (allContainer) {
            newEvent.ui_el = this.addSectionItem(allContainer, "Events", newEvent.Event.name, newEvent.Event);
            sortDOMList(allContainer);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    //used to maintain correct data structure
    Sidebar.prototype.addNewEmptyEventAction = function (state) {
      var mainModel = simApp.allDataModel;
      var dataState = this.getStateByName(mainModel, state.name);
      var emptyAction = {
        "actions": []
      }
      dataState.State.eventActions.push(emptyAction);
    }
    /**
     * Sorts variables alphabetically by name.
     */
    Sidebar.prototype.sortVariables = function () {
      const mainModel = simApp.allDataModel;
      mainModel.VariableList = mainModel.VariableList.sort((a, b) => {
        if (a.Variable.name < b.Variable.name) {
          return -1;
        }
        if (a.Variable.name > b.Variable.name) {
          return 1;
        }
        return 0;
      });
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewVariable = function (newVariable, parent) {
      var mainModel = simApp.allDataModel;
      if (mainModel.VariableList) {
        var varr = this.getVariableByName(mainModel, newVariable.Variable.name);
        if (!varr) {
          var idx = mainModel.VariableList.push(newVariable);
          newVariable.Variable.id = idx;
          this.sortVariables();
          if (parent) {
            parent.push(newVariable.Variable.name);
          }

          var container = document.getElementById("VariablesPanel_id");
          if (container) {
            newVariable.ui_el = this.addSectionItem(container, "Variables", newVariable.Variable.name, newVariable.Variable);
            sortDOMList(container);
          }
          var globalContainer = document.getElementById("Global_VariablesPanel_id");
          if (globalContainer && newVariable.Variable.varScope == "gtGlobal") {
            newVariable.ui_el = this.addSectionItem(globalContainer, "Variables", newVariable.Variable.name, newVariable.Variable);
            sortDOMList(globalContainer);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewLogicTree = function (newLogicNode, parent) {
      var mainModel = simApp.allDataModel;
      if (mainModel.LogicNodeList) {
        var existing = this.getLogicNodeByName(mainModel, newLogicNode.LogicNode.name);
        if (!existing) {
          var idx = mainModel.LogicNodeList.push(newLogicNode);
          newLogicNode.LogicNode.id = idx;
          if (parent) {
            parent.push(newLogicNode.LogicNode.name);
          }

          var container = document.getElementById("LogicTreesPanel_id");
          if (container) {
            newLogicNode.ui_el = this.addSectionItem(container, "Logic Tree", newLogicNode.LogicNode.name, newLogicNode.LogicNode);
            sortDOMList(container);
          }
          return true;
        }
      }
      return false;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewExtSim = function (newExtSim, parent) {
      var mainModel = simApp.allDataModel;

      if (!mainModel.ExtSimList) mainModel.ExtSimList = [];

      var sim = this.getExtSimByName(mainModel, newExtSim.ExtSim.name);
      if (!sim) {
        //We only care about a new ExtSim, as any existing will be updated by the editor.
        var idx = mainModel.ExtSimList.push(newExtSim);
        newExtSim.ExtSim.id = idx;
        if (parent) {
          parent.push(newExtSim.ExtSim.name);
        }

        var container = document.getElementById("ExtSimPanel_id");
        if (container) {
          newExtSim.ui_el = this.addSectionItem(container, "External Sims", newExtSim.ExtSim.name, newExtSim.ExtSim);
          sortDOMList(container);
        }
        return true;
      }
      return false;
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewState = function (newState) {
      var mainModel = simApp.allDataModel;
      if (mainModel.StateList) {
        var idx = mainModel.StateList.push(newState);
        newState.State.id = idx;
        var container = document.getElementById("StatesPanel_id");
        if (container) {
          newState.ui_el = this.addSectionItem(container, "States", newState.State.name, newState.State);
          sortDOMList(container);
        }
      }
    }
    //---------------------------------------------------
    Sidebar.prototype.addNewLocalState = function (newState) {
      var mainModel = simApp.allDataModel;
      if (mainModel.StateList) {
        var idx = mainModel.StateList.push(newState);
        newState.State.id = idx;
        var container = document.getElementById("Local_StatesPanel_id");
        if (container) {
          newState.ui_el = this.addSectionItem(container, "States", newState.State.name, newState.State);
          sortDOMList(container);
        }
        var allContainer = document.getElementById("StatesPanel_id");
        if (allContainer) {
          newState.ui_el = this.addSectionItem(allContainer, "States", newState.State.name, newState.State);
          sortDOMList(allContainer);
        }
      }
    }
    //---------------------------------------------------
    Sidebar.prototype.cleanDataModel = function (diagram) {
      //these properties are mxGraph's and will be reassigned when re-rendered in Sidebar and StateHandler.
      if (diagram.StateList)
        for (var i = 0; i < diagram.StateList.length; i++) {
          //simply cannot recreate State, it need to be a reference to the main model.
          if (typeof (diagram.StateList[i]["actionCell"]) !== "undefined") delete diagram.StateList[i]["actionCell"];
          if (typeof (diagram.StateList[i]["dataType"]) !== "undefined") delete diagram.StateList[i]["dataType"];
          if (typeof (diagram.StateList[i]["eventCell"]) !== "undefined") delete diagram.StateList[i]["eventCell"];
          if (typeof (diagram.StateList[i]["iActions"]) !== "undefined") delete diagram.StateList[i]["iActions"];
          if (typeof (diagram.StateList[i]["iEvents"]) !== "undefined") delete diagram.StateList[i]["iEvents"];
          if (typeof (diagram.StateList[i]["ownerCell"]) !== "undefined") delete diagram.StateList[i]["ownerCell"];
          if (typeof (diagram.StateList[i]["ownerID"]) !== "undefined") delete diagram.StateList[i]["ownerID"];
        }

      if (diagram.sidebar) delete diagram.sidebar;
      return diagram;
    }
    //---------------------------------------------------
    Sidebar.prototype.openDiagramWindow = function (diagram) {
      diagram = diagram || null;
      var diagramPlus = this.getDiagram(diagram);
      this.cleanDataModel(diagramPlus);
      diagramPlus.sidebar = this;

      //create a frame window (Div) on the document.body.
      var wnd = mxWindow.createFrameWindow(
        'State1.html',
        '',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, dataObj) {   //callback for the "close" button.
          if (btn.toUpperCase() === 'CLOSE') {
            var dia = this.getDiagramByName(simApp.allDataModel, diagram.name);
            if (dia && dia.wnd)
              delete dia.wnd;
          }
          return true;
        }.bind(this),
        diagramPlus, //dataObj
        false, //ismodal
        null,
        null,
				(window.innerWidth / 1.5) - 200, //width
				(window.innerHeight / 1.5) - 150  //height
      );

      //we want to keep the window handle so when the diagram is tried to open again, we just show it.
      var dia = this.getDiagramByName(simApp.allDataModel, diagram.name);
      if (dia)
        dia.wnd = wnd;
      ///
      //move the new framewindow from document.body to be managed by the ContentPanel.
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
      // wnd.div.style.width = '100%';
      //wnd.div.style.height = '100%';
    }
    //---------------------------------------------------
    Sidebar.prototype.openDiagramByStateName = function (stateName) {
      var diagram = this.getDiagramByStateName(stateName);
      if (diagram) {
        this.openDiagram(diagram.Diagram);
      }
    }
    //---------------------------------------------------
    Sidebar.prototype.openDiagram = function (inData) {


      if (!inData) {
        console.log("Open State Editor: invalid data was requested");
        return;
      }

      //If the diagram already opened, just bring it to the top.
      var dia = null;
      var mainModel = simApp.allDataModel;
      if (mainModel.DiagramList) {
        for (var i = 0; i < mainModel.DiagramList.length; i++) {
          if (mainModel.DiagramList[i].Diagram.name == inData.name) {
            dia = mainModel.DiagramList[i];
            break;
          }
        }
        if (dia && dia.wnd) {
          dia.wnd.show();
          return;
        }
      }

      this.openDiagramWindow(inData);
    }
    //------------------------------------------
    Sidebar.prototype.editDiagramProperties = function (dataObj, el) {
      var originalLabel = dataObj.diagramLabel;
      var url = 'EditForms/DiagramEditor.html';
      dataObj.changeDiagramType = this.editDiagramType;

      var wnd = mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, outDataObj) {
          if (btn === 'OK') {
            delete outDataObj.diagramLabels;
            simApp.modelChanged = true;
            if (el) {
              //diagram has its own create new diagram function.
              var oldName = el.innerText;
              this.replaceDiagramName(oldName, dataObj.name);
            }
          }
          return true;
        }.bind(this),
        dataObj,
        false, //ismodal
        null,
        null,
        450, //width
        300 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
      }
    //-------------------------------------------
    Sidebar.prototype.editDiagramType = function (diagramName, oldType, newType) {
      let successful = false;
      console.log('Changing Diagram Type');
      return successful;
    }

    //------------------
    Sidebar.prototype.editExtSimProperties = function (dataObj, el) {
      var oldName = dataObj.name;
      var url = 'EditForms/ExtSimEditor.html';
      var wnd = mxWindow.createFrameWindow(
          url,
          'OK, Cancel',  //command buttons
          'minimize, maximize, close', //top buttons
          function (btn, outDataObj) {
            if (btn === 'OK') {
              if (el) {
                el.innerText = dataObj.name;
                simApp.modelChanged = true;
                //this.replaceVariable(oldName, dataObj.name);
              }
              else {
                var extSimObj = { ExtSim: dataObj };
                this.addNewExtSim(extSimObj, null);
              }
            }
            return true;
          }.bind(this),
          dataObj,
          false, //ismodal
          null,
          null,
          500, //width
          150 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
    }

    //------------------------------------------
    Sidebar.prototype.editStateProperties = function (dataObj, el) {
      var url = "EditForms/StateEditor.html";
      dataObj.sidebar = simApp.mainApp.sidebar;
      var wnd = mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, retObj) {
          if (btn === 'OK') {
            //dataObj = retObj;
            //saveStateProperties(dataObj);

            if (el) {
              var oldName = el.innerText;
              el.innerText = dataObj.name;
              this.replaceStateName(oldName, dataObj.name)
            }
            simApp.modelChanged = true;

          }
          dataObj.sidebar = undefined;
          return true;
        }.bind(this),
        dataObj,
        false, //ismodal
        null,
        null,
        450, //width
        300 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
    }
    //------------------
    Sidebar.prototype.editVariableProperties = function (dataObj, el) {
      var oldName = dataObj.name;
      var url = 'EditForms/VariableEditor.html';
      var sidebar = this;
      var wnd = mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, outDataObj) {
          if (btn in SetOf(['OK', 'Save As New'])) {
            var asNew = btn === 'Save As New';
            if (el && !asNew) {
              var letters = /^[0-9a-zA-Z-_]+$/;
              if (dataObj.name.match(letters)) {
                el.innerText = dataObj.name;
                simApp.modelChanged = true;
                this.replaceVariableName(oldName, dataObj.name);
                sidebar.sortVariables();
                var container = document.getElementById("VariablesPanel_id");
                if (container) {
                  sortDOMList(container);
                }
              }
              else {
                return false;
              }
            }
            else {
              var variableObj = { Variable: outDataObj };
              this.addNewVariable(variableObj, null);
            }
          }
          return true;
        }.bind(this),
        dataObj,
        false, //ismodal
        null,
        null,
        450, //width
        300 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
    }
   
    //-------------------------------------------------------
    Sidebar.prototype.getDefaultGateID = function () {
      var maxID = 0;
      var logicNodeList = this.LogicNodeList;
      for (var i = 0; i < logicNodeList.length; i++) {
        if (logicNodeList[i].LogicNode.id > maxID) {
          maxID = logicNodeList[i].LogicNode.id;
        }
      }
      return (maxID + 1);
    }
    //------------------------------------------

    Sidebar.prototype.editLogicProperties = function (dataObj, el) {
      var url = 'EditForms/GateEditor.html';
      var newID = this.getDefaultGateID();
      if (!dataObj) {
        dataObj = {
          id: newID,
          name: "",
          desc: "",
          gateType: "gtAnd",
          rootName: "",
          compChildren: [],
          gateChildren: []
        };
      }
      var wnd = mxWindow.createFrameWindow(
          url,
          'OK, Cancel',  //command buttons
          'minimize, maximize, close', //top buttons
          function (btn, outDataObj) {
            if (btn === 'OK') {
              simApp.modelChanged = true;
              if (el) {
                el.innerText = dataObj.name;
                const oldName = outDataObj.rootName;
                outDataObj.rootName = outDataObj.name;
                simApp.mainApp.sidebar.replaceNames(oldName, dataObj.name, 'LogicNode', simApp.allDataModel, false);
              } else {
                if (this.existsLogicName(outDataObj.name)) {
                  MessageBox.alert("New Logic Tree", "A logic tree with the '" + outDataObj.name + "' exists, please try a different name.");
                  return false;
                }
                if (outDataObj.name.length > 0) {
                  outDataObj.rootName = outDataObj.name;
                  var logicNode = { LogicNode: outDataObj };
                  this.addNewLogicTree(logicNode, null);
                  this.openLogicTree(outDataObj);
                }
              }
            }
            return true;
          }.bind(this),
          dataObj,
          true, //ismodal
          null,
          null,
          450, //width
          300 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
      // wnd.div.setMaximizable=true;
    }
    //------------------
    Sidebar.prototype.openLogicTree = function (dataObj) {
      var url = 'FTViewer10.html';
      var logicTree = this.buildLogicTree(dataObj);
      if (logicTree) {
        var wnd = mxWindow.createFrameWindow(
          url,
          'OK, Cancel',  //command buttons
          'minimize, maximize, close', //top buttons
          function (btn, retObj) {
            if (btn === 'OK') {
              // TODO: Only save fault tree changes when the OK button is clicked.
            }
            return true;
          }.bind(this),
          logicTree,
          false, //ismodal
          null,
          null,
          650, //width
          500 //height, 
        );
        document.body.removeChild(wnd.div);
        var contentPanel = document.getElementById("ContentPanel");
        adjustWindowPos(contentPanel, wnd.div);
        contentPanel.appendChild(wnd.div);
      }
    }

    //------------------
    Sidebar.prototype.editActionProperties = function (dataObj, el) {
      var url = 'EditForms/ActionEditor.html';
      //Action Editor needs the variables, so we temporary added here.
      dataObj.tempVariableList = simApp.allDataModel.VariableList;
      dataObj.tempExtSimList = simApp.allDataModel.ExtSimList;
      var wnd = mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn in SetOf(['OK', 'Save As New'])) {
          var asNew = btn === 'Save As New';
          simApp.modelChanged = true;
          if (el && !asNew) { // el is not null when editing an existing action.
            var original = el.innerText;
            el.innerText = dataObj.name;
            //change references to this obj elsewhere too
            this.editActionPropertiesHelper(original, dataObj.name);
          }
          else {
            //when el is not provided, it is new action created.
            var actionObj = { Action: retObj };
            this.addNewAction(actionObj, null);
          }
        }
        //When we are done editing the action object, the variables is then removed.
        delete dataObj.tempVariableList;
        delete dataObj.tempExtSimList;
        return true;
      }.bind(this),
      dataObj,
      false, //ismodal
      null,
      null,
      500, //width
      400 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
    }

    //------------------
    Sidebar.prototype.editActionPropertiesHelper = function (oldName, newName) {
      var mainModel = simApp.allDataModel;
      var stateList = mainModel.StateList;
      stateList.forEach(function (item) {
        var state = item.State;
        for (var i = 0; i < state.immediateActions.length; i++) {
          if (state.immediateActions[i] == oldName) {
            item.State.immediateActions[i] = newName;
          }

        }
        for (var j = 0; j < state.eventActions.length; j++) {
          for (var k = 0; k < state.eventActions[j].actions.length; k++) {
            if (state.eventActions[j].actions[k] == oldName) {
              item.State.eventActions[j].actions[k] = newName;
            }
          }
        }

      }.bind(this));
    }
    //------------------------------------------
    Sidebar.prototype.editEventProperties = function (dataObj, el) {
      var url = 'EditForms/EventEditor.html';
      var vars = simApp.allDataModel.VariableList;
      var varList = [];
      for (var i = 0; i < vars.length; i++) {
        varList.push(vars[i].Variable);
      }
      dataObj.tempVariableList = varList;
      var nodeList = simApp.allDataModel.LogicNodeList;
      var logicNodes = [];
      var ln;
      for (var i = 0; i < nodeList.length; i++) {
        ln = nodeList[i].LogicNode;
        if (ln.isRoot)
          logicNodes.push(ln);
      }
      dataObj.tempLogicTopList = logicNodes;

      var wnd = mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn in SetOf(['OK', 'Save As New'])) {
          var asNew = btn === 'Save As New';
          simApp.modalChanged = true;
          if (el && !asNew) { //existing one.
            var oldName = el.innerText;
            if (oldName != dataObj.name) {
              this.replaceEventName(oldName, dataObj.name);
            }
              //el.innerText = dataObj.name;
              //this.editEventPropertiesHelper(original, dataObj.name);              
          }
          else { //new event.
            var evtObj = { Event: dataObj };
            this.addNewEvent(evtObj, null);
          }
        }
        //When we are done editing the action object, the variables is then removed.
        delete dataObj.tempVariableList;
        delete dataObj.tempLogicTopList;
        return true;
      }.bind(this),
      dataObj,
      false, //ismodal
      null,
      null,
      500, //width
      500 //height
      );
      document.body.removeChild(wnd.div);
      var contentPanel = document.getElementById("ContentPanel");
      adjustWindowPos(contentPanel, wnd.div);
      contentPanel.appendChild(wnd.div);
    }
    //------------------
    //For Delete set newName = null 
    Sidebar.prototype.alterSideBarListsItem = function (itemName, newName, tabs, type) { 
      var container = null;
      if (type == "LogicNode") {
        container = document.getElementById("LogicTreesPanel_id");
        var index = this.indexOfSideBarNode(container.childNodes, itemName);
        if (index != null) {
          var id = container.childNodes[index].id;
          var element = document.getElementById(id);
          if (newName == null)
            element.parentNode.removeChild(element);
          else
            element.innerHTML = newName;
        }
        return;
      }

      if (tabs.has("All")) {
        switch (type) {
          case "State" :
            container = document.getElementById("StatesPanel_id");
            break;
          case "Event" :
            container = document.getElementById("EventsPanel_id");
            break;
          case "Action" :
            container = document.getElementById("ActionsPanel_id");
            break;
          case "Variable" :
            container = document.getElementById("VariablesPanel_id");
            break;
          default: //all others not in the lists
            return;
        }

        var index = this.indexOfSideBarNode(container.childNodes, itemName);
        if (index != null) {
          var id = container.childNodes[index].id;
          var element = document.getElementById(id);
          if (newName == null)
            element.parentNode.removeChild(element);
          else
            element.innerHTML = newName;
        }
      }

      if (tabs.has("Global")) {
        switch (type) {
          //case "State" :
          //  container = document.getElementById("");
          //  break;
          case "Event" :
            container = document.getElementById("Global_EventsPanel_id");
            break;
          case "Action" :
            container = document.getElementById("Global_ActionsPanel_id");
            break;
          case "Variable" :
            container = document.getElementById("Global_VariablesPanel_id");
            break;
        }
        index = this.indexOfSideBarNode(container.childNodes, itemName);
        if (index != null) {
          var id = container.childNodes[index].id;
          var element = document.getElementById(id);
          if (newName == null)
            element.parentNode.removeChild(element);
          else
            element.innerHTML = newName;
        }
      }

      if (tabs.has("Local")) {
        switch (type) {
          case "State" :
            container = document.getElementById("Local_StatesPanel_id");
            break;
          case "Event" :
            container = document.getElementById("Local_EventsPanel_id");
            break;
          case "Action" :
            container = document.getElementById("Local_ActionsPanel_id");
            break;
          //case "Variable" :
          //  container = document.getElementById("");
          //  break;
        }
        index = this.indexOfSideBarNode(container.childNodes, itemName);
        if (index != null) {
          var id = container.childNodes[index].id;
          var element = document.getElementById(id);
          if (newName == null)
            element.parentNode.removeChild(element);
          else
            element.innerHTML = newName;
        }
      }
    }
    //------------------
    Sidebar.prototype.deleteDiagram = function (dataObj, el) {
      var idx = -1;
      var mainModel = simApp.allDataModel;

      //remove references in the logic trees
      this.logicNodesReferencing(mainModel, dataObj.name, "Diagram", true);

      //find in the diagram list and remove
      if (mainModel.DiagramList) {
        for (var i = 0; i < mainModel.DiagramList.length; i++) {
          if (mainModel.DiagramList[i].Diagram.name == dataObj.name) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          mainModel.DiagramList.splice(idx, 1);
          el.remove();
          this.notifyDataChanged(true);
          //When a Diagram is deleted, all associated states must be removed as well.
          for (var i = 0; i < dataObj.states.length; i++) {
            var astate = this.getStateByName(mainModel, dataObj.states[i]);
            if (astate) {
              this.deleteState(astate.State);
              if (astate.ui_el)
                astate.ui_el.remove();
            }
          }
        }
      }
    }
    //------------------------------------------
    Sidebar.prototype.deleteState = function (dataObj) {
      var idx = -1;
      var mainModel = simApp.allDataModel;

      //remove references to the state
      this.diagramsReferencing(mainModel, dataObj.name, "State", true);
      this.eventsReferencing(mainModel, dataObj.name, "State", true);
      this.variableReferencing(mainModel, dataObj.name, "State", true);
      this.actionsReferencing(mainModel, dataObj.name, "State", true);

      if (mainModel.StateList) {
        for (var i = 0; i < mainModel.StateList.length; i++) {
          if (mainModel.StateList[i].State.name == dataObj.name) {
            idx = i;
            break;
          }
        }

        if (idx >= 0) {
          //Delete the items in the state, any child items with this as the only reference will also be deleted.
          for (var i = 0; i < dataObj.immediateActions.length; i++) {
            var action = this.getAction(mainModel, dataObj.immediateActions[i]);
            this.deleteAction(action.Action, false, dataObj);
            if (action.ui_el)
              action.ui_el.remove();
          }

          for (var i = 0; i < dataObj.events.length; i++) {
            var evt = this.getEvent(mainModel, dataObj.events[i]);
            this.deleteEvent(evt.Event, false, dataObj);
            if (evt.ui_el)
              evt.ui_el.remove();
          }

          for (var i = 0; i < dataObj.eventActions.length; i++) {
            var ea = dataObj.eventActions[i];
            if (ea && ea.actions.length > 0)
              for (var j = 0; j < ea.actions.length; j++) {
                var action = this.getAction(mainModel, ea.actions[j]);
                this.deleteAction(action.Action, false, dataObj);
                if (action.ui_el)
                  action.ui_el.remove();
              }
          }

          mainModel.StateList.splice(idx, 1);
          this.notifyDataChanged(true);
        }
      }


      //check if it is in local panel and delete it if it is
      //Remove from left panel lists
      this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Local"]), "State");
     }
    //------------------------------------------
    Sidebar.prototype.deleteLogicTree = function (dataObj, el) {
      var idx = -1;
      var mainModel = simApp.allDataModel;
      if (mainModel.LogicNodeList) {
        for (var i = 0; i < mainModel.LogicNodeList.length; i++) {
          if (mainModel.LogicNodeList[i].LogicNode.name == dataObj.name) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          mainModel.LogicNodeList.splice(idx, 1);
          this.notifyDataChanged(true);
          el.remove();
        }
      }
    }
    //------------------------------------------
    Sidebar.prototype.deleteAction = function (dataObj, fullDelete, state, event) {
      //collect all the array references to be removed

      var mainModel = simApp.allDataModel;
      
      //find and remove all State immediate actions and Event Actions that are applicable and remove
      var refCnt = this.statesReferencing(mainModel, dataObj.name, "Action", fullDelete, state, event).length;      

      var global = dataObj.mainItem;

      fullDelete = (fullDelete || ((refCnt == 0) && !global));
      if (fullDelete) {
        //remove from the main action list
        if (mainModel.ActionList) {
          for (var i = 0; i < mainModel.ActionList.length; i++) {
            if (mainModel.ActionList[i].Action.name == dataObj.name) {
              mainModel.ActionList.splice(i, 1);
              break;
            }
          }
        }

        this.notifyDataChanged(true);
        this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Global", "Local"]), "Action");
      }
      else if ((refCnt == 0) && global) {
        this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Local"]), "Action");
      }
    }
    
    //------------------------------------------
    Sidebar.prototype.deleteEvent = function (dataObj, fullDelete, state) {
      var mainModel = simApp.allDataModel;

      //find and remove applicable references to it first
      var refCnt = this.statesReferencing(mainModel, dataObj.name, "Event", fullDelete, state).length;      

      var global = dataObj.mainItem;
      fullDelete = (fullDelete || ((refCnt == 0) && !global));
      if (fullDelete) {
        var mainModel = simApp.allDataModel;
        //remove event from main event list
        if (mainModel.EventList) {
          for (var i = 0; i < mainModel.EventList.length; i++) {
            if (mainModel.EventList[i].Event.name == dataObj.name) {
              mainModel.EventList.splice(i, 1);
              break;
            }
          }
        }
        this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Global", "Local"]), "Event");
        this.notifyDataChanged(true);
      }
      else if ((refCnt == 0) && global) {
        this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Local"]), "Event");
      }
    }

    //------------------------------------------
    Sidebar.prototype.deleteExtSim = function (dataObj, el) {
      var idx = -1;
      var mainModel = simApp.allDataModel;

      //remove it from any actions
      this.actionsReferencing(mainModel, dataObj.name, "ExtSim", true);

      //find and remove item in the main list
      if (mainModel.ExtSimList) {
        for (var i = 0; i < mainModel.ExtSimList.length; i++) {
          if (mainModel.ExtSimList[i].ExtSim.name == dataObj.name) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          mainModel.ExtSimList.splice(idx, 1);
          this.notifyDataChanged(true);
          el.remove();
        }
      }
    }

    //------------------------------------------
    Sidebar.prototype.deleteVariable = function (dataObj, el) {
      var idx = -1;
      var mainModel = simApp.allDataModel;

      //remove from any references
      this.eventsReferencing(mainModel, dataObj.name, "Variable", true);
      this.actionsReferencing(mainModel, dataObj.name, "Variable", true);


      //find and remove in the main model
      if (mainModel.VariableList) {
        for (var i = 0; i < mainModel.VariableList.length; i++) {
          if (mainModel.VariableList[i].Variable.name == dataObj.name) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          mainModel.VariableList.splice(idx, 1);
          el.remove();
          this.notifyDataChanged(true);
        }
      }
      this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Global", "Local"]), "Variable");
      //var allContainer = document.getElementById("VariablesPanel_id");
      //var index = this.indexOfSideBarNode(allContainer.childNodes, dataObj.name);
      //if (index != null) {
      //  var id = allContainer.childNodes[index].id;
      //  var element = document.getElementById(id);
      //  element.parentNode.removeChild(element);
      //}
      //var globalContainer = document.getElementById("Global_VariablesPanel_id");
      //index = this.indexOfSideBarNode(globalContainer.childNodes, dataObj.name);
      //if (index != null) {
      //  var id = globalContainer.childNodes[index].id;
      //  var element = document.getElementById(id);
      //  element.parentNode.removeChild(element);
      //}
    }

    //------------------------------------------
    //Replace the name in text such as user defined code
    Sidebar.prototype.replaceNamesInText = function (text, name, newName) {
      var letters = /^[0-9a-zA-Z-_]+$/;
      var j = -1;
      var newText = text;
      while ((j = text.indexOf(name, j + 1)) != -1) {
        newText = "";
        //check that it starts with a non-alphanumeric value
        var before = " ", after = " ";
        if (j > 0) {
          before = "" + text.charAt(j - 1);
          newText = text.substring(0, j);
        }
        newText += newName;
        if ((j + name.length) < text.length) {
          after = "" + text.charAt(j + name.length);
          newText += text.substring(j + name.length, text.length);
        }
        if (!before.match(letters) && !after.match(letters)) {
          text = newText;
        }
      }

      return newText;
    }

    //------------------------------------------
    //--------------Reference functions----------
    //Get, rename, or delete all the references to the given item
    //model - general model to be searched, could be a subset of the main model if null then it uses the full model
    //name - item searching for references.
    //type - type of item searching for
    //del* - delete the reference from the item. Must be false for replace to work.
    //replaceName - replace the name of the found reference
    //returns all references not deleted
    Sidebar.prototype.eventsReferencing = function (model, name, type, del = false, replaceName = null ) {
      var refs = [];
      if (model == null) //use the entire model not just what was given
        model = simApp.allDataModel;

      //find and remove applicable references to it first
      if (model.EventList) {
        for (var i = 0; i < model.EventList.length; i++) {
          var cur = model.EventList[i].Event;
          //don't worry about the event type just see if the applicable properties exists in the JSON.
          switch (type) {
            case "ExtSim":
              // nothing to do
              break;
            case "Variable":
              //etVarCond
              //variable checked to be used in code
              if (cur.varNames) {
                var j = cur.varNames.indexOf(name);
                if (j > -1) {
                  if (del) {
                    cur.varNames.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.varNames[j] = replaceName;
                    refs.push(cur);
                  }
                }
              }
              //any user defined code references
              if (cur.code && replaceName) { 
                cur.code = this.replaceNamesInText(cur.code, name, replaceName);
              }
              // Timers and Failure Rate Events
              if (cur.useVariable) {
                  if (cur.lambda === name) {
                      refs.push(cur);
                      cur.lambda = del ? '' : (replaceName !== null ? replaceName : name);
                  }
                  if (cur.time === name) {
                      refs.push(cur);
                      cur.time = del ? '' : (replaceName !== null ? replaceName : name);
                  }
              }
              // Distribution events
              if (cur.parameters && Array.isArray(cur.parameters)) {
                cur.parameters.forEach((parameter, i) => {
                  if (parameter.useVariable && parameter.variable === name) {
                    refs.push(cur);
                    if (replaceName) {
                      cur.parameters[i].variable = replaceName;
                    }
                    if (del) {
                      cur.parameters[i].variable = '';
                    }
                  }
                });
              }
              // Ext sim events
              if (cur.variable && cur.variable === name) {
                refs.push(cur);
                if (replaceName) {
                  cur.variable = replaceName;
                }
                if (del) {
                  cur.variable = '';
                }
              }
              break;
            case "State":
              //etStateCng
              if (cur.triggerStates) {
                var j = cur.triggerStates.indexOf(name);
                if (j > -1) {
                  if (del) {
                    cur.triggerStates.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.triggerStates[j] = replaceName;
                    refs.push(cur);
                  }
                }
              }
              break;
            case "LogicNode":
              //etComponentLogic
              if (cur.logicTop && cur.logicTop == name) {
                if (del) {
                  cur.logicTop = "";
                } else {
                  if (replaceName != null)
                    cur.logicTop = replaceName;
                  refs.push(cur);
                }
              }
              break;
            case "Event"://only Event reference to an event is itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.EventList[i].ui_el) {
                    model.EventList[i].ui_el.innerText = replaceName;
                    model.EventList[i].ui_el.innerHTML = replaceName;
                  }
                }
                  
                refs.push(cur);
                return refs; //only one ref if it is itself, so return
              }
              break;
            case "Action":
              //nothing to do, Events don't directly relate to action, they are in the state actions
              break;
            
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.actionsReferencing = function (model, name, type, del = false, replaceName = null ) {
      var refs = [];
      if (model == null)//use the entire model not just what was given
        model = simApp.allDataModel;

      //find and remove applicable references to it first
      if (model.StateList) {
        for (var i = 0; i < model.ActionList.length; i++) {
          var cur = model.ActionList[i].Action;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "State":
              //atTransition
              if (cur.newStates) {
                for (var j = 0; j < cur.newStates.length; j++) {
                  if (cur.newStates[j].toState == name) {
                    if (del) {
                      cur.newStates.splice(j, 1);
                    } else {
                      if (replaceName != null)
                        cur.newStates[j].toState = replaceName;
                      refs.push(cur);
                    }
                  }
                }
              }
              break;
            case "ExtSim":
              //atRunExtApp
              if (cur.extSim && cur.extSim == name) {
                if (del) {
                  cur.extSim = "";
                } else {
                  if (replaceName != null)
                    cur.extSim = replaceName;
                  refs.push(cur);
                }
              }
              break;
            case "Variable":
              //atTransition
              if (cur.newStates) {
                cur.newStates.forEach((newState, i) => {
                  if (typeof newState.varProb === 'string' && newState.varProb === name) {
                    refs.push(cur);
                    if (replaceName) {
                      cur.newStates[i].varProb = replaceName;
                    }
                  }
                });
              }
              //atCngVarVal
              if (cur.variableName && cur.variableName == name) {
                if (del) {
                  cur.variableName = "";
                } else {
                  if (replaceName != null)
                    cur.variableName = replaceName;
                  refs.push(cur);
                }
              }
              if (cur.scriptCode && replaceName) {
                cur.scriptCode = this.replaceNamesInText(cur.scriptCode, name, replaceName);                
              }
              //at3DSimMsg
              if (cur.sim3DVariable && cur.sim3DVariable == name) {
                if (del) {
                  cur.sim3DVariable = "";
                } else {
                  if (replaceName != null)
                    cur.sim3DVariable = replaceName;
                  refs.push(cur);
                }
              }
              //atCngVarVal
              if (cur.codeVariables) {
                var j = cur.codeVariables.indexOf(name);
                if (j > -1) {
                  if (del) {
                    cur.codeVariables.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.codeVariables[j] = replaceName;
                    refs.push(cur);
                  }

                }
              }
              //atRunExtApp
              if (cur.makeInputFileCode && replaceName) {
                cur.makeInputFileCode = this.replaceNamesInText(cur.makeInputFileCode, name, replaceName);                
              }
              if (cur.processOutputFileCode && replaceName) {
                cur.processOutputFileCode = this.replaceNamesInText(cur.processOutputFileCode, name, replaceName);
              }
              //OpenErrorPro form
              if (cur.template && cur.template.name === 'Open Error Pro') {
                // Ref collection is already handled above using the codeVariables property
                if (replaceName) {
                  cur.formData.model = cur.formData.model.replace(
                    new RegExp(`\\+${name}\\+`, 'g'),
                    replaceName,
                  );
                  cur.formData.varLinks.forEach((varLink) => {
                    if (varLink.variable.name === name) {
                      varLink.variable.name = replaceName;
                    }
                  });
                }
                if (del) {
                  cur.formData.varLinks.forEach((varLink) => {
                    if (varLink.variable.name === name) {
                      varLink.variable.name = '';
                    }
                  });
                }
              }
              break;
            case "Action": //only action reference to an action is itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.ActionList[i].ui_el) {
                    model.ActionList[i].ui_el.innerText = replaceName;
                    model.ActionList[i].ui_el.innerHTML = replaceName;
                  }
                }
                refs.push(cur);
                return refs; //only one ref if it is itself, so return
              }
              break;
            case "Event":
              //not applicable
              break;
            case "LogicNode":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.statesReferencing = function (model, name, type, delAll = false, delForState = false, delForEv = false, replaceName = null ) {
      var refs = [];
      if (model == null)//use the entire model not just what was given
        model = simApp.allDataModel;

      //find state references to it the items
      if (model.StateList) {
        for (var i = 0; i < model.StateList.length; i++) {
          var cur = model.StateList[i].State;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "Event":
              //Event Actions
              if (cur.events) {
                for (var j = 0; j < cur.events.length; j++) {
                  if (cur.events[j] == name) {
                    if (delAll || (delForState && (delForState.name == cur.name))) {
                      cur.events.splice(j, 1);
                      cur.eventActions.splice(j, 1);
                    }
                    else {
                      if (replaceName != null)
                        cur.events[j] = replaceName;
                      refs.push(cur);
                    }
                  }
                }
              }
              break;
            case "Action":
              //immediate actions
              if (cur.immediateActions) {
                for (var j = 0; j < cur.immediateActions.length; j++) {
                  if (cur.immediateActions[j] == name) {
                    if (delAll || (delForState && (delForState.name == cur.name))) {
                      cur.immediateActions.splice(j, 1);
                    }
                    else {
                      if (replaceName != null)
                        cur.immediateActions[j] = replaceName;
                      refs.push(cur);
                    }
                  }
                }
              }
              //Event Actions
              if (cur.eventActions) {
                for (var k = 0; k < cur.eventActions.length; k++) {
                  for (var l = 0; l < cur.eventActions[k].actions.length; ++l) {
                    if (cur.eventActions[k].actions[l] == name) {
                      if (delAll || (delForState && (delForState.name == cur.name) && (!delForEv || delForEv == cur.events[k]))) {
                        cur.eventActions[k].actions.splice(l, 1);
                      }
                      else {
                        if (replaceName != null)
                          cur.eventActions[k].actions[l] = replaceName;
                        refs.push(cur);
                      }
                    }
                  }
                }
              }
              break;
            case "Diagram":
              //Event Actions
              if (cur.diagramName && (cur.diagramName === name)) {
                if (replaceName != null) {
                  cur.diagramName = replaceName;
                }
                if (delAll) {
                  cur.diagramName = '';
                }
                refs.push(cur);
              }
              break;
            case "State"://only state reference to a state is itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.StateList[i].ui_el) {
                    model.StateList[i].ui_el.innerText = replaceName;
                    model.StateList[i].ui_el.innerHTML = replaceName;
                  }
                }
                refs.push(cur);
                return refs; //only one ref if it is itself, so return
              }
              break;
            case "ExtSim":
              //Not applicable
              break;
            case "Variable":
              //Not applicable
              break;
            case "LogicNode":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.diagramsReferencing = function (model, name, type, del = false, replaceName = null ) {
      var refs = [];
      if (model == null)//use the entire model not just what was given
        model = simApp.allDataModel;

      //find diagram references to it the items
      if (model.DiagramList) {
        for (var i = 0; i < model.DiagramList.length; i++) {
          var cur = model.DiagramList[i].Diagram;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "State":
              //values for states in single state diagrams
              if (cur.singleStates) {
                for (var j = 0; j < cur.singleStates.length; j++) {
                  if (cur.singleStates[j].stateName == name) {
                    if (del) {
                      cur.singleStates.splice(j, 1);
                    }
                    else {
                      if (replaceName != null)
                        cur.singleStates[j].stateName = replaceName;
                      refs.push(cur);
                    }
                  }
                }
              }
              //states in the diagram
              if (cur.states) {
                var j = cur.states.indexOf(name);
                if (j > -1) {
                  if (del) {
                    cur.states.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.states[j] = replaceName;
                    refs.push(cur);
                  }

                }
              }
              break;
            case "Diagram"://only diagram reference to a diagram is itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.DiagramList[i].ui_el) {
                    model.DiagramList[i].ui_el.innerText = replaceName;
                    model.DiagramList[i].ui_el.innerHTML = replaceName;
                  }
                }
                refs.push(cur);
                return refs; //only one ref if it is itself, so return
              }
              break;
            case "Action":
              //not applicable
              break;
            case "Event":
              //Not applicable
              break;
            case "ExtSim":
              //Not applicable
              break;
            case "Variable":
              //Not applicable
              break;
            case "LogicNode":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.logicNodesReferencing = function (model, name, type, del = false, replaceName = null ) {
      var refs = [];
      if (model == null) //use the entire model not just what was given
        model = simApp.allDataModel;

      //find logic tree references to it the items
      if (model.LogicNodeList) {
        for (var i = 0; i < model.LogicNodeList.length; i++) {
          var cur = model.LogicNodeList[i].LogicNode;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "Diagram":
              //compChildren are names of diagrams
              if (cur.compChildren) {
                var j = cur.compChildren.indexOf(name);
                if (j > -1) {
                  refs.push(cur);
                  if (del) {
                    cur.compChildren.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.compChildren[j] = replaceName;
                  }

                }
              }
              break;
            case "LogicNode":
              // Reference to itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.LogicNodeList[i].ui_el) {
                    model.LogicNodeList[i].ui_el.innerText = replaceName;
                    model.LogicNodeList[i].ui_el.innerHTML = replaceName;
                  }
                }
                refs.push(cur);
              }
              // Gate children
              if (cur.gateChildren) {
                cur.gateChildren.forEach((gate, i) => {
                  if (gate == name) {
                    refs.push(cur);
                    if (replaceName) {
                      cur.gateChildren[i] = replaceName;
                    }
                    if (del) {
                      cur.gateChildren.splice(i, 1);
                    }
                  }
                });
              }
              // Comp children
              if (cur.compChildren) {
                cur.compChildren.forEach((gate, i) => {
                  if (gate == name) {
                    refs.push(cur);
                    if (replaceName) {
                      cur.compChildren[i] = replaceName;
                    }
                    if (del) {
                      cur.compChildren.splice(i, 1);
                    }
                  }
                });
              }
              // All nodes
              if (cur.rootName === name) {
                if (replaceName !== null) {
                  cur.rootName = replaceName;
                }
                if (del) {
                  cur.rootName = '';
                }
                refs.push(cur);
              }
              break;
            case "Action":
              //not applicable
              break;
            case "Event":
              //Not applicable
              break;
            case "ExtSim":
              //Not applicable
              break;
            case "Variable":
              //Not applicable
              break;
            case "State":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.variableReferencing = function (model, name, type, del = false, replaceName = null ) {
      var refs = [];
      if (model === null) //use the entire model not just what was given
        model = simApp.allDataModel;

      //find variable references to it the items
      if (model.VariableList) {
        for (var i = 0; i < model.VariableList.length; i++) {
          var cur = model.VariableList[i].Variable;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "Diagram":
              //not applicable
              break;
            case "LogicNode":
              //not applicable
              break;
            case "Action":
              //not applicable
              break;
            case "Event":
              //Not applicable
              break;
            case "ExtSim":
              //Not applicable
              break;
            case "Variable":
              //only reference is itself, so replace name if given
              if (cur.name === name) {
                refs.push(cur);
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.VariableList[i].ui_el) {
                    model.VariableList[i].ui_el.innerText = replaceName;
                    model.VariableList[i].ui_el.innerHTML = replaceName;
                  }
                }
              }
              break;
            case "State":
              if (cur.accrualStatesData) {
                for (var j = 0; j < cur.accrualStatesData.length; j++) {
                  if (cur.accrualStatesData[j].stateName === name) {
                    if (replaceName !== null) {
                      cur.accrualStatesData[j].stateName = replaceName;
                    }
                    if (del) {
                      cur.accrualStatesData.splice(j, 1);
                    }
                    refs.push(cur);
                  }
                }
              }
              break;
            default:
          }
        }
      }

      return refs;
    }
    Sidebar.prototype.extSimsReferencing = function (model, name, type, del = false, replaceName = null) {
      var refs = [];
      if (model === null) //use the entire model not just what was given
        model = simApp.allDataModel;

      //find variable references to it the items
      if (model.ExtSimList) {
        for (var i = 0; i < model.ExtSimList.length; i++) {
          var cur = model.ExtSimList[i].ExtSim;
          //don't worry about the action type just see if the property exists in the JSON.
          switch (type) {
            case "Diagram":
              //not applicable
              break;
            case "LogicNode":
              //not applicable
              break;
            case "Action":
              //not applicable
              break;
            case "Event":
              //Not applicable
              break;
            case "Variable":
              //Not applicable
              break;
            case "ExtSim":
              //only reference is itself, so replace name if given
              if (cur.name == name) {
                refs.push(cur);
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.ExtSimList[i].ui_el) {
                    model.ExtSimList[i].ui_el.innerText = replaceName;
                    model.ExtSimList[i].ui_el.innerHTML = replaceName;
                  }
                }
              }
              break;
            case "State":
              //Not Applicable 
              //update the html for the item, the name has already changed
              break;
            default:
          }
        }
      }

      return refs;
    }
    
    //--------------End Reference Functions-------------------------

    //------------------------------------------
    //check the number times this action name is used within provided states or all states if no provided.
    //name - actionName
    //states - an array of string of state name.
    Sidebar.prototype.numberOfInstancesActions = function (name, states) {
      var stateArray = [];
      var count = 0;
      var mainModel = simApp.allDataModel;
      if (!states) {
        states = mainModel.StateList;
      }
      
      //get state objects for each stateName.
      states.forEach(function (stateName) {
        var state = this.getStateByName(mainModel, stateName);
        stateArray.add(state.State);
      }.bind(this));
      //get all action objects within the diagram. 
      var actions = this.getActionList(stateArray);
      //count how many times the action name appears in list
      actions.forEach(function (item) {
        if (item.Action.name == name)
          count += 1;
      }.bind(this));
      return count;
    }
    //------------------------------------------
    Sidebar.prototype.numberOfInstancesEvents = function (name, states) {
      //First check if the action appears more than once
      var stateArray = [];
      var count = 0;
      if (states) {
        var mainModel = simApp.allDataModel;
        states.forEach(function (item) {
          var state = this.getStateByName(mainModel, item);
          stateArray.add(state.State);
        }.bind(this));
        var events = this.getEventList(stateArray);
        //count how many times name appears in list
        events.forEach(function (item) {
          if (item.Event.name == name)
            count += 1;
        }.bind(this));
        return count;
      }
      return -1;
    }
    //------------------------------------------
    /**
     * Safely gets the saved local templates, if any.
     * 
     * @returns {EMRALD.Model[]} The local templates.
     */
    Sidebar.prototype.getLocalTemplates = function () {
      let localTemplates = [];
      if (localStorage.getItem('templates')) {
        localTemplates = JSON.parse(localStorage.getItem('templates'));
      }
      return localTemplates;
    }

    /**
     * Safely adds a template to the local storage list.
     * 
     * @param {EMRALD.Model} templateObj - The template to add.
     */
    Sidebar.prototype.addLocalTemplate = function (templateObj) {
      let localTemplates = this.getLocalTemplates();
      // Overwrite duplicates
      localTemplates = localTemplates.filter((template) => template.name !== templateObj.name);
      localTemplates.push(templateObj);
      localStorage.setItem('templates', JSON.stringify(localTemplates));
    }

    /**
     * Gets the template with the given name.
     * 
     * @param {string} templateName - The name of the template to find.
     * @returns {EMRALD.Model} The template, if any.
     */
    Sidebar.prototype.getTemplateByName = function (templateName) {
      return this.getLocalTemplates().find((template) => template.name === templateName);
    }

    /**
     * Collects a list of custom diagram types used in the project.
     *
     * @returns {EMRALD.DiagramType[]} The types used in the project.
     */
    Sidebar.prototype.getCustomDiagramTypes = function () {
      const customTypes = [];
      const customTypeLabels = ['Plant', 'Component', 'System'];
      simApp.allDataModel.DiagramList.forEach((diagram) => {
        if (customTypeLabels.indexOf(diagram.Diagram.diagramLabel) < 0) {
          customTypes.push({
            label: diagram.Diagram.diagramLabel,
            type: diagram.Diagram.diagramType,
          });
          customTypeLabels.push(diagram.Diagram.diagramLabel);
        }
      });
      return customTypes;
    }

    Sidebar.prototype.addDiagramToSection = function (ol, item) {
      var sol = null;

      if (!item.Diagram.diagramLabel) {
        item.Diagram.diagramLabel = item.Diagram.diagramType.substring(2, item.Diagram.diagramType.length);
      }
      //For each Diagram, use the diagramLabel to create a parent node, but first we 
      //need to search the tree structure of existing parent node.  If we found one, just add 
      //our diagramlabel to it.  If not found, we will create a new parent node, then add the diagramLabel to 
      //the new parent node.

      var ls = ol.querySelectorAll('label');
      var l = Array.from(ls).filter(el => el.innerText == item.Diagram.diagramLabel)[0]; //search for parent node.
      if (l && l.parentElement) {
        //sol is the diagram section element
        sol = l.parentElement.querySelector('ul');
      }
      else {
        var li = document.createElement("li");
        ol.appendChild(li);

        var inp = document.createElement("input");
        inp.type = "checkbox";
        inp.id = item.Diagram.diagramLabel;
        li.appendChild(inp);

        var lbl = document.createElement("label");
        lbl.setAttribute("for", item.Diagram.diagramLabel);
        lbl.innerText = item.Diagram.diagramLabel;
        li.appendChild(lbl);

        sol = document.createElement("ul");
        li.appendChild(sol);
      }
      var sli = document.createElement("li");
      sli.textContent = item.Diagram.name;
      sli.dataObject = item.Diagram;
      sli.draggable = true;
      sli.ondragstart = function (evt) {
        evt.dataTransfer.effectAllowed = 'copy';
        evt.dataTransfer.setData("Diagrams", makeDeferred(this.dataObject)());
        evt.dataTransfer.setData(this.dataObject.diagramType, null);
      }.bind(sli);

      sli.onmouseup = function (evt) {
        var target = evt.currentTarget;
        var sibs = target.parentElement.children;
        for (var i = 0; i < sibs.length; i++) {
          var u = sibs[i];
          if ((u.nodeName == 'LI') && (u.className == "ItemSelected")) {
            u.className = "ItemCleared";
          }
        };
        target.className = "ItemSelected";
      }

      sli.ondblclick = function (evt) {
        this.openDiagram(sli.dataObject);
        this.onLoadLocal(sli.dataObject);
      }.bind(this);

      ///////////////////////////

      //using jquery-ui-contextmenu to do right-click menu.
      // TODO: jquery contextmenu is deprecated
      $(sli).contextmenu({
        delegate: sli,
        preventContextMenuForPopup: true,
        preventSelect: true,
        taphold: true,
        menu: [
          { title: "Open...", cmd: "Open" },
          { title: "Edit properties...", cmd: "Edit" },
					{ title: "Delete", cmd: "Delete" },
					{ title: "Make Template", cmd: "Template" },
          { title: "Export", cmd: "Export" },
          { title: "Copy", cmd: "Copy"},
        ],
        select: function (evt, ui) {
          switch (ui.cmd) {
            case "Edit":
              if (ui.target.context.dataObject)
                this.editDiagramProperties(ui.target.context.dataObject, ui.target.context);
              break;
            case "Open":
              if (ui.target.context.dataObject)
                this.openDiagram(ui.target.context.dataObject);
              break;
            case "Delete":
              if (ui.target.context.dataObject) {
                MessageBox.confirm("Deleting a Diagram", "Are you sure you want to delete the highlighted diagram?", ["Yes", "Cancel"],
                  function (btn, evt) {
                    if (btn == "Yes")
                      this.deleteDiagram(ui.target.context.dataObject, ui.target.context);
                    return true;
                  }.bind(this));
              }
              break;
            case "Template":
              if (ui.target.context.dataObject) {
                const dataObj = this.exportDiagram(ui.target.context.dataObject);
                this.addLocalTemplate(dataObj);
              }
              break;
            case "Export":
              if (ui.target.context.dataObject) {
                const a = document.createElement('a');
                const dataObject = this.exportDiagram(ui.target.context.dataObject);
                a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(dataObject))}`);
                a.setAttribute('download', `${dataObject.name}.json`);
                a.click();
              }
              break;
            case "Copy":
              if (ui.target.context.dataObject) {
                navigator.clipboard
                  .writeText(
                    JSON.stringify(
                      this.exportDiagram(ui.target.context.dataObject),
                    ),
                  )
                  .catch((err) => {
                    throw err;
                  });
              }
              break;
          }
        }.bind(this)
      });

      sol.appendChild(sli);
      item.ui_el = sli;

      sortDOMList(sol);
      return sol;
    }

    Sidebar.prototype.exportDiagram = function (dataObject, model) {
      const StateList = this.statesReferencing(model, dataObject.name, 'Diagram');
      const exportObject = {
        id: dataObject.id,
        name: dataObject.name,
        desc: dataObject.desc,
        DiagramList: this.getDiagramList(StateList, model),
        ExtSimList: this.getExtSimList(StateList, model),
        StateList: StateList.map((State) => {
          return {
            State,
          };
        }),
        ActionList: this.getActionList(StateList, model),
        EventList: this.getEventList(StateList, model),
        LogicNodeList: this.getLogicNodeList(StateList, model),
        VariableList: this.getVariableList(StateList, model),
      };
      exportObject.DiagramList = simApp.mainApp.cloneDataModel(exportObject.DiagramList);
      exportObject.ExtSimList = simApp.mainApp.cloneDataModel(exportObject.ExtSimList);
      exportObject.StateList = simApp.mainApp.cloneDataModel(exportObject.StateList);
      exportObject.ActionList = simApp.mainApp.cloneDataModel(exportObject.ActionList);
      exportObject.EventList = simApp.mainApp.cloneDataModel(exportObject.EventList);
      exportObject.LogicNodeList = simApp.mainApp.cloneDataModel(exportObject.LogicNodeList);
      exportObject.VariableList = simApp.mainApp.cloneDataModel(exportObject.VariableList);
      return exportObject;
    }

    Sidebar.prototype.ActionExists = function (actionName) {
      return this.getActionByName(simApp.allDataModel, actionName) !== null;
    };

    Sidebar.prototype.DiagramExists = function (diagramName) {
      return this.getDiagramByName(simApp.allDataModel, diagramName) !== null;
    };

    Sidebar.prototype.EventExists = function (eventName) {
      return this.getEventByName(simApp.allDataModel, eventName) !== null;
    };

    Sidebar.prototype.ExtSimExists = function (extSimName) {
      return this.getExtSimByName(simApp.allDataModel, extSimName) !== null;
    };

    Sidebar.prototype.LogicNodeExists = function (logicNodeName) {
      return this.getLogicNodeByName(simApp.allDataModel, logicNodeName) !== null;
    };

    Sidebar.prototype.StateExists = function (stateName) {
      return this.getStateByName(simApp.allDataModel, stateName) !== null;
    };

    Sidebar.prototype.VariableExists = function (variableName) {
      return this.getVariableByName(simApp.allDataModel, variableName) !== null;
    };

    /**
     * Imports a diagram and opens the UI for conflict resolution.
     * 
     * @param {EMRALD.Model} importedContent - The diagram to import.
     */
    Sidebar.prototype.importDiagram = function (importedContent, forceMerge = false) {
      return new Promise((resolve, reject) => {
        // Find conflicts
        let hasConflict = false;
        const conflicts = [];
        Object.values(importedContent).forEach((value, i) => {
          if (typeof value === 'object' && typeof value.length === 'number') {
            value.forEach((item) => {
              const [type] = Object.keys(item);
              const name = item[type].name;
              const conflict = this[`${type}Exists`](name);
              hasConflict = hasConflict || conflict;
              conflicts[i] = conflict;
            });
          }
        });
        const sidebar = simApp.mainApp.sidebar;
        if (forceMerge || hasConflict) {
          const wnd = mxWindow.createFrameWindow(
            'EditForms/ImportEditor.html',
            'OK, Cancel',
            'minimize, maximize, close',
            /**
             * Handles the window closing.
             *
             * @param {string} btn - The button that was clicked.
             * @param {ImportEditor.OutputData} outDataObj The dialog output.
             * @returns {boolean} If the window closed.
             */
            (btn, outDataObj) => {
              if (btn === 'OK') {
                // Replace names in the local model
                outDataObj.entries.forEach((entry) => {
                  this.replaceNames(
                    entry.oldName,
                    entry.data.name,
                    entry.type,
                    outDataObj.model,
                    false,
                  );
                });
                // Apply changes to the global model
                outDataObj.entries.forEach((entry) => {
                  switch (entry.action) {
                    case 'rename':
                      const obj = outDataObj.model[`${entry.type}List`].find(
                        (item) => item[entry.type].name === entry.data.name,
                      );
                      if (entry.type === 'LogicNode') {
                        this.addNewLogicTree(obj);
                      } else {
                        this[`addNew${entry.type}`](obj);
                      }
                      break;
                    case 'replace':
                      const target = this.getByName(
                        entry.type,
                        simApp.allDataModel,
                        entry.data.name,
                      );
                      Object.keys(entry.data).forEach((key) => {
                        target[entry.type][key] = entry.data[key];
                      });
                      break;
                    default:
                    // ignore (literally)
                  }
                });
                resolve(outDataObj.model);
              }
              return true;
            },
            {
              conflicts,
              model: importedContent,
            },
            false,
            null,
            null,
            800,
            500,
          );
          document.body.removeChild(wnd.div);
          var contentPanel = document.getElementById('ContentPanel');
          adjustWindowPos(contentPanel, wnd.div);
          contentPanel.appendChild(wnd.div);
        } else {
          Object.keys(importedContent).forEach((key) => {
            if (Array.isArray(importedContent[key])) {
              importedContent[key].forEach((entry) => {
                const type = key.replace('List', '');
                if (type === 'LogicNode') {
                  this.addNewLogicTree(entry);
                } else {
                  this[`addNew${type}`](entry);
                }
              })
            }
          });
          resolve(importedContent);
        }
      });
    };

    //------------------------------------------
    //Not currently being used
    Sidebar.prototype.addStatesToDiagram = function (ol, item) {
      //First Search for diagram section element
      var ls = ol.querySelectorAll('label');
      var l = Array.from(ls).filter(el => el.innerText == item.Diagram.diagramLabel)[0]; //search for parent node.
      //sol is the diagram section element
      var sol = l.parentElement.querySelector('ul');

      //Create a folder to contain list of states
      var liSubSol = document.createElement("li");
      var inp = document.createElement("input");
      inp.type = "checkbox";
      inp.id = item.Diagram.name;
      liSubSol.appendChild(inp);

      var lbl = document.createElement("label");
      lbl.setAttribute("for", item.Diagram.name);
      lbl.innerText = item.Diagram.name;
      liSubSol.appendChild(lbl);


      sol.appendChild(liSubSol);
      var innerUl = document.createElement("ul")


      //Populate inner Ul with states
      for (var s = 0; s < item.Diagram.states.length; s++) {
        var mainModel = simApp.allDataModel;
        var state = this.getStateByName(mainModel, item.Diagram.states[s]);
        //var container = document.getElementById("ActionsPanel_id")
        this.addSectionItem(innerUl, "States", item.Diagram.states[s], state);

      }

      liSubSol.appendChild(innerUl);


      return sol;
    }
    //------------------------------------------

    //Note: container is a div.
    //Take the diagramList and generate HTML elements to create a tree structure.  
    Sidebar.prototype.addDiagramSectionItem = function (container, diagramList) {
      if (container instanceof HTMLDivElement)
        container.className = 'css-treeview';

      var ol = document.createElement("ul");
      var section = ol;
      container.appendChild(ol);
      diagramList.forEach(function (item) {
        this.addDiagramToSection(ol, item);
      }.bind(this));
      //diagramList.forEach(function (item) {
      //  this.addStatesToDiagram(ol, item);
      //}.bind(this));
    }

    //------------------------------------------
    Sidebar.prototype.addSectionItem = function (container, type, title, data) {

      var li = document.createElement('LI');
      li.draggable = true;
      li.dataObject = data;
      li.ondragstart = function (evt) {
        evt.dataTransfer.effectAllowed = 'copy';
        evt.dataTransfer.setData(type, makeDeferred(this.dataObject)());
      }.bind(li);

      //li.style.whiteSpace = "nowrap";
      li.textContent = title;
      //li.style.cursor = "pointer";

      li.onmouseup = function (evt) {
        var target = evt.currentTarget;
        var sibs = target.parentElement.children;
        for (var i = 0; i < sibs.length; i++) {
          var u = sibs[i];
          if ((u.nodeName == 'LI') && (u.className == "ItemSelected")) {
            u.className = "ItemCleared";
          }
        }
        target.className = "ItemSelected";
      }
      if (this.checkSideBarNodes(container.childNodes, title))
        container.appendChild(li);

      var isLocContainer = false;
      if (this.isLocalContainer(container)) {
        isLocContainer = true;
      }
      switch (type) {
        case "Variables":
          li.ondblclick = function (evt) {
            this.editVariableProperties(evt.target.dataObject, evt.target);
          }.bind(this);

          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Edit properties...", cmd: "Edit" },
              { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {

              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject)
                    this.editVariableProperties(ui.target.context.dataObject, ui.target.context);
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    var actionList = getActionsUsingVariable(this, ui.target.context.dataObject.name);
                    if (actionList.length < 1) {
                      MessageBox.confirm("Deleting a variable", "Are you sure you want to delete the highlighted Variable?", ["Yes", "Cancel"],
                          function (btn, evt) {
                            if (btn == "Yes")
                              this.deleteVariable(ui.target.context.dataObject, ui.target.context);
                            return true;
                          }.bind(this));
                    }
                    else {
                      var message = "The variable " + ui.target.context.dataObject.name + " is used in the following actions: ";
                      for (var i = 0; i < actionList.length; i++) {
                        message += actionList[i].name + ", ";
                      }
                      message += "You can not delete a used variable.";
                      MessageBox.confirm("Can not delete", message, ["Cancel"],
                          function (btn, evt) {
                            return true;
                          }.bind(this));
                    }

                  }
                  break;
              }
            }.bind(this)

          });
          break;
        case "Logic Tree":
          li.ondblclick = function (evt) {
            this.openLogicTree(evt.target.dataObject, evt.target);
          }.bind(this);

          //using jquery-ui-contextmenu to do right-click menu.
          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Open...", cmd: "Open" },
              { title: "Edit properties...", cmd: "Edit" },
              { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject)
                    this.editLogicProperties(ui.target.context.dataObject, ui.target.context);
                  break;
                case "Open":
                  if (ui.target.context.dataObject)
                    this.openLogicTree(ui.target.context.dataObject);
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    MessageBox.confirm("Deleting a Logic Node", "Are you sure you want to delete the highlighted Logic Node?", ["Yes", "Cancel"],
                     function (btn, evt) {
                       if (btn == "Yes") {
                         this.deleteLogicTree(ui.target.context.dataObject, ui.target.context);
                       }
                       return true;
                     }.bind(this));
                  }
                  break;
              }
            }.bind(this)
          });
          break;
        case "Actions":
          li.ondblclick = function (evt) {
            this.editActionProperties(evt.target.dataObject, evt.target);
          }.bind(this);

          //using jquery-ui-contextmenu to do right-click menu.
          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Edit properties...", cmd: "Edit" },
              { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject) {
                   this.editActionProperties(ui.target.context.dataObject, ui.target.context);
                  }
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    MessageBox.confirm("Deleting a Action", "Are you sure you want to delete the highlighted Action?", ["Yes", "Cancel"],
                    function (btn, evt) {
                      if (btn == "Yes") {
                        this.deleteAction(ui.target.context.dataObject, true);
                        //ui.target.context.remove();
                      }
                      return true;
                    }.bind(this));
                  }
                  break;
              }
            }.bind(this)
          });
          break;
        case "Events":
          li.ondblclick = function (evt) {
            this.editEventProperties(evt.target.dataObject, evt.target);
          }.bind(this);

          //using jquery-ui-contextmenu to do right-click menu.
          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Edit properties...", cmd: "Edit" },
              { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject)
                    this.editEventProperties(ui.target.context.dataObject, ui.target.context);
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    MessageBox.confirm("Deleting a Event", "Are you sure you want to delete the highlighted Event?", ["Yes", "Cancel"],
                      function (btn, evt) {
                        if (btn == "Yes") {
                          this.deleteEvent(ui.target.context.dataObject, true);
                          //ui.target.context.remove();
                        }
                        return true;
                      }.bind(this));
                  }
                  break;
              }
            }.bind(this)
          });
          break;
        case "States":
          li.ondblclick = function (evt) {
            if (evt.target.dataObject.State) {
              this.editStateProperties(evt.target.dataObject.State, evt.target);
            }
            else {
              this.editStateProperties(evt.target.dataObject, evt.target);
            }

          }.bind(this);

          //using jquery-ui-contextmenu to do right-click menu.
          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
              { title: "Edit properties...", cmd: "Edit" },
              { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject)
                    this.editStateProperties(ui.target.context.dataObject, ui.target.context);
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    MessageBox.confirm("Deleting a State", "Are you sure you want to delete the highlighted state?", ["Yes", "Cancel"],
                      function (btn, evt) {
                        if (btn == "Yes") {
                          this.deleteState(ui.target.context.dataObject);
                          //ui.target.context.remove();
                        }
                        return true;
                      }.bind(this));
                  }
                  break;
              }
            }.bind(this)
          });
          break;
        case "External Sims":
          li.ondblclick = function (evt) {
            this.editExtSimProperties(evt.target.dataObject, evt.target);
          }.bind(this);

          //using jquery-ui-contextmenu to do right-click menu.
          $(li).contextmenu({
            delegate: li,
            preventContextMenuForPopup: true,
            preventSelect: true,
            taphold: true,
            menu: [
                { title: "Edit properties...", cmd: "Edit" },
                { title: "Delete", cmd: "Delete" }
            ],
            select: function (evt, ui) {
              //var $target = ui.target;
              switch (ui.cmd) {
                case "Edit":
                  if (ui.target.context.dataObject)
                    this.editExtSimProperties(ui.target.context.dataObject, ui.target.context);
                  break;
                case "Delete":
                  if (ui.target.context.dataObject) {
                    MessageBox.confirm("Deleting a External Sim", "Are you sure you want to delete the highlighted External Sim?", ["Yes", "Cancel"],
                        function (btn, evt) {
                          if (btn == "Yes")
                            this.deleteExtSim(ui.target.context.dataObject, ui.target.context);
                          return true;
                        }.bind(this));
                  }
                  break;
              }
            }.bind(this)
          });
          break;

      }
      return li;
    }
    //---------------------------------------------------------

    var getActionsUsingVariable = function (sidebar, varName) {
      var result = [];
      var actionsList = sidebar.ActionList;
      for (var i = 0; i < actionsList.length; i++) {
        if (actionsList[i].Action.variableName == varName) {
          result.push((actionsList[i].Action));
        }
      }
      return result;
    }


    //---------------------------------------------------------
    Sidebar.prototype.checkSideBarNodes = function (childNodes, value) {
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].innerText == value) {
          return false;
        }
      }
      return true;
    }


    //---------------------------------------------------------
    Sidebar.prototype.indexOfSideBarNode = function (childNodes, value) {
      var returnArray = childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].innerText == value || childNodes[i].innerHTML == value) {
          return i;
        }
      }
      return null;
    }


    //---------------------------------------------------------

    Sidebar.prototype.isLocalContainer = function (container) {
      var id = container.id;
      switch (id) {
        case "Local_EventsPanel_id":
          return true;
        case "Local_StatesPanel_id":
          return true;
        case "Local_ActionsPanel_id":
          return true;
        case "Local_VariablesPanel_id":
          return true;
        default:
          return false;
      }
    }

    //------------------------------------------
    //Assign the id from the sidebar.json "DiagramsPanel_id", "StatesPanel_id", "LogicTreesPanel_id", "ActionsPanel_id", "EventsPanel_id", "VariablesPanel_id", "ExtSimPanel_id"

    Sidebar.prototype.getLookup = function (container, section, id) {
      switch (section) {
        case "Diagrams":
          if (this.DiagramList) {
            this.addDiagramSectionItem(container, this.DiagramList);
          }
          break;
        case "Actions":
          if (this.ActionList) {
            if (id == "Global_ActionsPanel_id") {
              this.ActionList.forEach(function (item) {
                var mainItem = item.Action.mainItem;
                if (mainItem) {
                  item.ui_el = this.addSectionItem(container, section, item.Action.name, item.Action);
                }
              }.bind(this));
            }
            else {
              this.ActionList.forEach(function (item) {
                item.ui_el = this.addSectionItem(container, section, item.Action.name, item.Action);

              }.bind(this));
            }
            sortDOMList(container);
          }
          break;
        case "Events":
          if (this.EventList) {
            if (id == "Global_EventsPanel_id") {
              this.EventList.forEach(function (item) {
                if (item.Event.mainItem) {
                  item.ui_el = this.addSectionItem(container, section, item.Event.name, item.Event);
                }
              }.bind(this));
            }
            else {
              this.EventList.forEach(function (item) {
                item.ui_el = this.addSectionItem(container, section, item.Event.name, item.Event);
              }.bind(this));
            }

            sortDOMList(container);
          }
          break;
        case "Logic Tree":
          if (this.LogicNodeList) {
            this.LogicNodeList.forEach(function (item) {
              if (item.LogicNode.name == item.LogicNode.rootName || item.LogicNode.isRoot) {
                item.ui_el = this.addSectionItem(container, section, item.LogicNode.name, item.LogicNode);
                sortDOMList(container);
              }
            }.bind(this));
          }
          break;
        case "External Sims":
          if (this.ExtSimList) {
            this.ExtSimList.forEach(function (item) {
              item.ui_el = this.addSectionItem(container, section, item.ExtSim.name, item.ExtSim);
              sortDOMList(container);
            }.bind(this));
          }
          break;
        case "Variables":
          if (this.VariableList) {
            this.VariableList.forEach(function (item) {
              var varScope = item.Variable.varScope;
              item.ui_el = this.addSectionItem(container, section, item.Variable.name, item.Variable);
              sortDOMList(container);
            }.bind(this));
          }
          break;
        case "States":
          if (this.StateList) {
            this.StateList.forEach(function (item) {
              item.ui_el = this.addSectionItem(container, section, item.State.name, item.State);
              sortDOMList(container);
            }.bind(this));
          }
          break;
      }
    }

    //------------------------------------------
    Sidebar.prototype.onLoadLocal = function (dataObject) {

      var stateArray = [];
      //first add states
      var stateContainer = document.getElementById("Local_StatesPanel_id");
      if (stateContainer) {
        stateContainer.innerHTML = "";
        var states = dataObject.states;
        var mainModel = simApp.allDataModel;
        if (states) {
          states.forEach(function (item) {
            var state = this.getStateByName(mainModel, item);
            if (state) {
              stateArray.add(state.State);
              this.addSectionItem(stateContainer, "States", item, state.State);
              sortDOMList(stateContainer);
            }
          }.bind(this));
        }
      }
      var eventContainer = document.getElementById("Local_EventsPanel_id");
      if (eventContainer) {
        eventContainer.innerHTML = "";
        var events = this.getEventListWithoutRepeats(stateArray);
        for (var i = 0; i < events.length ; i++) {
          if (!events[i].Event.mainItem) {
            events[i].ui_el = this.addSectionItem(eventContainer, "Events", events[i].Event.name, events[i].Event);
          }
        }

      }
      var actionContainer = document.getElementById("Local_ActionsPanel_id");
      if (actionContainer) {
        actionContainer.innerHTML = "";
        var actions = this.getActionListWithoutRepeats(stateArray);
        for (var i = 0; i < actions.length; i++) {
          if (!actions[i].Action.mainItem) {
            actions[i].ui_el = this.addSectionItem(actionContainer, "Actions", actions[i].Action.name, actions[i].Action);
          }
        }
      }

      /* 
       //TODO ask about local variables
       var variableContainer = document.getElementById("LocalVariablesPanel_id");
       
       if (variableContainer) {
           var localVarList = [];
           var actionsList = this.getActionListWithoutRepeats(stateArray);
           for (var i = 0; i < actionsList.length; i++) {
               if (actionsList[i].Action.variableName) {
                   localVarList.push((actionsList[i].Action.variableName));
               }
           }
            variableContainer.innerHTML = "";
            var varList = simApp.allDataModel.VariableList;
            for (var i = 0; i< varList.length ;i++){
                if (localVarList.indexOf(varList[i].Variable.name) > -1) {
                    this.addSectionItem(variableContainer, "Variables", varList[i].Variable.name, varList[i].Variable);
                }
                    
            }
        }
     */
    }
    //------------------------------------------
    //load the sidebar from WindowFrame (every time user clicks on one)

    Sidebar.prototype.loadLocalFromwindow = function (rootModel) {
      var stateArray = [];
      //first add states
      var stateContainer = document.getElementById("Local_StatesPanel_id");
      if (stateContainer) {
        stateContainer.innerHTML = "";
        var states = rootModel.StateList;
        var mainModel = simApp.allDataModel;
        if (states) {
          states.forEach(function (item) {
            stateArray.add(item.State);
            this.addSectionItem(stateContainer, "States", item.State.name, item.State);
            sortDOMList(stateContainer);
          }.bind(this));
        }
      }
      var eventContainer = document.getElementById("Local_EventsPanel_id");
      if (eventContainer) {
        eventContainer.innerHTML = "";
        var events = this.getEventListWithoutRepeats(stateArray);
        for (var i = 0; i < events.length; i++) {
          this.addSectionItem(eventContainer, "Events", events[i].Event.name, events[i].Event);
        }

      }
      var actionContainer = document.getElementById("Local_ActionsPanel_id");
      if (actionContainer) {
        actionContainer.innerHTML = "";
        var actions = this.getActionListWithoutRepeats(stateArray);
        for (var i = 0; i < actions.length; i++) {
          this.addSectionItem(actionContainer, "Actions", actions[i].Action.name, actions[i].Action);
        }
      }


      //TODO ask about local variables
      var variableContainer = document.getElementById("LocalVariablesPanel_id");
      if (variableContainer) {
        variableContainer.innerHTML = "";
        var varList = simApp.allDataModel.VariableList;
        for (var i = 0; i < varList.length; i++) {
          if (varList[i].Variable.varScope == "gtLocal")
            this.addSectionItem(variableContainer, "Variables", varList[i].Variable.name, varList[i].Variable);
        }
      }
    }
    //------------------------------------------
    Sidebar.prototype.emptyLocalPanels = function () {
      var stateContainer = document.getElementById("Local_StatesPanel_id");
      if (stateContainer) {
        stateContainer.innerHTML = "";
      }
      var eventContainer = document.getElementById("Local_EventsPanel_id");
      if (eventContainer) {
        eventContainer.innerHTML = "";
      }
      var actionContainer = document.getElementById("Local_ActionsPanel_id");
      if (actionContainer) {
        actionContainer.innerHTML = "";
      }
      var variableContainer = document.getElementById("Local_VariablesPanel_id");
      if (variableContainer) {
        variableContainer.innerHTML = "";
      }
    }
    //------------------------------------------

    //this function is to be overwritten by specialize descendant,  it is also needed to be prototype because 
    //execution of it is during creation of the object.
    Sidebar.prototype.loadContent = function (container, catInfo) {
      var lookup = this.getLookup(container, catInfo.title, catInfo.id);
    }

    Sidebar.prototype.getActionVariables = function () {
      var model = simApp.allDataModel;
      return model.VariableList;
    }

    //This function get call for any change made to the data model: allDataModel.  
    //It cause browser to prompt user to confirm if any he/she wants to save the changed 
    //before refresh/leaving the page.
    Sidebar.prototype.notifyDataChanged = function (isModified) {
      simApp.modelChanged = isModified;
    }

    //provide a way for diagram windows to save the project.
    Sidebar.prototype.saveProject = function () {
      simApp.mainApp.saveProject();
    }

    return Sidebar;
  })(Object);
  Navigation.Sidebar = Sidebar;
})(Navigation || (Navigation = {}));
