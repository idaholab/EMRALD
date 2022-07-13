// Copyright 2021 Battelle Energy Alliance


'use strict';
// Makes the shadow brighter
mxConstants.SHADOWCOLOR = '#C0C0C0';

// Program starts here. Creates a sample graph in the
// DOM node with the specified ID. This function is invoked
// from the onLoad event handler of the document (see below).

function main(container, outline) {
  var projName = '';
	var ftName = '';

  // Checks if browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is
    // not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    // Workaround for Internet Explorer ignoring certain styles
    mxEvent.disableContextMenu(container);
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = 'hidden';
      new mxDivResizer(container);
      new mxDivResizer(outline);
    }
    document.body.appendChild(container);

    // Creates a wrapper editor with a graph inside the given container.
    // The editor is used to create certain functionality for the
    // graph, such as the rubberband selection, but most parts
    // of the UI are custom in this example.
    var editor = new mxEditor();
    var graph = editor.graph;

    // Creates the graph inside the given container
    //graph = new mxGraph(container);
    // Sets the graph container and configures the editor
    editor.setGraphContainer(container);
    var config = mxUtils.load(
      //'config/keyhandler-commons.xml'  // disabled F12 key for developer tool in browser.
      'config/keyhandler-minimal.xml'  //for debugging F12 enabled  keycode(123) == F12.
      )
      .getDocumentElement();
    editor.configure(config);


    // Enables automatic sizing for vertices after editing and
    // panning by using the left mouse button.
    graph.setCellsMovable(false);
    graph.setAutoSizeCells(false);
    graph.cellsResizable = (false);
    graph.setHtmlLabels(true);
    graph.setPanning(true);
    graph.centerZoom = false;
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.keepEdgesInBackground = true
    graph.setDropEnabled(true);


    // Displays a popupmenu when the user clicks
    // on a cell (using the left mouse button) but
    // do not select the cell when the popup menu
    // is displayed
    graph.panningHandler.popupMenuHandler = false;

    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    var outln = new mxOutline(graph, outline);

    // Disables tooltips on touch devices
    graph.setTooltips(!mxClient.IS_TOUCH);

    configureStyleSheets(graph);

    // Stops editing on enter or escape keypress
    var keyHandler = new mxKeyHandler(graph);

    // Enables automatic layout on the graph and installs
    // a tree layout for all groups who's children are
    // being changed, added or removed.
    var layout = new mxCompactTreeLayout(graph, false);
    layout.useBoundingBox = false;
    layout.edgeRouting = false;
    layout.levelDistance = 60;
    layout.nodeDistance = 16;

    // Allows the layout to move cells even though cells
    // aren't movable in the graph
    layout.isVertexMovable = function (cell) {
      return true;
    };

    var layoutMgr = new mxLayoutManager(graph);

    layoutMgr.getLayout = function (cell) {
      if (cell.getChildCount() > 0) {
        return layout;
      }
    };

    //-------------------------------------------------------------
    // Installs a popupmenu handler using local function (see below).
    graph.panningHandler.factoryMethod = function (menu, cell, evt) {
      return createPopupMenu(graph, menu, cell, evt);
    };

    //-------------------------------------------------------------
    // Fix for wrong preferred size
    var oldGetPreferredSizeForCell = graph.getPreferredSizeForCell;
    graph.getPreferredSizeForCell = function (cell) {
      var result = oldGetPreferredSizeForCell.apply(this, arguments);
      //TODO: testingo only.
      return result;

      if (result != null) {
        result.width = Math.max(120, result.width - 40);
      }

      return result;
    };

    //-------------------------------------------------------------
    // Sets the maximum text scale to 1
    graph.cellRenderer.getTextScale = function (state) {
      return Math.min(1, state.view.scale);
    };

    //-------------------------------------------------------------
    var GetFTItem = function (cell) {
      if (cell instanceof mxCell) {
        if (cell.children == null) {
          return null;
        }

        for (var i = 0; i < cell.children.length; i++) {
          var cellVal = cell.children[i].value;
          if ((cellVal != null) && (cellVal instanceof FTItem)) {
            return cellVal;
          }
        }
      }

      return null;
    }
    //-------------------------------------------------------------
    var editFunc = function EditLabel(lbl) {
      alert(lbl);
    }
    //-------------------------------------------------------------
    // Sets the new value for the given cell and trigger
    graph.labelChanged = function (cell, newValue, trigger) {
      cell.value = newValue;

      if ((cell.parent != null) && (cell.parent.value instanceof FTItem)) {
        var nodePart = cell.id.split('~');
        nodePart = nodePart[nodePart.length - 1];
        switch (nodePart) {
          case 'Name':
            cell.parent.value.name = newValue;
            break;

          case 'Desc':
            cell.parent.value.desc = newValue;
            break;

          case 'Value':
            cell.parent.value.value = newValue;
            break;
        }
      }

      mxGraph.prototype.labelChanged.apply(this, arguments);
    }
    //-------------------------------------------------------------
         // Sets the new value for the given cell and trigger
    //TODO
    graph.gateChanged = function (cell, newValue, trigger) {
        cell.value = newValue;
        //var x = tree;

    }
    //-------------------------------------------------------------
    graph.isCellEditable = function (cell) {
      return ((cell.parent != null) && (cell.parent.value instanceof FTItem));
    };
    //-------------------------------------------------------------
    graph.getLabel = function (cell) {
      var tmp = '';
      if (cell && cell.isEdge() == true) return '';

      if (cell && cell.value) {
        if (cell.value instanceof FTItem) {
						if (!cell.collapsed) {  
								if (cell.id.indexOf("~Desc") > 0)
										return cell.value.desc;
								return cell.value.name;
						}
						
          else {
            return cell.value.name;
          }
        }
        if (cell.value.gateType) { //LogicNode gate
          if (cell.id.indexOf("~Name") > 0)
            tmp = cell.value.name;
          else tmp = cell.value.desc + "  ";
        }
        else if (cell.value.diagramType) { //DiagramType
          tmp = cell.value.name;
        } else if (typeof cell.value === 'string') {
          tmp = cell.value;
        }
      }
      else tmp = mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"

      return tmp;
    };


    //overwritten cellRenderer.redrawLabel to install drag/drop.  We can only do D&D on DOME element.
    var oldRedrawLabel = graph.cellRenderer.redrawLabel;
    graph.cellRenderer.redrawLabel = function (state) {

      //When the shape is redrawing its label, mxGraph destroys the content, so we need to re-install drop handler each time. 
      var installDropHandler = function (watchEl) {

        // handler for item drag over response
        // NOTE: the dragover is attach to the label's parent div.  So it can only be drop onto the label, for now.
        watchEl.ondragover = function (evt) {
        //mxEvent.addListener(watchEl, 'dragover', function (evt) {
          var isDiagram = false;
						var isGate = false;
          if (evt.dataTransfer.types.indexOf('diagrams') >= 0 && evt.dataTransfer.types.indexOf('dtcomponent') >= 0) {
            //TODO: if the diagram can only be drop to specific type of shape, the evt.target is the pdiv.  
            //When construct the shape, the mxCell.shate can be link to the div so we can get back to the object that containing the div.
            isDiagram = true;
          }
					if (evt.dataTransfer.types.indexOf('gate') >= 0) {
            //TODO: if the diagram can only be drop to specific type of shape, the evt.target is the pdiv.  
            //When construct the shape, the mxCell.shate can be link to the div so we can get back to the object that containing the div.
							isGate = true;
          }
						
          //drop allows
						if (isDiagram || isGate) {
								evt.preventDefault();  //tell drag it is okay to drop.
								evt.stopPropagation();
						}
						
						//TODO add error message here (only can drag component diagram)
        }.bind(watchEl);

        //handler for actual drop of drag over item.
        watchEl.ondrop = function (evt) {
        //mxEvent.addListener(watchEl, 'drop', function (evt) {
						if (evt.dataTransfer.types.indexOf('diagrams') >= 0) {
								var newDiagram = evt.dataTransfer.getData("diagrams");
								if (newDiagram !== '') {
										var target = evt.target;
										newDiagram = JSON.parse(newDiagram);

										//TODO: task to add diagram to the FT here.
										//BuildTree(graph, parent, tree);

										var cell = state.cell;
										if (cell.parentCell)
												cell = cell.parentCell;

										//check to make sure component not already child
										var alreadyExist = false;
										var compChildren;
										var index = -1;
										for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
												if (graph.sidebar.LogicNodeList[i].LogicNode.name == cell.value) {
														compChildren = graph.sidebar.LogicNodeList[i].LogicNode.compChildren;
														index = i;
												}
										}
										if (!compChildren) {
                      graph.sidebar.LogicNodeList[index].LogicNode.compChildren = [];
										}
										for (var i = 0; i < compChildren.length; i++) {
												if (compChildren[i] == newDiagram.name) {
														alreadyExist = true;
												}
										}
										if (!alreadyExist) {
												AddChildComp(graph, cell, newDiagram);
												graph.sidebar.LogicNodeList[index].LogicNode.compChildren.push(newDiagram.name);
										}
										else {
												alert(newDiagram.name + " is already added to that cell");
										}

								}
								

            //tell the current shape to update itself. Comment this out if the current shape is not require refresh.
            //var pCell = graph.getModel().getParent(state.cell); 
            //var pState = graph.getView().getState(pCell);
            //graph.fireEvent(new mxEventObject(mxEvent.UPDATE_CELL_SIZE, "cell", pCell,"mxImageShape", pState.shape));
          }
						else {
								
								var newID = getDefaultGateID(graph);
								var gateType = evt.dataTransfer.getData("gate");
								var parent = graph.getDefaultParent();
								var vertex = null;
								var cell = state.cell;
								if (cell.parentCell)
										cell = cell.parentCell;
								graph.getModel().beginUpdate();
								if (gateType == "ftBasicEvent") { //if it is a BE gate
									
										addBE(graph, cell);
								}
								else { // if it is a AND/ OR gate
										try {
												
												var ftNode = new FTItem(newID, "gate_" + newID, "", gateType, "Gate", null, null, null);
												ftNode.gateType = gateType;
												vertex = AddChildGate(graph, cell, ftNode);
										}
										finally {
												graph.getModel().endUpdate();
										}

										graph.setSelectionCell(vertex);
										if (cell.children[0].value.gateChildren.indexOf("gate_" + newID) < 0) {
												cell.children[0].value.gateChildren.push("gate_" + newID);
                    }
										var newLogicNode = {
												LogicNode: {
														id: newID,
														name: "gate_" + newID,
														desc: "",
														gateType: gateType,
														rootName: graph.tree.LogicNode.LogicNode.name,
														compChildren: [],
														gateChildren: []
												}
										};
										graph.sidebar.LogicNodeList.push(newLogicNode);
										graph.zoomOut();
										graph.zoomActual();
										graph.zoomOut();
								}
						

						
						}
          evt.preventDefault();
          evt.stopPropagation();

        }.bind(watchEl);
      } //installDropHandler

      oldRedrawLabel.apply(this, arguments); // "supercall"
      if (state.cell.isEdge() == true) return;
      var graph = state.view.graph;
      //var s = graph.view.scale;
     
      if (graph.getModel().isVertex(state.cell) && state.text != null) {
        if (((state.shape instanceof mxLabel) || (state.shape instanceof mxImageShape))) {
          if (!state.cell.value) return;
          if (state.cell.value.diagramType) return;  //don't need to drop on leave node.

          // Scrollbars are on the div
          //state.text.node.style.overflow = 'hidden';
          //get the main TableShape panel and should be only one.
          var el = state.text.node.querySelectorAll('div :not(.drop-target)');
          if (el) {
            if (el.length > 1) el = el[1];
            else if (el.length > 0) el = el[0];
          }
          else el = null;

          if (
            el != null &&
            !state.cell.parent.geometry
          ) {
            Array.from(el.getElementsByClassName('drop-target')).forEach(
              (oldTarget) => oldTarget.parentNode.removeChild(oldTarget),
            );
            const dropTarget = document.createElement('div');
            dropTarget.classList.add('drop-target');
            const cellHeight = state.cell.geometry.height;
            const cellWidth = state.cell.geometry.width;
            let height = state.height;
            let width = state.width;
            if (cellHeight > height) {
              height = cellHeight;
            }
            if (cellWidth > width) {
              width = cellWidth;
            }
            dropTarget.style.height = `${height}px`;
            dropTarget.style.width = `${width}px`;
            dropTarget.style.position = 'absolute';
            dropTarget.style.top = '0';
            dropTarget.style.left = `-${width / 3}px`;
            el.appendChild(dropTarget);
            installDropHandler(dropTarget);
          }
        }
      }

    }
    //Collapse or folding of cells

    //mxGraph.prototype.collapsedImage = new mxImage(mxClient.imageBasePath + '/collapsed.gif', 9, 9);
    //mxGraph.prototype.expandedImage = new mxImage(mxClient.imageBasePath + '/expanded.gif', 9, 9);
    //-------------------------------------------------------------
    // Defines the condition for showing the folding icon
    graph.isCellFoldable = function (cell) {
      return this.model.getOutgoingEdges(cell).length > 0;
    };
    //-------------------------------------------------------------
    // Defines the position of the folding icon
    graph.cellRenderer.getControlBounds = function (state) {
      if (state.control != null) {
        var oldScale = state.control.scale;
        var w = state.control.bounds.width / oldScale;
        var h = state.control.bounds.height / oldScale;
        var s = state.view.scale;
        var g = (Globals.ftNodeSettings.gateImgSize * s) - (9 * s / 2);

        //Globals.ftNodeSettings.height
        return new mxRectangle(state.x + state.width / 2 - w / 2 * s,
          state.y + state.height + g,
          9, 9);
      }

      return null;
    };
    //-------------------------------------------------------------
    // Implements the click on a folding icon
    graph.foldCells = function (collapse, recurse, cells) {
      this.model.beginUpdate();
      try {
        toggleSubtree(this, cells[0], !collapse);
        this.model.setCollapsed(cells[0], collapse);

        // Executes the layout for the new graph since
        // changes to visibility and collapsed state do
        // not trigger a layout in the current manager.
        layout.execute(graph.getDefaultParent());
      }
      finally {
        this.model.endUpdate();
      }
    };
    //-------------------------------------------------------------
    // Updates the visible state of a given subtree taking into
    // account the collapsed state of the traversed branches
    var toggleSubtree = function (graph, cell, show) {
      show = (show != null) ? show : true;
      var cells = [];

      graph.traverse(cell, true, function (vertex) {
        if (vertex != cell) {
          cells.push(vertex);
        }

        // Stops recursion if a collapsed cell is seen
        return vertex == cell || !graph.isCellCollapsed(vertex);
      });

      graph.toggleCells(show, cells, true);
    };
    //end section for collapsing or folding items.


    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();
  

    //-------------------------------------------------
    // Main entry point to FT...

			var handleTree = function (tree) {
			graph.tree = tree;
      graph.sidebar = tree.sidebar;
      graph.DiagramList = tree.DiagramList;
      BuildTree(graph, parent, tree);
					graph.fit();
					graph.center();
					graph.zoomIn();
					graph.zoomIn();
					graph.zoomIn();
					graph.zoomIn();
					graph.zoomIn();
    };

    window.mainLoadTree = handleTree;

    var content = document.createElement('div');
    content.style.padding = '4px';
    var tb = new FaultTree.Toolbar(content, graph);


    tb.addItem('Zoom In', 'images/zoom_in32.png', function (evt) {
      graph.zoomIn();
    });

    tb.addItem('Zoom Out', 'images/zoom_out32.png', function (evt) {
      graph.zoomOut();
    });

    tb.addItem('Actual Size', 'images/view_1_132.png', function (evt) {
      graph.zoomActual();
    });

    /*tb.addItem('Print', 'images/print32.png', function (evt) {
      var preview = new mxPrintPreview(graph, 1);
      preview.open();
    });*/

    //tb.addItem('Poster Print', 'images/press32.png', function (evt) {
    //  var pageCount = mxUtils.prompt('Enter maximum page count', '1');

    //  if (pageCount != null) {
    //    var scale = mxUtils.getScaleForPageCount(pageCount, graph);
    //    var preview = new mxPrintPreview(graph, scale);
    //    preview.open();
    //  }
    //});
    /*tb.addSeparator('images/Vert.png');
    tb.addItem('Undo', 'images/undo.png', function (evt) {
      editor.execute('undo');
    });

    tb.addItem('Redo', 'images/redo.png', function (evt) {
      editor.execute('redo');
    }); */

    //tb.addItem('Save', 'images/save.png', function (evt) {
    //  SaveFTL(graph, '');
    //});
    //-------------------------------------------------------------
    var dropHandler = function (graph, evt, cell, x, y) {
      if (!cell) return;

      var parent = graph.getDefaultParent();
      var vertex = null;

      graph.getModel().beginUpdate();
      try {
        var gateType = "BE";
        if (evt.toElement.title.indexOf("OR") >= 0)
          gateType = "OR";
        else if (evt.toElement.title.indexOf("AND") >= 0)
          gateType = "AND";

        var ftNode = new FTItem(0, "Untitled", "", gateType, "Gate", null, null, null);
        vertex = AddChild(graph, cell, ftNode);
      }
      finally {
        graph.getModel().endUpdate();
      }

      graph.setSelectionCell(vertex);
    };
    //-------------------------------------------------------------
			tb.addSeparator('images/Vert.png');
			tb.addNewDraggableItem('gtOr', 'images/OrGate.png', null, true);
			tb.addNewDraggableItem('gtAnd', 'images/AndGate.png', null, true);
			tb.addNewDraggableItem('ftBasicEvent', 'images/BE.png', null, true);
    //tb.addDraggableItem('OR State', 'images/OrGate.png', null, true, dropHandler);
    //tb.addDraggableItem('AND State', 'images/AndGate.png', null, true, dropHandler);
    //tb.addDraggableItem('BE Event', 'images/BE.png', null, true, dropHandler);
		tb.addSeparator('images/Vert.png');
		tb.addItem('Help', 'images/question.png', function (evt) {
				
		var url = "HelpLogicTree.html";
		var componentDiagrams = [];
		mxWindow.createFrameWindow(
				url,
				'OK',  //command buttons
				'minimize, maximize, close', //top buttons
				function (btn, retObj) {
						return true;
				},
				componentDiagrams,
				true, //ismodal
				null,
				null,
				450, //width
				200 //height
		);

			});
    var wnd = new mxWindow('Tools', content, 0, 0, null, null, false);
    wnd.setMaximizable(false);
    wnd.setScrollable(false);
    //wnd.setResizable(false);
    wnd.setVisible(true);


    // Fades-out the splash screen after the UI has been loaded.
    var splash = document.getElementById('splash');
    if (splash != null) {
      try {
        mxEvent.release(splash);
        mxEffects.fadeOut(splash, 100, true);
      }
      catch (e) {

        // mxUtils is not available (library not loaded)
        splash.parentNode.removeChild(splash);
      }
    }
    //-------------------------------------------------------------
  }
}


// Function to create the entries in the popupmenu
var createPopupMenu = function (graph, menu, cell, evt) {
  var model = graph.getModel();

  if (cell != null) {
    if (model.isVertex(cell)) {
      menu.addItem('Add child', 'images/overlays/check.png', function () {
        AddChild(graph, cell);
      });
    }

    menu.addItem('Edit label', 'images/text.gif', function () {
      graph.startEditingAtCell(cell);
    });

    if (cell.id != 'treeRoot' && model.isVertex(cell)) {
      menu.addItem('Delete', 'images/delete.gif', function () {
        deleteSubtree(graph, cell);
      });
    }

		if (cell.id != 'treeRoot' &&
            model.isVertex(cell)) {
      menu.addItem('add', 'images/add.png', function () {
					alert("TODO");
      });
    }

    menu.addSeparator();
  }

  menu.addItem('Fit', 'images/zoom.gif', function () {
    graph.fit();
  });

  menu.addItem('Actual', 'images/zoomactual.gif', function () {
    graph.zoomActual();
  });

  menu.addSeparator();

  /*menu.addItem('Print', 'images/print.gif', function () {
    var preview = new mxPrintPreview(graph, 1);
    preview.open();
  });

  menu.addItem('Poster Print', 'images/print.gif', function () {
    var pageCount = mxUtils.prompt('Enter maximum page count', '1');

    if (pageCount != null) {
      var scale = mxUtils.getScaleForPageCount(pageCount, graph);
      var preview = new mxPrintPreview(graph, scale);
      preview.open();
    }
  });*/
}
;

function getDefaultGateID(graph) {
		var maxID = 0;
		var logicNodeList = graph.sidebar.LogicNodeList;
		for (var i = 0; i < logicNodeList.length; i++) {
				if (logicNodeList[i].LogicNode.id > maxID) {
						maxID = logicNodeList[i].LogicNode.id;
				}
		}
		return (maxID + 1);
}

function addOverlays(graph, cell, isEditable) {
  const isRoot = graph.tree.LogicNode.LogicNode.rootName === cell.value;
  var overlay = new mxCellOverlay(new mxImage('images/delete.png', 16, 16), 'delete');
  overlay.cursor = 'hand';
  overlay.offset = new mxPoint(-6, 4);//(-4, 8);
  overlay.align = mxConstants.ALIGN_RIGHT;
  overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
  overlay.addListener(mxEvent.CLICK, function (sender, evt) {
    deleteSubtree(graph, cell);
  }.bind(this));

  if (!isRoot) {
    graph.addCellOverlay(cell, overlay);
  }


  if (isEditable) {
    overlay = new mxCellOverlay(new mxImage('images/edit.png', 16, 16), 'Edit');
    overlay.cursor = 'hand';
    overlay.offset = new mxPoint(-26, 4);//(-4, 8);
    if (isRoot) {
      overlay.offset.x = -6;
    }
    overlay.align = mxConstants.ALIGN_RIGHT;
    overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
    overlay.addListener(mxEvent.CLICK, function (sender, evt) {
      if (cell.value) {
          if (typeof cell.value === 'string') {
            editNode(graph, cell);
          }
          else if (cell.value.diagramType)
              editDiagramNode(graph, cell);
          else if (cell.value.gateType)
              editNode(graph, cell);
      }
      else if (cell.nameItem)
        editDiagramNode(graph, cell.nameItem);
    });

    graph.addCellOverlay(cell, overlay);
  }
		if (cell.style == "ftGate;" ) {
			overlay = new mxCellOverlay(new mxImage('images/add.png', 16, 16), 'add');
			overlay.cursor = 'hand';
			overlay.offset = new mxPoint(6, 4);//(-4, 8);
			overlay.align = mxConstants.ALIGN_LEFT;
			overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
			overlay.addListener(mxEvent.CLICK, function (sender, evt) {
					addNode(graph, cell);
			});

			graph.addCellOverlay(cell, overlay);
    }

}

function mergeFTData(obj1, obj2) {
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
}

//When a state is edited and data were written back to the underlying user object, we need to update the 
//overlay cells manually.
function updateCell(graph, cell) {
  graph.labelChanged(cell, cell.value, this);
  // Force the child cells to sync up with the changes
  // There is probably a better way to do this
  graph.labelChanged(cell.children[1], cell.children[0].value.desc, this);
  let imgName = 'ORGate.png';
  if (cell.children[0].value.gateType === 'gtAnd') {
    imgName = 'ANDGate.png';
  }
  graph.model.setStyle(cell.children[2], `ftGateShape;image=images/${imgName};`);
}


function BuildTreeRec(graph, parentCell, node) {
    if (node != undefined) {
        if (parentCell == null)
            var addedChild = AddChildGate(graph, parent, node.LogicNode);
        else
            var addedChild = AddChildGate(graph, parentCell, node.LogicNode);

        //addedChild.value = node.LogicNode;
        if (node.gateChildren != undefined) {
            for (var i = 0; i < node.gateChildren.length; i++) {
                BuildTreeRec(addedChild, node.gateChildren[i].LogicNode);
            }
        }

        if (node.compChildren != undefined) {
            for (var i = 0; i < node.compChildren.length; i++) {
                AddChildComp(graph, addedChild, node.compChildren[i]);
            }
        }
    }
}


function editDiagramNode(graph, cell) {
  var sb = graph.sidebar;
  var diagram = sb.getDiagramByName(sb, cell.value);
  if (diagram)
    sb.openDiagramWindow(diagram.Diagram);
}

/*
 //TODO change this to be like the rest
function editNode(graph, cell) {
  mxWindow.createFrameWindow(
  'EditForms/GateEditor.html',
  'Save, Cancel',  //command buttons
  'minimize, maximize, close', //top buttons
  function (btn, dataObj) {
    if (btn === 'Save') {
      mergeFTData(cell.value, dataObj);
      var state = graph.getView().getState(cell);
      updateCell(graph, cell);
    }
    return true;
  },
  cell.value,
  true, //ismodal
  null,
  null,
  450, //width
  300 //height
  );

}

*/



function editNode (graph, stateCell) {
    var url = "EditForms/GateEditor.html";
		var sModel = stateCell.children.find((cell) => cell.style === 'ftValue').value;
		var oldName = stateCell.value;
    mxWindow.createFrameWindow(
        url,
        'OK, Cancel',  //command buttons
        'minimize, maximize, close', //top buttons
        function (btn, retObj) {
            if (btn === 'OK') {
								graph.sidebar.replaceNames(oldName, retObj.name, 'LogicNode', null, true);
								mergeFTData(sModel, retObj);
                stateCell.value = retObj.name;
								updateCell(graph, stateCell);
            }
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

function addNode(graph, stateCell) {
		var url = "EditForms/GateAdder.html";
		var componentDiagrams = [];
		var diagramList = graph.sidebar.DiagramList;
		for (var i = 0; i < diagramList.length; i++) {
				if (diagramList[i].Diagram.diagramType == "dtComponent") {
						var obj = diagramList[i].Diagram;
						componentDiagrams.push(obj);
						//TODO: do not add diagrams that already exist
				}
		}
		mxWindow.createFrameWindow(
				url,
				'OK, Cancel',  //command buttons
				'minimize, maximize, close', //top buttons
				function (btn, retObj) {
						if (btn === 'OK') {
								if (retObj.addType == "diagram" && retObj.newDiagram ) {
										var state = graph.getView().getState(stateCell);
										var cell = state.cell;
										if (cell.parentCell)
												cell = cell.parentCell;
										//check to make sure component not already child
										var alreadyExist = false;
										var compChildren;
										var index = -1;
										for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
												if (graph.sidebar.LogicNodeList[i].LogicNode.name == cell.value) {
														compChildren = graph.sidebar.LogicNodeList[i].LogicNode.compChildren;
														index = i;
												}
										}
										for (var i = 0; i < compChildren.length; i++) {
												if (compChildren[i] == retObj.newDiagram.name) {
														alreadyExist = true;
												}
										}
										if (!alreadyExist) {
												AddChildComp(graph, cell, retObj.newDiagram);
												graph.sidebar.LogicNodeList[index].LogicNode.compChildren.push(retObj.newDiagram.name);
										}
										else {
												alert(retObj.newDiagram.name + " is already added to that cell");
										}
								}
								else if (retObj.addType == "standard") {
										//check to make sure component not already child
										var alreadyExist = false;
										var vertex = null;
										var state = graph.getView().getState(stateCell);
										var cell = state.cell;
										var newID = getDefaultGateID(graph);
										for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
												if (graph.sidebar.LogicNodeList[i].LogicNode.name == retObj.newName) {
														alreadyExist = true;
												}
										}
										if (!alreadyExist) {
												graph.getModel().beginUpdate();
												try {
														var ftNode = new FTItem(newID, retObj.newName, retObj.newDesc, retObj.newGateType, "Gate", null, null, null);
														ftNode.gateType = retObj.newGateType;
														vertex = AddChildGate(graph, cell, ftNode);
												}
												finally {
														graph.getModel().endUpdate();
												}

												graph.setSelectionCell(vertex);
												for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
														if (graph.sidebar.LogicNodeList[i].LogicNode.name == cell.value) {
																if (graph.sidebar.LogicNodeList[i].LogicNode.gateChildren.indexOf(retObj.newName) < 0) {
                                  graph.sidebar.LogicNodeList[i].LogicNode.gateChildren.push(retObj.newName);
                                }
														}
												}

												var newLogicNode = {
														LogicNode: {
																id: newID,
																name: retObj.newName,
																desc: retObj.newDesc,
																gateType: retObj.newGateType,
																"rootName": cell.value.rootName,
																"compChildren": [],
																"gateChildren": []
														}
												};
												graph.sidebar.LogicNodeList.push(newLogicNode);
												graph.zoomActual();
												graph.zoomOut();

										}
										else {
												alert(retObj.newName + " is already added to that cell");
										}
										
								}

						}
						return true;
				},
				componentDiagrams,
				true, //ismodal
				null,
				null,
				500, //width
				250 //height
		);
}



function addBE(graph, cell) {
		var url = "EditForms/CompAdder.html";
		var componentDiagrams = [];
		var diagramList = graph.sidebar.DiagramList;
		for (var i = 0; i < diagramList.length; i++) {
				if (diagramList[i].Diagram.diagramType == "dtComponent") {
						var obj = diagramList[i].Diagram;
						componentDiagrams.push(obj);
						//TODO: do not add diagrams that already exist
				}
		}
		mxWindow.createFrameWindow(
				url,
				'OK, Cancel',  //command buttons
				'minimize, maximize, close', //top buttons
				function (btn, retObj) {
						if (btn === 'OK') {
										//check to make sure component not already child
								var alreadyExist = false;
								var compChildren;
								var newDiagram = retObj.element;
								var index = -1;
								for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
										if (graph.sidebar.LogicNodeList[i].LogicNode.name == cell.value) {
												compChildren = graph.sidebar.LogicNodeList[i].LogicNode.compChildren;
												index = i;
										}
								}
								if (!compChildren) {
                  graph.sidebar.LogicNodeList[index].LogicNode.compChildren = [];
								}
								for (var i = 0; i < compChildren.length; i++) {
										if (compChildren[i] == newDiagram.name) {
												alreadyExist = true;
										}
								}
								if (!alreadyExist) {
										AddChildComp(graph, cell, newDiagram);
										graph.sidebar.LogicNodeList[index].LogicNode.compChildren.push(newDiagram.name);
								}
								else {
										alert(newDiagram.name + " is already added to that cell");
              }
              graph.getModel().endUpdate();

						}
						return true;

				},
				componentDiagrams,
				true, //ismodal
				null,
				null,
				450, //width
				200 //height
		);
}



//TODO
function ErrorMessage(message) {

}






//Patches

mxLayoutManager.prototype.getCellsForChange = function (change) {
  var model = this.getGraph().getModel();

  if (change instanceof mxChildChange) {
    return [change.child, change.previous, model.getParent(change.child)];
  }
  else if (change instanceof mxTerminalChange || change instanceof mxGeometryChange) {
    return [change.cell, model.getParent(change.cell)];
  }
  else if (change instanceof mxVisibleChange || change instanceof mxStyleChange) {
    return [change.cell];
  }

  return [];
};


//Override to not allow individual overlay cells to be deleted.
var graphRemoveCells = mxGraph.prototype.removeCells;
mxGraph.prototype.removeCells = function (cells, includeEdges) {
  if (!cells) {
    cells = this.getDeletableCells(this.getSelectionCells());
  }

  var i = 0;
  while (i < cells.length) {
    var cell = cells[i];
    if (!(cell.value instanceof FTItem) && (!cell.forceDelete)) {
      cells.splice(i, 1);
    }
    else
      ++i;
  }
  return graphRemoveCells.apply(this, [cells, true]);
};

//override to not allow an edge to be selected.  If edge allows to be selected, it can be deleted, moved and disconnect form state.
mxGraph.prototype.isCellSelectable = function (cell) {
  if (cell.isEdge())
    return false;
  else
    return this.isCellsSelectable();
};
