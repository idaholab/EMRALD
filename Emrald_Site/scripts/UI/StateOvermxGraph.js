// Copyright 2021 Battelle Energy Alliance

'use strict';

//The original clear function remove out z-index and cursor,
//override to retain them.
var superShapeClear = mxShape.prototype.clear;
mxShape.prototype.clear = function () {
  if (this.node.ownerSVGElement != null) {
    this.node.style.visibility = 'visible';

    while (this.node.lastChild != null) {
      this.node.removeChild(this.node.lastChild);
    }
  }
  else {
    var zindex = this.node.style.zIndex;
    var cursor = this.node.style.cursor;
    this.node.style.cssText = 'position:absolute;';
    if (zindex)
      this.node.style.zIndex = zindex;
    if (cursor)
      this.node.style.cursor = cursor;
    this.node.innerHTML = '';
  }
}


//The original shape is a swimlane, override it to add additional
//two overlay cells "tableshape" inside.
var superCreateShape = mxCellRenderer.prototype.createShape;
mxCellRenderer.prototype.createShape = function (state) {
  var shape = superCreateShape.apply(this, arguments);
  if (shape.createChildrenShape) {
    shape.createChildrenShape(state.cell);
  }
  return shape;
};

//When a shape is redraw, we also need to override to recalculate
//the size to fit our inner cells.
var superCellRendererRedraw = mxCellRenderer.prototype.redraw;
mxCellRenderer.prototype.redraw = function (state, force, rendering) {
  superCellRendererRedraw.apply(this, arguments);
  if (state.shape != null && (rendering == null || rendering)) {
    if (state.shape instanceof StateShape) {
      mainApp.graph.fireEvent(new mxEventObject(mxEvent.UPDATE_CELL_SIZE, "cell",
        state.cell, "StateShape", state.shape));
    }
  }
};

//The original imageShape does not set zIndex by default, override to
//identity by adding 'elementType' attribute and defaulting zIndex = 60
//to move the image div (button) higher so it won't hide behind some 
//div panels.
var superImageShapeCreateHTML = mxImageShape.prototype.createHtml;
mxImageShape.prototype.createHtml = function () {
  var node = superImageShapeCreateHTML.apply(this);
  node.style.zIndex = 3;
  node.setAttribute("elementType", "mxImageShape");

  return node;
}

//original div control set zIndex = 1, override to ensure that if the
//control is an imageShape, it is higher.
var superCellRendererInitControl = mxCellRenderer.prototype.initControl;
mxCellRenderer.prototype.initControl = function(state, control, handleEvents, clickHandler) {
  var graph = state.view.graph;

  // In the special case where the label is in HTML and the display is SVG the image
  // should go into the graph container directly in order to be clickable. Otherwise
  // it is obscured by the HTML label that overlaps the cell.
  var isForceHtml = graph.isHtmlLabel(state.cell) && mxClient.NO_FO &&
		graph.dialect == mxConstants.DIALECT_SVG;

  if (isForceHtml) {
    control.dialect = mxConstants.DIALECT_PREFERHTML;
    control.init(graph.container);
    if (control.node.getAttribute("elementType") == "mxImageShape")
      control.node.style.zIndex = 3; // override just to add this.....
    else if (control.node.getAttribute('elementType') == 'mxSwimlane')
      control.node.style.zIndex = 2; // override just to add this.....
    else
      control.node.style.zIndex = 1;
  }
  else {
    control.init(state.view.getOverlayPane());
  }

  var node = control.innerNode || control.node;

  if (clickHandler) {
    if (graph.isEnabled()) {
      node.style.cursor = 'pointer';
    }

    mxEvent.addListener(node, 'click', clickHandler);
  }

  if (handleEvents) {
    mxEvent.addGestureListeners(node,
			function (evt) {
			  graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state));
			  mxEvent.consume(evt);
			},
			function (evt) {
			  graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state));
			});
  }

  return node;
}


//Handlers override
// Overrides check for valid roots
mxGraph.prototype.isValidRoot = function () {
  return false;
};


// Don't clear selection if multiple cells selected
var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
mxGraphHandler.prototype.mouseDown = function (sender, me) {
 graphHandlerMouseDown.apply(this, arguments);
  var state = this.graph.getView().getState(me.getCell());
  if (state && state.shape) {
    if (state.shape instanceof TableShape) {
      // this.graph.setSelectionCell(me.getCell().parent);
    }
    else if (state && state.shape instanceof mxConnector) {
      this.graph.setSelectionCell(me.getCell());
    }
  }
  if (this.graph.isCellSelected(me.getCell()) && this.graph.getSelectionCount() > 1) {
    this.delayedSelection = false;
  }
};

// Selection is delayed to mouseup: not allow child cell to be selected.
var graphHandlerIsDelayedSelection = mxGraphHandler.prototype.isDelayedSelection;
mxGraphHandler.prototype.isDelayedSelection = function (cell) {
  var result = graphHandlerIsDelayedSelection.apply(this, arguments);
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
    if (!this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
      result = true;
    }
  }
  return result;
};

// Delayed selection of parent group, always select the parent group only.
mxGraphHandler.prototype.selectDelayed = function (me) {
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var cell = me.getCell();
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
    while (!this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
      cell = parent;
      parent = this.graph.getModel().getParent(cell);
    }
  }
	if (cell && cell.value) {
		var name;
		if (cell.value.State) {
						name = cell.value.State.name;
		}
		else {
			name = cell.value.name;
		}
    console.log("selectDelayed: " + name);
    this.graph.selectCellForEvent(cell, me.getEvent());
  }
};
