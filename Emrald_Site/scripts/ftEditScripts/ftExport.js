// JavaScript source code
// get a date from the tree logic
function SaveFTL(graph, filename)
{
  var model = graph.getModel();

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var treeTop = graph.getDefaultParent().children[0];

  //var cell = graph.getSelectionCell();
  //graph.traverse(treeTop, false, testTraverse);
  var ftl = { logicStr: '' };
  ftl.logicStr = "";
  var topName = TreeTraverse(model, treeTop, ftl);
  ftl.logicStr = projName + ", " + topName + "\n" + ftl.logicStr;
  alert(ftl.logicStr);
  //var obj = { item: "unchanged" };
  //TreeTraverse(model, treeTop, obj);
  //alert(obj.item);

  //graph.prototype.traverse = testTraverse;


  function TreeTraverse(model, vertex, resLogic, visited)
  {
    var curLine = '';
    var retName = '';

    if (vertex != null)
    {
      visited = visited || [];
      var id = mxCellPath.create(vertex);

      if (visited[id] == null)
      {
        visited[id] = vertex;

        //var curShape = graph.getView().getState(vertex).shape;
        //var gType = curShape.getGateType();
        //retName = curShape.getTitle();
        retName = vertex.value.name;
        if (vertex.value.gType != 'BE')
        {
          curLine = retName + ' ' + vertex.value.gType + ' ';
        }


        var edgeCount = model.getEdgeCount(vertex);
        var inputsStr = '';

        if (edgeCount > 0)
        {
          for (var i = 0; i < edgeCount; i++)
          {
            var e = model.getEdgeAt(vertex, i);
            var isSource = model.getTerminal(e, true) == vertex;

            if (isSource)
            {
              var next = model.getTerminal(e, !isSource);
              inputsStr = inputsStr + TreeTraverse(model, next, resLogic, visited) + ' ';
            }
          }
        }
        if (curLine != '')
        {
          curLine = curLine + inputsStr;
          resLogic.logicStr = resLogic.logicStr + curLine + '\n';
        }
      }
    }

    return retName;
  };

  //function testTraverse(vertex,edge)
  //{
  //  //vertex
  //  var curShape = graph.getView().getState(vertex).shape;
  //  var gInputs = '';
  //  for (var i=0; i<vertex)
  //  resStr = resStr + curShape.getTitle + " " + curShape.gateType + " " ;
  //  //graph.getView().getState(vertex).shape.title
  //  //model.state[0].name;


  //}


  //var model = graph.getModel();

  //// Gets the default parent for inserting new cells. This
  //// is normally the first child of the root (ie. layer 0).
  //var parent = graph.getDefaultParent();
  //var resStr = "";

  //GenerateFTLStrRec(parent);


  //function GenerateFTLStrRec(pNode)
  //{
  //  resStr = resStr + "node \n";
  //  alert("Node");

  //  for (var i = 0; i < parent.getChildCount; i++)
  //  {
  //    //GenerateFTLStrRec(pNpde.)
  //  }
  //}



};