/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children
  node-click : function to response to when a node selected.

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="modelId"
		data-node-label="modelName"
		data-node-children="children" 
    data-node-click="handleNodeClick(selectedNode);"
    >
	</div>
*/

(function (angular) {
  'use strict';

  angular.module('angularTreeview', []).directive('treeModel', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeModel = attrs.treeModel;
        scope.dataModel = treeModel;

        //node id
        var nodeId = attrs.nodeId || 'id';

        //node label
        var nodeLabel = attrs.nodeLabel || 'label';

        //node check
        var nodeChecked = attrs.checked || 'checked';

        //children
        var nodeChildren = attrs.nodeChildren || 'children';
        
        //node-click
        var fnCode = attrs.nodeClick || 'handleNodeClick';
        fnCode = 
          'if (typeof scope.' + fnCode + ' == "function") { ' +
          '  scope.' + fnCode + '(selectedNode);' +
          '};';
        scope.handleNodeClick = new Function('selectedNode', fnCode);

        //tree template
        var template =
          '<ul>' +
            '<li data-ng-repeat="node in ' + treeModel + '">' +
              '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
              '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
//              '<i class="vline" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
              '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length" style=""></i> ';
        template += scope.checkable ?
        '<input type="checkbox" data-ng-click="' + treeId + '.nodeCheck(node)" ng-model="node.' + nodeChecked + '" />' : '';
        template +=
                '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
              '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
            '</li>' +
          '</ul>';


        //check tree id, tree model
        if (treeId && treeModel) {

          //root node
          if (attrs.angularTreeview) {

            //create tree object if not exists
            scope[treeId] = scope[treeId] || {};

            //if node head clicks,
            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

              //Collapse or Expand
              selectedNode.collapsed = !selectedNode.collapsed;
            };

            //================== Custom code added to support check parent when all children are checked and vise versa ===========
            scope.findParentOfChild = function (pNode, childNode) {
              var parent = null;
              if (pNode.children.length > 0) {
                for (var i = 0; i < pNode.children.length; i++) {
                  if (pNode.children[i] == childNode) {
                    parent = pNode;
                    break;
                  }
                  else {
                    parent = scope.findParentOfChild(pNode.children[i], childNode);
                    if (parent !== null) break;
                  }
                }
              }
              return parent;
            }

            scope.parentOf = function (childNode) {
              var parent = null;
              var root = scope[scope.dataModel];
              for (var i = 0; i < root.length; i++) {
                parent = scope.findParentOfChild(root[i], childNode);
                if (parent !== null) break;
              }

              return parent;
            }
            
            scope.isChildrenChecked = function (pNode) {
              var isAllChecked = true;
              if (pNode.children && pNode.children.length > 0) {
                pNode.children.forEach(function (childNode) {
                    isAllChecked = isAllChecked && childNode.checked;
                });
              }
              return isAllChecked;
            }

            scope.checkAllChildren = function (aNode) {
              aNode.children.forEach(function (childNode) {
                childNode.checked = true;
                scope.checkAllChildren(childNode);
              });
            }

            scope.unCheckAllChildren = function (aNode) {
              aNode.children.forEach(function (childNode) {
                childNode.checked = false;
                scope.unCheckAllChildren(childNode);
              });
            }

            if (scope.checkable) {
              scope[treeId].nodeCheck = scope[treeId].nodeCheck || function (selectedNode) {
                if (selectedNode.checked == undefined)
                  selectedNode.checked = false;
                selectedNode.checked = !selectedNode.checked;
                if (selectedNode.checked) {
                  scope.checkAllChildren(selectedNode);
                }
                else {
                  scope.unCheckAllChildren(selectedNode)
                }

                var p = scope.parentOf(selectedNode);
                if (p) {
                  if (scope.isChildrenChecked(p)) {
                    p.checked = true;
                  }
                  else
                    p.checked = false;
                }

                if (selectedNode.checked) {
                  scope[treeId].selectNodeLabel(selectedNode);
                }
                else {
                  scope[treeId].currentNode.selected = undefined;
                  scope.handleNodeClick(scope[treeId].currentNode);
                }
              }
            }
            // ============== END Custom code =================

            //if node label clicks,
            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {

              //remove highlight from previous node
              if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                scope[treeId].currentNode.selected = undefined;
              }

              //set highlight to selected node
              selectedNode.selected = 'selected';

              //set currentNode
              scope[treeId].currentNode = selectedNode;

              if (typeof scope.handleNodeClick == 'function') {
                scope.handleNodeClick(selectedNode);
              }
            };
          }

          //Rendering template.
          element.html('').append($compile(template)(scope));
        }
      }
    };
  }]);
})(angular);
