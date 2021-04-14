// Copyright 2021 Battelle Energy Alliance


'use strict';
var StateShape = (function (_super) {
  __extends(StateShape, _super);
  function StateShape(bounds, fill, stroke, strokewidth) {
    _super.apply(this, arguments);


    //******* CANT STORE DATA IN SHAPE ******
    //It gets create and destroy by CellRenderer all the time.
    //  MUST Create a data model and keep it in the Cell.value.
    //  Just like in BugScript.
    this.ownerCellID = -1;
    this.getLabel = function (cell) {
      var content = '<table style="overflow:hidden;" width="100%" height="100%" border="1" cellpadding="4" class="title" style="height:100%;">' +
        '<tr><th colspan="2" style="font-size: 12pt; font-weight: bold;">' + cell.value.getName() + '</th></tr>' +
        '</table>';
      return content;
    };


    //This function is executed for any changes (resize, move, collapse, expand) made to the StateShape.  It calculates the shape's side, and the individual 
    //panes (action, event, event action) within the TableShape panel.  
    this.titleOffset = 20;
    this.collapseHeight = 30;
    this.minHeight = 2 * this.collapseHeight + this.titleOffset;
    this.updateShape = function (graph, cell) {
      if (!cell) return;
      if (!cell.isUpdatingShape) {
        cell.isUpdatingShape = true;
        try {
          var state = graph.getView().getState(cell);
          if (graph.isCellCollapsed(cell)) {
            cell.geometry.height = this.titleOffset;
            cell.geometry.alternateBounds = new mxRectangle(cell.geometry.x, cell.geometry.y, cell.geometry.width, this.titleOffset);
          }
          else if (state) {
            var actionCell = cell.value.actionCell;
            var eventCell = cell.value.eventCell;
            if (!actionCell || !eventCell) return;  //actionCell or eventCell has been created, quit.

            graph.updateCellSize(actionCell);
            graph.updateCellSize(eventCell);
            var width = Math.max(Math.max(cell.geometry.width, actionCell.geometry.width), eventCell.geometry.width);
            cell.geometry.width = width;
            var clientHeight = actionCell.geometry.height + eventCell.geometry.height + this.titleOffset;

            if (graph.isCellCollapsed(actionCell) && graph.isCellCollapsed(eventCell)) {
              //when both collapsed, set the cell height to shrink to fit just the titles.
              cell.geometry.height = clientHeight + this.titleOffset;
            }
            else {
              if (cell.geometry.height <= this.minHeight) {
                //when cell's height is less than the minimum required for both table, expand the cell.
                cell.geometry.height = clientHeight + this.titleOffset;
              }
              else {
                if ((clientHeight + this.titleOffset) > cell.geometry.height) {
                  //when both tables' height is more than the cell, restrict to the cell height.
                  clientHeight = cell.geometry.height - this.titleOffset;
                }
                else {
                  //otherwise set the cell's height to the tables' combine height.
                  //this is when we tried to resize the cell's height way too big.
                  cell.geometry.height = clientHeight + this.titleOffset;
                  // cell.geometry.height = clientHeight + this.titleOffset;
                }
              }
              //if one of the table is collapsed, the other takes up the space.
              if (graph.isCellCollapsed(actionCell) && !graph.isCellCollapsed(eventCell)) {
                eventCell.geometry.height = clientHeight - actionCell.geometry.height;
              }
              else if (!graph.isCellCollapsed(actionCell) && graph.isCellCollapsed(eventCell)) {
                actionCell.geometry.height = clientHeight - eventCell.geometry.height;
              }
              else {  //when both expanded, expand parent to fit both.
                clientHeight = actionCell.geometry.height + eventCell.geometry.height;
                cell.geometry.height = clientHeight + this.titleOffset;
              }

              //graph.updateCellSize(cell);
              //Shape changes either size or position, update the State's geometry.
              var aState = cell.value.State;
              aState.geometry =
                "{ x: " + cell.geometry.x +
                ", y: " + cell.geometry.y +
                ", width: " + cell.geometry.width +
                ", height: " + cell.geometry.height + "}";

            }
            //console.log("name: "+ aState.name+";  geometry: " + aState.geometry);

            //the eventList start right under the action list, wherever that may be.
            actionCell.geometry.height += actionCell.value.items.length * 2;

            eventCell.geometry.y = actionCell.geometry.height + this.titleOffset;
            actionCell.geometry.x = 0;
            actionCell.geometry.y = this.titleOffset;
            eventCell.geometry.x = 0;
            eventCell.geometry.width = width;
            eventCell.geometry.height += 10;

            //alternateBounds are for collapse and expand toggles.
            if (eventCell.geometry.alternateBounds) {
              eventCell.geometry.alternateBounds.width = width;
              eventCell.geometry.alternateBounds.height = eventCell.geometry.height;
            }

            actionCell.geometry.width = width;
            if (actionCell.geometry.alternateBounds) {
              actionCell.geometry.alternateBounds.width = width;
              actionCell.geometry.alternateBounds.height = actionCell.geometry.height;
            }

            graph.view.invalidate(actionCell, false, true);
            graph.view.invalidate(eventCell, false, true);

            if (!cell.geometry.alternateBounds) {
              cell.geometry.alternateBounds = new mxRectangle(cell.geometry.x, cell.geometry.y, cell.geometry.width, cell.geometry.height);// 80, 20);
            }
          }
          graph.view.invalidate(cell, false, true);
          graph.view.validate(cell);
        }
        finally {
          delete cell.isUpdatingShape;
        }
      }
    };

    //listen for when the cell has resized, move or properties changed, we want to recalculate the cell size, and the tables' height.
    mainApp.graph.addListener(mxEvent.UPDATE_CELL_SIZE, function (graph, evtObj) {
      var cell = evtObj.properties.cell;
      if (cell) {
        var state = graph.getView().getState(cell);
        if (state && (state.shape instanceof StateShape)) {
          state.shape.updateShape(graph, cell);
        }
      }
    });

    //listen to when tables collapsed, we want to recalculate the cell size.
    mainApp.graph.addListener(mxEvent.CELLS_FOLDED, function (graph, evtObj) {
      var cells = evtObj.properties.cells;
      if (!cells) return;
      for (var i = 0; i < cells.length; i++) {
        var state = graph.getView().getState(cells[i]);
        if (state && state.shape instanceof TableShape) {
          var parent = graph.model.getParent(cells[i]);
          if (parent) {
            var pstate = graph.getView().getState(parent);
            if (pstate && pstate.shape) {
              pstate.shape.updateShape(graph, parent);
              break;
            }
          }
        }
      }
    });

    mainApp.graph.addListener(mxEvent.CELLS_RESIZED, function (graph, evtObj) {
        var root = graph.getDefaultParent();
        if (root.value.sidebar) {
          root.value.modelChanged = true;
          root.value.sidebar.notifyDataChanged(true);
        }
    });

    mainApp.graph.addListener(mxEvent.CELLS_MOVED, function (graph, evtObj) {
        var root = graph.getDefaultParent();
        if (root.value.sidebar) {
          root.modelChanged = true;
          root.value.sidebar.notifyDataChanged(true);
        }
    });

    mainApp.graph.addListener(mxEvent.CELL_CONNECTED, function () {
      var args = arguments;
//      console.log('connected cell event: ' + arguments[1].properties.terminal.value.name);
    });

    //This is called by the constructor to add two table grids inside the StateShape.
    this.createChildrenShape = function (cell) {
      var state = cell.value;
      if (state && state.dataType == "state") {
        if (!state.actionCell && !mainApp.graph.isCellCollapsed(cell)) {

          var width = cell.geometry.width;
          var val = { dataType: "actions", name: "Immediate Actions", items: state.iActions };
          var actionCell = mainApp.graph.insertVertex(cell, null, val, 0, 20, width, 40, 'shape=TableShape');
          if (cell.onLoadData) {
            cell.onLoadData(actionCell.value, cell);
          }
          //mainApp.graph.fireEvent(new mxEventObject(mxEvent.LOAD_DATA, 'model', actionCell.value, 'parentCell', cell));

          mainApp.graph.updateCellSize(actionCell);
          actionCell.geometry.width = width;
          actionCell.geometry.alternateBounds = new mxRectangle(0, 0, width, 27);
          state.actionCell = actionCell;
        }
        if (!state.eventCell && !mainApp.graph.isCellCollapsed(cell)) {
          var val = {
            dataType: "events",
            name: "Event Actions",
            items: state.iEvents
          };
          var eventCell = mainApp.graph.insertVertex(cell, null, val, 0, 0, width, 40, 'shape=TableShape');
          if (cell.onLoadData) {
            cell.onLoadData(eventCell.value, cell);
          }
          //          mainApp.graph.fireEvent(new mxEventObject(mxEvent.LOAD_DATA, 'model', eventCell.value, 'parentCell', cell));
          mainApp.graph.updateCellSize(eventCell);
          eventCell.geometry.width = width;
          eventCell.geometry.alternateBounds = new mxRectangle(0, 0, width, 27);
          state.eventCell = eventCell;
        }
      }
    };
  }
  return StateShape;
})(mxSwimlane);
mxCellRenderer.registerShape("StateShape", StateShape);
