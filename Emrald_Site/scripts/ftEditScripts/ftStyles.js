function configureStyleSheets(graph)
{
  // Set some stylesheet options for the visual appearance of vertices
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_SHAPE] = 'label';
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_SPACING_LEFT] = 0;
  style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
  style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
  style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
  style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_SOUTH;
  style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
  style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_FONTSTYLE] = '1';
  style[mxConstants.STYLE_SHADOW] = '1';
  style[mxConstants.STYLE_ROUNDED] = '1';
  style[mxConstants.STYLE_GLASS] = '1';
  //style[mxConstants.STYLE_DELETABLE] = 0;


  // Sets the default style for edges
  style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_STROKEWIDTH] = 3;
  style[mxConstants.STYLE_EXIT_X] = 0.5; // center
  style[mxConstants.STYLE_EXIT_Y] = 1.0; // bottom
  style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
  style[mxConstants.STYLE_ENTRY_X] = 0.5; // center
  style[mxConstants.STYLE_ENTRY_Y] = 0; // top
  style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
  style[mxConstants.STYLE_ENDARROW] = 'none';
  style.endArrow = 'none';

  // Disable the following for straight lines
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;

  //Style for the Gate Shape
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  style[mxConstants.STYLE_FONTCOLOR] = '#774400';
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_FONTSTYLE] = 2;
  style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
  style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
  //style[mxConstants.STYLE_DELETABLE] = 0;
  graph.getStylesheet().putCellStyle('ftGateShape', style);

  //Style for Name Part
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE; //SHAPE_IMAGE is just transparent if not image
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = '11';
  style[mxConstants.STYLE_FONTSTYLE] = 3;
  //style[mxConstants.STYLE_DELETABLE] = 0;
  graph.getStylesheet().putCellStyle('ftName', style);

  //Style for Description Part
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE; //SHAPE_IMAGE is just transparent if not image
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_FONTSTYLE] = 2;
  //style[mxConstants.STYLE_DELETABLE] = 0;
  graph.getStylesheet().putCellStyle('ftDesc', style);

  //Style for BE Value Part
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_Center;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_FONTSTYLE] = 2;  
  style[mxConstants.STYLE_OPACITY] = '60';
  style[mxConstants.STYLE_SHADOW] = null;
  style[mxConstants.STYLE_STROKECOLOR] = 'black';
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_FILLCOLOR] = '#EEEEEE';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  //style[mxConstants.STYLE_DELETABLE] = 0;
  graph.getStylesheet().putCellStyle('ftValue', style);

  //Style for BE Item Part
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = 'label';
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_SPACING_LEFT] = 0;
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'orange';
  style[mxConstants.STYLE_FILLCOLOR] = 'yellow';
  style[mxConstants.STYLE_STROKECOLOR] = 'black'; //line around item
  style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
  style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
  style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
  style[mxConstants.STYLE_FONTSIZE] = '10';
  style[mxConstants.STYLE_FONTSTYLE] = '1';
  style[mxConstants.STYLE_SHADOW] = '1';
  style[mxConstants.STYLE_ROUNDED] = '1';
  style[mxConstants.STYLE_GLASS] = '1';
  graph.getStylesheet().putCellStyle('ftBasicEvent', style);

  //style[mxConstants.STYLE_GRADIENTCOLOR] = 'black';
  //style[mxConstants.STYLE_STROKECOLOR] = 'red';
  //style[mxConstants.STYLE_FILLCOLOR] = 'white';

}// JavaScript source code
