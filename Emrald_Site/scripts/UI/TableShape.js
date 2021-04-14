// Copyright 2021 Battelle Energy Alliance

/*this handles the GUI of everything contained inside a state object in a diagram editor */

'use strict';
//------------------------------------------------------
function TableShape(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);

  //The shape is just an empty shell, the label is the heart of the shape.

  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = (strokewidth != null) ? strokewidth : 1;



  //The label for the TableShape is the entire content -- really is a table of tables.
  this.getLabel = function (cell) {
    var parentState = cell.parent.value.State;
    var graph = mainApp.graph;
    var section = cell.value;
    var content = "";
    if (section.dataType == "actions" || section.dataType == "events") {
      if (graph.isCellCollapsed(cell)) {
        content += '<table style="overflow:hidden;" width="100%" cellpadding="4" class="title" style="height:100%;">' +
          '<tr><th colspan="2">' + section.name + '</th></tr>' +
          '</table>';
      }
      else {

        // To allow scrollbar, the header is in a separate table.  Scrollbar is 
        // on the div.
        content +=
          '<table cellpadding="4" class="title" datatype="' + section.dataType + '"> ' +
          '<tr><th colspan="2" row-type="' + section.dataType + 'Header" dataType="' + section.dataType + '">' + section.name + '</th></tr>' +
          '</table>' +
          '<div section = "top" class="cellPanel" dataType="' + section.dataType + '" >' +
          '<table width="100%" cellpadding="4" class="erd">';


        /////////////////////////////////////////////////////////////////
        //Add logic to validate probs
        if (section.items) {
          var tips = "";
          //First check how many items in section have prob -1
          var pCounter = 0;
          var pSum = 0;
          for (var j = 0; j < section.items.length; j++) {
            var newStates = null;
            if (section.items[j].value) {
              newStates = section.items[j].value.newStates;
            }
            if (newStates && newStates.length > 0) {
              var prob = newStates[0].prob;
              if (prob == -1) {
                pCounter += 1;
              }
              else {
                pSum += newStates[0].prob;
              }
            }
          }

          for (var i = 0; i < section.items.length; i++) {
            var item = section.items[i];
            item.itemId = i;
            var isValid = "True";
            var overOne = "False";
            var newStates = null;
            if (item.value) {
              newStates = item.value.newStates;
            }
            if (newStates && newStates.length > 0) {
              if ((newStates[0].prob == -1 && pCounter > 1) || (!newStates[0].prob)) {
                isValid = "False";
              }
              if (newStates[0].prob != -1 && pSum > 1) {
                overOne = "True";
              }
            }

            content +=
              '<tr row-type="ImmediateAction"  dataType="' + item.dataType + '">' +
              '<td datatype="' + item.dataType + '" width="20" style="text-align:center;" >';

            if (section.dataType == "actions") {
              if (item.Action) {
                item.value = item.Action;
              }
              switch (item.value.actType) {
                case "atTransition":
                  content +='<img style="width:12px;height:12px;" src="images/TransitionArrow.png"/>';
                  break;
                case "atCngVarVal":
                  content += '<img style="width:12px;height:12px;" src="images/varCond.png"/>';
                  break;
                case "at3DSimMsg":
                  content += '<img style="width:12px;height:12px;" src="images/extSim.png"/>';
                  break;
                case "atRunExtApp":
                  content += '<img style="width:12px;height:12px;" src="images/cogwheel.png"/>';
                  break;
                default:
                  content += '<img style="width:12px;height:12px;" src="images/cogwheel.png"/>';
              }

              
              if (item.value.actType == "atTransition" && item.value.newStates.length == 0) {
                content += "<img src='images/questionOrange.png' style='width:12px;margin-right:5px;' />";
                tips += "Warning: " + "This transition does not go to any state" + '&#13';
              }
              else if (overOne == "True" && item.value.mutExcl) {
                content += "<img src='images/questionOrange.png' style='width:12px;margin-right:5px;' />";
                tips += "Error: " + "The sum of all the immediate action probability is greater than one" + '&#13';
              }
              /*else if (isValid == "True") {
                  content += "<img src='images/check.png' style='width:12px;margin-right:5px;' />";         
              }*/
              else if (isValid == "False") {
                content += "<img src='images/delete2.png' style='width:12px;margin-right:5px;' />";
                tips += "Error: " + "There are more then one immediate actions that has REMAINDER probability" + '&#13';
              }

            }
            else {
              if (item.Event) {
                item.value = item.Event;
              }

              var evType = item.value.evType;
              if (evType) {
                switch (evType) {
                  case "etTimer":
                    content +=
                      '<img style="width:12px;height:12px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/alarm.png"/>';
                    break;
                  case "etFailRate":
                    content +=
                      '<img style="width:16px;height:16px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/dice.png"/>';
                    break;
                  case "et3dSimEv":
                    content +=
                      '<img style="width:12px;height:12px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/extInput.png"/>';
                    break;
                  case "etVarCond":
                    content +=
                      '<img style="width:18px;height:16px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/varCond.png"/>';
                    break;
                  case "etStateCng":
                    content +=
                      '<img style="width:16px;height:16px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/stateChange.png"/>';
                    break;
                  case "etComponentLogic":
                    content +=
                      '<img style="width:18px;height:18px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/compLogic.png"/>';
                    break;
                  case "etNormalDist":
                  case "etLogNormalDist":
                    content +=
                      '<img style="width:18px;height:18px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/dist.png"/>';
                    break;
                  case "etWeibullDist":
                    content +=
                      '<img style="width:18px;height:18px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/dist.png"/>';
                    break;
                  case "etExponentialDist":
                    content +=
                      '<img style="width:18px;height:18px;" dataType="' + item.dataType +
                      '" cellId="' + cell.getId() +
                      '" src="images/dist.png"/>';
                    break;

                }


              }
              else {
                content +=
                  '<img style="width:12px;height:12px;" dataType="' + item.dataType +
                  '" cellId="' + cell.getId() +
                  '" src="images/alarm.png"/>';
              }

            }
            content +=
              '</td>';

            //Building the tooltips for the section.

            for (var prop in item.value) {
              if ((typeof item.value[prop] == 'string') ||
                (typeof item.value[prop] == 'boolean') ||
                (typeof item.value[prop] == 'number')) {
                if (prop == "name" || prop == "desc")
                  tips += prop + ': ' + (item.value[prop]).toString().replace('<br/>', '&#13') + '&#13';
              }
            }

            if (item.value) {
              if (item.name !== item.value.name)
                item.name = item.value.name;
            }

            if (item.dataType == 'actions') {
              //an immediate action second
              content +=
                '<td colspan="2" title="' + tips +
                '" datatype="' + item.dataType + '" cellid="' + cell.getId() + '" itemid="'
                + item.itemId + '" actionid="-1">' + item.name;

              if (item.value.newStates) {
                var any = false;
                for (var k = 0; k < item.value.newStates.length; k++) {
                  if (!mainApp.getStateByName(item.value.newStates[k].toState)) {
                    item.actionId = k;
                    any = true;
                    break;
                  }
                }

                if (any) {
                  content += '<td dataType ="StateLink" title = "To state on other Diagram." ' +
                    ' width="10" style="text-align:right;">' +
                    ' <img style="width:12px;height:12px;" src="images/link.png" ' +
                    'dataType= "toStateAction" ' +
                    'cellid= "' + cell.getId() + '" ' +
                    'itemid= "' + item.itemId + '" ' +
                    'actionid= "' + item.actionId + '" ' +
                    '/>';

                }
              }

              content += '</td>';
            } else {
              //event action header.
              content +=
                '<td datatype="' + item.dataType + '" cellid="' + cell.getId() + '" itemId="' + item.itemId + '" >' +
                '<div section="actions" class="cellPanel" datatype="' + item.dataType + '">' +
                '<table style="overflow:auto;" width="100%" cellpadding="4" class="title" datatype="' + item.dataType + '"> ' +
                '<tr row-type="immediateAction" datatype="' + item.dataType + '">' +
                '<th colspan="2" row-type="eventActionHeader" title ="' + tips +
                '" datatype="' + item.dataType +
                '" cellId ="' + cell.getId() +
                '" itemId ="' + item.itemId + '">' + item.name;
              var indx = parentState.events.indexOf(item.name);
              if (indx > -1 && parentState.eventActions[indx] && parentState.eventActions[indx].moveFromCurrent) {
                content += "<img src='images/exit-icon.png' style='width:20px;position: absolute;right:10px;' />" + '</th>';
              }
              else {
                content += '</th>';
              }
              content += '</tr>' + '</table>';
              tips = "";

              //The Event Actions section host another table, which divided further into Event and Action called EventAction.

              if (item.dataType == "events"
                && item.eActions && item.eActions.length > 0) {
                pCounter = 0;
                pSum = 0;
                isValid = "True";
                for (var k = 0; k < item.eActions.length; k++) {
                  if (!item.eActions[k].value) {
                    var a = item.eActions[k];
                  }
                  var newStates = item.eActions[k].value.newStates;
                  if (newStates[0]) {
                    var prob = newStates[0].prob;
                    if (prob == -1) {
                      pCounter += 1;
                    }
                    else {
                      pSum += newStates[0].prob;
                    }
                  }
                }


                content +=
                  '<div section = "events" style="overflow:auto;" datatype="' + item.dataType + '">' +
                  '<table width="100%"  class="erd" cellpadding="3">';
                for (var j = 0; j < item.eActions.length; j++) {
                  var act = item.eActions[j];
                  if (!act.value) {
                    var a = act;
                  }
                  var newStates = act.value.newStates;
                  if (newStates.length > 0) {
                    if ((newStates[0].prob == -1 && pCounter > 1) || (!newStates[0].prob)) {
                      isValid = "False";
                    }
                    if (newStates[0].prob != -1 && pSum > 1) {
                      overOne = "True";
                    }
                  }
                  if (act.value && act.name !== act.value.name)
                    act.name = act.value.name;
                  //The tooltips for EventAction.
                  var tips = "";
                  for (var prop in act.value) {
                    if ((typeof act.value[prop] == 'string') ||
                      (typeof act.value[prop] == 'boolean') ||
                      (typeof act.value[prop] == 'number')) {
                      if (prop == "name" || prop == "desc")
                        tips += prop + ': ' + (act.value[prop]).toString().replace('<br/>', '&#13') + '&#13';
                    }
                  }
                  content +=
                    '<tr row-type="eventAction" datatype="' + act.dataType + '">' +
                    '<td width="35" style="text-align:center;">';

                  switch (act.value.actType) {
                    case "atTransition":
                      content += '<img style="width:12px;height:12px;" src="images/TransitionArrow.png"';
                      break;
                    case "atCngVarVal":
                      content += '<img style="width:12px;height:12px;" src="images/varCond.png"';
                      break;
                    case "at3DSimMsg":
                      content += '<img style="width:12px;height:12px;" src="images/ExtInput.png"';
                      break;
                    case "atRunExtApp":
                      content += '<img style="width:12px;height:12px;" src="images/cogwheel.png"';
                      break;
                    default:
                      content += '<img style="width:12px;height:12px;" src="images/cogwheel.png"';
                  }
                  
                  content +=  ' dataType="' + act.dataType +
                    '" cellId="' + cell.getId() +
                    '" itemId="' + act.itemId +
                    '" actionId="' + act.actionId + '" />';
                  if (act.value.actType == "atTransition" && act.value.newStates.length == 0) {
                    content += "<img src='images/questionOrange.png' style='width:12px;margin-right:5px;' />";
                    tips += "Warning: " + "This transition does not go to any state" + '&#13';
                  }
                  else if (overOne == "True" && act.value.mutExcl) {
                    content += "<img src='images/questionOrange.png' style='width:12px;margin-right:5px;' />";
                    tips += "Error: " + "The sum of all the event action probability is greater than one" + '&#13';
                  }
                  /*else if (isValid == "True") {
                      content += "<img src='images/check.png' style='width:12px;margin-right:5px;' />";
                  }*/
                  else if (isValid == "False") {
                    content += "<img src='images/delete2.png' style='width:12px;margin-right:5px;' />";
                    tips = "Error: " + "There are more then one event actions that has REMAINDER probability" + '&#13' + tips;
                  }
                  content +=
                    '</td>' +
                    '<td datatype= "' + act.dataType +
                    '" title = "' + tips +
                    '" cellid = "' + cell.getId() +
                    '" itemid = "' + act.itemId +
                    '" actionid= "' + act.actionId + '" >' + act.name +
                    '</td>';
                  if (act.value.newStates) {
                    var any = false;
                    for (var k = 0; k < act.value.newStates.length; k++) {
                      if (!mainApp.getStateByName(act.value.newStates[k].toState)) {
                        any = true;
                        break;
                      }
                    }
                    if (any) {
                      content += '<td dataType ="StateLink" title = "To state on other view (Right click to show list)." ' +
                        ' width="10" style="text-align:center;">' +
                        ' <img style="width:12px;height:12px;" src="images/link.png" ' +
                        'dataType= "toStateAction" ' +
                        'cellid= "' + cell.getId() + '" ' +
                        'itemid= "' + act.itemId + '" ' +
                        'actionid= "' + act.actionId + '" ' +
                        '/>' +
                        ' </td><td width="12" ' +
                        'dataType= "' + act.dataType + '" ' +
                        'cellid= "' + cell.getId() + '" ' +
                        'itemid= "' + act.itemId + '" ' +
                        'actionid= "' + act.actionId + '" ' +
                        '></td>';
                    }
                  }
                  content +=
                    '</tr>';
                }
                content +=
                  '</table>' +
                  '</div>';
              }
              content +=
                '</div>' +
                '</td>';
            }
            content +=
              '</tr>';
            tips = "";
          }
        }
        content +=
          '</table>' +
          '</div>';
      }
    }
    return content;
  }


};
/**
 * Extends mxShape.
 */
mxUtils.extend(TableShape, mxShape);
mxCellRenderer.registerShape("TableShape", TableShape);

/**
 * Function: isHtmlAllowed
 *
 * Returns true for non-rounded, non-rotated shapes with no glass gradient.
 */
TableShape.prototype.isHtmlAllowed = function () {
  return !this.isRounded && !this.glass && this.rotation == 0;
};

/**
 * Function: paintBackground
 * 
 * Generic background painting implementation.
 */
TableShape.prototype.paintBackground = function (c, x, y, w, h) {
  if (this.isRounded) {
    var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
      mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
    var r = Math.min(w * f, h * f);
    c.roundrect(x, y, w, h, r, r);
  }
  else {
    c.rect(x, y, w, h);
  }

  c.fillAndStroke();
};

/**
 * Function: paintForeground
 * 
 * Generic background painting implementation.
 */
TableShape.prototype.paintForeground = function (c, x, y, w, h) {
  if (this.glass) {
    this.paintGlassEffect(c, x, y, w, h, this.getArcSize(w + this.strokewidth, h + this.strokewidth));
  }
};

/**
 * Function: redrawHtml
 *
 * Allow optimization by replacing VML with HTML.
 */
TableShape.prototype.redrawHtmlShape = function () {
  // LATER: Refactor methods
  this.updateHtmlBounds(this.node);
  this.updateHtmlFilters(this.node);
  this.updateHtmlColors(this.node);
};

/**
 * Function: mixedModeHtml
 *
 * Allow optimization by replacing VML with HTML.
 */
TableShape.prototype.updateHtmlBounds = function (node) {
  var sw = (document.documentMode >= 9) ? 0 : Math.ceil(this.strokewidth * this.scale);
  node.style.borderWidth = Math.max(1, sw) + 'px';
  node.style.overflow = 'hidden';

  node.style.left = Math.round(this.bounds.x - sw / 2) + 'px';
  node.style.top = Math.round(this.bounds.y - sw / 2) + 'px';

  if (document.compatMode == 'CSS1Compat') {
    sw = -sw;
  }

  node.style.width = Math.round(Math.max(0, this.bounds.width + sw)) + 'px';
  node.style.height = Math.round(Math.max(0, this.bounds.height + sw)) + 'px';
};

/**
 * Function: mixedModeHtml
 *
 * Allow optimization by replacing VML with HTML.
 */
TableShape.prototype.updateHtmlColors = function (node) {
  var color = this.stroke;

  if (color != null && color != mxConstants.NONE) {
    node.style.borderColor = color;

    if (this.isDashed) {
      node.style.borderStyle = 'dashed';
    }
    else if (this.strokewidth > 0) {
      node.style.borderStyle = 'solid';
    }

    node.style.borderWidth = Math.max(1, Math.ceil(this.strokewidth * this.scale)) + 'px';
  }
  else {
    node.style.borderWidth = '0px';
  }

  color = this.fill;

  if (color != null && color != mxConstants.NONE) {
    node.style.backgroundColor = color;
    node.style.backgroundImage = 'none';
  }
  else if (this.pointerEvents) {
    node.style.backgroundColor = 'transparent';
  }
  else if (document.documentMode == 8) {
    mxUtils.addTransparentBackgroundFilter(node);
  }
  else {
    this.setTransparentBackgroundImage(node);
  }
};

/**
 * Function: updateHtmlFilters
 *
 * Allow optimization by replacing VML with HTML.
 */
TableShape.prototype.updateHtmlFilters = function (node) {
  var f = '';

  if (this.opacity < 100) {
    f += 'alpha(opacity=' + (this.opacity) + ')';
  }

  if (this.isShadow) {
    // FIXME: Cannot implement shadow transparency with filter
    f += 'progid:DXImageTransform.Microsoft.dropShadow (' +
      'OffX=\'' + Math.round(mxConstants.SHADOW_OFFSET_X * this.scale) + '\', ' +
      'OffY=\'' + Math.round(mxConstants.SHADOW_OFFSET_Y * this.scale) + '\', ' +
      'Color=\'' + mxConstants.SHADOWCOLOR + '\')';
  }

  if (this.gradient) {
    var start = this.fill;
    var end = this.gradient;
    var type = '0';

    var lookup = { east: 0, south: 1, west: 2, north: 3 };
    var dir = (this.direction != null) ? lookup[this.direction] : 0;

    if (this.gradientDirection != null) {
      dir = mxUtils.mod(dir + lookup[this.gradientDirection] - 1, 4);
    }

    if (dir == 1) {
      type = '1';
      var tmp = start;
      start = end;
      end = tmp;
    }
    else if (dir == 2) {
      var tmp = start;
      start = end;
      end = tmp;
    }
    else if (dir == 3) {
      type = '1';
    }

    f += 'progid:DXImageTransform.Microsoft.gradient(' +
      'startColorStr=\'' + start + '\', endColorStr=\'' + end +
      '\', gradientType=\'' + type + '\')';
  }

  node.style.filter = f;
};
