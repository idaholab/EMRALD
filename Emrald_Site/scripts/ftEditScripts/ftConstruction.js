// JavaScript source code
function FTItem(id, name, desc, gType, value, inputs, var1, var2)
{
  this.id = id; 
  this.name = name;
  this.desc = desc;
  this.gType = gType;
  this.value = value;
  this.inputs = inputs;
  this.var1 = var1;
  this.var2 = var2;
  this.expanded = true;

  this.getId = function () { return this.id; }
  this.setId = function (value) { this.id = value; }
  this.getName = function () { return this.name; }
  this.setName = function (value) { this.name = value; }
  this.getDesc = function () { return this.desc; }
  this.setDesc = function (value) { this.desc = value; }
  this.getgType = function () { return this.gType; }
  this.setgType = function (value) { this.gType = value; }
  this.getValue = function () { return this.value; }
  this.setValue = function (value) { this.value = value; }
  this.getInputs = function () { return this.inputs; }
  this.setInputs = function (value) { this.inputs = value; }
  this.getVar1 = function () { return this.var1; }
  this.setVar1 = function (value) { this.var1 = value; }
  this.getVar2 = function () { return this.var2; }
  this.setVar2 = function (value) { this.var2 = value; }
  this.getExpanded = function () { return this.expanded; }
  this.setExpanded = function (value) { this.expanded = value;}
}


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

    vertex = graph.insertVertex(parent, ftNode.name + '~Name', ftNode.name, 0, 0, itemWidth, itemHeight, styleType );
   // vertex.geometry.alternateBounds = new mxRectangle(0, 0, 200, 50);
    vertex.geometry.offset = new mxPoint(0,0);

    // This stores the gate JSON in a way that's easily retrievable while still using a string as the actual label
    var valueItem = graph.insertVertex(vertex, ftNode.name + '~Value', ftNode, 0, 0, 0, 0, 'ftValue');
    valueItem.parentCell = vertex;
    valueItem.setVisible(false);

    var descItem = graph.insertVertex(vertex, ftNode.name + '~Desc', ftNode.desc, 0, 0, 0, 0, 'ftDesc;whiteSpace=wrap;', true);
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
    var nameItem = graph.insertVertex(vertex, comp.name + '~Name', comp.name, 0, 0, itemWidth - 20 - valSpace, 18, 'ftName;', true);
    nameItem.geometry.offset = new mxPoint(0, 0);
    vertex.nameItem = nameItem;

    var descItem = graph.insertVertex(vertex, comp.name + '~Desc', compDesc, 0, 0, 200, itemHeight - 22, 'ftDesc;whiteSpace=wrap;', true);
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
        if (vertex.value.name) {
					name = vertex.value.name;
        }
        name = vertex.value;
			}
			else if (vertex.id) {
					name = vertex.id;
			}
			if (vertex.style == "ftBasicEvent;") {
					if (vertex.edges && vertex.edges.length > 0) {
							var source = vertex.edges[0].source;
							var sName;
							if (source.value) {
									sName = source.value;
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




