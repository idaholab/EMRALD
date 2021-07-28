/**
 * @file Logic for constructing fault trees.
 */

/**
 * Constructs FTItem.
 * 
 * @class ftEditor#FTItem
 * @classdesc An item in a fault tree.
 * @constructs
 * @param {number} id The item ID.
 * @param {string} name The item name.
 * @param {string} desc The item description.
 * @param {string} gType The item gate type.
 * @param {string} value The item value.
 * @param {string[]} inputs Item gate inputs.
 * @param {string} var1 Var 1 name.
 * @param {string} var2 Var 2 name.
 */
function FTItem(id, name, desc, gType, value, inputs, var1, var2)
{
  /**
   * The item ID.
   * 
   * @name ftEditor#FTItem#id
   * @type {number}
   */
  this.id = id;

  /**
   * The item name.
   * 
   * @name ftEditor#FTItem#name
   * @type {string}
   */
  this.name = name;

  /**
   * The item description.
   * 
   * @name ftEditor#FTItem#desc
   * @type {string}
   */
  this.desc = desc;

  /**
   * The item gate type.
   * 
   * @name ftEditor#FTItem#gType
   * @type {string}
   */
  this.gType = gType;

  /**
   * The item value.
   * 
   * @name ftEditor#FTItem#value
   * @type {string}
   */
  this.value = value;

  /**
   * The item gate inputs.
   * 
   * @name ftEditor#FTItem#inputs
   * @type {string[]}
   */
  this.inputs = inputs;

  /**
   * Item var 1 name.
   * 
   * @name ftEditor#FTItem#var1
   * @type {string}
   */
  this.var1 = var1;

  /**
   * Item var 2 name.
   * 
   * @name ftEditor#FTItem#var2
   * @type {string}
   */
  this.var2 = var2;

  /**
   * If the item is expanded.
   * 
   * @name ftEditor#FTItem#expanded
   * @type {boolean}
   */
  this.expanded = true;

  /**
   * Gets the item ID.
   * 
   * @name ftEditor#FTItem#getId
   * @function
   * @returns {number} The item ID.
   */
  this.getId = function () { return this.id; }

  /**
   * Sets the item ID.
   * 
   * @name ftEditor#FTItem#setId
   * @function
   * @param {number} value The new ID.
   */
  this.setId = function (value) { this.id = value; }

  /**
   * Gets the item name.
   * 
   * @name ftEditor#FTItem#getName
   * @function
   * @returns {string} The item name.
   */
  this.getName = function () { return this.name; }

  /**
   * Sets the item name.
   * 
   * @name ftEditor#FTItem#setName
   * @function
   * @param {string} value The new item name.
   */
  this.setName = function (value) { this.name = value; }

  /**
   * Gets the item description.
   * 
   * @name ftEditor#FTItem#getDesc
   * @function
   * @returns {string} The item description.
   */
  this.getDesc = function () { return this.desc; }

  /**
   * Sets the item description.
   * 
   * @name ftEditor#FTItem#setDesc
   * @function
   * @param {string} value The new description.
   */
  this.setDesc = function (value) { this.desc = value; }

  /**
   * Gets the gate type.
   * 
   * @name ftEditor#FTItem#getgType
   * @function
   * @returns {string} The gate type.
   */
  this.getgType = function () { return this.gType; }

  /**
   * Sets the gate type.
   * 
   * @name ftEditor#FTItem#setgType
   * @function
   * @param {string} value The new gate type.
   */
  this.setgType = function (value) { this.gType = value; }

  /**
   * Gets the item value.
   * 
   * @name ftEditor#FTItem#getValue
   * @function
   * @returns {string} The item value.
   */
  this.getValue = function () { return this.value; }

  /**
   * Sets the item value.
   * 
   * @name ftEditor#FTItem#setValue
   * @function
   * @param {string} value The new item value.
   */
  this.setValue = function (value) { this.value = value; }

  /**
   * Gets the gate inputs.
   * 
   * @name ftEditor#FTItem#getInputs
   * @function
   * @returns {string[]} The gate inputs.
   */
  this.getInputs = function () { return this.inputs; }

  /**
   * Sets the gate inputs.
   * 
   * @name ftEditor#FTItem#setInputs
   * @function
   * @param {string[]} value The new inputs.
   */
  this.setInputs = function (value) { this.inputs = value; }

  /**
   * Gets var 1 name.
   * 
   * @name ftEditor#FTItem#getVar1
   * @function
   * @returns {string} Var 1 name.
   */
  this.getVar1 = function () { return this.var1; }

  /**
   * Sets var 1 name.
   * 
   * @name ftEditor#FTItem#setVar1
   * @function
   * @param {string} value The new variable name.
   */
  this.setVar1 = function (value) { this.var1 = value; }

  /**
   * Gets var 2 name.
   * 
   * @name ftEditor#FTItem#getVar2
   * @function
   * @returns {string} Var 2 name.
   */
  this.getVar2 = function () { return this.var2; }

  /**
   * Sets var 2 name.
   * 
   * @name ftEditor#FTItem#setVar2
   * @function
   * @param {string} value The new variable name.
   */
  this.setVar2 = function (value) { this.var2 = value; }

  /**
   * Gets if the item is expanded.
   * 
   * @name ftEditor#FTItem#getExpanded
   * @function
   * @returns {boolean} If the item is expanded.
   */
  this.getExpanded = function () { return this.expanded; }

  /**
   * Sets the item's expanded state.
   * 
   * @name ftEditor#FTItem#setExpanded
   * @function
   * @param {boolean} value The new expanded state.
   */
  this.setExpanded = function (value) { this.expanded = value;}
}

/**
 * Builds a tree.
 * 
 * @name ftEditor#BuildTree
 * @function
 * @param {mxGraph} graph The graph.
 * @param {mxCell} parent The parent mxCell.
 * @param {LogicNode} tree The tree to build.
 */
function BuildTree(graph, parent, tree)
{
  var itemCnt = 1;

  function BuildTreeRec(parentCell, node)
  {
    if (node != undefined)
    {
      if (parentCell == null)
        var addedChild = AddChildGate(graph, parent, node.LogicNode);
      else
        var addedChild = AddChildGate(graph, parentCell, node.LogicNode);

      //addedChild.value = node.LogicNode;
      if (node.LogicNode.gateChildren != undefined)
      {
        for (var i = 0; i < node.gateChildren.length; i++)
        {
          BuildTreeRec(addedChild, node.gateChildren[i].LogicNode);
        }
      }

      if (node.LogicNode.compChildren != undefined) {
        for (var i = 0; i < node.compChildren.length; i++) {
          AddChildComp(graph, addedChild, node.compChildren[i]);
        }
      }
    }
  }

  var w = graph.container.offsetWidth;
  
  var shapeStr;
  shapeStr = 'shape=stateShape;whiteSpace=wrap;align=center;verticalAlign=top';

  BuildTreeRec(null, tree.LogicNode);
}

//var mxTextUpdateBoundingBox = mxText.prototype.updateBoundingBox;
//mxText.prototype.updateBoundingBox = function () {
//  mxTextUpdateBoundingBox.apply(this, arguments);
//  this.boundingBox.height = 50;
//  this.boundingBox.width = 200;
//  this.boundingBox.x = 0;
//}


/**
 * Adds a child gate to the editor.
 * 
 * @name ftEditor#AddChildGate
 * @function
 * @param {mxGraph} graph The editor graph.
 * @param {mxCell} cell The parent gate.
 * @param {object} ftNode The new gate data.
 * @returns {mxVertex} The connection to the new gate.
 */
function AddChildGate(graph, cell, ftNode) {

  var model = graph.getModel();
  var parent = graph.getDefaultParent();
  var vertex;

  model.beginUpdate();
  try {
    var itemHeight = Globals.ftNodeSettings.height;
    var itemWidth = Globals.ftNodeSettings.width;
    var valSpace = Globals.ftNodeSettings.valSpace; //change according to precision
    var gateImgSize = Globals.ftNodeSettings.gateImgSize;


    var shapeStr = '';
    var styleMod = '';
    var imgName = new String;
    
    //determine the icon and style to use
    var styleType = new String;
    switch (ftNode.gateType) {
      case "gtOr":
        imgName = 'ORGate.png';
        styleType = 'ftGate;';
        break;

      case "gtAnd":
        imgName = 'ANDGate.png';
        styleType = 'ftGate;';
        break;
			}
			if (!ftNode.gateChildren) {
					ftNode.gateChildren = [];
			}
			if (!ftNode.compChildren) {
					ftNode.compChildren = [];
			}

    vertex = graph.insertVertex(parent, ftNode.name + '~Name', ftNode, 0, 0, itemWidth, itemHeight, styleType );
   // vertex.geometry.alternateBounds = new mxRectangle(0, 0, 200, 50);
    vertex.geometry.offset = new mxPoint(0,0);

    var descItem = graph.insertVertex(vertex, ftNode.desc + '~Desc', ftNode, 0, 0, 200, 22, 'ftDesc;whiteSpace=wrap;', true);
    descItem.geometry.offset = new mxPoint(0, 22);
    descItem.parentCell = vertex;
 
    // Add the gate icon item
    var gate = graph.insertVertex(vertex, ftNode.name + '~Gate', '', .5, 1, gateImgSize, gateImgSize,
        'ftGateShape;image=images/' + imgName + ';', true);
    gate.geometry.offset = new mxPoint(-12, -1);

    //vertex.gate = gate;
    //var nameItem = graph.insertVertex(vertex, ftNode.name + '~Name', ftNode, 0, 0, itemWidth - 22, 18, 'ftName;align=center', true);
    //nameItem.geometry.offset = new mxPoint(-20, 0);
    //vertex.nameItem = nameItem;
      

    var edge = graph.insertEdge(parent, null, '', cell, vertex);

    // Configures the edge label "in-place" to reside
    // at the end of the edge (x = 1) and with an offset
    // of 20 pixels in negative, vertical direction.
    edge.geometry.x = 1;
    edge.geometry.y = 0;
    edge.geometry.offset = new mxPoint(0, -20);

    // add the edit and delete button at bottom right corner.
    addOverlays(graph, vertex, true);
			var name;
			if (cell.value) {
					name = cell.value.name;
					for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
							if (graph.sidebar.LogicNodeList[i].LogicNode) {
									if (graph.sidebar.LogicNodeList[i].LogicNode.name == name) {
											var gateChildren = graph.sidebar.LogicNodeList[i].LogicNode.gateChildren;
											var alreadyAdded = false;
											for (var k = 0; k < gateChildren.length; k++) {
													if (gateChildren[k] == ftNode.name) {
															alreadyAdded = true;
													}
											}
											if (!alreadyAdded) {
													graph.sidebar.LogicNodeList[i].LogicNode.gateChildren.add(ftNode.name);
											}

									}
							}
					}
			}
    return vertex;
  }

  finally {
    model.endUpdate();
		}


    return vertex;
};

/**
 * Adds a child component diagram to the editor.
 * 
 * @name ftEditor#AddChildComp
 * @function
 * @param {mxGraph} graph The editor graph.
 * @param {mxCell} cell The parent gate.
 * @param {object} comp The component diagram.
 * @returns {mxVertex} The connection to the new gate.
 */
function AddChildComp(graph, cell, comp)
{
  //comp is a data Model Diagram.
  var model = graph.getModel();
  var parent = graph.getDefaultParent();
  var vertex;

  model.beginUpdate();
  try
  {
    var itemHeight = Globals.ftNodeSettings.height;
    var itemWidth = Globals.ftNodeSettings.width;
    var valSpace = Globals.ftNodeSettings.valSpace; //change according to precision
    var gateImgSize = Globals.ftNodeSettings.gateImgSize;

    var sb = graph.sidebar;
    var ds = graph.DiagramList;
    var compDesc = null;
    for (var i = 0; i < ds.length; i++) {
      if (ds[i].Diagram.name == comp.name) {
        compDesc = ds[i].Diagram.desc;
        break;
      }
    }

    var shapeStr = '';
    var styleMod = '';

    var imgName = 'BE.png';
    var styleType = 'ftBasicEvent;';

    

    vertex = graph.insertVertex(parent, comp.name, null, 0, 20, itemWidth, itemHeight, styleType );
    vertex.geometry.alternateBounds = new mxRectangle(0, 0, 200, 30);
    imgName = 'BE.png';

      // Add the gate icon item
    var gate = graph.insertVertex(vertex, comp.name + '~Gate', '', .5, 1, gateImgSize, gateImgSize,
          'ftGateShape;image=images/' + imgName + ';', true);
    gate.geometry.offset = new mxPoint(-12, -1);

    vertex.gate = gate;
    var nameItem = graph.insertVertex(vertex, comp.name + '~Name', comp, 0, 0, itemWidth - 20 - valSpace, 18, 'ftName;', true);
    nameItem.geometry.offset = new mxPoint(0, 0);
    vertex.nameItem = nameItem;

    var descItem = graph.insertVertex(vertex, comp.desc + '~Desc', compDesc, 0, 0, 200, itemHeight - 22, 'ftDesc;whiteSpace=wrap;', true);
    descItem.geometry.offset = new mxPoint(0, 18);
    vertex.descItem = descItem;

      //gate.geometry.offset = new mxPoint(-12, -1);

    var edge = graph.insertEdge(parent, null, '', cell, vertex);

    // Configures the edge label "in-place" to reside
    // at the end of the edge (x = 1) and with an offset
    // of 20 pixels in negative, vertical direction.
    edge.geometry.x = 1;
    edge.geometry.y = 0;
    edge.geometry.offset = new mxPoint(0, -20);


    addOverlays(graph, vertex, true);

    return vertex;
  }

  finally
  {
    model.endUpdate();
  }

  return vertex;
};


//function expandCollapseTree(graph, cell)
//{
//  graph.getModel().beginUpdate();

//  cell.value.expanded = !cell.value.expanded;
//  if (cell.value.expanded)
//  {
//    cell.overlays[0].image = new mxImage('images/Navigate_minus.png', 20, 20);
//    cell.overlays[0].tooltip = 'Collapse';
//  }
//  else
//  {
//    cell.overlays[0].image = new mxImage('images/Navigate_plus.png', 20, 20);
//    cell.overlays[0].tooltip = 'Expand';
//  }

//  var model = graph.getModel();

//  var edgeCount = model.getEdgeCount(cell);
//  for (var i = 0; i < edgeCount; i++)
//  {
//    var e = model.getEdgeAt(cell, i);
//    var isSource = model.getTerminal(e, true) == cell;

//    if (isSource)
//    {
//      var next = model.getTerminal(e, !isSource);
//      SetCellVisbleRec(graph, next, cell.value.expanded)
//    }
//  }

//  graph.getModel().endUpdate();
//  graph.refresh(cell.parent);

//  function SetCellVisbleRec(graph, cell, show)
//  {
//    if ((show && (cell.value.expanded == show)) || (!show && (cell.value.expanded != show)))// || (cell.visible != show))
//    {
//      var childCount = model.getChildCount(cell);
//      for (var i = 0; i < childCount; i++)
//      {
//        model.setVisible(cell.children[i], show);
//      }

//      var edgeCount = model.getEdgeCount(cell);
//      for (var i = 0; i < edgeCount; i++)
//      {
//        var e = model.getEdgeAt(cell, i);
//        var isSource = model.getTerminal(e, true) == cell;

//        if (isSource)
//        {
//          var next = model.getTerminal(e, !isSource);
//          SetCellVisbleRec(graph, next, show);
//        }
//      }
//    }

//    model.setVisible(cell, show);
//  }
//};

/**
 * Deletes a subtree.
 * 
 * @name ftEditor#deleteSubtree
 * @function
 * @param {mxGraph} graph The editor graph.
 * @param {mxCell} cell The subtree to delete.
 */
function deleteSubtree(graph, cell)
{
  // Gets the subtree from cell downwards
  var cells = [];
  graph.traverse(cell, true, mxUtils.bind(graph,function (vertex)
  {
    
    //var st = this.getCellStyle(vertex);
    //st[mxConstants.STYLE_DELETABLE] = undefined;
    //this.model.setStyle(vertex, st);

    //if (vertex.gate) {
    //  st = this.getCellStyle(vertex.gate);
    //  st[mxConstants.STYLE_DELETABLE] = undefined;
    //  this.model.setStyle(vertex.gate, st);
    //}

    //if (vertex.nameItem) {
    //  st = this.getCellStyle(vertex.nameItem);
    //  st[mxConstants.STYLE_DELETABLE] = undefined;
    //  this.model.setStyle(vertex.nameItem, st);
    //}

    //if (vertex.valItem) {
    //  st = this.getCellStyle(vertex.valItem);
    //  st[mxConstants.STYLE_DELETABLE] = undefined;
    //  this.model.setStyle(vertex.valItem, st);
    //}
    //if (vertex.descItem) {
    //  st = this.getCellStyle(vertex.descItem);
    //  st[mxConstants.STYLE_DELETABLE] = undefined;
    //  this.model.setStyle(vertex.descItem, st);
    //}
    vertex.forceDelete = true;
    cells.push(vertex);
			//Delete it from sidebar
			var name;
			if (vertex.value) {
					name = vertex.value.name;
			}
			else if (vertex.id) {
					name = vertex.id;
			}
			if (vertex.style == "ftBasicEvent;") {
					if (vertex.edges && vertex.edges.length > 0) {
							var source = vertex.edges[0].source;
							var sName;
							if (source.value) {
									sName = source.value.name;
							}
							else if (source.id) {
									sName = source.id;
							}

							for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
									if (graph.sidebar.LogicNodeList[i].LogicNode) {
											if (graph.sidebar.LogicNodeList[i].LogicNode.name == sName) {
													var compChildren = graph.sidebar.LogicNodeList[i].LogicNode.compChildren;
													if (compChildren) {
															for (var k = 0; k < compChildren.length; k++) {
																	if (compChildren[k] == name) {
																			graph.sidebar.LogicNodeList[i].LogicNode.compChildren.splice(k, 1);
																			break;
																	}
															}
													}
											}
									}
							}
					}
			}
			else {
				for (var i = 0; i < graph.sidebar.LogicNodeList.length; i++) {
					if (graph.sidebar.LogicNodeList[i].LogicNode ) {
							if (graph.sidebar.LogicNodeList[i].LogicNode.name == name) {
									graph.sidebar.LogicNodeList.splice(i, 1);
							}
							
							var gateChildren = graph.sidebar.LogicNodeList[i].LogicNode.gateChildren;
							if (gateChildren) {
									for (var k = 0; k < gateChildren.length; k++) {
											if (gateChildren[k] == name) {
													graph.sidebar.LogicNodeList[i].LogicNode.gateChildren.splice(k, 1);
											}
									}
							}
							
					}
			}
			}
			
		

    return true;
  }));

  graph.removeCells(cells);
	

};




