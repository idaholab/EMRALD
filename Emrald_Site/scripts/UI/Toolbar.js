// Copyright 2021 Battelle Energy Alliance

/// <reference path="Common.js" />
/// <reference path="../mxGraph/js/util/mxToolbar.js" />
/// <reference path="../mxGraph/js/util/mxDragSource.js" />
'use strict';
var FaultTree;
(function (FaultTree) {
  var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(content, graph) {
      _super.apply(this, arguments);
      this.graph = graph;

      var dragOverFnc = function (graph, x, y) {
        var cell = graph.getCellAt(x, y, graph.getDefaultParent(), true, false); // x,y,parent,vertices,edges
        if (cell) {
          if (cell.value instanceof FTItem && cell.value.getgType() in SetOf(["OR", "AND"]))
            return cell;
          else if (cell.parent.value instanceof FTItem && cell.parent.value.getgType() in SetOf(["OR", "AND"]))
            return cell.parent;
        }
        return null;
      }

      var superAddItem = this.addItem;
      this.addItem = function (title, icon, funct, pressedIcon, style, factoryMethod) {
        var elt = superAddItem.apply(this, arguments);
        elt.style.width = "32px";
        elt.style.height = "32px";
        return elt;
				}

				this.addNewDraggableItem = function (title, icon, style, isDraggable) {
						var elt = this.addItem(title, icon, function (evt) { }, icon, null, null);
						var cloneElt = elt.cloneNode(true);
						cloneElt.style.width = '32px';
						cloneElt.style.height = '32px';
						if (isDraggable) {
								elt.draggable = true;
								elt.ondragstart = function (evt) {
										evt.dataTransfer.effectAllowed = 'copy';
										evt.dataTransfer.setData("gate", title);
								}.bind(elt);

								elt.onmouseup = function (evt) {
										var target = evt.currentTarget;
										var sibs = target.parentElement.children;
										for (var i = 0; i < sibs.length; i++) {
												var u = sibs[i];
												if ((u.nodeName == 'LI') && (u.className == "ItemSelected")) {
														u.className = "ItemCleared";
												}
										};
										target.className = "ItemSelected";
								}
						}
						return elt;
				}

      var superAddSeparator = this.addSeparator;
      this.addSeparator = function (icon) {
        var elt = document.createElement('img');
        elt.src = icon;
        elt.style.width = "15px";
        elt.style.height = "38px";
        this.container.appendChild(elt);
        return elt;
      }

      //this.addItem(title, icon, funct, pressedIcon, style, factoryMethod) =>elt
      this.addDraggableItem = function (title, icon, style, isDraggable, dropHandler) {
        var elt = this.addItem(title, icon, function (evt) { }, icon, null, null);
        if (isDraggable && dropHandler && (typeof dropHandler === 'function')) {
          var cloneElt = elt.cloneNode(true);
          cloneElt.style.width = '32px';
          cloneElt.style.height = '32px';
          // makeDraggable: function(element, graphF, funct, dragElement, dx, dy, autoscroll,	scalePreview, highlightDropTargets, getDropTarget)
          var ds = mxUtils.makeDraggable(elt, this.graph, dropHandler, cloneElt, 0, 0, false, false, true, this.dragOver);
        }
        return elt;
      }
      
      Object.defineProperty(this, "dragOver", { get: function () { return dragOverFnc; }, set: function (value) { dragOverFnc = value; }, enumerable: true, configurable: true });
    }

    return Toolbar;
  })(mxToolbar);
  FaultTree.Toolbar = Toolbar;
})(FaultTree || (FaultTree = {}));