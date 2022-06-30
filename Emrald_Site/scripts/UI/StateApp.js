// Copyright 2021 Battelle Energy Alliance

/* This files handles the states within a diagram , this will deal with what information is being displayed on a diagram*/

"use strict";
var StateApp = (function (global, _super) {
  __extends(StateApp, _super);
  function StateApp(content) {
    _super.apply(this, arguments);
    global.mainApp = this;
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false);
    }
    else {
      this.isLoading = false;
      this.graph = new mxGraph(content);
      this.Initialize(this.graph);
      //this.initCellEditing();

      this.graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
        var edge = evt.getProperty('cell');
        var cell = this.graph.getModel().getTerminal(edge, true);
        var moveFromCur = false;

        if (cell.parent && cell.parent.value && cell.parent.value.State) {
          var stateParent = cell.parent.value.State;
          for (var j = 0; j < stateParent.eventActions.length; j++) {
            if (stateParent.eventActions[j]) {
              for (var k = 0; k < stateParent.eventActions[j].actions.length; k++) {
                //var curActName = stateParent.eventActions[j].actions[k];
                if (edge.value.name.startsWith(stateParent.eventActions[j].actions[k])) {
                  moveFromCur = stateParent.eventActions[j].moveFromCurrent;
                  break;
                }
              }
            }
          }
        }
        if (!moveFromCur) {
          var style = this.graph.getCellStyle(edge);
          style.strokeColor = "green";
          style.dashed = 1;
          edge.style = style;
        }

      });

      if (this.InitContextMenu)
        this.InitContextMenu(content, this.graph);

      if (this.InitializeStyle)
        this.InitializeStyle(this.graph);

      //this.loadGraph();

      // this.EnableDebugViewer();
    }

  }; // end constructor

  StateApp.prototype.LoadData = null;
  StateApp.prototype.InitializeStyle = null;
  //--------------------------------------------------
  StateApp.prototype.Initialize = function (graph) {
    //make grouping children stay in its parent, anot allow parent to accommodate moving away children.
    graph.constrainChildren = true;
    graph.extendParents = false;
    graph.extendParentsOnAdd = false;
    graph.border = 10;

    // Uncomment the following if you want the container, auto grow the container.
    // to fit the size of the graph
    //this.graph.setResizeContainer(true);

    graph.setMultigraph(false);

    // Stops editing on enter or escape keypress
    var keyHandler = new mxKeyHandler(graph);

    // Enables rubberband selection
    new mxRubberband(graph);

    graph.setCellsSelectable(true);

    // Overrides method to disallow edge label editing
    graph.isCellEditable = function (cell) {
      return !graph.getModel().isEdge(cell);
    };

    // Workaround for Internet Explorer ignoring certain styles
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = 'hidden';
      new mxDivResizer(this.mainContainer);
    }
  }

  //----------------------------------------------------
  //this func is use for testing only.
  StateApp.prototype.Testdata = '';
  StateApp.prototype.loadGraph = function (dataStr) {

    if (!dataStr)
      dataStr = this.Testdata;

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = this.graph.getDefaultParent();

    // Adds cells to the model in a single step
    this.graph.getModel().beginUpdate();
    try {
      dataStr = null;
      if (dataStr) {
        var doc = mxUtils.parseXml(dataStr);
        var enc = new mxCodec(doc.documentElement.ownerDocument);
        enc.decode(doc.documentElement, this.graph.getModel());
      }
      else {
        //TODO: create cells here.
        if (this.LoadData) {
          this.LoadData(this.graph, parent);
        }
      }
    }
    finally {
      // Updates the display
      this.graph.getModel().endUpdate();
    }
  }

  //--------------------------------------------------
  StateApp.prototype.initCellEditing = function () {
    var _this = this;
    // Overrides method to disallow edge label editing
    this.graph.isCellEditable = function (cell) {
      return !this.getModel().isEdge(cell);
    };

    // Overrides method to provide a cell label.
    var graphconvertValueToString = this.graph.convertValueToString;
    this.graph.convertValueToString = function (cell) {
      if (cell.value) {
        if (cell.value instanceof RiskSim.VertexModel)
          return cell.value.getName();
      }
      return graphconvertValueToString.apply(this, arguments);
    };

    //// Adds a special tooltip for edges
    this.graph.setTooltips(true);

    var getTooltipForCell = this.graph.getTooltipForCell;
    this.graph.getTooltipForCell = function (cell) {
      // Adds some relation details for edges
      if (this.getModel().isEdge(cell)) {
        var srcCell = this.getModel().getTerminal(cell, true);
        var trgCell = this.getModel().getTerminal(cell, false);
          if (srcCell) {
              var src = this.getLabel(srcCell);
              var type = classNameOf(srcCell.value);
          }
          else {
              var src = "";
              var type = "";
          }
        if (trgCell)
          var trg = this.getLabel(trgCell);
        else
          var trg = "";

        return src + ': ' + type + ' for ' + trg;
      }
      else if (cell.value instanceof RiskSim.VertexModel) {
        //return getTooltipForCell.apply(this, arguments);
        return cell.value.getTooltip();
      } else {
        return getTooltipForCell.apply(this, arguments);// cell.value;
      }
    };

    // Implements a properties panel that uses
    // mxCellAttributeChange to change properties
    this.graph.getSelectionModel().addListener(mxEvent.CHANGE, function (sender, evt) {
      this.cellHandler.selectionChanged(this.graph, evt);
    }.bind(this));
  };
  //-----------------------------------------------------------
  StateApp.prototype.EnableDebugViewer = function () {
    //debug view the XML
    var _this = this;

    var button = mxUtils.button('View XML', function () {
      var encoder = new mxCodec();
      var node = encoder.encode(_this.graph.getModel());

      //var modalview = new CreateModalPopUpObject();
      //modalview.ShowMessage("hello", 200, 200, mxUtils.getPrettyXml(node));

      mxUtils.popup('Graph XML', mxUtils.getPrettyXml(node), true, true);
    });

    var toolbar = document.getElementById('mainToolbar');
    if (toolbar) {
      toolbar.appendChild(button);
    }
    else
      document.body.insertBefore(button);
  }

  //id - events.Event.id
  StateApp.prototype.getEventAction = function (actionId) {
    var actionEvent = null;
    var parent = this.graph.getDefaultParent();
    var actions = parent.value.ActionList;
    for (var i = 0; i < actions.length; i++) {
      var action = actions[i];
      if (action && action.Action.id == actionId) {
        actionEvent = action;
        break;
      }
    }
    return actionEvent;
  }
  //------------------------------------
  //construct a complete tree from the model, for constructing the mxgraph diagram 
  //structure, because the model is not a true hierarchical tree structure.

  //Note: the tree structure is stored within the main model as iActions and iEvents,
  //but are excluded when the model is extract to be saved.

  StateApp.prototype.createTreeStructure = function (diagram) {
    var i = 0;
    for (i = 0; i < diagram.StateList.length; i++) {
      var stateObj = diagram.StateList[i];
      var state = stateObj.State;
      stateObj.dataType = 'state';
      stateObj.iActions = [];
      for (var j = 0; j < state.immediateActions.length; j++) {
        var act1 = mainApp.graph.getStateAction(state.immediateActions[j]);
        if (act1) {
          var act = { name: state.immediateActions[j], value: act1.Action, dataType: 'actions', itemId: j, actionId: -1 };
          stateObj.iActions.push(act);
        }

      }

      stateObj.iEvents = [];
      for (var j = 0; j < state.events.length; j++) {
        var evt1 = mainApp.graph.getStateEvent(state.events[j]);
        if (evt1) {
          var evt = { name: state.events[j], value: evt1.Event, dataType: 'events' };
          stateObj.iEvents.push(evt);
          evt.eActions = [];
          var evtAct = state.eventActions[j];
          if (evtAct) {
            for (var k = 0; k < evtAct.actions.length; k++) {
              var act1 = mainApp.graph.getStateAction(evtAct.actions[k]);
              if (act1) {
                var act = { name: evtAct.actions[k], value: act1.Action, dataType: 'actions', itemId: j, actionId: k };
                evt.eActions.push(act);
              }
            }
          }
        }
      }
    };
  }
  //------------------------------------
  //The main entry function to define the graph.  
  //stateModel - a complete diagram data model.
  StateApp.prototype.LoadData = function (graph, parent, stateList) {

    // either create a callback function for the cell or subscribe to the LOAD_DATA as below.
    //var handleLoadData = function (model, parentCell) {

    //}
    //subscribe to LOAD_DATA event on the graph.  When the Action and Event data model is created, it will 
    //fire this message.

    //Create each state box at a proper location and size.
    if (!stateList) return;
    var model = graph.getModel();
    model.beginUpdate();
    try {
      for (var i = 0; i < stateList.length; i++) {
        var astate = stateList[i];
        if (astate.State && astate.State.geometry)
          var geo = JSON.parse(astate.State.geometry.replace('x', '"x"').replace('y', '"y"').replace('width', '"width"').replace('height', '"height"'));
        else
          var geo = { x: 20, y: 20, width: 200, height: 100 };
        var stateCell = graph.insertVertex(parent, astate.State.id, astate, geo.x, geo.y, geo.width, geo.height, 'shape=StateShape');
        astate.ownerCell = stateCell;
      }
    }
    finally {
      model.endUpdate();
    }

    //The connection edge has to be done in a separate step, because the actions table hasn't
    //created yet.  
    model.beginUpdate();
    try {
      //create connection edges
      var cells = graph.getModel().cells;
      for (var i in cells) {
        var cell = cells[i];
        var state = cell.value;

        //for all state shap cells
        if (state && state.dataType == "state") {
          var ias = state.iActions;
          var evts = state.iEvents;
          var actCell = state.actionCell;
          var evtCell = state.eventCell;

          //create connection edges for immediateAction
          ias.forEach(function (actObj) {
            var act = actObj.value;
            if (act && act.newStates) {
              for (var n = 0; n < act.newStates.length; n++) {
                var ns = deepClone(act.newStates[n]);
                ns.linkState = act.newStates[n];
                ns.dataType = "NewStates";
                ns.baseDataType = 'actions';
                ns.sourceRow = n;
                ns.itemId = actObj.itemId;
                ns.actionId = actObj.actionId;
                ns.targetRow = -1;
                var targetCell = graph.getCellByStateName(ns.toState);
                if (targetCell) {
                  ns.name = act.name + ' -> ' + targetCell.value.State.name;
                  //insert green line
                  if (act.actType == "atTransition") {
                    var edge = graph.insertEdge(parent, null, null, actCell, targetCell, 'dashed=1;fontColor=#1E8449 ;strokeColor=#1E8449;');
                    edge.value = ns;
                  }
                  else {
                    var edge = graph.insertEdge(parent, null, null, actCell, targetCell, 'dashed=0;fontColor=black ;strokeColor=black;');
                    edge.value = ns;
                  }
                }
              }
            }
          });

          //create connection edge for Events
          //NOTE: Events and eventActions MUST have the same number elements and a one-to-one relation
          for (var n = 0; n < evts.length; n++) {
            var anEvt = evts[n].value;
            if (anEvt) {
              var evtAct = evts[n];
              for (var m = 0; m < evtAct.eActions.length; m++) {
                var act = evtAct.eActions[m].value;
                var action = evtAct.eActions[m];
                if (act.newStates && act.newStates.length > 0) {
                  for (var p = 0; p < act.newStates.length; p++) {
                    var ns = deepClone(act.newStates[p]);
                    ns.linkState = act.newStates[p];
                    ns.dataType = "NewStates";
                    ns.baseDataType = 'events';
                    ns.itemId = action.itemId;
                    ns.actionId = action.actionId;
                    ns.sourceRow = m;
                    ns.targetRow = -1;
                    var targetCell = graph.getCellByStateName(ns.toState);
                    if (targetCell) {
                      ns.name = act.name + ' -> ' + targetCell.value.State.name;
                      //Add a green dashed line
                      if (state.State.eventActions[n].moveFromCurrent != true) {
                        var edge = graph.insertEdge(parent, null, null, evtCell, targetCell, 'dashed=1;fontColor=#1E8449 ;strokeColor=#1E8449;');
                        edge.value = ns;
                      }
                      //add a normal black line
                      else {
                        var edge = graph.insertEdge(parent, null, null, evtCell, targetCell, 'dashed=0;fontColor=black ;strokeColor=black;');
                        edge.value = ns;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    finally {
      model.endUpdate();
      //The create graph functions share the same function for resize/update/move notification.
      //during which it notifies the sidebar that something was changed. When we finish creating 
      // the graph, We need to reset this back to not yet modified: false.
      graph.getDefaultParent().value.modelChanged = false;
      var sb = graph.getDefaultParent().value.sidebar;
      if (sb)
        sb.notifyDataChanged(false);
    }
  }
  //------------------------------------
  //adds a new state to both diagram and sidebar
  StateApp.prototype.addNewState = function (graph, X, Y) {
    MessageBox.prompt("New State", "Please type in a state name.", "State1",
      function (dialog, newName, closeStatus, evt) {
        var ok = false;
        if (closeStatus == "OK") {
          var parent = graph.getDefaultParent();
          var model = parent.value;
          if (model.sidebar && !model.sidebar.existsStateName(newName)) {

            var width = 200;
            var m1 = {
              dataType: "state",
              State: {
                id: -1, name: newName, desc: "", stateType: "stStandard",
                diagramName: model.DiagramList[0].Diagram.name,
                immediateActions: [],
                events: [],
                eventActions: [],
                geometry: { x: X, y: Y, width: 200, height: 100 }
              },
              iActions: [],
              iEvents: []
            };
            model.sidebar.addNewLocalState(m1); //This add to the mainModel.
            model.StateList.push(m1); //This add to the diagram model which only local.
            model.DiagramList[0].Diagram.states.push(m1.State.name); //add the state name to the diagram's state list.

            var v1 = graph.insertVertex(parent, null, m1, X, Y, width, 200, 'shape=StateShape');
            ok = true;
          }
          else {
            MessageBox.alert("New State", "A state named '" + newName + "' exists, please choose another name.");
          }
        }
        return ok || closeStatus == "Cancel";
      });
  }
  //------------------------------------
  // delete a state from both diagram and sidebar


  StateApp.prototype.editActionProperties = function (cell, dataObj, parent, evtName) {
    var url = 'EditForms/ActionEditor.html';
    var actionName = dataObj.name;
    var graph = mainApp.graph;
    var root = graph.getDefaultParent().value;
    var sb = root.sidebar;
    if (cell.parent && cell.parent.value && cell.parent.value.State) {
      var stateParent = cell.parent.value.State;
      for (var j = 0; j < stateParent.eventActions.length; j++) {
        if (stateParent.eventActions[j]) {
          for (var k = 0; k < stateParent.eventActions[j].actions.length; k++) {
            if (stateParent.eventActions[j].actions[k] == dataObj.name) {
              dataObj.moveFromCurrent = stateParent.eventActions[j].moveFromCurrent;
              break;
            }
          }
        }
      }
    }
    dataObj.tempVariableList = sb.getActionVariables();
    dataObj.tempExtSimList = sb.getExtSimList();
    var wnd = mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn in SetOf(['OK', 'Ok', 'Save As New'])) {
          var asNew = (btn === 'Save As New');
          var existing = !parent;
          if (asNew && (dataObj.id == retObj.id)) { //reset the ID if it is to be saved as a new item
            retObj.id = -1;
          }
          root.modelChanged = true;
          var sb = graph.getDefaultParent().value.sidebar;
          if (sb) {
            //if invalid prob (i.e. p>=1 or p<=0 and not -1 or blank ) show error Message
            var newStatesArray = retObj.newStates;
            if (newStatesArray && newStatesArray.length > 0) {
              for (var i = 0; i < newStatesArray.length; i++) {
                var p = newStatesArray[i].prob;
                if ((p > 1 || p < 0) && (p != -1) && (p != "")) {
                  MessageBox.show("Edit Action", "The action probability must between 0 and 1 or -1/ blank to set to be the remainder. Please enter a valid probability.");
                  return false;   //should prevent the editor from closing.
                }

              }
            }
            // update variables
            if (retObj.updateVariables) {
              retObj.updateVariables.forEach((variable) => {
                sb.replaceNames(variable.name, variable.name, "Variable", null, true);
              });
            }
            //TODO make this if statement cleaner (i.e. w/ function)
            if (actionName !== retObj.name && (retObj.name != "Goto_Action" && retObj.name.trim() != "")) {
              //if parent is passed in, it means add new action.
              if (!existing || asNew) {
                if (retObj.id == -1) {
                  retObj.id = getDefaultActionID(sb);
                }
                var newAction = { Action: retObj };
                //add new event object to the main model.
                if (!sb.addNewLocalAction(newAction, parent, cell.value.dataType == "actions")) {
                  MessageBox.show("New Action", "The action name '" + retObj.name + "' exists, please enter new name.");
                  return false;   //should prevent the editor from closing.
                }
                root.ActionList.push(newAction);
                var ac = null;
                var ac = { name: newAction.Action.name, value: newAction.Action, dataType: "actions", itemId: 0, actionId: -1 };
                if (!asNew) {//since the diagram maintains a "true" tree structure of the model for drawing purpose, we will need
                  //to add the this tree and update the cell.
                  if (cell.value.dataType == 'actions') {
                    //cell is the Immediate Action header.
                    var idx = cell.value.items.push(ac);
                    ac.itemId = getDefaultActionID(sb);
                    ac.actionId = idx;
                  }
                  else if (evtName) { //cell must be the EventAction Event header.
                    var item = null;
                    for (var i = 0; i < cell.value.items.length; i++)
                      if (cell.value.items[i].name == evtName) {
                        item = cell.value.items[i];
                        break;
                      }
                    if (item) {
                      var idx = item.eActions.push(ac);
                      ac.itemId = getDefaultActionID(sb);
                      ac.actionId = idx;
                    }
                  }
                }
              }
              else {
                //when parent is not passed in, it is an edit only.
                sb.replaceActionName(actionName, retObj.name);
                //tell the mainModel that there is something modified.
                sb.notifyDataChanged(true);
              }
            }


            //if actionName is default (i.e. Goto_Action) display an error message
            else if (retObj.name == "Goto_Action") {
              MessageBox.show("New Action", "The action name '" + retObj.name + "' is invalid, please enter new name.");
              return false; //should prevent the editor from closing.
            }
            //if actionName is empty display an error message
            else if (retObj.name.trim() == "") {
              MessageBox.show("New Action", "The action name can not be left blank, please enter new name.");
              return false; //should prevent the editor from closing.
            }

          }
          var foundCells = [];
          //Look for all StateShape that has this action and invalidate them too.
          var model = graph.getDefaultParent().value;
          for (var i = 0; i < model.StateList.length; i++) {
            var st = model.StateList[i].State;
            if (st.immediateActions) {
              for (var j = 0; j < st.immediateActions.length; j++) {
                if ((asNew && (st.immediateActions[j] == actionName)) || (st.immediateActions[j] == retObj.name)) {
                  if (asNew)
                    st.immediateActions[j] = retObj.name;
                  var stCell = graph.getCellByStateName(st.name);
                  if (foundCells.indexOf(stCell) < 0)
                    foundCells.push(stCell);
                }
              }
            }
            if (st.eventActions) {
              for (var j = 0; j < st.eventActions.length; j++) {
                var ea = st.eventActions[j];
                if (ea.actions)
                  for (var k = 0; k < ea.actions.length; k++) {
                    if ((asNew && (ea.actions[k] == actionName)) || (ea.actions[k] == retObj.name)) {
                      if (asNew)
                        ea.actions[k] = retObj.name;
                      var stCell = graph.getCellByStateName(st.name);
                      if (foundCells.indexOf(stCell) < 0)
                        foundCells.push(stCell);
                    }
                  }
              }
            }
          }

          if (foundCells.length > 0) {
            for (var i = 0; i < foundCells.length; i++) {
              //must call both to update cell.
              graph.view.invalidate(foundCells[i], false, true);
              graph.view.validate(foundCells[i]);
            }
          }
          else {
            graph.view.invalidate(cell, false, true);
            graph.view.validate(cell);
          }

        }
        delete dataObj.tempVariableList;
        delete dataObj.tempExtSimList;
        return true;
      }.bind(this),
      dataObj,
      true, //ismodal
      null,
      null,
      500, //width
      400 //height
    );
  }
  // to ensure that there are no duplicate IDS it will get next available action id
  //------------------------------------
  var getDefaultActionID = function (sidebar) {
    var maxID = 0;
    var ActionList = sidebar.ActionList;
    for (var i = 0; i < ActionList.length; i++) {
      if (ActionList[i].Action.id > maxID) {
        maxID = ActionList[i].Action.id;
      }
    }
    return (maxID + 1);
  }
  //------------------------------------
  //parent is the EventList.
  //NOTE: Parent the provide only when new event is create.  Parent will be null if edit existing properties.
  StateApp.prototype.editEventProperties = function (cell, dataObj, parent) {
    var url = 'EditForms/EventEditor.html';
    var evtName = "";
    var isNewEv = parent != null;
    if (!parent) {
      var evtName = dataObj.name;
      parent = cell.value;
    }

    var graph = mainApp.graph;
    var model = graph.getDefaultParent().value;

    var vars = model.VariableList;
    var varList = [];
    for (var i = 0; i < vars.length; i++) {
      varList.push(vars[i].Variable);
    }
    dataObj.tempVariableList = varList;

    if (cell.parent && cell.parent.value && cell.parent.value.State) {
      var stateParent = cell.parent.value.State;
      for (var j = 0; j < stateParent.events.length; j++) {
        if (stateParent.events[j] == dataObj.name) {
          dataObj.moveFromCurrent = (stateParent.eventActions[j] == null) ? false : stateParent.eventActions[j].moveFromCurrent;
          break;
        }
      }
    }
    if (!dataObj.moveFromCurrent) {
      dataObj.moveFromCurrent = false;
    }
    var nodeList = model.LogicNodeList;
    var logicNodes = [];
    var ln;
    for (var i = 0; i < nodeList.length; i++) {
      ln = nodeList[i].LogicNode;
      if (ln.rootName === ln.name)
        logicNodes.push(ln);
    }
    dataObj.tempLogicTopList = logicNodes;
    if (!dataObj.varNames) {
      dataObj.varNames = [];
    }
    mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn in SetOf(['OK', 'Ok', 'Save As New'])) {
          var asNew = (btn === 'Save As New');
          /*if (retObj.evType == "etVarCond" && retObj.varNames.length < 1) {
              MessageBox.show("Warning!", "Warning, you have checked none of the variables, if you used any variables please check the appropriate variables.");
          }*/
          //var graph = mainApp.graph;
          //var model = graph.getDefaultParent().value;
          model.modelChanged = true;
          var sb = model.sidebar;
          if (sb) {
            if (retObj.name !== evtName) {
              if (isNewEv || asNew) {
                var newObj = retObj;
                delete newObj.tempVariableList;
                delete newObj.tempLogicTopList;
                var newEvent = { Event: newObj };
                if (!sb.addNewLocalEvent(newEvent, parent, asNew)) { // if state name already exists
                  MessageBox.show("New Event", "The event name '" + retObj.name + "' exists, please enter a different name.");
                  return false;  //prevent editor window close.
                }
                //added state successfully 
                model.EventList.push(newEvent);

                if (isNewEv) {//a new event so add visually also
                  var stateParent = cell.parent.value.State;
                  sb.addNewEmptyEventAction(stateParent);
                  var ev = { name: newEvent.Event.name, value: newEvent.Event, dataType: "events", eActions: [] };
                  cell.value.items.push(ev);
                }
              } else { //existing item so just replace data.
                sb.replaceEventName(evtName, retObj.name);
                //tell the mainModel that there is something modified.
                sb.notifyDataChanged(true);
              }
              if (isNewEv || asNew) {//replace item if visually if either existing and "save as new"
                if (cell.value.items && cell.value.items.length > 0) {
                  for (var i = 0; i < cell.value.items.length; i++) {
                    if (cell.value.items[i].name == evtName) {
                      cell.value.items[i].name = retObj.name;
                      if (cell.value.items[i].Event)
                        cell.value.items[i].Event = retObj;
                      cell.value.items[i].value = retObj;
                    }
                  }
                }
              }
            }
          }

          var foundCells = [];

          //if (asNew) { //if existing item use current name
          //  for (var i = 0; i < cell.value.items.length; i++) {
          //    if (cell.value.items[i].name == 

          //}
          //else { //Search through the diagram's model for the modified share event references and update the state's cell content.
          for (var i = 0; i < model.StateList.length; i++) {
            var st = model.StateList[i].State;
            if (st.events) {
              for (var j = 0; j < st.events.length; j++) {
                var foundIdx = false;
                if (asNew) { //update the state's reference to the new object
                  if ((model.StateList[i].iEvents[j].name == retObj.name) &&
                    (st.events[j] == evtName)) {
                    foundIdx = true;
                    st.events[j] = retObj.name;
                  }
                }
                else {
                  if (st.events[j] == retObj.name) {
                    foundIdx = true;
                  }
                }
                if (foundIdx) {
                  var stCell = graph.getCellByStateName(st.name);
                  if (st.eventActions[j]) {
                    st.eventActions[j].moveFromCurrent = retObj.moveFromCurrent;
                  }
                  if (foundCells.indexOf(stCell) < 0)
                    foundCells.push(stCell);
                }
              }
            }
          }
          //}

          for (var i = 0; i < foundCells.length; i++) {
            //must call both to update cell.
            graph.view.invalidate(foundCells[i], false, true);
            graph.view.validate(foundCells[i]);
          }
          //when we are done, remove the temp lists.
          delete dataObj.tempVariableList;
          delete dataObj.tempLogicTopList;
          return true;
        }
        //when we are done, remove the temp lists.
        delete dataObj.tempVariableList;
        delete dataObj.tempLogicTopList;
        return true;
      }.bind(this),
      dataObj,
      true, //ismodal
      null,
      null,
      450, //width
      300 //height
    );
  }
  //------------------------------------
  StateApp.prototype.editLinkProperties = function (cell, dataObj) {
    var url = 'EditForms/LinkEditor.html';
    mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn === 'OK') {
          var graph = mainApp.graph;
          var model = graph.getDefaultParent().value;
          model.modelChanged = true;
          var sb = model.sidebar;
          cell.value.prob = +retObj.prob / 100;
          cell.value.desc = retObj.desc;
          if (sb) {
            var p = retObj.prob;
            if ((p >= 1 || p <= 0) && (p != -1) && (p != "")) {
              MessageBox.show("Edit Link", "The probability must between 0 and 1 or -1/ blank to set to be the remainder. Please enter a valid probability.");
              return false;   //should prevent the editor from closing.
            }
            sb.notifyDataChanged(true);
          }

          graph.view.invalidate(cell, false, true);
          graph.view.validate(cell);
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

  }
  //------------------------------------
  StateApp.prototype.editStateProperties = function (stateCell, graph) {
    var stateApp = this;
    function makeEdgeGreen(edge) {
      var eParent = edge.parent;
      var eId = edge.id;
      var eValue = edge.value;
      var eSource = edge.source;
      var eTarget = edge.target;
      graph.removeCells([edge], true);
      var newedge = graph.insertEdge(eParent, eId, eValue, eSource, eTarget, 'dashed=1;fontColor=#1E8449 ;strokeColor=#1E8449;');
    }
    function makeEdgeBlack(edge) {
      var eParent = edge.parent;
      var eId = edge.id;
      var eValue = edge.value;
      var eSource = edge.source;
      var eTarget = edge.target;
      graph.removeCells([edge], true);
      var newedge = graph.insertEdge(eParent, eId, eValue, eSource, eTarget, 'dashed=0;fontColor=black ;strokeColor=black;');
    }
    var url = "EditForms/StateEditor.html";
    var sModel = stateCell.value.State;
    sModel.sidebar = graph.getDefaultParent().value.sidebar;
    var stateName = sModel.name;
    mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn === 'OK') {
          var edges = stateCell.value.eventCell.edges;
          if (edges) {
            for (var i = 0; i < edges.length; i++) {
              for (var j = 0; j < edges[i].source.value.items.length; j++) {
                var edgeSourceName = edges[i].source.value.items[j].name;
                var indxEvent = retObj.events.indexOf(edgeSourceName);
                if (indxEvent > -1) {
                  if (!retObj.eventActions[indxEvent].moveFromCurrent) {
                    //This will just change the graphics until reload sets the graphics to display correctly
                    makeEdgeGreen(edges[i]);
                  }
                  else {
                    makeEdgeBlack(edges[i]);
                  }
                }
              }

            }
          }
          graph.getDefaultParent().value.modelChanged = true;
          var sb = graph.getDefaultParent().value.sidebar;
          if (sb) {
            if (stateName !== retObj.name)
              sb.replaceStateName(stateName, retObj.name);
            sb.notifyDataChanged(true);
          }

          //State is unique per diagram, so there shouldn't be anything else to update.
          graph.view.invalidate(stateCell, false, true);
          graph.view.validate(stateCell);

        }
        sModel.sidebar = undefined;
        return true;
      },
      sModel,
      true, //ismodal
      null,
      null,
      450, //width
      300 //height
    );
  }
  //------------------------------------
  StateApp.prototype.editDiagramProperties = function (cell, graph) {
    var url = 'EditForms/DiagramEditor.html';
    var parent = graph.getDefaultParent();
    var dModel = parent.value.DiagramList[0].Diagram;
    var diagramName = dModel.name;
    var sb = mainApp.graph.getDefaultParent().value.sidebar;
    dModel.changeDiagramType = sb.editDiagramType;
    mxWindow.createFrameWindow(
      url,
      'OK, Cancel',  //command buttons
      'minimize, maximize, close', //top buttons
      function (btn, retObj) {
        if (btn === 'OK') {
          graph.getDefaultParent().value.modelChanged = true;
          if (sb) {
            if (diagramName !== retObj.name) {
              sb.replaceDiagramName(diagramName, retObj.name);
              if (typeof UpdateFrameTitle == "function") {
                UpdateFrameTitle("Diagram: " + retObj.name);
              }
            }
            sb.notifyDataChanged(true);

          }

          if (cell) {
            graph.view.invalidate(cell, false, true);
            graph.view.validate(cell);
          }
        }
        return true;
      },
      dModel,
      true, //ismodal
      null,
      null,
      450, //width
      250 //height
    );
  }
  //------------------------------------
  //Not sure if this even ever used (not positive so never deleted it)
  StateApp.prototype.editProperties = function (cell, graph, evt, isSelected) {
    if (isSelected) {
      //a state is selected, edit state properties.
      var cells = graph.getSelectionCells();
      if (cells && cells.length > 0) {
        var cell = cells[0]
        if (cell.isEdge()) {
          this.editLinkProperties(cell, cell.value, function onChanged(retData) {
            cell.value = retData;
          });
        }
        else {
          this.editStateProperties(cell, graph);
        }
      }
      else {
        alert("mxGraph Error:  unable to get the selected cell to edit. ");
      }
    }
    else {
      //no state selected, edit diagram properties.
      this.editDiagramProperties(cell, graph);
    }
  }
  //------------------------------------
  //Returns the value of an event action
  StateApp.prototype.getEventActionData = function (state, iid, aid) {
    var foundData = null;
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].eActions) {
        var eActs = state.items[i].eActions;
        for (var j = 0; j < eActs.length; j++) {
          if (eActs[j].itemId == iid && eActs[j].actionId == aid) {
            foundData = eActs[j].value;
            break;
          }
        }
      }
      if (foundData)
        break;
    }
    return foundData;
  }
  //------------------------------------
  //returns the value of an immediate action
  StateApp.prototype.getImmediateActionData = function (state, iid) {
    var foundData = null;
    for (var i = 0; i < state.items.length; i++) {
      var act = state.items[i];
      if (act.itemId == iid) {
        foundData = act.value;
        break;
      }
    }

    return foundData;
  }

  //------------------------------------
  StateApp.prototype.removeEdge = function (cell, graph) {
    if (!cell || !graph) return;
    var okToRemove = false;
    var sourceData = cell.source.value;
    var targetData = cell.target.value;
    var itemId = cell.value.itemId;
    var actionId = cell.value.actionId;
    //Getting the source item's data object off which the edge is connecting from.
    if (sourceData.dataType == "events")
      var actionData = this.getEventActionData(sourceData, itemId, actionId);
    else if (sourceData.dataType == "actions")
      var actionData = this.getImmediateActionData(sourceData, itemId);

    if (actionData && actionData.newStates) {
      //if the source data object actually contains a link to "newStates"
      var idx = -1;
      for (var i = 0; i < actionData.newStates.length; i++) {
        if (actionData.newStates[i].toState == targetData.State.name) {
          idx = i;
          break;  //There should only be one edge between source and target
        }
      }

      //Remove the edge data object from the state's action item (event or immediate action).
      if (idx >= 0 || actionData.newStates.length > 0) {
        actionData.newStates.splice(idx, 1);
        okToRemove = true;
      }
    }

    //remove the edge from screen view.
    if (okToRemove)
      graph.removeCells([cell], true);
  }
  //------------------------------------
  StateApp.prototype.removeState = function (graph, evt) {

    //now remove the visual only info here and call sideBar to remove the data model pieces
    var cells = graph.getSelectionCells();
    var sidebar = graph.getDefaultParent().value.sidebar;
    if (cells && sidebar) {
      cells.forEach(function (cell) {
        if (cell.value && cell.value.State) {
          //remove the items from the data model
          var aState = cell.value.State;
          if (aState)
            sidebar.deleteState(aState);
          if (cell.value)
            cell.value.ui_el;
        }
      });

      //remove the visual
      graph.removeCells(cells, true);
    }
  }
  //------------------------------------
  StateApp.prototype.removeEvent = function (selCell, eventName, graph, fullDelete) {
    //find and remove visual model items only, call sidebar to remove data model items.
    var graph = this.graph;
    var dataObj;
    var changed = false;
    //Remove all the visual stuff only!
    //collect all the array references and edges to be removed
    var sidebar = graph.getDefaultParent().value.sidebar;
    if (!sidebar)
      return;

    var selState = selCell.value.State;
    var states = sidebar.getStateDataObjectsForDiagram(null, selState.diagramName);
    for (var sIdx = 0; sIdx < states.length; sIdx++) {
      var curState = states[sIdx];
      if (fullDelete || ((selState.name == curState.State.name))) {
        var tempActionsList = [];
        if (curState.iEvents) {
          for (var i = 0; i < curState.iEvents.length; i++) {
            if (curState.iEvents[i].name == eventName) {
              for (var j = 0; j < curState.iEvents[i].eActions.length; j++) {
                dataObj = curState.iEvents[i].eActions[j];
                tempActionsList.push(dataObj);
              }
            }
          }
        }

        //any edge connected from this event's actions, remove them all.
        if (curState.eventCell && curState.eventCell.edges) {
          for (var i = 0; i < curState.eventCell.edges.length; i++) {
            for (var j = 0; j < tempActionsList.length; j++) {
              if (curState.eventCell.edges[i].value.name.indexOf(tempActionsList[j].name + " -> ") > -1) {
                //this.removeEdge(curState.eventCell.edges[i], graph);
                graph.removeCells([curState.eventCell.edges[i]], true);
                changed = true;
              }
            }
          }
        }
      }

      //remove the action in the event action list from the View's model.
      if (curState.iEvents) {
        for (var i = 0; i < curState.iEvents.length; i++) {
          if (curState.iEvents[i].name == eventName) {
            for (var j = 0; j < curState.iEvents[i].eActions.length; j++) {
              dataObj = curState.iEvents[i].eActions[j];
              curState.iEvents[i].eActions.splice(j, 1);
              changed = true;
              curState.ui_el.remove();
            }
          }
        }
        //remove the event from the View's model.
        for (var i = 0; i < curState.iEvents.length; i++) {
          if (curState.iEvents[i].name == eventName) {
            dataObj = curState.iEvents[i];
            curState.iEvents.splice(i, 1);
            changed = true;
            curState.ui_el.remove();
            break;
          }
        }
      }
    }

    //Now delete any action(s) associated with the event
    sidebar.deleteEvent(dataObj, fullDelete, selState);

    //Save th index and delete all of the actionevents that are associated with it
    //i.e. pass them on to deleteAction or whatever
    if (changed) {
      this.graph.view.invalidate(selCell, false, true);
      this.graph.view.validate(selCell);
    }
  }
  //------------------------------------
  StateApp.prototype.removeAction = function (selCell, actionName, eventName, graph, fullDelete) {
    graph = this.graph;
    var dataObj;
    var el;
    //Remove all the visual stuff only!
    //collect all the array references and edges to be removed
    var edgeList = [];
    var cell;
    var sidebar = graph.getDefaultParent().value.sidebar;
    if (!sidebar)
      return;

    var selState = selCell.value.State;
    var states = sidebar.getStateDataObjectsForDiagram(null, selState.diagramName);
    for (var sIdx = 0; sIdx < states.length; sIdx++) {
      var curState = states[sIdx];

      //add immediate items to the remove lists if deleting all or it is the selected state and the immediate action is selected
      if (fullDelete || ((selState.name == curState.State.name) && ((eventName == "Immediate Actions")))) {
        //add to the immediate actions edges for later removal
        if (curState.actionCell.edges) {
          for (var i = 0; i < curState.actionCell.edges.length; i++) {
            var edgeName = curState.actionCell.edges[i].value.name;
            edgeName = edgeName.substring(0, edgeName.indexOf("->")).trim();
            if (edgeName == actionName) {
              edgeList.push(curState.actionCell.edges[i]);
            }
          }
        }

        //find item in view model and add to ref remove list
        if (curState.iActions) {
          for (var i = 0; i < curState.iActions.length; i++) {
            if (curState.iActions[i].name == actionName) {
              if (selState.name == curState.State.name) {
                dataObj = curState.iActions[i];
                el = curState.ui_el;
              }
              curState.iActions.splice(i, 1);
              break;
            }
          }
        }
      }

      if (fullDelete || ((selState.name == curState.State.name) && ((eventName != "Immediate Actions")))) {
        //find the correct event action ID
        var actionID = 0;
        
        //remove the action in the event action list from the View's data model and 
        //find the correct event action ID in case it is in more than one event
        for (var j = 0; j < curState.iEvents.length; j++) {
          if (fullDelete ||
              (curState.iEvents[j].name == eventName)) { //it is the correct State and Event
            //look for the action
            for (var i = 0; i < curState.iEvents[j].eActions.length; i++) {
              if (curState.iEvents[j].eActions[i].name == actionName) {
                actionID = curState.iEvents[j].eActions[i].itemId
                dataObj = curState.iEvents[j].eActions[i];
                el = curState.ui_el;
                curState.iEvents[j].eActions.splice(i, 1);
                break;
              }
            }
          }
        }

        //add to the states list for removal of all edges later
        if (curState.eventCell.edges) {
          for (var i = 0; i < curState.eventCell.edges.length; i++) {
            if (fullDelete) {
              var edgeName = curState.eventCell.edges[i].value.name;
              edgeName = edgeName.substring(0, edgeName.indexOf("->")).trim();
              if (edgeName == actionName) {
                edgeList.push(curState.eventCell.edges[i]);
              }
            }
            else {
              if (curState.eventCell.edges[i].value.itemId == actionID) {
                edgeList.push(curState.eventCell.edges[i]);
              }
            }
          }
        }
      }
    }

    //remove all the items specified
    if (edgeList) {
      graph.removeCells(edgeList, true);
      graph.view.invalidate(selCell, false, true);
      graph.view.validate(selCell);
    }

    if (el)
      el.remove();

    //remove from the data model.
    if ((eventName == "Immediate Actions") || fullDelete)
      eventName = null;
    sidebar.deleteAction(dataObj, fullDelete, selState, eventName);

  }
  //------------------------------------
  StateApp.prototype.moveAction = function (selCell, actionName, eventName, graph, moveCnt) {
    graph = this.graph;
    var changed = false;
    var state = selCell.value;
    var dataObj;
    var el;
    //there are two type of actions we need to be mindful off.  Immediate Action or Event Action.
    if (eventName == "Immediate Actions") {//this action is from the immediate action.

      // find and shift the action in the immediate action list 
      //move main data model info.
      for (var j = 0; j < state.State.immediateActions.length; j++) {
        if (state.State.immediateActions[j] == actionName) {
          var temp = state.State.immediateActions[j + moveCnt];
          state.State.immediateActions[j + moveCnt] = state.State.immediateActions[j];
          state.State.immediateActions[j] = temp;

          //update the display
          var temp2 = state.actionCell.value.items[j + moveCnt];
          state.actionCell.value.items[j + moveCnt] = state.actionCell.value.items[j];
          state.actionCell.value.items[j] = temp2;

          graph.resetEdges(state.actionCell.edges);
          changed = true;
          break;
        }
      }
    }
    else { // If action is an Event Action
      //move main data model info.
      for (var i = 0; i < state.State.events.length; i++) {
        if (state.State.events[i] == eventName) {
          for (var j = 0; j < state.State.eventActions[i].actions.length; j++) {
            if (state.State.eventActions[i].actions[j] == actionName) {
              var temp = state.State.eventActions[i].actions[j + moveCnt];
              state.State.eventActions[i].actions[j + moveCnt] = state.State.eventActions[i].actions[j];
              state.State.eventActions[i].actions[j] = temp;

              //update the display
              var temp2 = state.iEvents[i].eActions[j + moveCnt];
              state.iEvents[i].eActions[j + moveCnt] = state.iEvents[i].eActions[j];
              state.iEvents[i].eActions[j] = temp2;

              changed = true;
              break;
            }
          }
        }
      }

      graph.resetEdges(state.eventCell.edges);
    }
    if (changed) {
      graph.view.invalidate(selCell, false, true);
      graph.view.validate(selCell);

    }
  }
  //------------------------------------

  //returns state object
  StateApp.prototype.getStateByName = function (stateName) {
    var state = null;
    var parent = this.graph.getDefaultParent();
    var model = parent.value;
    if (model.StateList) {
      for (var i = 0; i < model.StateList.length; i++) {
        var st = model.StateList[i];
        if (st.State.name == stateName) {
          state = st;
          break;
        }

      }
    }
    return state;
  }
  //------------------------------------
  //returns action object
  StateApp.prototype.getActionByName = function (aName) {
    var action = null;
    var parent = this.graph.getDefaultParent();
    var model = parent.value;
    if (model.ActionList) {
      for (var i = 0; i < model.ActionList.length; i++) {
        if (model.ActionList[i].Action.name == aName) {
          action = model.ActionList[i];
          break;
        }
      }
    }
    return action;
  }
  //------------------------------------
  StateApp.prototype.getEventByName = function (eName) {
    var evt = null;
    var parent = this.graph.getDefaultParent();
    var model = parent.value;
    if (model.EventList) {
      for (var i = 0; i < model.EventList.length; i++) {
        if (model.EventList[i].Event.name == eName) {
          evt = model.EventList[i];
          break;
        }
      }
    }
    return evt;
  }
  //------------------------------------
  StateApp.prototype.reloadDiagram = function () {
    var rootModel = this.graph.getDefaultParent().value;
    var sb = rootModel.sidebar;
    if (sb) {
      var diagram = sb.getDiagram(rootModel.DiagramList[0].Diagram); //There should be only one diagram per view.

      sb.cleanDataModel(diagram);
      diagram.sidebar = sb;
      this.graph.view.clear();
      this.graph.model.clear();
      OnLoad(diagram);

    }
  }

  StateApp.prototype.pasteDiagram = function () {
    const rootModel = this.graph.getDefaultParent().value;
    const sb = rootModel.sidebar;
    if (sb) {
      console.log('Pasting diagram');
    }
  }


  //------------------------------------
  //handles what happens when you right click on any state or action or event
  StateApp.prototype.InitContextMenu = function (content, graph) {

    //disable built-in context menu.
    mxEvent.disableContextMenu(content);

    //Set default colors for context menu
    mxConstants.HANDLE_FILLCOLOR = '#99ccff';
    mxConstants.HANDLE_STROKECOLOR = '#0088cf';
    mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';

    //configure automatic expand on mouseover.
    graph.popupMenuHandler.autoExpand = true;

    //this make the right click to no de-select a selected cell.
    mxPopupMenuHandler.prototype.selectOnPopup = false;
    //installs context menu, when right mouse clicked, it calls this function
    //to create a context menu items.


    graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      var isActionHeader = false, isEventHeader = false;
      var isAction = false, isEvent = false;
      var actionName = null, eventName = null;
      var isToState = false, isEventIcon = false;

      if (evt.target.nodeName == 'IMG') {
        //right clicked on the action's Link image (toState which is not in this diagram.
        //get a list of toState and create a menu to open respondance diagram.
        isToState = evt.target.getAttribute('dataType') == 'toStateAction'
          && evt.target.getAttribute('cellid') !== undefined
          && evt.target.getAttribute('itemid') !== undefined
          && evt.target.getAttribute('actionid') !== undefined;

        isAction = evt.target.getAttribute('dataType') == 'actions'
          && evt.target.getAttribute('cellid') !== undefined
          && evt.target.getAttribute('itemid') !== undefined
          && evt.target.getAttribute('actionid') !== undefined;


        isEventIcon = evt.target.getAttribute('dataType') == 'events'
          && evt.target.getAttribute('cellId') !== undefined
          && evt.target.getAttribute('itemid') == undefined
          && evt.target.getAttribute('actionid') == undefined;

        isEvent = isEvent || isEventIcon;
        if (isEvent) {
          evEl = evt.target.parentElement.querySelector("TH[cellId][itemId]");
          // There should only be one TH per TR for each event.
          if (evEl)
            eventName = evEl.innerText;
        }
      }

      var isEdge = cell && cell.isEdge() && graph.isCellSelected(cell);

      if (isToState) {
        var itemId = parseInt(evt.target.getAttribute('itemid'));
        var actionId = parseInt(evt.target.getAttribute('actionid'));
        if (cell.value.items && cell.value.items.length > itemId) {
          if (cell.value.items[itemId] && cell.value.items[itemId].eActions && cell.value.items[itemId].eActions.length > actionId) {
            var action = cell.value.items[itemId].eActions[actionId].value;
            if (action.newStates) {
              for (var i = 0; i < action.newStates.length; i++) {
                var sName = action.newStates[i].toState;
                var state = mainApp.getStateByName(sName);
                if (!state) {
                  menu.addItem(sName,
                    null, //'images/package.png',
                    function (evt) {
                      var toState = evt.target.innerText;
                      var parent = graph.getDefaultParent();
                      var model = parent.value;
                      if (model.sidebar)
                        model.sidebar.openDiagramByStateName(toState);
                    },
                    null, //parent
                    "", //iconCls
                    true //enabled
                  );
                }
              }
            }
          }
        }
      }
      else {
        isEvent = isEvent || isEventIcon;
        if (evt.target.nodeName == 'TH') {
          isActionHeader = evt.target.getAttribute('dataType') == 'actions' && evt.target.getAttribute('row-type') == 'actionsHeader';
          isEventHeader = evt.target.getAttribute('dataType') == 'events' && evt.target.getAttribute('row-type') == 'eventsHeader';
          isEvent = isEvent || (evt.target.getAttribute('dataType') == 'events' && evt.target.getAttribute('row-type') == 'eventActionHeader');
          if (isEvent) {
            eventName = evt.target.innerText;
          }
        }

        if (evt.target.nodeName == 'TD') {
          isAction = isAction || (evt.target.getAttribute('dataType') == 'actions'
            && evt.target.getAttribute('cellid') !== undefined
            && evt.target.getAttribute('itemid') !== undefined
            && evt.target.getAttribute('actionid') !== undefined);
          if (isAction) {
            actionName = evt.target.innerText;
          }
          else {
            //target is the EventIcon cell, but on on the icon image.
            isEventIcon = evt.target.querySelector("IMG[dataType='events'][cellId]") !== null;
            var evEl = evt.target.parentNode.querySelector("TH[cellid][itemId]");
            if (evEl)
              eventName = evEl.innerText;
          }
          isEvent = isEvent || isEventIcon;
        }

        if (isAction) {
          var evEl = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("TH[dataType='events']");
          if (!evEl)
            evEl = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("TH[dataType='actions']");
          if (evEl)
            eventName = evEl.innerText;
        }

        var selCell = graph.getSelectionCell();
        var isStateSelected = selCell && selCell.value.dataType == "state";
        if (!isStateSelected && !selCell) {
          //no cell selected, right click must occurred on the diagram canvas.
          menu.addItem(
            "New State",
            null /*image url*/,
            function () {
              this.addNewState(graph, evt.x, evt.y);
            }.bind(this),
            null /*parent*/,
            "" /*iconCls*/,
            !isStateSelected /*enabled*/);
        }

        if ((isActionHeader || isEvent || isEventIcon) && isStateSelected) {
          menu.addItem(
            "New Action",
            null /*image url*/,
            function () {
              var actionObj = { id: -1, name: "Goto_Action", desc: "", actType: "atTransition", mainItem: false, mutExcl: true, newStates: [] };
              if (isActionHeader) {
                var parent = cell.parent.value.State.immediateActions;
                this.editActionProperties(cell, actionObj, parent);
              }
              else {
                //need to figure out which event we are adding action to.
                //note: events and eventActions should have the same number elements.
                var eventName = evt.target.innerText;
                var idx = cell.parent.value.State.events.indexOf(eventName);

                if (idx >= cell.parent.value.State.eventActions.length) {
                  var evtAction = { moveFromCurrent: true, actions: [] };
                  cell.parent.value.State.eventActions[idx] = evtAction;
                  var parent = evtAction;
                }
                else
                  var parent = cell.parent.value.State.eventActions[idx];
                //not only parent, but the eventName also needed to know which event the new addition is to add to.
                this.editActionProperties(cell, actionObj, parent, eventName);
              }
            }.bind(this),
            null /*parent*/,
            "" /*iconCls*/,
            true);
        }

        if (isEventHeader && isStateSelected) {
          menu.addItem(
            "New Event",
            null /*image url*/,
            function () {
              var parent = cell.parent.value.State.events;
              var eventObj = { id: -1, name: "new event", desc: "", mainItem: false, evType: "etStateCng", allItems: true, triggerStates: [] };
              this.editEventProperties(cell, eventObj, parent);
            }.bind(this),
            null /*parent*/,
            "" /*iconCls*/,
            true);
        }

        var mName = "Diagram ";
        if (isAction)
          mName = "Action ";
        else if (isEvent)
          mName = "Event ";
        else if (isStateSelected)
          mName = "State ";
        else if (isEdge)
          mName = "Link ";

        if (isStateSelected || selCell) {
          if ((isAction) && !(cell.value.items[0].name === actionName)) { //can move up
            menu.addItem("Move Up", null,
              function (evt) {
                this.moveAction(selCell, actionName, eventName, graph, -1);
              }.bind(this));
          }
          if ((isAction) && !(cell.value.items[cell.value.items.length - 1].name === actionName)) { //can move up
            menu.addItem("Move Down", null,
              function (evt) {
                this.moveAction(selCell, actionName, eventName, graph, 1);
              }.bind(this));
          }
          menu.addSeparator();
          if (!isEdge && (isEvent || isAction)) {
            menu.addItem("Remove " + mName,
              null,
              function (evt) {
                if (isAction) {
                  this.removeAction(selCell, actionName, eventName, graph, false);
                }
                else if (isEvent) {
                  this.removeEvent(selCell, eventName, graph, false);
                }
              }.bind(this));
          }
          menu.addItem("Delete " + mName,
            null,
            function (evt) {
              if (isAction) {
                this.removeAction(selCell, actionName, eventName, graph, true);
              }
              else if (isEvent) {
                this.removeEvent(selCell, eventName, graph, true);
              }
              else if (isEdge) this.removeEdge(cell, graph);
              else if (isStateSelected) this.removeState(graph, evt);
            }.bind(this));
        }

        menu.addItem("Save...", null,
          function (evt) {
            var sb = graph.getDefaultParent().value.sidebar;
            if (sb)
              sb.saveProject();
          }.bind(this));
        menu.addSeparator();
        if (!isStateSelected && !selCell) {
          menu.addItem("Refresh diagram", null,
            function (evt) {
              this.reloadDiagram();
            }.bind(this));
            /*
            menu.addItem("Paste diagram", null, (evt) => {
              this.pasteDiagram();
            });
            */
        }
        menu.addItem(mName + "Properties...", null,
          function () {
            if (isAction) {
              var actionObj = this.getActionByName(actionName);
              this.editActionProperties(cell, actionObj.Action);
            }
            else if (isEvent) {
              var eventObj = this.getEventByName(eventName);
              this.editEventProperties(cell, eventObj.Event);
            }
            else if (isStateSelected) {
              this.editStateProperties(selCell, graph);
            }
            else if (cell && cell.isEdge) {
              this.editLinkProperties(cell, cell.value.linkState);
            }
            else
              this.editDiagramProperties(cell, graph);
          }.bind(this)
        );
      }

      //This is how to add submenu example.
      //var subMenu = menu.addItem("Options", null, null);
      //menu.addItem("Red", null, function () { alert("Color is Red!"); }, subMenu);
      //menu.addItem("Blue", null, function () { alert("Color is Blue!"); }, subMenu);
      //menu.addItem("Green", null, function () { alert("Color is Green!"); }, subMenu);
    }.bind(this);
  }

  return StateApp;
})(this, Object);

//launch the application when DOM is done loading stuff.
document.addEventListener('DOMContentLoaded', function () {
  new StateApp(document.getElementById('graphContainer'));
});


