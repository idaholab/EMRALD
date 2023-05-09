// Copyright 2021 Battelle Energy Alliance

/// <reference path="editor.d.ts" />

//declare module mxGraphModule {

interface ICallback { // For function types
    (...args: any[]): any;
}

interface mxCell {

    /**
     * Variable: id
     *
     * Holds the Id. Default is null.
     */
    id: any; // string?
    /**
     * Variable: value
     *
     * Holds the user object. Default is null.
     */
    value: Object; 
    /**
     * Variable: geometry
     *
     * Holds the <mxGeometry>. Default is null.
     */
    geometry: mxGeometry;
    /**
     * Variable: style
     *
     * Holds the style as a string of the form [(stylename|key=value);]. Default is
     * null.
     */
    style: string;
    /**
     * Variable: vertex
     *
     * Specifies whether the cell is a vertex. Default is false.
     */
    vertex: boolean;
    /**
     * Variable: edge
     *
     * Specifies whether the cell is an edge. Default is false.
     */
    edge: boolean;
    /**
     * Variable: connectable
     *
     * Specifies whether the cell is connectable. Default is true.
     */
    connectable: boolean;
    /**
     * Variable: visible
     *
     * Specifies whether the cell is visible. Default is true.
     */
    visible: boolean;
    /**
     * Variable: collapsed
     *
     * Specifies whether the cell is collapsed. Default is false.
     */
    collapsed: boolean;
    /**
     * Variable: parent
     *
     * Reference to the parent cell.
     */
    parent: any; // mxCell?
    /**
     * Variable: source
     *
     * Reference to the source terminal.
     */
    source: any; // mxCell?
    /**
     * Variable: target
     *
     * Reference to the target terminal.
     */
    target: any; // mxCell?
    /**
     * Variable: children
     *
     * Holds the child cells.
     */
    children: any[]; // mxCell[]?
    /**
     * Variable: edges
     *
     * Holds the edges.
     */
    edges: any[]; // mxCell[]?
    /**
     * Variable: mxTransient
     *
     * List of members that should not be cloned inside <clone>. This field is
     * passed to <mxUtils.clone> and is not made persistent in <mxCellCodec>.
     * This is not a convention for all classes, it is only used in this class
     * to mark transient fields since transient modifiers are not supported by
     * the language.
     */
    mxTransient: any[];
    /**
     * Function: getId
     *
     * Returns the Id of the cell as a string.
     */
    getId(): string;
    /**
     * Function: setId
     *
     * Sets the Id of the cell to the given string.
     */
    setId(id: string);
    /**
     * Function: getValue
     *
     * Returns the user object of the cell. The user
     * object is stored in <value>.
     */
    getValue(): any; // Object?
    /**
     * Function: setValue
     *
     * Sets the user object of the cell. The user object
     * is stored in <value>.
     */
    setValue(value: Object);
    /**
     * Function: valueChanged
     *
     * Changes the user object after an in-place edit
     * and returns the previous value. This implementation
     * replaces the user object with the given value and
     * returns the old user object.
     */
    valueChanged(newValue: Object); 
    /**
     * Function: getGeometry
     *
     * Returns the <mxGeometry> that describes the <geometry>.
     */
    getGeometry(): mxGeometry;
    /**
     * Function: setGeometry
     *
     * Sets the <mxGeometry> to be used as the <geometry>.
     */
    setGeometry(geometry: mxGeometry);
    /**
     * Function: getStyle
     *
     * Returns a string that describes the <style>.
     */
    getStyle(): string;
    /**
     * Function: setStyle
     *
     * Sets the string to be used as the <style>.
     */
    setStyle(style: string);
    /**
     * Function: isVertex
     *
     * Returns true if the cell is a vertex.
     */
    isVertex(): boolean;
    /**
     * Function: setVertex
     *
     * Specifies if the cell is a vertex. This should only be assigned at
     * construction of the cell and not be changed during its lifecycle.
     * 
     * Parameters:
     * 
     * vertex - Boolean that specifies if the cell is a vertex.
     */
    setVertex(vertex: boolean);
    /**
     * Function: isEdge
     *
     * Returns true if the cell is an edge.
     */
    isEdge(): boolean;
    /**
     * Function: setEdge
     * 
     * Specifies if the cell is an edge. This should only be assigned at
     * construction of the cell and not be changed during its lifecycle.
     * 
     * Parameters:
     * 
     * edge - Boolean that specifies if the cell is an edge.
     */
    setEdge(edge: boolean);
    /**
     * Function: isConnectable
     *
     * Returns true if the cell is connectable.
     */
    isConnectable(): boolean;
    /**
     * Function: setConnectable
     *
     * Sets the connectable state.
     * 
     * Parameters:
     * 
     * connectable - Boolean that specifies the new connectable state.
     */
    setConnectable(connectable: boolean);
    /**
     * Function: isVisible
     *
     * Returns true if the cell is visibile.
     */
    isVisible(): boolean;
    /**
     * Function: setVisible
     *
     * Specifies if the cell is visible.
     * 
     * Parameters:
     * 
     * visible - Boolean that specifies the new visible state.
     */
    setVisible(visible: boolean);
    /**
     * Function: isCollapsed
     *
     * Returns true if the cell is collapsed.
     */
    isCollapsed(): boolean;
    /**
     * Function: setCollapsed
     *
     * Sets the collapsed state.
     * 
     * Parameters:
     * 
     * collapsed - Boolean that specifies the new collapsed state.
     */
    setCollapsed(collapsed: boolean);
    /**
     * Function: getParent
     *
     * Returns the cell's parent.
     */
    getParent(): mxCell;
    /**
     * Function: setParent
     *
     * Sets the parent cell.
     * 
     * Parameters:
     * 
     * parent - <mxCell> that represents the new parent.
     */
    setParent(parent: mxCell);
    /**
     * Function: getTerminal
     *
     * Returns the source or target terminal.
     * 
     * Parameters:
     * 
     * source - Boolean that specifies if the source terminal should be
     * returned.
     */
    getTerminal(source: boolean): boolean;
    /**
     * Function: setTerminal
     *
     * Sets the source or target terminal and returns the new terminal.
     * 
     * Parameters:
     * 
     * terminal - <mxCell> that represents the new source or target terminal.
     * isSource - Boolean that specifies if the source or target terminal
     * should be set.
     */
    setTerminal(terminal: mxCell, isSource: boolean): mxCell;
    /**
     * Function: getChildCount
     *
     * Returns the number of child cells.
     */
    getChildCount(): number;
    /**
     * Function: getIndex
     *
     * Returns the index of the specified child in the child array.
     * 
     * Parameters:
     * 
     * child - Child whose index should be returned.
     */
    getIndex(child: mxCell);
    /**
     * Function: getChildAt
     *
     * Returns the child at the specified index.
     * 
     * Parameters:
     * 
     * index - Integer that specifies the child to be returned.
     */
    getChildAt(index: number): mxCell;
    /**
     * Function: insert
     *
     * Inserts the specified child into the child array at the specified index
     * and updates the parent reference of the child. If not childIndex is
     * specified then the child is appended to the child array. Returns the
     * inserted child.
     * 
     * Parameters:
     * 
     * child - <mxCell> to be inserted or appended to the child array.
     * index - Optional integer that specifies the index at which the child
     * should be inserted into the child array.
     */
    insert(child: mxCell, index?: number): mxCell;
    /**
     * Function: remove
     *
     * Removes the child at the specified index from the child array and
     * returns the child that was removed. Will remove the parent reference of
     * the child.
     * 
     * Parameters:
     * 
     * index - Integer that specifies the index of the child to be
     * removed.
     */
    remove(index: number): mxCell;
    /**
     * Function: removeFromParent
     *
     * Removes the cell from its parent.
     */
    removeFromParent();
    /**
     * Function: getEdgeCount
     *
     * Returns the number of edges in the edge array.
     */
    getEdgeCount(): number;
    /**
     * Function: getEdgeIndex
     *
     * Returns the index of the specified edge in <edges>.
     * 
     * Parameters:
     * 
     * edge - <mxCell> whose index in <edges> should be returned.
     */
    getEdgeIndex(edge: mxCell): number;
    /**
     * Function: getEdgeAt
     *
     * Returns the edge at the specified index in <edges>.
     * 
     * Parameters:
     * 
     * index - Integer that specifies the index of the edge to be returned.
     */
    getEdgeAt(index: number): mxCell;
    /**
     * Function: insertEdge
     *
     * Inserts the specified edge into the edge array and returns the edge.
     * Will update the respective terminal reference of the edge.
     * 
     * Parameters:
     * 
     * edge - <mxCell> to be inserted into the edge array.
     * isOutgoing - Boolean that specifies if the edge is outgoing.
     */
    insertEdge(edge: mxCell, isOutgoing: boolean): mxCell;
    /**
     * Function: removeEdge
     *
     * Removes the specified edge from the edge array and returns the edge.
     * Will remove the respective terminal reference from the edge.
     * 
     * Parameters:
     * 
     * edge - <mxCell> to be removed from the edge array.
     * isOutgoing - Boolean that specifies if the edge is outgoing.
     */
    removeEdge(edge: mxCell, isOutgoing: boolean): mxCell;
    /**
     * Function: removeFromTerminal
     *
     * Removes the edge from its source or target terminal.
     * 
     * Parameters:
     * 
     * isSource - Boolean that specifies if the edge should be removed from its
     * source or target terminal.
     */
    removeFromTerminal(isSource: boolean);
    /**
     * Function: getAttribute
     *
     * Returns the specified attribute from the user object if it is an XML
     * node.
     * 
     * Parameters:
     * 
     * name - Name of the attribute whose value should be returned.
     * defaultValue - Optional default value to use if the attribute has no
     * value.
     */
    getAttribute(name: string, defaultValue?: any): any;
    /**
     * Function: setAttribute
     *
     * Sets the specified attribute on the user object if it is an XML node.
     * 
     * Parameters:
     * 
     * name - Name of the attribute whose value should be set.
     * value - New value of the attribute.
     */
    setAttribute(name: string, value: Object);
    /**
     * Function: clone
     *
     * Returns a clone of the cell. Uses <cloneValue> to clone
     * the user object. All fields in <mxTransient> are ignored
     * during the cloning.
     */
    clone(): mxCell;
    /**
     * Function: cloneValue
     *
     * Returns a clone of the cell's user object.
     */
    cloneValue(): any;


}

declare var mxCell: {
    new (value?: Object, geometry?: mxGeometry, style?: string): mxCell;
    prototype: mxCell;
}

interface mxGeometry extends mxRectangle {

    /**
     * Variable: TRANSLATE_CONTROL_POINTS
     * 
     * Global switch to translate the points in translate. Default is true.
     */
    TRANSLATE_CONTROL_POINTS: boolean;
    /**
     * Variable: alternateBounds
     *
     * Stores alternate values for x, y, width and height in a rectangle. See
     * <swap> to exchange the values. Default is null.
     */
    alternateBounds: mxRectangle; // number?
    /**
     * Variable: sourcePoint
     *
     * Defines the source <mxPoint> of the edge. This is used if the
     * corresponding edge does not have a source vertex. Otherwise it is
     * ignored. Default is  null.
     */
    sourcePoint: mxPoint;
    /**
     * Variable: targetPoint
     *
     * Defines the target <mxPoint> of the edge. This is used if the
     * corresponding edge does not have a target vertex. Otherwise it is
     * ignored. Default is null.
     */
    targetPoint:mxPoint;
    /**
     * Variable: points
     *
     * Array of <mxPoints> which specifies the control points along the edge.
     * These points are the intermediate points on the edge, for the endpoints
     * use <targetPoint> and <sourcePoint> or set the terminals of the edge to
     * a non-null value. Default is null.
     */
    points: any[]; // Array of <mxPoints>
    /**
     * Variable: offset
     *
     * For edges, this holds the offset (in pixels) from the position defined
     * by <x> and <y> on the edge. For relative geometries (for vertices), this
     * defines the absolute offset from the point defined by the relative
     * coordinates. For absolute geometries (for vertices), this defines the
     * offset for the label. Default is null.
     */
    offset: number; // ?
    /**
     * Variable: relative
     *
     * Specifies if the coordinates in the geometry are to be interpreted as
     * relative coordinates. For edges, this is used to define the location of
     * the edge label relative to the edge as rendered on the display. For
     * vertices, this specifies the relative location inside the bounds of the
     * parent cell.
     * 
     * If this is false, then the coordinates are relative to the origin of the
     * parent cell or, for edges, the edge label position is relative to the
     * center of the edge as rendered on screen.
     * 
     * Default is false.
     */
    relative: boolean;
    /**
     * Function: swap
     * 
     * Swaps the x, y, width and height with the values stored in
     * <alternateBounds> and puts the previous values into <alternateBounds> as
     * a rectangle. This operation is carried-out in-place, that is, using the
     * existing geometry instance. If this operation is called during a graph
     * model transactional change, then the geometry should be cloned before
     * calling this method and setting the geometry of the cell using
     * <mxGraphModel.setGeometry>.
     */
    swap();
    /**
     * Function: getTerminalPoint
     * 
     * Returns the <mxPoint> representing the source or target point of this
     * edge. This is only used if the edge has no source or target vertex.
     * 
     * Parameters:
     * 
     * isSource - Boolean that specifies if the source or target point
     * should be returned.
     */
    getTerminalPoint(isSource: boolean): mxPoint;
    /**
     * Function: setTerminalPoint
     * 
     * Sets the <sourcePoint> or <targetPoint> to the given <mxPoint> and
     * returns the new point.
     * 
     * Parameters:
     * 
     * point - Point to be used as the new source or target point.
     * isSource - Boolean that specifies if the source or target point
     * should be set.
     */
    setTerminalPoint(point: mxPoint, isSource: boolean): mxPoint;
    /**
     * Function: translate
     * 
     * Translates the geometry by the specified amount. That is, <x> and <y>
     * of the geometry, the <sourcePoint>, <targetPoint> and all elements of
     * <points> are translated by the given amount. <x> and <y> are only
     * translated if <relative> is false. If <TRANSLATE_CONTROL_POINTS> is
     * false, then <points> are not modified by this function.
     * 
     * Parameters:
     * 
     * dx - Integer that specifies the x-coordinate of the translation.
     * dy - Integer that specifies the y-coordinate of the translation.
     */
    translate(dx: number, dy: number);
    /**
     * Function: equals
     * 
     * Returns true if the given object equals this geometry.
     */
    equals(obj: Object): boolean;


}

declare var mxGeometry: {
    new (x: number, y: number, width: number, height: number): mxGeometry;
    prototype: mxGeometry;
}

interface mxCellPath {

    /**
     * Class: mxCellPath
     * 
     * Implements a mechanism for temporary cell Ids.
     * 
     * Variable: PATH_SEPARATOR
     * 
     * Defines the separator between the path components. Default is ".".
     */
    PATH_SEPARATOR: string;
    /**
     * Function: create
     * 
     * Creates the cell path for the given cell. The cell path is a
     * concatenation of the indices of all ancestors on the (finite) path to
     * the root, eg. "0.0.0.1".
     * 
     * Parameters:
     * 
     * cell - Cell whose path should be returned.
     */
    create(cell: mxCell): string;
	/**
	 * Function: getParentPath
	 * 
	 * Returns the path for the parent of the cell represented by the given
	 * path. Returns null if the given path has no parent.
	 * 
	 * Parameters:
	 * 
	 * path - Path whose parent path should be returned.
	 */
    getParentPath(path: string): string;
	/**
	 * Function: resolve
	 * 
	 * Returns the cell for the specified cell path using the given root as the
	 * root of the path.
	 * 
	 * Parameters:
	 * 
	 * root - Root cell of the path to be resolved.
	 * path - String that defines the path.
	 */
    resolve(root: mxCell, path: string): mxCell;
	/**
	 * Function: compare
	 * 
	 * Compares the given cell paths and returns -1 if p1 is smaller, 0 if
	 * p1 is equal and 1 if p1 is greater than p2.
	 */
    compare(p1: string, p2: string): number; // string?

}

declare var mxCellPath: {
    new (): mxCellPath;
    prototype: mxCellPath;
}

interface mxGraphModel extends mxEventSource {

    /**
     * Variable: root
     * 
     * Holds the root cell, which in turn contains the cells that represent the
     * layers of the diagram as child cells. That is, the actual elements of the
     * diagram are supposed to live in the third generation of cells and below.
     */
    root: mxCell;
    /**
     * Variable: cells
     * 
     * Maps from Ids to cells.
     */
    cells: mxCell[]; // any[]?
    /**
     * Variable: maintainEdgeParent
     * 
     * Specifies if edges should automatically be moved into the nearest common
     * ancestor of their terminals. Default is true.
     */
    maintainEdgeParent: boolean;
    /**
     * Variable: createIds
     * 
     * Specifies if the model should automatically create Ids for new cells.
     * Default is true.
     */
    createIds: boolean;
    /**
     * Variable: prefix
     * 
     * Defines the prefix of new Ids. Default is an empty string.
     */
    prefix: string;
    /**
     * Variable: postfix
     * 
     * Defines the postfix of new Ids. Default is an empty string.
     */
    postfix: string;
    /**
     * Variable: nextId
     * 
     * Specifies the next Id to be created. Initial value is 0.
     */
    nextId: number;
    /**
     * Variable: currentEdit
     * 
     * Holds the changes for the current transaction. If the transaction is
     * closed then a new object is created for this variable using
     * <createUndoableEdit>.
     */
    currentEdit: Object;
    /**
     * Variable: updateLevel
     * 
     * Counter for the depth of nested transactions. Each call to <beginUpdate>
     * will increment this number and each call to <endUpdate> will decrement
     * it. When the counter reaches 0, the transaction is closed and the
     * respective events are fired. Initial value is 0.
     */
    updateLevel: number;
    /**
     * Variable: endingUpdate
     * 
     * True if the program flow is currently inside endUpdate.
     */
    endingUpdate: boolean;
    /**
     * Function: clear
     *
     * Sets a new root using <createRoot>.
     */
    clear();
    /**
     * Function: isCreateIds
     *
     * Returns <createIds>.
     */
    isCreateIds(): boolean;
    /**
     * Function: setCreateIds
     *
     * Sets <createIds>.
     */
    setCreateIds(value: boolean);
    /**
     * Function: createRoot
     *
     * Creates a new root cell with a default layer (child 0).
     */
    createRoot(): mxCell;
    /**
     * Function: getCell
     *
     * Returns the <mxCell> for the specified Id or null if no cell can be
     * found for the given Id.
     *
     * Parameters:
     * 
     * id - A string representing the Id of the cell.
     */
    getCell(id: string): mxCell;
    /**
     * Function: filterCells
     * 
     * Returns the cells from the given array where the fiven filter function
     * returns true.
     */
    filterCells(cells: mxCell[], filter: ICallback);
    /**
     * Function: getDescendants
     * 
     * Returns all descendants of the given cell and the cell itself in an array.
     * 
     * Parameters:
     * 
     * parent - <mxCell> whose descendants should be returned.
     */
    getDescendants(parent: mxCell): mxCell[];
    /**
     * Function: filterDescendants
     * 
     * Visits all cells recursively and applies the specified filter function
     * to each cell. If the function returns true then the cell is added
     * to the resulting array. The parent and result paramters are optional.
     * If parent is not specified then the recursion starts at <root>.
     * 
     * Example:
     * The following example extracts all vertices from a given model:
     * (code)
     * var filter = function(cell)
     * {
     * 	return model.isVertex(cell);
     * }
     * var vertices = model.filterDescendants(filter);
     * (end)
     * 
     * Parameters:
     * 
     * filter - JavaScript function that takes an <mxCell> as an argument
     * and returns a boolean.
     * parent - Optional <mxCell> that is used as the root of the recursion.
     */
    filterDescendants(filter: ICallback, parent?: mxCell): mxCell[];
    /**
     * Function: getRoot
     * 
     * Returns the root of the model or the topmost parent of the given cell.
     *
     * Parameters:
     * 
     * cell - Optional <mxCell> that specifies the child.
     */
    getRoot(cell?: mxCell): mxCell;
    /**
     * Function: setRoot
     * 
     * Sets the <root> of the model using <mxRootChange> and adds the change to
     * the current transaction. This resets all datastructures in the model and
     * is the preferred way of clearing an existing model. Returns the new
     * root.
     * 
     * Example:
     * 
     * (code)
     * var root = new mxCell();
     * root.insert(new mxCell());
     * model.setRoot(root);
     * (end)
     *
     * Parameters:
     * 
     * root - <mxCell> that specifies the new root.
     */
    setRoot(root: mxCell): mxCell;
    /**
     * Function: rootChanged
     * 
     * Inner callback to change the root of the model and update the internal
     * datastructures, such as <cells> and <nextId>. Returns the previous root.
     *
     * Parameters:
     * 
     * root - <mxCell> that specifies the new root.
     */
    rootChanged(root: mxCell): mxCell;
    /**
     * Function: isRoot
     * 
     * Returns true if the given cell is the root of the model and a non-null
     * value.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the possible root.
     */
    isRoot(cell: mxCell): boolean;
    /**
     * Function: isLayer
     * 
     * Returns true if <isRoot> returns true for the parent of the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the possible layer.
     */
    isLayer(cell: mxCell): boolean;
    /**
     * Function: isAncestor
     * 
     * Returns true if the given parent is an ancestor of the given child.
     *
     * Parameters:
     * 
     * parent - <mxCell> that specifies the parent.
     * child - <mxCell> that specifies the child.
     */
    isAncestor(parent: mxCell, child: mxCell): boolean;
    /**
     * Function: contains
     * 
     * Returns true if the model contains the given <mxCell>.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell.
     */
    contains(cell: mxCell): boolean;
    /**
     * Function: getParent
     * 
     * Returns the parent of the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose parent should be returned.
     */
    getParent(cell: mxCell): mxCell;
    /**
     * Function: add
     * 
     * Adds the specified child to the parent at the given index using
     * <mxChildChange> and adds the change to the current transaction. If no
     * index is specified then the child is appended to the parent's array of
     * children. Returns the inserted child.
     * 
     * Parameters:
     * 
     * parent - <mxCell> that specifies the parent to contain the child.
     * child - <mxCell> that specifies the child to be inserted.
     * index - Optional integer that specifies the index of the child.
     */
    add(parent: mxCell, child: mxCell, index?: number): mxCell;
    /**
     * Function: cellAdded
     * 
     * Inner callback to update <cells> when a cell has been added. This
     * implementation resolves collisions by creating new Ids. To change the
     * ID of a cell after it was inserted into the model, use the following
     * code:
     * 
     * (code
     * delete model.cells[cell.getId()];
     * cell.setId(newId);
     * model.cells[cell.getId()] = cell;
     * (end)
     *
     * If the change of the ID should be part of the command history, then the
     * cell should be removed from the model and a clone with the new ID should
     * be reinserted into the model instead.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell that has been added.
     */
    cellAdded(cell: mxCell);
    /**
     * Function: createId
     * 
     * Hook method to create an Id for the specified cell. This implementation
     * concatenates <prefix>, id and <postfix> to create the Id and increments
     * <nextId>. The cell is ignored by this implementation, but can be used in
     * overridden methods to prefix the Ids with eg. the cell type.
     *
     * Parameters:
     *
     * cell - <mxCell> to create the Id for.
     */
    createId(cell: mxCell): string;
    /**
     * Function: updateEdgeParents
     * 
     * Updates the parent for all edges that are connected to cell or one of
     * its descendants using <updateEdgeParent>.
     */
    updateEdgeParents(cell: mxCell, root: mxCell);
    /**
     * Function: updateEdgeParent
     *
     * Inner callback to update the parent of the specified <mxCell> to the
     * nearest-common-ancestor of its two terminals.
     *
     * Parameters:
     * 
     * edge - <mxCell> that specifies the edge.
     * root - <mxCell> that represents the current root of the model.
     */
    updateEdgeParent(edge: mxCell, root: mxCell);
    /**
     * Function: getOrigin
     * 
     * Returns the absolute, accumulated origin for the children inside the
     * given parent as an <mxPoint>.
     */
    getOrigin(cell: mxCell): mxPoint;
    /**
     * Function: getNearestCommonAncestor
     * 
     * Returns the nearest common ancestor for the specified cells.
     *
     * Parameters:
     * 
     * cell1 - <mxCell> that specifies the first cell in the tree.
     * cell2 - <mxCell> that specifies the second cell in the tree.
     */
    getNearestCommonAncestor(cell1: mxCell, cell2: mxCell): mxCell;
    /**
     * Function: remove
     * 
     * Removes the specified cell from the model using <mxChildChange> and adds
     * the change to the current transaction. This operation will remove the
     * cell and all of its children from the model. Returns the removed cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> that should be removed.
     */
    remove(cell: mxCell): mxCell;
    /**
     * Function: cellRemoved
     * 
     * Inner callback to update <cells> when a cell has been removed.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell that has been removed.
     */
    cellRemoved(cell: mxCell);
    /**
     * Function: parentForCellChanged
     * 
     * Inner callback to update the parent of a cell using <mxCell.insert>
     * on the parent and return the previous parent.
     *
     * Parameters:
     * 
     * cell - <mxCell> to update the parent for.
     * parent - <mxCell> that specifies the new parent of the cell.
     * index - Optional integer that defines the index of the child
     * in the parent's child array.
     */
    parentForCellChanged(cell: mxCell, parent: mxCell, index?: number): mxCell;
    /**
     * Function: getChildCount
     *
     * Returns the number of children in the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose number of children should be returned.
     */
    getChildCount(cell: mxCell): number;
    /**
     * Function: getChildAt
     *
     * Returns the child of the given <mxCell> at the given index.
     * 
     * Parameters:
     * 
     * cell - <mxCell> that represents the parent.
     * index - Integer that specifies the index of the child to be returned.
     */
    getChildAt(cell: mxCell, index: number): mxCell[];
    /**
     * Function: getChildren
     * 
     * Returns all children of the given <mxCell> as an array of <mxCell[]>. The
     * return value should be only be read.
     *
     * Parameters:
     * 
     * cell - <mxCell> the represents the parent.
     */
    getChildren(cell: mxCell): mxCell[];
    /**
     * Function: getChildVertices
     * 
     * Returns the child vertices of the given parent.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose child vertices should be returned.
     */
    getChildVertices(parent: mxCell): mxCell[];
    /**
     * Function: getChildEdges
     * 
     * Returns the child edges of the given parent.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose child edges should be returned.
     */
    getChildEdges(parent: mxCell): mxCell[];
    /**
     * Function: getChildCells
     * 
     * Returns the children of the given cell that are vertices and/or edges
     * depending on the arguments.
     *
     * Parameters:
     * 
     * cell - <mxCell> the represents the parent.
     * vertices - Boolean indicating if child vertices should be returned.
     * Default is false.
     * edges - Boolean indicating if child edges should be returned.
     * Default is false.
     */
    getChildCells(parent: mxCell, vertices: boolean, edges: boolean): mxCell[];
    /**
     * Function: getTerminal
     * 
     * Returns the source or target <mxCell> of the given edge depending on the
     * value of the boolean parameter.
     *
     * Parameters:
     * 
     * edge - <mxCell> that specifies the edge.
     * isSource - Boolean indicating which end of the edge should be returned.
     */
    getTerminal(edge: mxCell, isSource: boolean): mxCell;
    /**
     * Function: setTerminal
     * 
     * Sets the source or target terminal of the given <mxCell> using
     * <mxTerminalChange> and adds the change to the current transaction.
     * This implementation updates the parent of the edge using <updateEdgeParent>
     * if required.
     *
     * Parameters:
     * 
     * edge - <mxCell> that specifies the edge.
     * terminal - <mxCell> that specifies the new terminal.
     * isSource - Boolean indicating if the terminal is the new source or
     * target terminal of the edge.
     */
    setTerminal(edge: mxCell, terminal: mxCell, isSource: boolean): mxCell;
    /**
     * Function: setTerminals
     * 
     * Sets the source and target <mxCell> of the given <mxCell> in a single
     * transaction using <setTerminal> for each end of the edge.
     *
     * Parameters:
     * 
     * edge - <mxCell> that specifies the edge.
     * source - <mxCell> that specifies the new source terminal.
     * target - <mxCell> that specifies the new target terminal.
     */
    setTerminals(edge: mxCell, source: mxCell, target: mxCell);
    /**
     * Function: terminalForCellChanged
     * 
     * Inner helper function to update the terminal of the edge using
     * <mxCell.insertEdge> and return the previous terminal.
     * 
     * Parameters:
     * 
     * edge - <mxCell> that specifies the edge to be updated.
     * terminal - <mxCell> that specifies the new terminal.
     * isSource - Boolean indicating if the terminal is the new source or
     * target terminal of the edge.
     */
    terminalForCellChanged(edge: mxCell, terminal: mxCell, isSource: boolean): mxCell;
    /**
     * Function: getEdgeCount
     * 
     * Returns the number of distinct edges connected to the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the vertex.
     */
    getEdgeCount(cell: mxCell): number;
    /**
     * Function: getEdgeAt
     * 
     * Returns the edge of cell at the given index.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the vertex.
     * index - Integer that specifies the index of the edge
     * to return.
     */
    getEdgeAt(cell: mxCell, index: number): mxCell;
    /**
     * Function: getDirectedEdgeCount
     * 
     * Returns the number of incoming or outgoing edges, ignoring the given
     * edge.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose edge count should be returned.
     * outgoing - Boolean that specifies if the number of outgoing or
     * incoming edges should be returned.
     * ignoredEdge - <mxCell> that represents an edge to be ignored.
     */
    getDirectedEdgeCount(cell: mxCell, outgoing: boolean, ignoredEdge: mxCell): number;
    /**
     * Function: getConnections
     * 
     * Returns all edges of the given cell without loops.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose edges should be returned.
     * 
     */
    getConnections(cell: mxCell): mxCell[];
    /**
     * Function: getIncomingEdges
     * 
     * Returns the incoming edges of the given cell without loops.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose incoming edges should be returned.
     * 
     */
    getIncomingEdges(cell: mxCell): mxCell[];
    /**
     * Function: getOutgoingEdges
     * 
     * Returns the outgoing edges of the given cell without loops.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose outgoing edges should be returned.
     * 
     */
    getOutgoingEdges(cell: mxCell): mxCell[];
    /**
     * Function: getEdges
     * 
     * Returns all distinct edges connected to this cell as a new array of
     * <mxCell[]>. If at least one of incoming or outgoing is true, then loops
     * are ignored, otherwise if both are false, then all edges connected to
     * the given cell are returned including loops.
     * 
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell.
     * incoming - Optional boolean that specifies if incoming edges should be
     * returned. Default is true.
     * outgoing - Optional boolean that specifies if outgoing edges should be
     * returned. Default is true.
     * includeLoops - Optional boolean that specifies if loops should be returned.
     * Default is true. 
     */
    getEdges(cell: mxCell, incoming?: boolean, outgoing?: boolean, includeLoops?: boolean): mxCell[];
    /**
     * Function: getEdgesBetween
     * 
     * Returns all edges between the given source and target pair. If directed
     * is true, then only edges from the source to the target are returned,
     * otherwise, all edges between the two cells are returned.
     * 
     * Parameters:
     * 
     * source - <mxCell> that defines the source terminal of the edge to be
     * returned.
     * target - <mxCell> that defines the target terminal of the edge to be
     * returned.
     * directed - Optional boolean that specifies if the direction of the
     * edge should be taken into account. Default is false.
     */
    getEdgesBetween(source: mxCell, target: mxCell, directed?: boolean): mxCell[];
    /**
     * Function: getOpposites
     * 
     * Returns all opposite vertices wrt terminal for the given edges, only
     * returning sources and/or targets as specified. The result is returned
     * as an array of <mxCell[]>.
     * 
     * Parameters:
     * 
     * edges - Array of <mxCell[]> that contain the edges to be examined.
     * terminal - <mxCell> that specifies the known end of the edges.
     * sources - Boolean that specifies if source terminals should be contained
     * in the result. Default is true.
     * targets - Boolean that specifies if target terminals should be contained
     * in the result. Default is true.
     */
    getOpposites(edges: mxCell[], terminal: mxCell, sources: boolean, targets: boolean): mxCell[];
    /**
     * Function: getTopmostCells
     * 
     * Returns the topmost cells of the hierarchy in an array that contains no
     * descendants for each <mxCell> that it contains. Duplicates should be
     * removed in the cells array to improve performance.
     * 
     * Parameters:
     * 
     * cells - Array of <mxCell[]> whose topmost ancestors should be returned.
     */
    getTopmostCells(cells: mxCell[]): mxCell[];
    /**
     * Function: isVertex
     * 
     * Returns true if the given cell is a vertex.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the possible vertex.
     */
    isVertex(cell: mxCell): boolean;
    /**
     * Function: isEdge
     * 
     * Returns true if the given cell is an edge.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the possible edge.
     */
    isEdge(cell: mxCell): boolean;
    /**
     * Function: isConnectable
     * 
     * Returns true if the given <mxCell> is connectable. If <edgesConnectable>
     * is false, then this function returns false for all edges else it returns
     * the return value of <mxCell.isConnectable>.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose connectable state should be returned.
     */
    isConnectable(cell: mxCell): boolean;
    /**
     * Function: getValue
     * 
     * Returns the user object of the given <mxCell> using <mxCell.getValue>.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose user object should be returned.
     */
    getValue(cell: mxCell): any;
    /**
     * Function: setValue
     * 
     * Sets the user object of then given <mxCell> using <mxValueChange>
     * and adds the change to the current transaction.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose user object should be changed.
     * value - Object that defines the new user object.
     */
    setValue(cell: mxCell, value: Object);
    /**
     * Function: valueForCellChanged
     * 
     * Inner callback to update the user object of the given <mxCell>
     * using <mxCell.valueChanged> and return the previous value,
     * that is, the return value of <mxCell.valueChanged>.
     * 
     * To change a specific attribute in an XML node, the following code can be
     * used.
     * 
     * (code)
     * graph.getModel().valueForCellChanged = function(cell, value)
     * {
     *   var previous = cell.value.getAttribute('label');
     *   cell.value.setAttribute('label', value);
     *   
     *   return previous;
     * };
     * (end) 
     */
    valueForCellChanged(cell: mxCell, value: Object): Object;
    /**
     * Function: getGeometry
     * 
     * Returns the <mxGeometry> of the given <mxCell>.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose geometry should be returned.
     */
    getGeometry(cell: mxCell): mxGeometry;
    /**
     * Function: setGeometry
     * 
     * Sets the <mxGeometry> of the given <mxCell>. The actual update
     * of the cell is carried out in <geometryForCellChanged>. The
     * <mxGeometryChange> action is used to encapsulate the change.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose geometry should be changed.
     * geometry - <mxGeometry> that defines the new geometry.
     */
    setGeometry(cell: mxCell, geometry: mxGeometry): mxGeometry;
    /**
     * Function: geometryForCellChanged
     * 
     * Inner callback to update the <mxGeometry> of the given <mxCell> using
     * <mxCell.setGeometry> and return the previous <mxGeometry>.
     */
    geometryForCellChanged(cell: mxCell, geometry: mxGeometry): mxGeometry;
    /**
     * Function: getStyle
     * 
     * Returns the style of the given <mxCell>.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose style should be returned.
     */
    getStyle(cell: mxCell): string;
    /**
     * Function: setStyle
     * 
     * Sets the style of the given <mxCell> using <mxStyleChange> and
     * adds the change to the current transaction.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose style should be changed.
     * style - String of the form [stylename;|key=value;] to specify
     * the new cell style.
     */
    setStyle(cell: mxCell, style: string): string;
    /**
     * Function: styleForCellChanged
     * 
     * Inner callback to update the style of the given <mxCell>
     * using <mxCell.setStyle> and return the previous style.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell to be updated.
     * style - String of the form [stylename;|key=value;] to specify
     * the new cell style.
     */
    styleForCellChanged(cell: mxCell, style: string): string;
    /**
     * Function: isCollapsed
     * 
     * Returns true if the given <mxCell> is collapsed.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose collapsed state should be returned.
     */
    isCollapsed(cell: mxCell): boolean;
    /**
     * Function: setCollapsed
     * 
     * Sets the collapsed state of the given <mxCell> using <mxCollapseChange>
     * and adds the change to the current transaction.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose collapsed state should be changed.
     * collapsed - Boolean that specifies the new collpased state.
     */
    setCollapsed(cell: mxCell, collapsed: boolean): boolean;
    /**
     * Function: collapsedStateForCellChanged
     *
     * Inner callback to update the collapsed state of the
     * given <mxCell> using <mxCell.setCollapsed> and return
     * the previous collapsed state.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell to be updated.
     * collapsed - Boolean that specifies the new collpased state.
     */
    collapsedStateForCellChanged(cell: mxCell, collapsed: boolean): boolean;
    /**
     * Function: isVisible
     * 
     * Returns true if the given <mxCell> is visible.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose visible state should be returned.
     */
    isVisible(cell: mxCell): boolean;
    /**
     * Function: setVisible
     * 
     * Sets the visible state of the given <mxCell> using <mxVisibleChange> and
     * adds the change to the current transaction.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose visible state should be changed.
     * visible - Boolean that specifies the new visible state.
     */
    setVisible(cell: mxCell, visible: boolean): boolean;
    /**
     * Function: visibleStateForCellChanged
     *
     * Inner callback to update the visible state of the
     * given <mxCell> using <mxCell.setCollapsed> and return
     * the previous visible state.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the cell to be updated.
     * visible - Boolean that specifies the new visible state.
     */
    visibleStateForCellChanged(cell: mxCell, visible: boolean): boolean;
    /**
     * Function: execute
     * 
     * Executes the given edit and fires events if required. The edit object
     * requires an execute function which is invoked. The edit is added to the
     * <currentEdit> between <beginUpdate> and <endUpdate> calls, so that
     * events will be fired if this execute is an individual transaction, that
     * is, if no previous <beginUpdate> calls have been made without calling
     * <endUpdate>. This implementation fires an <execute> event before
     * executing the given change.
     * 
     * Parameters:
     * 
     * change - Object that described the change.
     */
    execute(change: Object);
    /**
     * Function: beginUpdate
     * 
     * Increments the <updateLevel> by one. The event notification
     * is queued until <updateLevel> reaches 0 by use of
     * <endUpdate>.
     *
     * All changes on <mxGraphModel> are transactional,
     * that is, they are executed in a single undoable change
     * on the model (without transaction isolation).
     * Therefore, if you want to combine any
     * number of changes into a single undoable change,
     * you should group any two or more API calls that
     * modify the graph model between <beginUpdate>
     * and <endUpdate> calls as shown here:
     * 
     * (code)
     * var model = graph.getModel();
     * var parent = graph.getDefaultParent();
     * var index = model.getChildCount(parent);
     * model.beginUpdate();
     * try
     * {
     *   model.add(parent, v1, index);
     *   model.add(parent, v2, index+1);
     * }
     * finally
     * {
     *   model.endUpdate();
     * }
     * (end)
     * 
     * Of course there is a shortcut for appending a
     * sequence of cells into the default parent:
     * 
     * (code)
     * graph.addCells([v1, v2]).
     * (end)
     */
    beginUpdate();
    /**
     * Function: endUpdate
     * 
     * Decrements the <updateLevel> by one and fires an <undo>
     * event if the <updateLevel> reaches 0. This function
     * indirectly fires a <change> event by invoking the notify
     * function on the <currentEdit> und then creates a new
     * <currentEdit> using <createUndoableEdit>.
     *
     * The <undo> event is fired only once per edit, whereas
     * the <change> event is fired whenever the notify
     * function is invoked, that is, on undo and redo of
     * the edit.
     */
    endUpdate();
    /**
     * Function: createUndoableEdit
     * 
     * Creates a new <mxUndoableEdit> that implements the
     * notify function to fire a <change> and <notify> event
     * through the <mxUndoableEdit>'s source.
     */
    createUndoableEdit(): mxUndoableEdit;
    /**
     * Function: mergeChildren
     * 
     * Merges the children of the given cell into the given target cell inside
     * this model. All cells are cloned unless there is a corresponding cell in
     * the model with the same id, in which case the source cell is ignored and
     * all edges are connected to the corresponding cell in this model. Edges
     * are considered to have no identity and are always cloned unless the
     * cloneAllEdges flag is set to false, in which case edges with the same
     * id in the target model are reconnected to reflect the terminals of the
     * source edges.
     */
    mergeChildren(from: mxCell, to: mxCell, cloneAllEdges: boolean);
    /**
     * Function: mergeChildren
     * 
     * Clones the children of the source cell into the given target cell in
     * this model and adds an entry to the mapping that maps from the source
     * cell to the target cell with the same id or the clone of the source cell
     * that was inserted into this model.
     */
    mergeChildrenImpl(from: mxCell, to: mxCell, cloneAllEdges: boolean, mapping: any);
    /**
     * Function: getParents
     * 
     * Returns an array that represents the set (no duplicates) of all parents
     * for the given array of cells.
     * 
     * Parameters:
     * 
     * cells - Array of cells whose parents should be returned.
     */
    getParents(cells: mxCell[]): mxCell[];
    /**
     * Function: cloneCell
     * 
     * Returns a deep clone of the given <mxCell> (including
     * the children) which is created using <cloneCells>.
     *
     * Parameters:
     * 
     * cell - <mxCell> to be cloned.
     */
    cloneCell(cell: mxCell): mxCell;
    /**
     * Function: cloneCells
     * 
     * Returns an array of clones for the given array of <mxCell[]>.
     * Depending on the value of includeChildren, a deep clone is created for
     * each cell. Connections are restored based if the corresponding
     * cell is contained in the passed in array.
     *
     * Parameters:
     * 
     * cells - Array of <mxCell> to be cloned.
     * includeChildren - Boolean indicating if the cells should be cloned
     * with all descendants.
     */
    cloneCells(cells: mxCell[], includeChildren: boolean): mxCell[];
    /**
     * Function: cloneCellImpl
     * 
     * Inner helper method for cloning cells recursively.
     */
    cloneCellImpl(cell: mxCell, mapping: any, includeChildren: boolean): mxCell;
    /**
     * Function: cellCloned
     * 
     * Hook for cloning the cell. This returns cell.clone() or
     * any possible exceptions.
     */
    cellCloned(cell: mxCell): mxCell;
    /**
     * Function: restoreClone
     * 
     * Inner helper method for restoring the connections in
     * a network of cloned cells.
     */
    restoreClone(clone: mxCell, cell: mxCell, mapping: any);

}

   
/*
 * Constructs a new graph model.If no root is specified then a new root
 * <mxCell> with a default layer is created.
 * 
 * Parameters:
 *
 * root - <mxCell> that represents the root cell.
 */
declare var mxGraphModel: {
  new (root?: mxCell): mxGraphModel;
    prototype: mxGraphModel;
}

interface mxRootChange { // inside mxGraphModel.js

    /**
     * Function: execute
     * 
     * Carries out a change of the root using
     * <mxGraphModel.rootChanged>.
     */
    execute();

}

declare var mxRootChange: {
    new (model: mxGraphModel, root: mxCell): mxRootChange;
    prototype: mxRootChange;
}

interface mxChildChange {
    /**
     * Function: execute
     * 
     * Changes the parent of <child> using
     * <mxGraphModel.parentForCellChanged> and
     * removes or restores the cell's
     * connections.
     */
    execute();
    /**
     * Function: disconnect
     * 
     * Disconnects the given cell recursively from its
     * terminals and stores the previous terminal in the
     * cell's terminals.
     */
    connect(cell: mxCell, isConnect: boolean);

}

declare var mxChildChange: {
    new (model: mxGraphModel, parent: mxCell, child: mxCell, index: number): mxChildChange;
    prototype: mxChildChange;
}

interface mxTerminalChange {

    /**
     * Function: execute
     * 
     * Changes the terminal of <cell> to <previous> using
     * <mxGraphModel.terminalForCellChanged>.
     */
    execute();

}

 declare var mxTerminalChange: {
     new (model: mxGraphModel, cell: mxCell, terminal: mxCell, source: mxCell): mxTerminalChange;
     prototype: mxTerminalChange;
 }

interface mxValueChange {

    /**
     * Function: execute
     * 
     * Changes the value of <cell> to <previous> using
     * <mxGraphModel.valueForCellChanged>.
     */
    execute();

}

declare var mxValueChange: {
    new (mode: mxGraphModel, cell: mxCell, value: Object): mxValueChange;
    prototype: mxValueChange;
}

interface mxStyleChange {

    /**
     * Function: execute
     * 
     * Changes the style of <cell> to <previous> using
     * <mxGraphModel.styleForCellChanged>.
     */
    execute();

}

declare var mxStyleChange: {
    new (model: mxGraphModel, cell: mxCell, style: any): mxStyleChange;
    prototype: mxStyleChange;
}

interface mxGeometryChange {

    /**
     * Function: execute
     * 
     * Changes the geometry of <cell> ro <previous> using
     * <mxGraphModel.geometryForCellChanged>.
     */
    execute();

}

declare var mxGeometryChange: {
    new (model: mxGraphModel, cell: mxCell, geometry: mxGeometry): mxGeometryChange;
    prototype: mxGeometryChange;
}

interface mxCollapseChange {

    /**
     * Function: execute
     * 
     * Changes the collapsed state of <cell> to <previous> using
     * <mxGraphModel.collapsedStateForCellChanged>.
     */
    execute();

}

declare var mxCollapseChange: {
    new (model: mxGraphModel, cell: mxCell, collapsed: any): mxCollapseChange;
    prototype: mxCollapseChange;
}

interface mxVisibleChange {

    /**
     * Function: execute
     * 
     * Changes the visible state of <cell> to <previous> using
     * <mxGraphModel.visibleStateForCellChanged>.
     */
    execute();

}

declare var mxVisibleChange: {
    new (model: mxGraphModel, cell: mxCell, visible: any): mxVisibleChange;
    prototype: mxVisibleChange;
}

interface mxCellAttributeChange {

    /**
     * Function: execute
     * 
     * Changes the attribute of the cell's user object by
     * using <mxCell.setAttribute>.
     */
    execute();

}

declare var mxCellAttributeChange: {
    new (cell: mxCell, attribute: any, value: any): mxCellAttributeChange;
    prototype: mxCellAttributeChange;
}

//}