
var curExpandNode = null;

function beforeExpand(treeId, treeNode) {
  var pNode = curExpandNode ? curExpandNode.getParentNode() : null;
  var treeNodeP = treeNode.parentTId ? treeNode.getParentNode() : null;
  var zTree = $.fn.zTree.getZTreeObj("publicationTree");
  for (var i = 0, l = !treeNodeP ? 0 : treeNodeP.children.length; i < l; i++) {
    if (treeNode !== treeNodeP.children[i]) {
    }
  }
  while (pNode) {
    if (pNode === treeNode) {
      break;
    }
    pNode = pNode.getParentNode();
  }
  if (!pNode) {
    singlePath(treeNode);
  }

}

function singlePath(newNode) {
  if (newNode === curExpandNode) return;

  var zTree = $.fn.zTree.getZTreeObj("publicationTree"),
            rootNodes, tmpRoot, tmpTId, i, j, n;

  if (!curExpandNode) {
    tmpRoot = newNode;
    while (tmpRoot) {
      tmpTId = tmpRoot.tId;
      tmpRoot = tmpRoot.getParentNode();
    }
    rootNodes = zTree.getNodes();
    for (i = 0, j = rootNodes.length; i < j; i++) {
      n = rootNodes[i];
      if (n.tId != tmpTId) {
        zTree.expandNode(n, false);
      }
    }
  } else if (curExpandNode && curExpandNode.open) {
    if (newNode.parentTId === curExpandNode.parentTId) {
      zTree.expandNode(curExpandNode, false);
    } else {
      var newParents = [];
      while (newNode) {
        newNode = newNode.getParentNode();
        if (newNode === curExpandNode) {
          newParents = null;
          break;
        } else if (newNode) {
          newParents.push(newNode);
        }
      }
      if (newParents != null) {
        var oldNode = curExpandNode;
        var oldParents = [];
        while (oldNode) {
          oldNode = oldNode.getParentNode();
          if (oldNode) {
            oldParents.push(oldNode);
          }
        }
        if (newParents.length > 0) {
          zTree.expandNode(oldParents[Math.abs(oldParents.length - newParents.length) - 1], false);
        } else {
          zTree.expandNode(oldParents[oldParents.length - 1], false);
        }
      }
    }
  }
  curExpandNode = newNode;
}

function onExpand(event, treeId, treeNode) {
  curExpandNode = treeNode;
}

function onClick(e, treeId, treeNode) {
  var zTree = $.fn.zTree.getZTreeObj("publicationTree");
  zTree.expandNode(treeNode, null, null, null, true);
}

