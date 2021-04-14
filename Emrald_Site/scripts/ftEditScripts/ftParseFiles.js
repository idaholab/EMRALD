// JavaScript source code

function FTItemArray()
{
  this.ftItems = new Object();
}

FTItemArray.prototype.AddItem = function (toAddItem)
{
  this.ftItems[toAddItem.name] = toAddItem;
}

FTItemArray.prototype.Sort = function ()
{
  this.ftItems.sort(function (a, b)
  {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  });
}

function ParseBED(filename, ftNodes)
{
  var req = mxUtils.load(filename);
  var text = req.getText();

  var lines = text.split('\n');

  try
  {
    var i = 0;
    var curLine = lines[i].trim();

    ////remove comments and header to get to description line
    //while (curLine.length = 0 ||
    //       curLine.substring(0, 1) == "*" ||
    //       curLine != 'Descriptions') {
    //  i = i + 1;
    //  curLine = lines[i].trim();
    //}

    i = 3;

    for (i; i < lines.length; i++)
    {
      parsedLine = lines[i].trim().replace(/\s+/g, ' '); //remove all excess white space
      parsedLine = parsedLine.split(",");

      if (parsedLine[0] != "" &&
          parsedLine.length <= 2)
      {
        if (parsedLine[1].substring(0, 1) == "")
        {
          window.alert('Error in BED file, not enough data on line : ' + i + " - " + lines[i]);
          break;
        }

        //var inputs = parsedLine.slice(2);
        var name = parsedLine[0].trim();
        var ftItem = ftNodes.ftItems[name];
        if (ftItem == undefined)
        {
          ftNodes.AddItem(new FTItem(0, name, parsedLine[1], 'BE', -1.0, undefined));
        }
        else
        {
          ftItem.desc = parsedLine[1];
        }
      }
    }
  } finally
  {

  }
}

function ParseGTD(filename, ftNodes)
{
  var req = mxUtils.load(filename);
  var text = req.getText();

  var lines = text.split('\n');

  try
  {
    var i = 0;
    var curLine = lines[i].trim();

    ////remove comments and header to get to description line
    //while (curLine.length = 0 ||
    //       curLine.substring(0, 1) == "*" ||
    //       curLine != 'Descriptions') {
    //  i = i + 1;
    //  curLine = lines[i].trim();
    //}

    i = 1;

    for (i; i < lines.length; i++)
    {
      parsedLine = lines[i].trim().replace(/\s+/g, ' '); //remove all excess white space
      parsedLine = parsedLine.split(",");

      if (parsedLine[0] != "" &&
          parsedLine.length <= 2)
      {
        if (parsedLine[1].substring(0, 1) == "")
        {
          window.alert('Error in GTD file, not enough data on line : ' + i + " - " + lines[i]);
          break;
        }

        //var inputs = parsedLine.slice(2);
        var name = parsedLine[0].trim();
        var ftItem = ftNodes.ftItems[name];
        if (ftItem == undefined)
        {
          ftNodes.AddItem(new FTItem(0, name, parsedLine[1], 'Gate', -1.0, undefined));
        }
        else
        {
          ftItem.desc = parsedLine[1];
        }
      }
    }
  } finally
  {

  }
}


function ParseBEI(filename, ftNodes)
{
  var req = mxUtils.load(filename);
  var text = req.getText();

  var lines = text.split('\n');

  try
  {
    var i = 0;
    var curLine = lines[i].trim();

    ////remove comments and header to get to description line
    //while (curLine.length = 0 ||
    //       curLine.substring(0, 1) == "*" ||
    //       curLine != 'Descriptions') {
    //  i = i + 1;
    //  curLine = lines[i].trim();
    //}

    i = 3;

    for (i; i < lines.length; i++)
    {
      parsedLine = lines[i].trim().replace(/\s+/g, ' '); //remove all excess white space
      parsedLine = parsedLine.split(",");

      if (parsedLine[0] != "" &&
          parsedLine.length >= 6)
      {
        if (parsedLine[5].substring(0, 1) == "")
        {
          window.alert('Error in GTD file, not enough data on line : ' + i + " - " + lines[i]);
          break;
        }

        //var inputs = parsedLine.slice(2);
        var name = parsedLine[0].trim();
        var ftItem = ftNodes.ftItems[name];
        if (ftItem == undefined)
        {
          ftNodes.AddItem(new FTItem(0, name, '', 'BE', parsedLine[5], undefined));
        }
        else
        {
          ftItem.value = parsedLine[5];
        }
      }
    }
  } finally
  {

  }
}

// Custom parser for FTL format
function ParseFTL(graph, filename, ftNodes)
{
  var model = graph.getModel();

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  var req = mxUtils.load(filename);
  var text = req.getText();

  var lines = text.split('\n');

  // Creates the lookup table for the ftNodes

  // Parses all lines (vertices must be first in the file)
  graph.getModel().beginUpdate();
  try
  {
    var i = 0;
    var curLine = lines[i].trim();

    //remove comments and get to project line
    while (curLine.length = 0 ||
            curLine.substring(0, 1) == "*")
    {
      i = i + 1;
      curLine = lines[i].trim();
    }

    var parsedLine = lines[i].trim().split(" ");
    if (parsedLine.length < 2)
    {
      window.alert('Error in FTL file, missing header Info - ' + lines[i]);
      return;
    }

    projName = parsedLine[0].replace(",", "");
    //projName = projName;
    ftName = parsedLine[1];
    i = i + 1;


    for (i; i < lines.length; i++)
    {
      parsedLine = lines[i].trim().replace(/\s+/g, ' '); //remove all excess white space
      parsedLine = parsedLine.split(" ");

      if (parsedLine[0] != "" &&
              parsedLine[0].substring(0, 1) != "*" &&
              parsedLine[0].substring(0, 1) != "^")
      {
        if (parsedLine.length < 3)
        {
          window.alert('Error in FTL file, not enough data on line : ' + i + " - " + lines[i]);
          break;
        }

        var inputs = parsedLine.slice(2);

        //TODO : if the item is a n/m gate then add the additional parameters
        var ftItem = ftNodes.ftItems[parsedLine[0]];
        if (ftItem == undefined)
        {
          ftNodes.AddItem(new FTItem(0, parsedLine[0], "", parsedLine[1], -1.0, inputs));
        }
        else
        {
          ftItem.gType = parsedLine[1];
          ftItem.inputs = inputs;
        }

      }
    }
    //ftNodes.Sort();


    BuildTree(graph, parent, ftNodes, ftName);

  }
  finally
  {
    graph.getModel().endUpdate();
  }
}