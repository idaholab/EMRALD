﻿/**
 * @file Functions for interacting with the model.
 * @copyright 2021 Battelle Energy Alliance
 */

"use strict";

if (typeof Navigation === 'undefined')
  /**
   * @namespace Navigation
   */
  var Navigation;
(function (Navigation) {
  var Sidebar = (function (_super) {
    __extends(_super, Sidebar);
    /**
     * Constructs Sidebar.
     * 
     * @class Navigation#Sidebar
     * @classdesc Functions for interacting with the model.
     * @constructs
     * @param {HTMLElement} container Node to place the sidebar inside.
     * @param {string} [url] URL to load the sidebar data from. 
     * @param {string} [modelStr] The model data as a string. 
     */
    function Sidebar(container, url, modelStr) {
      _super.apply(this, arguments);

      /**
       * Sync count.
       * 
       * @name Navigation#Sidebar#syncCount
       * @type {number}
       */
      this.syncCount = 0;

      /**
       * Loaded simulation ID.
       * 
       * @name Navigation#Sidebar#simId
       * @type {number}
       */
      this.simId = appConfig.simInfo.id;
      //this.simModelFile = appConfig.simInfo.name + ".json"

      /**
       * The backend server URL.
       * 
       * @name Navigation#Sidebar#serverUrl
       * @type {string}
       */
      this.serverUrl = appConfig.apiUrl;

      /**
       * If the model has been loaded.
       * 
       * @name Navigation#Sidebar#lookupLoaded
       * @type {boolean}
       */
      this.lookupLoaded = false;

      /**
       * If an error occurred loading the model.
       * 
       * @name Navigation#Sidebar#lookupError
       * @type {boolean}
       */
      this.lookupError = false;

      /**
       * The model JSON as it's loaded.
       * 
       * @name Navigation#Sidebar#jsonStr
       * @type {string}
       */
      this.jsonStr = null;
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
        this.upgrade(simApp.allDataModel);
        this.assignList(jobj);
        //load templates
        this.loadTemplates();
        this.createSidebar(container, url || "resources/sidebar.json");
      }
    }

    /**
     * Loads all diagram templates when the project is first opened and save them within simApp.
     * 
     * @name Navigation#Sidebar#loadTemplates
     * @function
     */
    Sidebar.prototype.loadTemplates = function () {
      getServerFile("resources/userCreatedDiagramTemplates.json", function onSuccess(jsonStr) {
        var templateObj = JSON.parse(jsonStr);
        simApp.userTemplates = templateObj;
        getServerFile("resources/diagramTemplates.json", function onSuccess(jsonStr) {
          var templateObj = JSON.parse(jsonStr);
          simApp.globalTemplates = templateObj;
          simApp.allTemplates = templateObj;
          //add the local templates to allTemplates
          var localTemplates = simApp.userTemplates;
          localTemplates.DiagramList.forEach(function (di) {
            simApp.allTemplates.DiagramList.add(di);
          }.bind(this));
          localTemplates.StateList.forEach(function (st) {
            simApp.allTemplates.StateList.add(st);
          }.bind(this));
          localTemplates.ActionList.forEach(function (a) {
            simApp.allTemplates.ActionList.add(a);
          }.bind(this));
          localTemplates.EventList.forEach(function (e) {
            simApp.allTemplates.EventList.add(e);
          }.bind(this));
        }.bind(this));
      }.bind(this));

    }

    /**
     * Assigns values from an object to the Sidebar.
     * 
     * @name Navigation#Sidebar#assignList
     * @function
     * @param {object} objList The object to assign from.
     */
    Sidebar.prototype.assignList = function (objList) {
      for (var propName in objList) {
        var item = objList[propName];
        if (item instanceof Array) {
          this[propName] = item;
        }
      }
    }
    /**
     * Upgrades a model created in a previous version of EMRALD.
     * 
     * @name Navigation#Sidebar#upgrade
     * @function
     * @param {Model} model The model.
     */
    Sidebar.prototype.upgrade = function (model) {
      var curVersion = 1.1;
      if (!model.version) {
        model.version = 0.0;
      }

      if (model.version < 1.1) { //update all the string Booleans to real Booleans 
        for (let curE of model.EventList) {
          if (curE.Event.mainItem && ((typeof curE.Event.mainItem) == "string")) {
            curE.Event.mainItem = curE.Event.mainItem.toUpperCase() == "TRUE" ? true : false;
          }
        }
        for (let curA of model.ActionList) {
          if (curA.Action.mainItem && ((typeof curA.Action.mainItem) == "string")) {
            curA.Action.mainItem = curA.Action.mainItem.toUpperCase() == "TRUE" ? true : false;
          }
          if (curA.Action.mutExcl && ((typeof curA.Action.mutExclm) == "string")) {
            curA.Action.mutExcl = curA.Action.mutExcl.toUpperCase() == "TRUE" ? true : false;
          }
        }
      }
      
      model.version = curVersion;
    }

    /**
     * Applies jQuery UI's accordion directive to a sidebar section using "content" heightStyle.
     * 
     * @name Navigation#Sidebar#ApplyJqueryUI
     * @function
     * @param {string} id The ID of the sidebar section.
     */
    Sidebar.prototype.ApplyJqueryUi = function (id) {

      $('#' + id).accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }

      });
    }

    /**
     * Applies jQuery UI's accordion directive to a sidebar section using "fill" heightStyle.
     * 
     * @name Navigation#Sidebar#ApplyJqueryUiFill
     * @function
     * @param {string} id The ID of the sidebar section.
     */
    Sidebar.prototype.ApplyJqueryUiFill = function (id) {
      $('#' + id).accordion({
        collapsible: true,
        heightStyle: "fill"
      });
    }

    /**
     * Opens the diagram edit form and adds the diagram to the sidebar.
     * 
     * @name Navigation#Sidebar#createNewDiagram
     * @function
     */
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

      var diagramList = simApp.allTemplates.DiagramList;
      var diagramTemplates = [];
      if (diagramList.length > 0) {
        diagramTemplates.add("");
      }
      for (var i = 0; i < diagramList.length; i++) {
        diagramTemplates.add(diagramList[i].Diagram.name);
      }
      dataObj.diagramTemplates = diagramTemplates;

      var wnd = mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, outDataObj) {
          if (btn === 'OK') {
            if (outDataObj.importedContent) {
              Sidebar.prototype.beginMergeModel(outDataObj.importedContent);
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
              this.addNewTemplateDiagram(diagram, outDataObj.diagramTemplate);
              this.openDiagram(diagram.Diagram);
              this.onLoadLocal(diagram.Diagram);
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

    /**
     * Creates the sidebar.
     * 
     * @name Navigation#Sidebar#createSidebar
     * @function
     * @param {HTMLElement} container The node to create the sidebar within.
     * @param {string} url The URL of the sidebar JSON file.
     */
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
              { title: "Refresh", cmd: "Refresh" }
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
                      var eventObj = { id: -1, name: "", desc: "", mainItem: true, evType: "etVarCode", varNames: [], Code: "return 1.0;", sim3dID: 1 };
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
                case "Merge":
                  getServerFile("resources/TestMergeModel.json", function onSuccess(jsonStr) {
                    var dataObj = JSON.parse(jsonStr);
                    this.beginMergeModel(dataObj);
                  }.bind(this));                  
                  break;
              }
            }.bind(this)

          }
        }
        return cmenu;
      }.bind(this);

      getServerFile(url, function onSuccess(jsonStr) {
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
      }.bind(this));

    }
    
    /**
     * Shows a dynamic sidebar.
     * 
     * @name Navigation#Sidebar#showDynamicSidebar
     * @function
     * @param {string} type The type of sidebar to show (local, global, or all).
     */
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
     * Gets all ExtSims.
     * 
     * @name Navigation#Sidebar#getExtSimList
     * @function
     * @returns {ExtSim[]} The ExtSim list.
     */
    Sidebar.prototype.getExtSimList = function () {
      return simApp.allDataModel.ExtSimList;
    }

    /**
     * Removes the dynamic sidebar.
     * 
     * @name Navigation#Sidebar#deleteDynamicSidebar
     * @function
     */
    Sidebar.prototype.deleteDynamicSidebar = function () {
      var localElement = document.getElementById("Sidebar_Dynamic_Local");
      if (localElement != null)
        localElement.parentNode.removeChild(localElement);
      var globalElement = document.getElementById("Sidebar_Dynamic_Global");
      if (globalElement != null)
        globalElement.parentNode.removeChild(globalElement);
    }

    /**
     * Loads the model data.
     * 
     * @name Navigation#Sidebar#loadLookup
     * @function
     */
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

    /**
     * Gets an item within the model by name.
     * 
     * @name Navigation#Sidebar#getByName
     * @function
     * @param {string} itemType The type of the item.
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {Action|Event|Variable|ExtSim|LogicNode|Diagram|State} The item with the specified name.
     */
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
    
    /**
     * Gets an action in a model by name.
     * 
     * @name Navigation#Sidebar#getActionByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {Action} The Action with the specified name.
     */
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
    
    /**
     * Gets an event in a model by name.
     * 
     * @name Navigation#Sidebar#getEventByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {Event} The Event with the specified name.
     */
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
    
    /**
     * Gets a variable in a model by name.
     * 
     * @name Navigation#Sidebar#getVariableByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {Variable} The Variable with the specified name.
     */
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
    
    /**
     * Gets an ExtSim in a model by name.
     * 
     * @name Navigation#Sidebar#getExtSimByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {ExtSim} The ExtSim with the specified name.
     */
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
    
    /**
     * Gets a logic node in a model by name.
     * 
     * @name Navigation#Sidebar#getLogicNodeByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {LogicNode} The LogicNode with the specified name.
     */
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
    
    /**
     * Gets a diagram in a model by name.
     * 
     * @name Navigation#Sidebar#getDiagramByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {Diagram} The Diagram with the specified name.
     */
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
    
    /**
     * Gets a diagram in a model by state name.
     * 
     * @name Navigation#Sidebar#getDiagramByStateName
     * @function
     * @param {string} sName The state name to find.
     * @returns {Diagram} The Diagram with the specified name.
     */
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
    
    /**
     * Builds a logic tree.
     * 
     * @name Navigation#Sidebar#buildLogicTree
     * @function
     * @param {LogicNode} logicNode The logic node.
     * @returns {LogicNode} The built logic tree.
     */
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
    
    /**
     * Gets a state in a model by name.
     * 
     * @name Navigation#Sidebar#getStateByName
     * @function
     * @param {Model} model The model to search in.
     * @param {string} aName The name to find.
     * @returns {State} The State with the specified name.
     */
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
    
    /**
     * Gets a diagram's state names
     * 
     * @name Navigation#Sidebar#getStateNamesForDiagram
     * @function
     * @param {Model} model The model to search in.
     * @param {string} dName The name of the diagram whose state names to get.
     * @returns {string[]} The diagram's state names.
     */
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
    
    /**
     * Gets a diagram's state objects.
     * 
     * @name Navigation#Sidebar#getStateDataObjecsForDiagram
     * @function
     * @param {Model} model The model to search in.
     * @param {string} dName The name of the diagram whose state objects to get.
     * @returns {State[]} The diagram's states.
     */
    Sidebar.prototype.getStateDataObjecsForDiagram = function (model, dName) {
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
     * Gets a list of actions from a list of states.
     * 
     * @name Navigation#Sidebar#getActionList
     * @function
     * @param {State[]} states The list of states to get actions from.
     * @returns {Action[]} The actions.
     */
    Sidebar.prototype.getActionList = function (states) {
      var actionList = [];
      if (states instanceof Array) {
        //get all action object match actionName for all states objects.
        states.forEach(function (state) {
          //look for action name within the ImmediateAction list.
          if (state.immediateActions && state.immediateActions.length > 0) {
            state.immediateActions.forEach(function (actionName) {
              var actionObj = this.getActionByName(simApp.allDataModel, actionName);
              if (actionObj)
                actionList.push(actionObj);
            }.bind(this));
          }
          //look for action name within the eventAction list.
          if (state.eventActions && state.eventActions.length > 0) {
            state.eventActions.forEach(function (eaObj) {
              if (eaObj.actions && eaObj.actions.length > 0) {
                eaObj.actions.forEach(function (actionName) {
                  var actionObj = this.getActionByName(simApp.allDataModel, actionName);
                  if (actionObj)
                    actionList.push(actionObj);
                }.bind(this));
              }
            }.bind(this));
          }
        }.bind(this));
      }
      return actionList;
    }
    
    /**
     * Gets a list of unique actions from a list of states.
     * 
     * @name Navigation#Sidebar#getActionListWithoutRepeats
     * @function
     * @param {State[]} states The list of states to get actions from.
     * @returns {Action[]} The actions.
     */
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
     * Gets a list of events from a list of states.
     * 
     * @name Navigation#Sidebar#getEventList
     * @function
     * @param {State[]} states The list of states to get events from.
     * @returns {Event[]} The events.
     */
    Sidebar.prototype.getEventList = function (states) {
      var eventList = [];
      var eventNames = [];
      if (states instanceof Array) {
        states.forEach(function (state) {
          if (state.events && state.events.length > 0) {
            state.events.forEach(function (eventName) {
              var eventObj = this.getEventByName(simApp.allDataModel, eventName);
              if (eventObj) {
                eventList.push(eventObj);
                eventNames.push(eventName);
              }
            }.bind(this));
          }
        }.bind(this));
      }
      return eventList;
    }
    
    /**
     * Gets a list of unique events from a list of states.
     * 
     * @name Navigation#Sidebar#getEventListWithoutRepeats
     * @function
     * @param {State[]} states The list of states to get events from.
     * @returns {Event[]} The events.
     */
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
    
    /**
     * Gets an event from the model.
     * 
     * @name Navigation#Sidebar#getEvent
     * @function
     * @param {Diagram} diagram The diagram.
     * @param {string} eventName The name of the event to find.
     * @returns {Event} The event with the specified name.
     */
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
    
    /**
     * Gets an action from the model.
     * 
     * @name Navigation#Sidebar#getAction
     * @function
     * @param {Diagram} diagram The diagram.
     * @param {string} actionName The name of the action to find.
     * @returns {Action} The action with the specified name.
     */
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

    /**
     * Gets the state along with any events, immediateActions and the eventAction's actions object.
     * 
     * @name Navigation#Sidebar#getState
     * @function
     * @param {Diagram} diagram The diagram to search in.
     * @param {string} stateName The name of the state to find.
     * @returns {State} The state with the specified name.
     */
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
    
    /**
     * Create a diagram model off the simApp allDataModel.
     * 
     * @name Navigation#Sidebar#getDiagram
     * @function
     * @param {object} inData Data to create the diagram with.
     * @returns {Diagram} The created diagram.
     */
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

    /**
     * Run a function with each item in the model for the given item types.
     * 
     * @name Navigation#Sidebar#forEachItemDo
     * @function
     * @param {Model} model The model to get items from.
     * @param {string[]} itemTypes The types of items to loop over.
     * @param {Function} doFunc The loop function.
     */
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

    /**
     * Builds a model asking the user how to resolve merge conflicts (overwrite, ignore or rename)
     * 
     * @name Navigation#Sidebar#resolveConflicts
     * @function
     * @param {Model} addModel The model to add.
     * @param {object} conflictList The list of conflicts.
     */
    Sidebar.prototype.resolveConflicts = function (addModel, conflictList) {
      let conflictNumber = 0;

      let elem = document.createElement('div');
      elem.style.cssText = "background: #fb8b3b; width: 550px; position: sticky; align-items: center; margin: auto; padding: 5em; z-index: 1000";
      elem.innerHTML = 'There is a naming conflict with the following objects. Please choose an option to resolve: <br>';

      let conflictTable = document.createElement('table');
      conflictTable.innerHTML = "<tr><th>Type</th><th>Conflicting Name</th><th>Overwrite</th><th>Ignore</th><th>Rename</th></tr>";

      conflictList.forEach(conflictItem => {
        conflictNumber = conflictNumber + 1;
        let conflictName = "conflict" + conflictNumber;
        conflictItem.RadioName = conflictName;
        let conflictElemRow = document.createElement('tr');

        let conflictElemRowType = document.createElement('td');
        conflictElemRowType.innerText = conflictItem.ItemType;
        conflictElemRowType.style.fontStyle = "italic";
        conflictElemRow.appendChild(conflictElemRowType);

        let conflictElemRowName = document.createElement('td');
        conflictElemRowName.innerText = conflictItem.Name;
        conflictElemRow.appendChild(conflictElemRowName);

        let conflictElemRowOverwrite = document.createElement('td');
        conflictElemRowOverwrite.innerHTML = '<input type="radio" name="' + conflictName + '" value="Overwrite">';
        conflictElemRow.appendChild(conflictElemRowOverwrite);

        let conflictElemRowIgnore = document.createElement('td');
        conflictElemRowIgnore.innerHTML = '<input type="radio" name="' + conflictName + '" value="Ignore" checked>';
        conflictElemRow.appendChild(conflictElemRowIgnore);

        let conflictElemRowRename = document.createElement('td');
        conflictElemRowRename.innerHTML = '<input type="radio" name="' + conflictName + '" value="Rename">';
        conflictElemRow.appendChild(conflictElemRowRename);

        let conflictElemRowRenameTextBox = document.createElement('span');
        conflictElemRowRenameTextBox.style.display = 'none';
        conflictElemRowRenameTextBox.innerHTML = '<input type="text" name="' + conflictName + 'New" value="' + conflictItem.Name + '2">';
        conflictElemRowRename.appendChild(conflictElemRowRenameTextBox);

        conflictElemRowOverwrite.addEventListener('click', () => { conflictElemRowRenameTextBox.style.display = 'none'; conflictElemRowOverwrite.childNodes[0].checked = true; });
        conflictElemRowIgnore.addEventListener('click', () => { conflictElemRowRenameTextBox.style.display = 'none'; conflictElemRowIgnore.childNodes[0].checked = true; });
        conflictElemRowRename.addEventListener('click', () => { conflictElemRowRenameTextBox.style.display = 'inline'; conflictElemRowRename.childNodes[0].checked = true; });

        conflictTable.appendChild(conflictElemRow);
      });

      let submitButton = document.createElement('input');
      submitButton.style.width = '100%';
      submitButton.type = "button";
      submitButton.value = "Submit"

      submitButton.addEventListener('click', () => {
        var model = simApp.allDataModel;
        var overwriteList = this.initializeConflictList();
        var ignoreList = this.initializeConflictList();
        var renameList = this.initializeConflictList();

        for (let k = 1; k <= conflictNumber; k++) {
          let conflictName = "conflict" + k;
          let resolution = document.querySelector('input[name="' + conflictName + '"]:checked').value;
          let item = conflictList.filter(x => x.RadioName === conflictName)[0];
          if (resolution === "Rename") {
            let newName = document.querySelector('input[name = "' + conflictName + 'New"]').value;
            if (!this.getByName(item.ItemType, model, newName) && !this.getByName(item.ItemType, addModel, newName)) {
              renameList[item.ItemType].push({ "oldName": item.Name, "newName": newName });
            }
            else {
              alert('An object with the name "' + newName + '" already exists.  Please choose a different name.');
              return;
            }
          }
          else if (resolution === "Overwrite") {
            overwriteList[item.ItemType].push(item.Name);
          }
          else {
            ignoreList[item.ItemType].push(item.Name);
          }
        }
        elem.remove();
        this.finishMergeModel(addModel, overwriteList, ignoreList, renameList);
      });

      elem.appendChild(conflictTable);
      elem.appendChild(submitButton);
      document.body.appendChild(elem);

      return;
    }

    /**
     * Initializes a list of conflicts.
     * 
     * @name Navigation#Sidebar#initializeConflictList
     * @function
     * @returns {object} The empty conflict list.
     */
    Sidebar.prototype.initializeConflictList = function () {
      let list = {};
      list["Diagram"] = [];
      list["State"] = [];
      list["Action"] = [];
      list["Event"] = [];
      list["LogicNode"] = [];
      list["Variable"] = [];
      list["ExtSim"] = [];
      return list;
    }

    /**
     * Prep the model for merging (discover any conflicts)
     * 
     * @name Navigation#Sidebar#beginMergeModel
     * @function
     * @param {Model} addModel The model to add.
     */
    Sidebar.prototype.beginMergeModel = function (addModel) {
      var model = simApp.allDataModel;
      //see if the items already exist
      let conflictList = [];
      var overwriteList = this.initializeConflictList();
      var ignoreList = this.initializeConflictList();
      var renameList = this.initializeConflictList();

      //Go through the merge model and find any already existing items and ask user what to do
      simApp.mainApp.sidebar.forEachItemDo(addModel, ["Diagram", "State", "Event", "Action", "LogicNode", "Variable", "ExtSim"], function (self, curModel, item, itemType) {
        if (self.getByName(itemType, model, item.name)) {
          conflictList.push({ "ItemType": itemType, "Model": model, "Name": item.name });
        }
      });

      if (conflictList.length > 0) {
        // Ask User to resolve conflicts
        this.resolveConflicts(addModel, conflictList);
      }
      else {
        // No conflicts to resolve, so just continue with the merge
        this.finishMergeModel(addModel, overwriteList, ignoreList, renameList);
      }
    }

    /**
     * Merge the models.
     * 
     * @name Navigation#Sidebar#finishMergeModel
     * @function
     * @param {Model} addModel The model to add.
     * @param {object} overwriteList Items to overwrite.
     * @param {object} ignoreList Items to ignore.
     * @param {object} renameList Items to rename.
     */
    Sidebar.prototype.finishMergeModel = function (addModel, overwriteList, ignoreList, renameList) {
      //for each rename change the names in the addDiagram
      for (var type in renameList) {
        for (var i = 0; i < renameList[type].length; i++) {
          //replace the names in the importing model, no need to redo side list here, as they will be added later.
          simApp.mainApp.sidebar.replaceNames(renameList[type][i].oldName, renameList[type][i].newName, type, addModel, false) //name:newName pair
        }
      }

      //for each Overwrite replace the existing in the model
      for (var type in overwriteList) {
        for (var i = 0; i < overwriteList[type].length; i++) {
          var target = this.getByName(type, simApp.allDataModel, overwriteList[type][i]);
          var source = this.getByName(type, addModel, overwriteList[type][i]);
          if ((target != null) && (source != null)) {
            //This does not work, it breakes the link to the ui element. Object.assign(target[type], source[type]);
            var assignString = "Object.assign(target." + type + ", source." + type + " )";
            eval(assignString);
          }
        }
      }

      //add all the rest of the items to the correct sections
      simApp.mainApp.sidebar.forEachItemDo(addModel, ["Diagram", "State", "Event", "Action", "LogicNode", "Variable", "ExtSim"], function (self, curModel, item, itemType) {
        if (ignoreList[itemType].includes(item.name) ||
          overwriteList[itemType].includes(item.name)) {
          return;
        }
        else { //item is unique or has been renamed
          //add to the existing model
          var addWrapper = {};
          addWrapper[itemType] = item;
          switch (itemType) {
            case "Diagram":
              self.addNewDiagram(addWrapper);
              break;
            case "State":
              self.addNewState(addWrapper);
              break;
            case "Action":
              if (item.mainItem)
                self.addNewAction(addWrapper);
              else
                self.addNewLocalAction(addWrapper);
              break;
            case "Event":
              if (item.mainItem)
                self.addNewEvent(addWrapper);
              else
                self.addNewLocalEvent(addWrapper);
              break;
            case "LogicNode":
              if (addWrapper.LogicNode.name == addWrapper.LogicNode.rootName)
                self.addNewLogicTree(addWrapper, null);
              else
                self.LogicNodeList.push(addWrapper);
              break;
            case "Variable":
              self.addNewVariable(addWrapper);
              break;
            case "ExtSim":
              self.addNewExtSim(addWrapper);
          };
        }
      });


      this.notifyDataChanged(true);

      //this.alterSideBarListsItem(dataObj.name, null, new Set(["All", "Global", "Local"]), "Event");
    }

    //begin-----------------Rename functions for different items-------------------------------
    /**
     * Replace a state name throughout the entire model and update the effected state veiw's text.
     * 
     * @name Navigation#Sidebar#replaceNames
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     * @param {string} type The type of item to search in.
     * @param {Model} model The model to search in.
     * @param {boolean} [updateSidebar] If the sidebar should be updated.
     */
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

    /**
     * Replaces the name of an event.
     * 
     * @name Navigation#Sidebar#replaceEventName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceEventName = function (oldName, newName) {
        this.replaceNames(oldName, newName, "Event");
    }

    /**
     * Replaces the name of an action.
     * 
     * @name Navigation#Sidebar#replaceActionName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceActionName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Action");
    }

    /**
     * Replaces the name of a state.
     * 
     * @name Navigation#Sidebar#replaceStateName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceStateName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "State");
    }

    /**
     * Replaces the name of a diagram.
     * 
     * @name Navigation#Sidebar#replaceDiagramName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceDiagramName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Diagram");
      //update the html for the item, the name has already changed
      this.diagramsReferencing(simApp.allDataModel, newName, "Diagram", false, newName);
    }

    /**
     * Replaces the name of a logic node.
     * 
     * @name Navigation#Sidebar#replaceLogicNodeName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceLogicNodeName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "LogicNode");
      //update the html for the item, the name has already changed
      this.logicNodesReferencing(simApp.allDataModel, newName, "LogicNode", false, newName);
    }

    /**
     * Replaces the name of a variable.
     * 
     * @name Navigation#Sidebar#replaceVariableName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceVariableName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "Variable");
    }

    /**
     * Replaces the name of a extsim.
     * 
     * @name Navigation#Sidebar#replaceExtSimName
     * @function
     * @param {string} oldName The name to replace.
     * @param {string} newName The name to replace with.
     */
    Sidebar.prototype.replaceExtSimName = function (oldName, newName) {
      this.replaceNames(oldName, newName, "ExtSim");   
      //update the html for the item, the name has already changed
      this.extSimsReferencing(simApp.allDataModel, newName, "ExtSim", false, newName);
    }
    //end-------------------Rename functions for different items-------------------------------


    /**
     * Checks if a state name is in use.
     * 
     * @name Navigation#Sidebar#existsStateName
     * @function
     * @param {string} aName The state name.
     * @returns {boolean} If the name is in use.
     */
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
    
    /**
     * Checks if a diagram name is in use.
     * 
     * @name Navigation#Sidebar#existsDiagramName
     * @function
     * @param {string} aName The state name.
     * @returns {boolean} If the name is in use.
     */
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
    
    /**
     * Checks if a logic node name is in use.
     * 
     * @name Navigation#Sidebar#existsLogicName
     * @function
     * @param {string} aName The logic node name.
     * @returns {boolean} If the name is in use.
     */
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
    
    /**
     * Checks if a template name is in use.
     * 
     * @name Navigation#Sidebar#existsTemplateName
     * @function
     * @param {string} aName The template name.
     * @returns {boolean} If the name is in use.
     */
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
    
    /**
     * Adds a new diagram.
     * 
     * @name Navigation#Sidebar#addNewDiagram
     * @function
     * @param {Diagram} newDiagram The diagram to add.
     * @param {Diagram[]} [parent] The diagram array to add to.
     * @returns {boolean} If the diagram was added.
     */
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
    
    /**
     * Adds a new template diagram.
     * 
     * @name Navigation#Sidebar#addNewTemplateDiagram
     * @function
     * @param {Diagram} newDiagram The diagram to add.
     * @param {string} templateName The name of the template.
     */
    Sidebar.prototype.addNewTemplateDiagram = function (newDiagram, templateName) {

      var diagram = newDiagram;
      var diagramInsert = newDiagram.Diagram.name; //string to replace all of the *****

      diagram.Diagram.name = diagramInsert;

      this.addTemplateInfo(templateName, diagram, diagramInsert);

    }

    /**
     * Add info to a template.
     * 
     * @name Navigation#Sidebar#addTemplateInfo
     * @function
     * @param {string} templateName The name of the template.
     * @param {Diagram} diagram The diagram.
     * @param {string} diagramInsert String to append to diagram item names.
     */
    Sidebar.prototype.addTemplateInfo = function (templateName, diagram, diagramInsert) {
      var templateObj = simApp.allTemplates;
      templateObj.DiagramList.forEach(function (item) {
        if (item.Diagram.name == templateName) { //if template exists
          var mainModel = simApp.allDataModel;
          var template = JSON.parse(JSON.stringify(item.Diagram));
          //get the list of states
          diagram.Diagram.states = template.states;
          var setUpDiagram = function () {	//go through saved templates
            //TODO - Bug currently gets all template items not just one one selected how do determine what is just from the one selected.
            var templateStateList = JSON.parse(JSON.stringify(templateObj.StateList));
            var templateEventList = JSON.parse(JSON.stringify(templateObj.EventList));
            var templateActionList = JSON.parse(JSON.stringify(templateObj.ActionList));
            var eventList = [];
            var actionList = [];
            for (var i = 0; i < diagram.Diagram.states.length; i++) {
              //change name and add the new states to the sidebar
              templateStateList.forEach(function (state) {
                var newState = state;
                var indx = newState.State.name.indexOf("*****");
                if (indx > -1) {
                  var start = newState.State.name.substring(0, indx);
                  var end = newState.State.name.substring(indx + 5, newState.State.name.length);
                  newState.State.name = "" + start + diagramInsert + end; //insert diagram name into the *****
                }
                //change name and add the events to sidebar
                for (var k = 0; k < newState.State.events.length; k++) {
                  eventList.push(newState.State.events[k]);
                  var eIndx = newState.State.events[k].indexOf("*****");
                  if (eIndx > -1) {
                    var start = newState.State.events[k].substring(0, eIndx);
                    var end = newState.State.events[k].substring(eIndx + 5, newState.State.events[k].length);
                    newState.State.events[k] = "" + start + diagramInsert + end; //insert diagram name into the *****
                  }
                }
                templateEventList.forEach(function (event) {

                  var elIndx = eventList.indexOf(event.Event.name);
                  if (elIndx > -1) {
                    var nameIndx = event.Event.name.indexOf("*****");
                    if (nameIndx > -1) {
                      var start = event.Event.name.substring(0, nameIndx);
                      var end = event.Event.name.substring(nameIndx + 5, event.Event.name.length);
                      event.Event.name = "" + start + diagramInsert + end; //insert diagram name into the *****
                    }
                    event.Event.id = this.getDefaultEventID();
                    if (!this.getEventByName(mainModel, event.Event.name)) {

                      mainModel.EventList.push(event);
                    }

                  }

                }.bind(this));

                //change name and add the eventActions to sidebar
                for (var m = 0; m < newState.State.eventActions.length; m++) {
                  for (var l = 0; l < newState.State.eventActions[m].actions.length; l++) {

                    var eIndx = newState.State.eventActions[m].actions[l].indexOf("*****");
                    if (eIndx > -1) {
                      if (actionList.indexOf(newState.State.eventActions[m].actions[l]) == -1) {
                        actionList.push(newState.State.eventActions[m].actions[l]);
                      }
                      var start = newState.State.eventActions[m].actions[l].substring(0, eIndx);
                      var end = newState.State.eventActions[m].actions[l].substring(eIndx + 5, newState.State.eventActions[m].actions[l].length);
                      newState.State.eventActions[m].actions[l] = "" + start + diagramInsert + end; //insert diagram name into the *****
                    }
                  }
                }
                //change name and add the immediateActions to sidebar
                for (var n = 0; n < newState.State.immediateActions.length; n++) {
                  var imIndx = newState.State.immediateActions[n].indexOf("*****");
                  if (imIndx > -1) {
                    if (actionList.indexOf(newState.State.immediateActions[n]) == -1) {
                      actionList.push(newState.State.immediateActions[n]);
                    }
                    var start = newState.State.immediateActions[n].substring(0, imIndx);
                    var end = newState.State.immediateActions[n].substring(imIndx + 5, newState.State.immediateActions[n].length);
                    newState.State.immediateActions[n] = "" + start + diagramInsert + end; //insert diagram name into the *****
                  }
                }
                templateActionList.forEach(function (action) {
                  var alIndx = actionList.indexOf(action.Action.name);
                  if (alIndx > -1) {
                    var nameIndx = action.Action.name.indexOf("*****");
                    if (nameIndx > -1) {
                      var start = action.Action.name.substring(0, nameIndx);
                      var end = action.Action.name.substring(nameIndx + 5, action.Action.name.length);
                      action.Action.name = "" + start + diagramInsert + end; //insert diagram name into the *****
                    }
                    //go through newStates and change any names that need changing
                    if (action.Action.newStates) {
                      for (var o = 0; o < action.Action.newStates.length; o++) {
                        var toState = action.Action.newStates[o].toState;
                        var newStateIndx = toState.indexOf("*****");
                        if (newStateIndx > -1) {
                          var start = toState.substring(0, newStateIndx);
                          var end = toState.substring(newStateIndx + 5, toState.length);
                          action.Action.newStates[o].toState = "" + start + diagramInsert + end; //insert diagram name into the *****
                        }
                      }
                    }

                    action.Action.id = this.getDefaultActionID();
                    if (!this.getActionByName(mainModel, action.Action.name)) {
                      mainModel.ActionList.push(action);
                    }

                  }

                }.bind(this));
                newState.State.diagramName = diagram.Diagram.name;
                newState.State.id = this.getDefaultStateID();
                if (!this.getStateByName(mainModel, newState.State.name)) {
                  mainModel.StateList.push(newState);
                }
              }.bind(this));
              //change the state names
              var indx = diagram.Diagram.states[i].indexOf("*****");
              if (indx > -1) {
                var start = diagram.Diagram.states[i].substring(0, indx);
                var end = diagram.Diagram.states[i].substring(indx + 5, diagram.Diagram.states[i].length);
                diagram.Diagram.states[i] = "" + start + diagramInsert + end;
              }
            }
            //add the singleStates
            diagram.Diagram.singleStates = template.singleStates;
            //insert diagram name into the *****
            for (var j = 0; j < diagram.Diagram.singleStates.length; j++) {
              var indx = diagram.Diagram.singleStates[j].stateName.indexOf("*****");
              if (indx > -1) {
                var start = diagram.Diagram.singleStates[j].stateName.substring(0, indx);
                var end = diagram.Diagram.singleStates[j].stateName.substring(indx + 5, diagram.Diagram.singleStates[j].stateName.length);
                diagram.Diagram.singleStates[j].stateName = "" + start + diagramInsert + end;
              }
            }
            diagram.Diagram.id = this.getDefaultDiagramID();
            diagram.Diagram.diagramLabel = template.diagramLabel;
            mainModel.DiagramList.push(diagram);
            var container = document.getElementById("DiagramsPanel_id");
            if (container) {
              this.addDiagramToSection(container, diagram);

            }
          }.bind(this);
          setUpDiagram();
        }
      }.bind(this));
    }

    /**
     * Gets the next available action ID.
     * 
     * @name Navigation#Sidebar#getDefaultActionID
     * @function
     * @returns {number} The next available action ID.
     */
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
    
    /**
     * Gets the next available event ID.
     * 
     * @name Navigation#Sidebar#getDefaultEventID
     * @function
     * @returns {number} The next available event ID.
     */
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
    
    /**
     * Gets the next available state ID.
     * 
     * @name Navigation#Sidebar#getDefaultStateID
     * @function
     * @returns {number} The next available state ID.
     */
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
    
    /**
     * Gets the next available diagram ID.
     * 
     * @name Navigation#Sidebar#getDefaultDiagramID
     * @function
     * @returns {number} The next available diagram ID.
     */
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

    /**
     * Adds a new action.
     * 
     * @name Navigation#Sidebar#addNewAction
     * @function
     * @param {Action} newAction The new action object to add.
     * @param {Action[]} parent The action array to add to.
     * @param {boolean} isImmediate If true, action is an immediate action.
     * @returns {boolean} If the action was added.
     */
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
    
    /**
     * Adds a new local action.
     * 
     * @name Navigation#Sidebar#addNewLocalAction
     * @function
     * @param {Action} newAction The new action object to add.
     * @param {Action[]} parent The action array to add to.
     * @param {boolean} isImmediate If true, action is an immediate action.
     * @returns {boolean} If the action was added.
     */
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
    
    /**
     * Adds a new event.
     * 
     * @name Navigation#Sidebar#addNewEvent
     * @function
     * @param {Event} newEvent The new event object to add.
     * @param {Event[]} parent The event array to add to.
     * @returns {boolean} If the event was added.
     */
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
    
    /**
     * Adds a new local event.
     * 
     * @name Navigation#Sidebar#addNewLocalEvent
     * @function
     * @param {Event} newEvent The new event object to add.
     * @param {Event[]} [parent] The event array to add to.
     * @param {boolean} [existingAsNew] If true, the event is being added as a new item.
     * @returns {boolean} If the event was added.
     */
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

    /**
     * Adds an empty action to maintain the data structure.
     * 
     * @name Navigation#Sidebar#addNewEmptyEventAction
     * @function
     * @param {State} state The state to add to.
     */
    Sidebar.prototype.addNewEmptyEventAction = function (state) {
      var mainModel = simApp.allDataModel;
      var dataState = this.getStateByName(mainModel, state.name);
      var emptyAction = {
        "actions": []
      }
      dataState.State.eventActions.push(emptyAction);
    }
    
    /**
     * Adds a new variable.
     * 
     * @name Navigation#Sidebar#addNewVariable
     * @function
     * @param {Variable} newVariable The variable to add.
     * @param {Variable[]} parent The variable array to add to.
     * @returns {boolean} If the variable was added.
     */
    Sidebar.prototype.addNewVariable = function (newVariable, parent) {
      var mainModel = simApp.allDataModel;
      if (mainModel.VariableList) {
        var varr = this.getVariableByName(mainModel, newVariable.Variable.name);
        if (!varr) {
          var idx = mainModel.VariableList.push(newVariable);
          newVariable.Variable.id = idx;
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
    
    /**
     * Adds a new logic tree.
     * 
     * @name Navigation#Sidebar#addNewLogicTree
     * @function
     * @param {LogicNode} newLogicNode The logic node to add.
     * @param {LogicNode[]} parent The logic node array to add to.
     * @returns {boolean} If the logic node was added.
     */
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
    
    /**
     * Adds a new ext sim.
     * 
     * @name Navigation#Sidebar#addNewExtSim
     * @function
     * @param {ExtSim} newExtSim The ext sim to add.
     * @param {ExtSim[]} parent The ext sim array to add to.
     * @returns {boolean} If the ext sim was added.
     */
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
    
    /**
     * Adds a new state.
     * 
     * @name Navigation#Sidebar#addNewState
     * @function
     * @param {State} newState The state to add.
     */
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
    
    /**
     * Adds a new local state.
     * 
     * @name Navigation#Sidebar#addNewLocalState
     * @function
     * @param {State} newState The state to add.
     */
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
    
    /**
     * Cleans a diagram model.
     * 
     * @name Navigation#Sidebar#cleanDataModel
     * @function
     * @param {Diagram} diagram The diagram to clean.
     */
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
    }
    
    /**
     * Opens a diagram editor window.
     * 
     * @name Navigation#Sidebar#openDiagramWindow
     * @function
     * @param {Diagram} diagram The diagram to open.
     */
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
    
    /**
     * Opens a diagram with the specified state name.
     * 
     * @name Navigation#Sidebar#openDiagramByStateName
     * @function
     * @param {string} stateName The name of the state to find.
     */
    Sidebar.prototype.openDiagramByStateName = function (stateName) {
      var diagram = this.getDiagramByStateName(stateName);
      if (diagram) {
        this.openDiagram(diagram.Diagram);
      }
    }
    
    /**
     * Opens a diagram.
     * 
     * @name Navigation#Sidebar#openDiagram
     * @function
     * @param {object} inData Parameters to find the diagram by.
     */
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
    
    /**
     * Edit a diagram's properties.
     * 
     * @name Navigation#Sidebar#editDiagramProperties
     * @function
     * @param {object} dataObj The diagram properties.
     * @param {HTMLElement} el The diagram sidebar section item.
     */
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
    
    /**
     * Edit a diagram's type.
     * 
     * @name Navigation#Sidebar#editDiagramType
     * @function
     * @param {string} diagramName The name of the diagram to edit.
     * @param {string} oldType The old diagram type.
     * @param {string} newType The new diagram type.
     * @returns {boolean} If the type was changed.
     */
    Sidebar.prototype.editDiagramType = function (diagramName, oldType, newType) {
      let successful = false;
      console.log('Changing Diagram Type');
      return successful;
    }

    /**
     * Edit an ext sim's properties.
     * 
     * @name Navigation#Sidebar#editExtSimProperties
     * @function
     * @param {object} dataObj The ext sim properties.
     * @param {HTMLElement} el The ext sim sidebar section item.
     */
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
    
    /**
     * Edit a template's properties.
     * 
     * @name Navigation#Sidebar#editTemplateProperties
     * @function
     * @param {object} dataObj The template properties.
     * @param {HTMLElement} el The template sidebar section item.
     */
    Sidebar.prototype.editTemplateProperties = function (dataObj, el) {
      var inputDataObj = JSON.parse(JSON.stringify(dataObj));
      var name = inputDataObj.name;
      var mainModel = simApp.allDataModel;
      var stateList = mainModel.StateList;
      var addStates = [];
      var excludeStates = [];
      var actionList = mainModel.ActionList;
      var addActions = [];
      var excludeActions = [];
      var includeActions = [];
      var eventList = mainModel.EventList;
      var addEvents = [];
      var excludeEvents = [];
      var includeEvents = [];
      inputDataObj = this.replaceInTemplateObj(inputDataObj, name);
      //go through states and add events + actions
      stateList.forEach(function (item) {
        if (item.State.diagramName == name) {
          //If the diagram name is within the state name, include the state
          if (item.State.name.indexOf(name) > -1) {
            //replace the diagram name with ***

            for (var i = 0; i < actionList.length; i++) {
              if (item.State.immediateActions.indexOf(actionList[i].Action.name) > -1) {
                //replace the diagram name with ***
                var replacedAction = JSON.parse(JSON.stringify(actionList[i]));
                replacedAction.Action = this.replaceInTemplateObj(replacedAction, name);
                if (replacedAction.Action.name == actionList[i].Action.name && includeActions.indexOf(replacedAction) < 0) {
                  includeActions.push(replacedAction);
                }
                else if (addActions.indexOf(replacedAction) < 0) {
                  addActions.push(replacedAction);
                }
              }
              for (var k = 0; k < item.State.eventActions.length; k++) {
                if (item.State.eventActions[k].actions.indexOf(actionList[i].Action.name) > -1) {
                  //replace the diagram name with ***
                  var replacedAction = JSON.parse(JSON.stringify(actionList[i]));
                  replacedAction.Action = this.replaceInTemplateObj(replacedAction, name);
                  if (replacedAction.Action.name == actionList[i].Action.name && includeActions.indexOf(replacedAction) < 0) {
                    includeActions.push(replacedAction);
                  }
                  else if (addActions.indexOf(replacedAction) < 0) {
                    addActions.push(replacedAction);
                  }
                }
              }
            }
            for (var j = 0; j < eventList.length; j++) {
              if (item.State.events.indexOf(eventList[j].Event.name) > -1) {
                var replacedEvent = JSON.parse(JSON.stringify(eventList[j]));
                replacedEvent.Event = this.replaceInTemplateObj(replacedEvent, name);
                if (replacedEvent.Event.name == eventList[j].Event.name && includeEvents.indexOf(replacedEvent) < 0) {
                  includeEvents.push(replacedEvent);
                }
                else if (addEvents.indexOf(replacedEvent) < 0) {
                  addEvents.push(replacedEvent);
                }
              }
            }
            var newItem = { State: item.State };
            var replacedState = JSON.parse(JSON.stringify(newItem));
            replacedState.State = this.replaceInTemplateObj(replacedState, name);
            addStates.push(replacedState);
          }
            //if the diagram name is not in the state name, exclude the state
          else {
            excludeStates.push(item);
            for (var i = 0; i < actionList.length; i++) {
              if (item.State.immediateActions.indexOf(actionList[i].Action.name) > -1) {
                if (excludeActions.indexOf(actionList[i]) < 0) {
                  excludeActions.push(actionList[i]);
                }
              }
              for (var k = 0; k < item.State.eventActions.length; k++) {
                if (item.State.eventActions[k].actions.indexOf(actionList[i].Action.name) > -1) {
                  if (excludeActions.indexOf(actionList[i]) < 0) {
                    excludeActions.push(actionList[i]);
                  }
                }
              }
            }
            for (var j = 0; j < eventList.length; j++) {
              if (item.State.events.indexOf(eventList[j].Event.name) > -1) {
                if (excludeEvents.indexOf(eventList[j]) < 0) {
                  excludeEvents.push(eventList[j]);
                }
              }
            }
          }


        }
      }.bind(this));
      inputDataObj.addStates = addStates;
      inputDataObj.excludeStates = excludeStates;
      inputDataObj.addEvents = addEvents;
      inputDataObj.excludeEvents = excludeEvents;
      inputDataObj.includeEvents = includeEvents;
      inputDataObj.addActions = addActions;
      inputDataObj.excludeActions = excludeActions;
      inputDataObj.includeActions = includeActions;
      var url = 'EditForms/TemplateEditor.html';
      var wnd = mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, outDataObj) {
        if (btn === 'OK') {
          if (this.existsTemplateName(outDataObj.name)) {
            MessageBox.alert("New Template", "A template with the name '" + outDataObj.name + "' exists, please try a different name.");
            return false;
          }
          if (outDataObj.name.length < 1) {
            MessageBox.alert("New Template", "Invalid name.");
            return false;
          }
          delete outDataObj.excludeActions;
          delete outDataObj.excludeEvents;
          delete outDataObj.excludeStates;
          delete outDataObj.id;
          //add actions
          outDataObj.addActions.forEach(function (action) {
            simApp.allTemplates.ActionList.push({ Action: action.Action });
            simApp.userTemplates.ActionList.push({ Action: action.Action });
          }.bind(this));
          outDataObj.includeActions.forEach(function (action) {
            simApp.allTemplates.ActionList.push({ Action: action.Action });
            simApp.userTemplates.ActionList.push({ Action: action.Action });
          }.bind(this));

          //add events
          outDataObj.addEvents.forEach(function (event) {
            simApp.allTemplates.EventList.push({ Event: event.Event });
            simApp.userTemplates.EventList.push({ Event: event.Event });
          }.bind(this));

          outDataObj.includeEvents.forEach(function (event) {
            simApp.allTemplates.EventList.push({ Event: event.Event });
            simApp.userTemplates.EventList.push({ Event: event.Event });
          }.bind(this));

          //add states
          outDataObj.addStates.forEach(function (state) {
            simApp.allTemplates.StateList.push({ State: state.State });
            simApp.userTemplates.StateList.push({ State: state.State });

          }.bind(this));

          delete outDataObj.addActions;
          delete outDataObj.includeActions;
          delete outDataObj.addEvents;
          delete outDataObj.includeEvents;
          delete outDataObj.addStates;


          var diagram = { Diagram: outDataObj };
          simApp.allTemplates.DiagramList.push(diagram);
          simApp.userTemplates.DiagramList.push(diagram);


          simApp.modelChanged = false;


        }
        return true;
      }.bind(this),
      inputDataObj,
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
    
    /**
     * Replaces a string of text with the diagram's name in the data item's names.
     * 
     * @name Navigation#Sidebar#replaceInTemplateObj
     * @function
     * @param {object} dataObj The data object to replace in.
     * @param {string} name The name to replace.
     * @returns {State|Action|Event|Diagram} The data with the name replaced.
     */
    Sidebar.prototype.replaceInTemplateObj = function (dataObj, name) {
      if (dataObj.State) {
        var state = dataObj.State;
        delete state.id;
        state.diagramName = "*****";
        var newStateName = state.name;
        var sIndx = newStateName.indexOf(name);
        if (sIndx > -1) {
          var start = newStateName.substring(0, sIndx);
          var end = newStateName.substring(sIndx + name.length, newStateName.length);
          state.name = "" + start + "*****" + end;
        }
        //replace events in State
        for (var i = 0; i < state.events.length; i++) {
          var eIndx = state.events[i].indexOf(name);
          if (eIndx > -1) {
            var start = state.events[i].substring(0, eIndx);
            var end = state.events[i].substring(eIndx + name.length, state.events[i].length);
            state.events[i] = "" + start + "*****" + end;
          }
        }
        //replace eventActions in State
        for (var j = 0; j < state.eventActions.length; j++) {
          for (var k = 0; k < state.eventActions[j].actions.length; k++) {
            var eaIndx = state.eventActions[j].actions[k].indexOf(name);
            if (eaIndx > -1) {
              var start = state.eventActions[j].actions[k].substring(0, eaIndx);
              var end = state.eventActions[j].actions[k].substring(eaIndx + name.length, state.eventActions[j].actions[k].length);
              state.eventActions[j].actions[k] = "" + start + "*****" + end; //insert diagram name into the *****
            }
          }
        }
        //change name and add the immediateActions to sidebar
        for (var l = 0; l < state.immediateActions.length; l++) {
          var imIndx = state.immediateActions[l].indexOf(name);
          if (imIndx > -1) {
            var start = state.immediateActions[l].substring(0, imIndx);
            var end = state.immediateActions[l].substring(imIndx + name.length, state.immediateActions[l].length);
            state.immediateActions[l] = "" + start + "*****" + end; //insert diagram name into the *****
          }
        }
        return state;
      }
      else if (dataObj.Action) {
        var action = dataObj.Action;
        delete action.id;
        var newActionName = action.name;
        var actIndx = newActionName.indexOf(name);
        if (actIndx > -1) {
          var start = newActionName.substring(0, actIndx);
          var end = newActionName.substring(actIndx + name.length, newActionName.length);
          action.name = "" + start + "*****" + end;
        }

        //go through newStates and change any names that need changing
        if (action.newStates) {
          for (var i = 0; i < action.newStates.length; i++) {
            var toState = action.newStates[i].toState;
            var newStateIndx = toState.indexOf(name);
            if (newStateIndx > -1) {
              var start = toState.substring(0, newStateIndx);
              var end = toState.substring(newStateIndx + name.length, toState.length);
              action.newStates[i].toState = "" + start + "*****" + end; //insert diagram name into the *****
            }
          }
        }
        return action;
      }
      else if (dataObj.Event) {
        var event = dataObj.Event;
        delete event.id;
        var newEventName = event.name;
        var eventIndx = newEventName.indexOf(name);
        if (eventIndx > -1) {
          var start = newEventName.substring(0, eventIndx);
          var end = newEventName.substring(eventIndx + name.length, newEventName.length);
          event.name = "" + start + "*****" + end;
        }
        return event;
      }
        //if it is diagram obj
      else if (dataObj) {
        var diagram = dataObj;
        for (var i = 0; i < diagram.states.length; i++) {
          var sIndx = diagram.states[i].indexOf(name);
          if (sIndx > -1) {
            var start = diagram.states[i].substring(0, sIndx);
            var end = diagram.states[i].substring(sIndx + name.length, diagram.states[i].length);
            diagram.states[i] = "" + start + "*****" + end;
          }
        }
        if (diagram.singleStates) {
          for (var j = 0; j < diagram.singleStates.length; j++) {
            var ssIndx = diagram.singleStates[j].stateName.indexOf(name);
            if (ssIndx > -1) {
              var start = diagram.singleStates[j].stateName.substring(0, ssIndx);
              var end = diagram.singleStates[j].stateName.substring(ssIndx + name.length, diagram.singleStates[j].stateName.length);
              diagram.singleStates[j].stateName = "" + start + "*****" + end;
            }
          }
        }
        return diagram;
      }
      return dataObj;
    }

    /**
     * Edit a state's properties.
     * 
     * @name Navigation#Sidebar#editStateProperties
     * @function
     * @param {object} dataObj The state's properties.
     * @param {HTMLElement} el The state sidebar section item.
     */
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
    
    /**
     * Edit a variable's properties.
     * 
     * @name Navigation#Sidebar#editVariableProperties
     * @function
     * @param {object} dataObj The variable's properties.
     * @param {HTMLElement} el The variable sidebar section item.
     */
    Sidebar.prototype.editVariableProperties = function (dataObj, el) {
      var oldName = dataObj.name;
      var url = 'EditForms/VariableEditor.html';
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
   
    /**
     * Gets the next available gate ID.
     * 
     * @name Navigation#Sidebar#getDefaultGateID
     * @function
     * @returns {number} The next available gate ID.
     */
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
    
    /**
     * Edit a logic node's properties.
     * 
     * @name Navigation#Sidebar#editLogicProperties
     * @function
     * @param {object} dataObj The logic node properties.
     * @param {HTMLElement} el The logic node sidebar section item.
     */
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
              if (el)
                el.innerText = dataObj.name;
              else {
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
    
    /**
     * Opens a logic tree's editor.
     * 
     * @name Navigation#Sidebar#openLogicTree
     * @function
     * @param {LogicNode} dataObj The target logic tree.
     */
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

    /**
     * Edit an action's properties.
     * 
     * @name Navigation#Sidebar#editActionProperties
     * @function
     * @param {object} dataObj The action properties.
     * @param {HTMLElement} el The action sidebar section item.
     */
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

    /**
     * Helper function for editing an action's properties.
     * 
     * @name Navigation#Sidebar#editActionPropertiesHelper
     * @function
     * @param {string} oldName The old action name to replace.
     * @param {string} newName The new action name to replace with.
     */
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
    
    /**
     * Edit an event's properties.
     * 
     * @name Navigation#Sidebar#editEventProperties
     * @function
     * @param {object} dataObj The event properties.
     * @param {HTMLElement} el The event sidebar section item.
     */
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
        if (ln.rootName === ln.name)
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

    /**
     * Alters a sidebar item.
     * 
     * @name Navigation#Sidebar#alterSideBarListsItem
     * @function
     * @param {string} itemName The name of the item to find.
     * @param {string} newName The name to change to.
     * @param {string[]} tabs Tabs for the item.
     * @param {string} type The type of item to alter.
     */
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
    
    /**
     * Deletes a diagram.
     * 
     * @name Navigation#Sidebar#deleteDiagram
     * @function
     * @param {Diagram} dataObj The diagram to delete.
     * @param {HTMLElement} el The diagram sidebar section item.
     */
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
    
    /**
     * Deletes a state.
     * 
     * @name Navigation#Sidebar#deleteState
     * @function
     * @param {State} dataObj The state to delete.
     */
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
    
     /**
      * Deletes a logic tree.
      * 
      * @name Navigation#Sidebar#deleteLogicTree
      * @function
      * @param {LogicNode} dataObj The logic tree to delete.
      * @param {HTMLElement} el The logic tree sidebar section item.
      */
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
    
    /**
     * Deletes an action.
     * 
     * @name Navigation#Sidebar#deleteAction
     * @function
     * @param {Action} dataObj The action to delete.
     * @param {boolean} fullDelete If the action should be completely deleted.
     * @param {State} state The state the action belongs to.
     * @param {Event} event The event the action belongs to.
     */
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
    
    /**
     * Deletes an event.
     * 
     * @name Navigation#Sidebar#deleteEvent
     * @function
     * @param {Event} dataObj The event to delete.
     * @param {boolean} fullDelete If the event should be completely deleted.
     * @param {State} state The state the event belongs to.
     */
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

    /**
     * Deletes an ext sim.
     * 
     * @name Navigation#Sidebar#deleteExtSim
     * @function
     * @param {ExtSim} dataObj The ext sim to delete.
     * @param {HTMLElement} el The ext sim sidebar section item.
     */
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

    /**
     * Deletes a variable.
     * 
     * @name Navigation#Sidebar#deleteVariable
     * @function
     * @param {Variable} dataObj The variable to delete.
     * @param {HTMLElement} el The variable sidebar section item.
     */
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

    /**
     * Replace a name within a block of text.
     * 
     * @name Navigation#Sidebar#replaceNamesInText
     * @function
     * @param {string} text The text to replace inside.
     * @param {string} name The name to replace.
     * @param {string} newName The name to replace with.
     * @returns {string} The string with the replaced text.
     */
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
    /**
     * Get, rename, or delete all the references to the given event.
     * 
     * @name Navigation#Sidebar#eventsReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
              //et3dSimEv
              if (cur.Variable && cur.Variable == name) {
                if (del) {
                  cur.Variable = "";
                } else {
                  if (replaceName != null)
                    cur.Variable = replaceName;
                  refs.push(cur);
                }
              }
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
                      cur.lambda = del ? null : (replaceName !== null ? replaceName : name);
                  }
                  if (cur.time === name) {
                      cur.time = del ? null : (replaceName !== null ? replaceName : name);
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
            case "LogicTree":
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
                  if (model.StateList[i].ui_el) {
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

    /**
     * Get, rename, or delete all the references to the given action.
     * 
     * @name Navigation#Sidebar#actionsReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
            case "LogicTree":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }

    /**
     * Get, rename, or delete all the references to the given state.
     * 
     * @name Navigation#Sidebar#statesReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [delAll] Delete all occurrences of the state. 
     * @param {State} [delForState] Delete within the given state.
     * @param {Event} [delForEv] Delete within the given event.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
                if (replaceName != null)
                  cur.diagramName = replaceName;
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
            case "LogicTree":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }

    /**
     * Get, rename, or delete all the references to the given diagram.
     * 
     * @name Navigation#Sidebar#diagramsReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
                        cur.singleStates[j] = replaceName;
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
            case "LogicTree":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }

    /**
     * Get, rename, or delete all the references to the given logic node.
     * 
     * @name Navigation#Sidebar#logicNodesReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
                  if (del) {
                    cur.compChildren.splice(j, 1);
                  } else {
                    if (replaceName != null)
                      cur.compChildren[j] = replaceName;
                    refs.push(cur);
                  }

                }
              }
              break;
            case "LogicNode": //only LogicNode reference to a logicNode is itself
              if (cur.name == name) {
                if (replaceName != null) {
                  cur.name = replaceName;
                  if (model.LogicNodeList[i].ui_el) {
                    model.LogicNodeList[i].ui_el.innerText = replaceName;
                    model.LogicNodeList[i].ui_el.innerHTML = replaceName;
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
            case "State":
              //not applicable
              break;
            default:
          }
        }
      }

      return refs;
    }

    /**
     * Get, rename, or delete all the references to the given variable.
     * 
     * @name Navigation#Sidebar#variableReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
              if ((cur.name == name) && (replaceName != null)) {
                cur.name = replaceName;
                if (model.VariableList[i].ui_el) {
                  model.VariableList[i].ui_el.innerText = replaceName;
                  model.VariableList[i].ui_el.innerHTML = replaceName;
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

    /**
     * Get, rename, or delete all the references to the given ext sim.
     * 
     * @name Navigation#Sidebar#extSimsReferencing
     * @function
     * @param {Model} model General model to be searched.
     * @param {string} name Name of the item to find.
     * @param {string} type The item type.
     * @param {boolean} [del] If true, delete the reference from the item. Must be false for replace to work.
     * @param {string} [replaceName] Replaces the name of the found reference.
     * @returns {ExtSim[]|Variable[]|State[]|LogicNode[]|Event[]} All references not deleted.
     */
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
              if ((cur.name == name) && (replaceName != null)) {
                cur.name = replaceName;
                if (model.ExtSimList[i].ui_el) {
                  model.ExtSimList[i].ui_el.innerText = replaceName;
                  model.ExtSimList[i].ui_el.innerHTML = replaceName;
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
    /**
     * Check the number of times this action name is used within states.
     * 
     * @name Navigation#Sidebar#numberOfInstancesActions
     * @function
     * @param {string} name The name of the action.
     * @param {State[]} [states] States to search in. Will search all states if not provided.
     * @returns {number} The number of times the given name is used.
     */
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
    
    /**
     * Check the number of times this event name is used within states.
     * 
     * @name Navigation#Sidebar#numberofInstancesEvents
     * @function
     * @param {string} name The name of the event.
     * @param {State[]} [states] States to search in. Will search all states if not provided. 
     * @returns {number} The number of times the given name is used.
     */
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
    
    /**
     * Add a diagram to a sidebar section.
     * 
     * @name Navigation#Sidebar#addDiagramToSection
     * @function
     * @param {HTMLOListElement} ol The sidebar section element.
     * @param {Diagram} item The diagram to add.
     * @returns {HTMLUListElement} The sidebar section.
     */
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
					{ title: "Make Template", cmd: "Template" }
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
                var copyDataObj = ui.target.context.dataObject;
                this.editTemplateProperties(copyDataObj);
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

    /**
     * Adds states to a diagram in the UI.
     * 
     * @name Navigation#Sidebar#addStatesToDiagram
     * @function
     * @param {HTMLOListElement} ol The sidebar section element.
     * @param {Diagram} item States to add.
     * @returns {HTMLUListElement} The element containing the list of states.
     */
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
    /**
     * Adds a section item to a diagram.
     * 
     * @name Navigation#Sidebar#addDiagramSectionItem
     * @function
     * @param {HTMLDivElement} container The section element.
     * @param {Diagram[]} diagramList Diagrams to add to the section.
     */ 
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

    /**
     * Add a section item.
     * 
     * @name Navigation#Sidebar#addSectionItem
     * @function
     * @param {HTMLElement} container The element to add to.
     * @param {string} type The type of item to add.
     * @param {string} title The item title.
     * @param {object} data The item data.
     * @returns {HTMLElement} The section item element.
     */
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


    /**
     * Checks if the given value appears in the text of a list of nodes.
     * 
     * @name Navigation#Sidebar#checkSideBarNodes
     * @function
     * @param {NodeListOf<HTMLElement>} childNodes The nodes to search through.
     * @param {string} value The text value to find.
     * @returns {boolean} If the value appears in the nodes.
     */
    Sidebar.prototype.checkSideBarNodes = function (childNodes, value) {
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].innerText == value) {
          return false;
        }
      }
      return true;
    }


    /**
     * Gets the index of the sidebar item where the given text occurs.
     * 
     * @name Navigation#Sidebar#indexOfSideBarNode
     * @function
     * @param {NodeListOf<HTMLElement>} childNodes The nodes to search through.
     * @param {string} value The text value to find.
     * @returns {number} The index of the node where the text first occurs.
     */
    Sidebar.prototype.indexOfSideBarNode = function (childNodes, value) {
      var returnArray = childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].innerText == value || childNodes[i].innerHTML == value) {
          return i;
        }
      }
      return null;
    }


    /**
     * Checks if the given element is a local container.
     * 
     * @name Navigation#Sidebar#isLocalContainer
     * @function
     * @param {HTMLElement} container The element to check.
     * @returns {boolean} If the element is a local container.
     */
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

    /**
     * Assign the id from the sidebar.json.
     * 
     * @name Navigation#Sidebar#getLookup
     * @function
     * @param {HTMLElement} container The sidebar container.
     * @param {string} section The section type.
     * @param {string} id The ID.
     */
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
              if (item.LogicNode.name == item.LogicNode.rootName || !item.LogicNode.rootName) {
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

    /**
     * Called when local data is loaded.
     * 
     * @name Navigation#Sidebar#onLoadLocal
     * @function
     * @param {object} dataObject The local data object.
     */
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

    /**
     * Load the sidebar from WindowFrame.
     * 
     * @name Navigation#Sidebar#loadLocalFromwindow
     * @function
     * @param {Model} rootModel The root data model.
     */
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

    /**
     * Empties the local panel elements.
     * 
     * @name Navigation#Sidebar#emptyLocalPanels
     * @function
     */
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
    
    /**
     * Loads lookup content.
     * 
     * @name Navigation#Sidebar#loadContent
     * @function
     * @param {HTMLElement} container The container to load into.
     * @param {object} catInfo Lookup info.
     */
    Sidebar.prototype.loadContent = function (container, catInfo) {
      var lookup = this.getLookup(container, catInfo.title, catInfo.id);
    }

    /**
     * Gets the action variable list.
     * 
     * @name Navigation#Sidebar#getActionVariables
     * @function
     * @returns {Variable[]} The variable list.
     */
    Sidebar.prototype.getActionVariables = function () {
      var model = simApp.allDataModel;
      return model.VariableList;
    }

    /**
     * Marks that data has been modified, so the browser will prompt the user to save their changes before closing the page.
     * 
     * @name Navigation#Sidebar#notifyDataChanged
     * @function
     * @param {boolean} isModified If the data has been modified.
     */
    Sidebar.prototype.notifyDataChanged = function (isModified) {
      simApp.modelChanged = isModified;
    }

    /**
     * Saves the project.
     * 
     * @name Navigation#Sidebar#saveProject
     * @function
     */
    Sidebar.prototype.saveProject = function () {
      simApp.mainApp.saveProject();
    }


    return Sidebar;
  })(Object);
  Navigation.Sidebar = Sidebar;
})(Navigation || (Navigation = {}));
