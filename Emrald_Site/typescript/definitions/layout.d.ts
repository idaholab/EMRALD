// Copyright 2021 Battelle Energy Alliance

//declare module mxGraphModule {

interface mxCircleLayout extends mxGraphLayout {
    /**
     * Variable: radius
     * 
     * Integer specifying the size of the radius. Default is 100.
     */
    radius: number;
    /**
     * Variable: moveCircle
     * 
     * Boolean specifying if the circle should be moved to the top,
     * left corner specified by <x0> and <y0>. Default is false.
     */
    moveCircle: boolean;
    /**
     * Variable: x0
     * 
     * Integer specifying the left coordinate of the circle.
     * Default is 0.
     */
    x0: number;
    /**
     * Variable: y0
     * 
     * Integer specifying the top coordinate of the circle.
     * Default is 0.
     */
    y0: number;
    /**
     * Variable: resetEdges
     * 
     * Specifies if all edge points of traversed edges should be removed.
     * Default is true.
     */
    resetEdges: boolean;
    /**
     * Variable: disableEdgeStyle
     * 
     * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
     * modified by the result. Default is true.
     */
    disableEdgeStyle: boolean;
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     */
    execute(parent: mxCell);
    /**
     * Function: getRadius
     * 
     * Returns the radius to be used for the given vertex count. Max is the maximum
     * width or height of all vertices in the layout.
     */
    getRadius(count: number, max: number);
    /**
     * Function: circle
     * 
     * Executes the circular layout for the specified array
     * of vertices and the given radius. This is called from
     * <execute>.
     */
    circle(vertices: any, r: number, left: number, top: number);

}

declare var mxCircleLayout: {
    new (graph: mxGraph, radius?: number): mxCircleLayout;
    prototype: mxCircleLayout;
}

interface mxCompactTreeLayout extends mxGraphLayout {

    horizontal: boolean;
    invert: boolean;
    resizeParent: boolean;
    groupPadding: number;
    parentsChanged: any;
    moveTree: boolean;
    levelDistance: number;
    nodeDistance: number;
    resetEdges: boolean;
    prefHozEdgeSep: number;
    prefVertEdgeOff: number;
    minEdgeJetty: number;
    channelBuffer: number;
    edgeRouting: boolean;
    sortEdges: boolean;
    alignRanks: boolean;
    maxRankHeight: number[];
    isVertexIgnored(vertex: mxCell): boolean;
    isHorizontal(): boolean;

    execute(parent: mxCell, root?: mxCell);        // Incompatability issues with mxGraphLayout
    execute(parent: mxCell);                       // Original: parent: mxCell, root?: mxCell
    execute(parent: mxCell, swimlanes: mxCell[]);  //

    moveNode(node: Object, dx: number, dy: number);
    sortOutgoingEdges(source: mxCell, edges: any);
    findRankHeights(node: Object, rank: number);
    setCellHeights(node: Object, rank: number);
    dfs(cell: mxCell, parent: mxCell, visited: any): any;
    layout(node: Object);
    horizontalLayout(node: Object, x0: number, y0: number, bounds: mxRectangle): mxRectangle;
    verticalLayout(node: Object, parent: mxCell, x0: number, y0: number, bounds: mxRectangle): mxRectangle;
    attachParent(node: Object, height: number);
    layoutLeaf(node: Object);
    join(node: Object): number;
    merge(p1: any, p2: any): number;
    offset(p1: number, p2: number, a1: number, a2: number, b1: number, b2: number): number
    bridge(line1: any, x1: number, y1: number, line2: any, x2: number, y2: number): any;
    createNode(cell: mxCell): Object;
    apply(node: Object, bounds: mxRectangle): mxRectangle;
    createLine(dx: number, dy: number, next: any): Object;
    adjustParents();
    localEdgeProcessing(node: Object);
    processNodeOutgoing(node: Object);

}

declare var mxCompactTreeLayout: {
    new (graph: mxGraph, horizontal?: boolean, invert?: boolean): mxCompactTreeLayout;
    prototype: mxCompactTreeLayout;
}

interface WeightedCellSorter { // at end of mxCompactTreeLayout.js

    weightedValue: number;
    nudge: boolean;
    visited: boolean;
    rankIndex: any;
    cell: mxCell;
    compare(a: Object, b: Object): number;

}

declare var WeightedCellSorter: {
    new (cell: mxCell, weightValue: number): WeightedCellSorter;
    prototype: WeightedCellSorter;
}

interface mxCompositeLayout extends mxGraphLayout {

    /**
     * Variable: layouts
     * 
     * Holds the array of <mxGraphLayouts> that this layout contains.
     */
    layouts: mxGraphLayout[];
    /**
     * Variable: layouts
     * 
     * Reference to the <mxGraphLayouts> that handles moves. If this is null
     * then the first layout in <layouts> is used.
     */
    master: mxGraphLayout;
    /**
     * Function: moveCell
     * 
     * Implements <mxGraphLayout.moveCell> by calling move on <master> or the first
     * layout in <layouts>.
     */
    moveCell(cell: mxCell, x: number, y: number);
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute> by executing all <layouts> in a
     * single transaction.
     */
    execute(parent: mxCell);


}

declare var mxCompositeLayout: {
    new (graph: mxGraph, layouts: mxGraphLayout[], master?: any): mxCompositeLayout;
    prototype: mxCompositeLayout;
}

interface mxEdgeLabelLayout extends mxGraphLayout {

    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     */
    execute(parent: mxCell);
    /**
     * Function: placeLabels
     * 
     * Places the labels of the given edges.
     */
    placeLabels(v: any[], e: any[]);
    /**
     * Function: avoid
     * 
     * Places the labels of the given edges.
     */
    avoid(edge: mxCell, vertex: mxCell);

}

declare var mxEdgeLabelLayout: {
    new (graph: mxGraph, radius?: number): mxEdgeLabelLayout;
    prototype: mxEdgeLabelLayout;
}

interface mxFastOrganicLayout extends mxGraphLayout {

    useInputOrigin: boolean;
    resetEdges: boolean;
    disableEdgeStyle: boolean;
    forceConstant: number;
    forceConstantSquared: number;
    minDistanceLimit: number;
    maxDistanceLimit: number;
    minDistanceLimitSquared: number;
    initialTemp: number;
    temperature: number;
    maxIterations: number;
    iteration: number;
    vertexArray: any[];
    dispX: number[];
    dispY: number[];
    cellLocation: number[];
    radius: number;
    radiusSquared: number;
    isMoveable: boolean[]
    neighbours: any;
    indices: any[]
    allowedToRun: boolean;
    isVertexIgnored(vertex: mxCell): boolean;
    execute(parent: mxCell);
    calcPositions();
    calcAttraction();
    calcRepulsion();
    reduceTemperature();

}

declare var mxFastOrganicLayout: {
    new (graph: mxGraph): mxFastOrganicLayout;
    prototype: mxFastOrganicLayout;
}

interface mxGraphLayout {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: useBoundingBox
     *
     * Boolean indicating if the bounding box of the label should be used if
     * its available. Default is true.
     */
    useBoundingBox: boolean;
    /**
     * Variable: parent
     *
     * The parent cell of the layout, if any
     */
    parent: mxCell;
    /**
     * Function: moveCell
     * 
     * Notified when a cell is being moved in a parent that has automatic
     * layout to update the cell state (eg. index) so that the outcome of the
     * layout will position the vertex as close to the point (x, y) as
     * possible.
     * 
     * Empty implementation.
     * 
     * Parameters:
     * 
     * cell - <mxCell> which has been moved.
     * x - X-coordinate of the new cell location.
     * y - Y-coordinate of the new cell location.
     */
    moveCell(cell: mxCell, x: number, y: number);
    /**
     * Function: execute
     * 
     * Executes the layout algorithm for the children of the given parent.
     * 
     * Parameters:
     * 
     * parent - <mxCell> whose children should be layed out.
     */
    execute(parent: mxCell);
    execute(parent: mxCell, swimlanes: mxCell[]);
    execute(parent: mxCell, root?: mxCell);
    /**
     * Function: getGraph
     * 
     * Returns the graph that this layout operates on.
     */
    getGraph(): mxGraph;
    /**
     * Function: getConstraint
     * 
     * Returns the constraint for the given key and cell. The optional edge and
     * source arguments are used to return inbound and outgoing routing-
     * constraints for the given edge and vertex. This implementation always
     * returns the value for the given key in the style of the given cell.
     * 
     * Parameters:
     * 
     * key - Key of the constraint to be returned.
     * cell - <mxCell> whose constraint should be returned.
     * edge - Optional <mxCell> that represents the connection whose constraint
     * should be returned. Default is null.
     * source - Optional boolean that specifies if the connection is incoming
     * or outgoing. Default is null.
     */
    getConstraint(key: any, cell: mxCell, edge?: mxCell, source?: boolean): any;
    traverse(vertex: mxCell, directed: boolean, func?: ICallback, edge?: mxCell, visited?: any[]);
    /**
     * Function: isVertexMovable
     * 
     * Returns a boolean indicating if the given <mxCell> is movable or
     * bendable by the algorithm. This implementation returns true if the given
     * cell is movable in the graph.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose movable state should be returned.
     */
    isVertexMovable(cell: mxCell): boolean;
    /**
     * Function: isVertexIgnored
     * 
     * Returns a boolean indicating if the given <mxCell> should be ignored by
     * the algorithm. This implementation returns false for all vertices.
     * 
     * Parameters:
     * 
     * vertex - <mxCell> whose ignored state should be returned.
     */
    isVertexIgnored(vertex: mxCell): boolean;
    /**
     * Function: isEdgeIgnored
     * 
     * Returns a boolean indicating if the given <mxCell> should be ignored by
     * the algorithm. This implementation returns false for all vertices.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose ignored state should be returned.
     */
    isEdgeIgnored(edge: mxCell): boolean;
    /**
     * Function: setEdgeStyleEnabled
     * 
     * Disables or enables the edge style of the given edge.
     */
    setEdgeStyleEnabled(edge: mxCell, value: string);
    /**
     * Function: setOrthogonalEdge
     * 
     * Disables or enables orthogonal end segments of the given edge.
     */
    setOrthogonalEdge(edge: mxCell, value: string);
    /**
     * Function: getParentOffset
     * 
     * Determines the offset of the given parent to the parent
     * of the layout
     */
    getParentOffset(parent: mxCell):mxPoint;
    /**
     * Function: setEdgePoints
     * 
     * Replaces the array of mxPoints in the geometry of the given edge
     * with the given array of mxPoints.
     */
    setEdgePoints(edge: mxCell, points: mxPoint[]);
    /**
     * Function: setVertexLocation
     * 
     * Sets the new position of the given cell taking into account the size of
     * the bounding box if <useBoundingBox> is true. The change is only carried
     * out if the new location is not equal to the existing location, otherwise
     * the geometry is not replaced with an updated instance. The new or old
     * bounds are returned (including overlapping labels).
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose geometry is to be set.
     * x - Integer that defines the x-coordinate of the new location.
     * y - Integer that defines the y-coordinate of the new location.
     */
    setVertexLocation(cell: mxCell, x: number, y: number): mxRectangle;
    /**
     * Function: getVertexBounds
     * 
     * Returns an <mxRectangle> that defines the bounds of the given cell or
     * the bounding box if <useBoundingBox> is true.
     */
    getVertexBounds(cell: mxCell): mxRectangle;
    /**
     * Function: arrangeGroups
     * 
     * Updates the bounds of the given groups to include all children. Call
     * this with the groups in parent to child order, top-most group first, eg.
     * 
     * arrangeGroups(graph, mxUtils.sortCells(Arrays.asList(
     *   new Object[] { v1, v3 }), true).toArray(), 10);
     */
    arrangeGroups(groups: mxCell[], border: number); 

}

declare var mxGraphLayout: {
    new (graph: mxGraph): mxGraphLayout;
    prototype: mxGraphLayout;
}

interface mxParallelEdgeLayout extends mxGraphLayout {

    /**
     * Variable: spacing
     * 
     * Defines the spacing between the parallels. Default is 20.
     */
    spacing: number;
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     */
    execute(parent: mxCell);
    /**
     * Function: findParallels
     * 
     * Finds the parallel edges in the given parent.
     */
    findParallels(parent: mxCell): mxCell[];
    /**
     * Function: getEdgeId
     * 
     * Returns a unique ID for the given edge. The id is independent of the
     * edge direction and is built using the visible terminal of the given
     * edge.
     */
    getEdgeId(edge: mxCell): any;
    /**
     * Function: layout
     * 
     * Lays out the parallel edges in the given array.
     */
    layout(parallels: mxCell[]);
    /**
     * Function: route
     * 
     * Routes the given edge via the given point.
     */
    route(edge: mxCell, x: number, y: number);

}

declare var mxParallelEdgeLayout: {
    new (graph: mxGraph): mxParallelEdgeLayout;
    prototype: mxParallelEdgeLayout;
}

interface mxPartitionLayout extends mxGraphLayout {

    /**
     * Variable: horizontal
     * 
     * Boolean indicating the direction in which the space is partitioned.
     * Default is true.
     */
    horizontal: boolean;
    /**
     * Variable: spacing
     * 
     * Integer that specifies the absolute spacing in pixels between the
     * children. Default is 0.
     */
    spacing: number;
    /**
     * Variable: border
     * 
     * Integer that specifies the absolute inset in pixels for the parent that
     * contains the children. Default is 0.
     */
    border: number;
    /**
     * Variable: resizeVertices
     * 
     * Boolean that specifies if vertices should be resized. Default is true.
     */
    resizeVertices: boolean;
    /**
     * Function: isHorizontal
     * 
     * Returns <horizontal>.
     */
    isHorizontal(): boolean;
    /**
     * Function: moveCell
     * 
     * Implements <mxGraphLayout.moveCell>.
     */
    moveCell(cell: mxCell, x: number, y: number);
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>. All children where <isVertexIgnored>
     * returns false and <isVertexMovable> returns true are modified.
     */
    execute(parent: mxCell);

}

declare var mxPartitionLayout: {
    new (graph: mxGraph, horizontal?: boolean, spacing?: number, border?: number): mxPartitionLayout;
    prototype: mxPartitionLayout;
}

interface mxStackLayout extends mxGraphLayout {

    /**
     * Variable: horizontal
     *
     * Specifies the orientation of the layout. Default is true.
     */
    horizontal: boolean;
    /**
     * Variable: spacing
     *
     * Specifies the spacing between the cells. Default is 0.
     */
    spacing: number;
    /**
     * Variable: x0
     *
     * Specifies the horizontal origin of the layout. Default is 0.
     */
    x0: number;
    /**
     * Variable: y0
     *
     * Specifies the vertical origin of the layout. Default is 0.
     */
    y0: number;
    /**
     * Variable: border
     *
     * Border to be added if fill is true. Default is 0.
     */
    border: number;
    /**
     * Variable: marginTop
     * 
     * Top margin for the child area. Default is 0.
     */
    marginTop: number;
    /**
     * Variable: marginLeft
     * 
     * Top margin for the child area. Default is 0.
     */
    marginLeft: number;
    /**
     * Variable: marginRight
     * 
     * Top margin for the child area. Default is 0.
     */
    marginRight: number;
    /**
     * Variable: marginBottom
     * 
     * Top margin for the child area. Default is 0.
     */
    marginBottom: number;
    /**
     * Variable: keepFirstLocation
     * 
     * Boolean indicating if the location of the first cell should be
     * kept, that is, it will not be moved to x0 or y0.
     */
    keepFirstLocation: boolean;
    /**
     * Variable: fill
     * 
     * Boolean indicating if dimension should be changed to fill out the parent
     * cell. Default is false.
     */
    fill: boolean;
    /**
     * Variable: resizeParent
     * 
     * If the parent should be resized to match the width/height of the
     * stack. Default is false.
     */
    resizeParent: boolean;
    /**
     * Variable: resizeLast
     * 
     * If the last element should be resized to fill out the parent. Default is
     * false. If <resizeParent> is true then this is ignored.
     */
    resizeLast: boolean;
    /**
     * Variable: wrap
     * 
     * Value at which a new column or row should be created. Default is null.
     */
    wrap: any;
    /**
     * Variable: borderCollapse
     * 
     * If the strokeWidth should be ignored. Default is true.
     */
    borderCollapse: boolean;
    /**
     * Function: isHorizontal
     * 
     * Returns <horizontal>.
     */
    isHorizontal(): boolean;
    /**
     * Function: moveCell
     * 
     * Implements <mxGraphLayout.moveCell>.
     */
    moveCell(cell: mxCell, x: number, y: number);
    /**
     * Function: getParentSize
     * 
     * Returns the size for the parent container or the size of the graph
     * container if the parent is a layer or the root of the model.
     */
    getParentSize(parent: mxCell): mxRectangle;
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     * 
     * Only children where <isVertexIgnored> returns false are taken into
     * account.
     */
    execute(parent: mxCell);
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     * 
     * Only children where <isVertexIgnored> returns false are taken into
     * account.
     */
    setChildGeometry(child: mxCell, geo: any);
    /**
     * Function: execute
     * 
     * Implements <mxGraphLayout.execute>.
     * 
     * Only children where <isVertexIgnored> returns false are taken into
     * account.
     */
    updateParentGeometry(parent: mxCell, pgeo: mxRectangle, last: any);

}

declare var mxStackLayout: {
    new (graph: mxGraph, horizontal?: boolean, spacing?: number, x0?: number, y0?: number, border?: number): mxStackLayout;
    prototype: mxStackLayout;
}

interface mxHierarchicalLayout extends mxGraphLayout {

    /**
     * Variable: roots
     * 
     * Holds the array of <mxCell> that this layout contains.
     */
    roots: mxCell[];
    /**
     * Variable: resizeParent
     * 
     * Specifies if the parent should be resized after the layout so that it
     * contains all the child cells. Default is false. See also <parentBorder>.
     */
    resizeParent: boolean;
    /**
     * Variable: moveParent
     * 
     * Specifies if the parent should be moved if <resizeParent> is enabled.
     * Default is false.
     */
    moveParent: boolean;
    /**
     * Variable: parentBorder
     * 
     * The border to be added around the children if the parent is to be
     * resized using <resizeParent>. Default is 0.
     */
    parentBorder: number;
    /**
     * Variable: intraCellSpacing
     * 
     * The spacing buffer added between cells on the same layer. Default is 30.
     */
    intraCellSpacing: number;
    /**
     * Variable: interRankCellSpacing
     * 
     * The spacing buffer added between cell on adjacent layers. Default is 50.
     */
    interRankCellSpacing: number;
    /**
     * Variable: interHierarchySpacing
     * 
     * The spacing buffer between unconnected hierarchies. Default is 60.
     */
    interHierarchySpacing: number;
    /**
     * Variable: parallelEdgeSpacing
     * 
     * The distance between each parallel edge on each ranks for long edges
     */
    parallelEdgeSpacing: number;
    /**
     * Variable: orientation
     * 
     * The position of the root node(s) relative to the laid out graph in.
     * Default is <mxConstants.DIRECTION_NORTH>.
     */
    orientation: any;
    /**
     * Variable: fineTuning
     * 
     * Whether or not to perform local optimisations and iterate multiple times
     * through the algorithm. Default is true.
     */
    fineTuning: boolean;
    /**
     * 
     * Variable: tightenToSource
     * 
     * Whether or not to tighten the assigned ranks of vertices up towards
     * the source cells.
     */
    tightenToSource: boolean;
    /**
     * Variable: disableEdgeStyle
     * 
     * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
     * modified by the result. Default is true.
     */
    disableEdgeStyle: boolean;
    /**
     * Variable: traverseAncestors
     * 
     * Whether or not to drill into child cells and layout in reverse
     * group order. This also cause the layout to navigate edges whose 
     * terminal vertices  * have different parents but are in the same 
     * ancestry chain
     */
    traverseAncestors: boolean;
    /**
     * Variable: model
     * 
     * The internal <mxGraphHierarchyModel> formed of the layout.
     */
    model: any;
    /**
     * Variable: edgesSet
     * 
     * A cache of edges whose source terminal is the key
     */
    edgesCache: any;
    /**
     * Variable: edgesSet
     * 
     * A cache of edges whose source terminal is the key
     */
    edgeSourceTermCache: any;
    /**
     * Variable: edgesSet
     * 
     * A cache of edges whose source terminal is the key
     */
    edgesTargetTermCache: any;
    /**
     * Function: getModel
     * 
     * Returns the internal <mxGraphHierarchyModel> for this layout algorithm.
     */
    getModel(): any;
    /**
     * Function: execute
     * 
     * Executes the layout for the children of the specified parent.
     * 
     * Parameters:
     * 
     * parent - Parent <mxCell> that contains the children to be laid out.
     * roots - Optional starting roots of the layout.
     */
    execute(parent: mxCell, roots?: any[]);  // Incompatibility issues. Original: parent: mxCell, roots?: any[]
    execute(parent: mxCell);
    execute(parent: mxCell, swimlanes: mxCell[]);
    execute(parent: mxCell, root?: mxCell);
    /**
     * Function: findRoots
     * 
     * Returns all visible children in the given parent which do not have
     * incoming edges. If the result is empty then the children with the
     * maximum difference between incoming and outgoing edges are returned.
     * This takes into account edges that are being promoted to the given
     * root due to invisible children or collapsed cells.
     * 
     * Parameters:
     * 
     * parent - <mxCell> whose children should be checked.
     * vertices - array of vertices to limit search to
     */
    findRoots(parent: mxCell, vertices: mxCell[]): mxCell[];
    /**
     * Function: getEdges
     * 
     * Returns the connected edges for the given cell.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose edges should be returned.
     */
    getEdges(cell: mxCell): mxCell[];
    /**
     * Function: getVisibleTerminal
     * 
     * Helper function to return visible terminal for edge allowing for ports
     * 
     * Parameters:
     * 
     * edge - <mxCell> whose edges should be returned.
     * source - Boolean that specifies whether the source or target terminal is to be returned
     */
    getVisibleTerminal(edge: mxCell, source: boolean): mxCell;
    /**
     * Function: run
     * 
     * The API method used to exercise the layout upon the graph description
     * and produce a separate description of the vertex position and edge
     * routing changes made. It runs each stage of the layout that has been
     * created.
     */
    run(parent: mxCell);
    /**
     * Function: filterDescendants
     * 
     * Creates an array of descendant cells
     */
    filterDescendants(cell: mxCell[], result: any[]);
    /**
     * Function: isPort
     * 
     * Returns true if the given cell is a "port", that is, when connecting to
     * it, its parent is the connecting vertex in terms of graph traversal
     * 
     * Parameters:
     * 
     * cell - <mxCell> that represents the port.
     */
    isPort(cell: mxCell): boolean;
    /**
     * Function: getEdgesBetween
     * 
     * Returns the edges between the given source and target. This takes into
     * account collapsed and invisible cells and ports.
     * 
     * Parameters:
     * 
     * source -
     * target -
     * directed -
     */
    getEdgesBetween(source: mxCell, target: mxCell, directed?: boolean);
    /**
     * Traverses the (directed) graph invoking the given function for each
     * visited vertex and edge. The function is invoked with the current vertex
     * and the incoming edge as a parameter. This implementation makes sure
     * each vertex is only visited once. The function may return false if the
     * traversal should stop at the given vertex.
     * 
     * Parameters:
     * 
     * vertex - <mxCell> that represents the vertex where the traversal starts.
     * directed - boolean indicating if edges should only be traversed
     * from source to target. Default is true.
     * edge - Optional <mxCell> that represents the incoming edge. This is
     * null for the first step of the traversal.
     * allVertices - Array of cell paths for the visited cells.
     */

    traverse(vertex: mxCell, directed: boolean, edge?: mxCell, allVertices?: any[], currentComp?: any[], hierarchyVertices?: any[], filledVertexSet?: any[]): any[];
    traverse(vertex: mxCell, directed: boolean, func?: ICallback, edge?: mxCell, visited?: any[]);
    
    /**
     * Function: cycleStage
     * 
     * Executes the cycle stage using mxMinimumCycleRemover.
     */
    cycleStage(parent: mxCell);
    /**
     * Function: layeringStage
     * 
     * Implements first stage of a Sugiyama layout.
     */
    layeringStage();
    /**
     * Function: crossingStage
     * 
     * Executes the crossing stage using mxMedianHybridCrossingReduction.
     */
    crossingStage(parent: mxCell);
    /**
     * Function: placementStage
     * 
     * Executes the placement stage using mxCoordinateAssignment.
     */
    placementStage(initialX: number, parent: mxCell): number;

}

declare var mxHierarchicalLayout: {
    new (graph: mxGraph, orientation?: any, deterministic?: boolean): mxHierarchicalLayout;
    prototype: mxHierarchicalLayout;
}

interface mxSwimlaneLayout extends mxGraphLayout {

    /**
     * Variable: roots
     * 
     * Holds the array of <mxCell> that this layout contains.
     */
    roots: mxCell[];
    /**
     * Variable: swimlanes
     * 
     * Holds the array of <mxCell> of the ordered swimlanes to lay out
     */
    swimlanes: mxCell[];
    /**
     * Variable: dummyVertices
     * 
     * Holds an array of <mxCell> of dummy vertices inserted during the layout
     * to pad out empty swimlanes
     */
    dummyVertices: mxCell[];
    /**
     * Variable: dummyVertexWidth
     * 
     * The cell width of any dummy vertices inserted
     */
    dummyVertexWidth: number;
    /**
     * Variable: resizeParent
     * 
     * Specifies if the parent should be resized after the layout so that it
     * contains all the child cells. Default is false. See also <parentBorder>.
     */
    resizeParent: boolean;
    /**
     * Variable: moveParent
     * 
     * Specifies if the parent should be moved if <resizeParent> is enabled.
     * Default is false.
     */
    moveParent: boolean;
    /**
     * Variable: parentBorder
     * 
     * The border to be added around the children if the parent is to be
     * resized using <resizeParent>. Default is 0.
     */
    parentBorder: number;
    /**
     * Variable: intraCellSpacing
     * 
     * The spacing buffer added between cells on the same layer. Default is 30.
     */
    intraCellSpacing: number;
    /**
     * Variable: interRankCellSpacing
     * 
     * The spacing buffer added between cell on adjacent layers. Default is 50.
     */
    interRankCellSpacing: number;
    /**
     * Variable: interHierarchySpacing
     * 
     * The spacing buffer between unconnected hierarchies. Default is 60.
     */
    interHierarchySpacing: number;
    /**
     * Variable: parallelEdgeSpacing
     * 
     * The distance between each parallel edge on each ranks for long edges
     */
    parallelEdgeSpacing: number;
    /**
     * Variable: orientation
     * 
     * The position of the root node(s) relative to the laid out graph in.
     * Default is <mxConstants.DIRECTION_NORTH>.
     */
    orientation: any;
    /**
     * Variable: fineTuning
     * 
     * Whether or not to perform local optimisations and iterate multiple times
     * through the algorithm. Default is true.
     */
    fineTuning: boolean;
    /**
     * 
     * Variable: tightenToSource
     * 
     * Whether or not to tighten the assigned ranks of vertices up towards
     * the source cells.
     */
    tightenToSource: boolean;
    /**
     * Variable: disableEdgeStyle
     * 
     * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
     * modified by the result. Default is true.
     */
    disableEdgeStyle: boolean;
    /**
     * Variable: traverseAncestors
     * 
     * Whether or not to drill into child cells and layout in reverse
     * group order. This also cause the layout to navigate edges whose 
     * terminal vertices  * have different parents but are in the same 
     * ancestry chain
     */
    traverseAncestors: boolean;
    /**
     * Variable: model
     * 
     * The internal <mxSwimlaneModel> formed of the layout.
     */
    model: mxSwimlaneModel;
    /**
     * Variable: edgesSet
     * 
     * A cache of edges whose source terminal is the key
     */
    edgesCache: any;
    /**
     * Function: getModel
     * 
     * Returns the internal <mxSwimlaneModel> for this layout algorithm.
     */
    getModel(): mxSwimlaneModel;
    /**
     * Function: execute
     * 
     * Executes the layout for the children of the specified parent.
     * 
     * Parameters:
     * 
     * parent - Parent <mxCell> that contains the children to be laid out.
     * swimlanes - Ordered array of swimlanes to be laid out
     */
    execute(parent: mxCell, swimlanes?: mxCell[]); // incompatibility issues.
    execute(parent: mxCell);
    execute(parent: mxCell, swimlanes: mxCell[]);
    execute(parent: mxCell, root?: mxCell);

    /**
     * Function: updateGroupBounds
     * 
     * Updates the bounds of the given array of groups so that it includes
     * all child vertices.
     * 
     */
    updateGroupBounds();
    /**
     * Function: findRoots
     * 
     * Returns all visible children in the given parent which do not have
     * incoming edges. If the result is empty then the children with the
     * maximum difference between incoming and outgoing edges are returned.
     * This takes into account edges that are being promoted to the given
     * root due to invisible children or collapsed cells.
     * 
     * Parameters:
     * 
     * parent - <mxCell> whose children should be checked.
     * vertices - array of vertices to limit search to
     */
    findRoots(parent: mxCell, vertices: mxCell[]): mxCell[];
    /**
     * Function: getEdges
     * 
     * Returns the connected edges for the given cell.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose edges should be returned.
     */
    getEdges(cell: mxCell): mxCell[];
    /**
     * Function: getVisibleTerminal
     * 
     * Helper function to return visible terminal for edge allowing for ports
     * 
     * Parameters:
     * 
     * edge - <mxCell> whose edges should be returned.
     * source - Boolean that specifies whether the source or target terminal is to be returned
     */
    getVisibleTerminal(edge: mxCell, source: boolean): mxCell;
    /**
     * Function: run
     * 
     * The API method used to exercise the layout upon the graph description
     * and produce a separate description of the vertex position and edge
     * routing changes made. It runs each stage of the layout that has been
     * created.
     */
    run(parent: mxCell);
    /**
     * Function: filterDescendants
     * 
     * Creates an array of descendant cells
     */
    filterDescendants(cell: mxCell, result: any[]);
    /**
     * Function: isPort
     * 
     * Returns true if the given cell is a "port", that is, when connecting to
     * it, its parent is the connecting vertex in terms of graph traversal
     * 
     * Parameters:
     * 
     * cell - <mxCell> that represents the port.
     */
    isPort(cell: mxCell): boolean;
    /**
     * Function: getEdgesBetween
     * 
     * Returns the edges between the given source and target. This takes into
     * account collapsed and invisible cells and ports.
     * 
     * Parameters:
     * 
     * source -
     * target -
     * directed -
     */
    getEdgesBetween(source: mxCell, target: mxCell, directed?: boolean): mxCell[];
    /**
     * Traverses the (directed) graph invoking the given function for each
     * visited vertex and edge. The function is invoked with the current vertex
     * and the incoming edge as a parameter. This implementation makes sure
     * each vertex is only visited once. The function may return false if the
     * traversal should stop at the given vertex.
     * 
     * Parameters:
     * 
     * vertex - <mxCell> that represents the vertex where the traversal starts.
     * directed - boolean indicating if edges should only be traversed
     * from source to target. Default is true.
     * edge - Optional <mxCell> that represents the incoming edge. This is
     * null for the first step of the traversal.
     * allVertices - Array of cell paths for the visited cells.
     * swimlaneIndex - the laid out order index of the swimlane vertex is contained in
     */
    traverse(vertex: mxCell, directed: boolean, edge?: mxCell, allVertices?: any[], currentComp?: any[], hierarchyVertices?: any[], filledVertexSet?: any[], swimlaneIndex?: number): any[];
    traverse(vertex: mxCell, directed: boolean, func?: ICallback, edge?: mxCell, visited?: any[]);
    /**
     * Function: cycleStage
     * 
     * Executes the cycle stage using mxMinimumCycleRemover.
     */
    cycleStage(parent: mxCell);
    /**
     * Function: layeringStage
     * 
     * Implements first stage of a Sugiyama layout.
     */
    layeringStage();
    /**
     * Function: crossingStage
     * 
     * Executes the crossing stage using mxMedianHybridCrossingReduction.
     */
    crossingStage(parent: mxCell);
    /**
     * Function: placementStage
     * 
     * Executes the placement stage using mxCoordinateAssignment.
     */
    placementStage(initialX: number, parent: mxCell): number;

}

declare var mxSwimlaneLayout: {
    new (graph: mxGraph, orientation?: any, deterministic?: boolean): mxSwimlaneLayout;
    prototype: mxSwimlaneLayout;
}

interface mxGraphAbstractHierarchyCell {

    /**
     * Variable: maxRank
     * 
     * The maximum rank this cell occupies. Default is -1.
     */
    maxRank: number;
    /**
     * Variable: minRank
     * 
     * The minimum rank this cell occupies. Default is -1.
     */
    minRank: number;
    /**
     * Variable: x
     * 
     * The x position of this cell for each layer it occupies
     */
    x: number;
    /**
     * Variable: y
     * 
     * The y position of this cell for each layer it occupies
     */
    y: number;
    /**
     * Variable: width
     * 
     * The width of this cell
     */
    width: number;
    /**
     * Variable: height
     * 
     * The height of this cell
     */
    height: number;
    /**
     * Variable: nextLayerConnectedCells
     * 
     * A cached version of the cells this cell connects to on the next layer up
     */
    nextLayerConnectedCells: mxCell[];
    /**
     * Variable: previousLayerConnectedCells
     * 
     * A cached version of the cells this cell connects to on the next layer down
     */
    previousLayerConnectedCells: mxCell[];
    /**
     * Variable: temp
     * 
     * Temporary variable for general use. Generally, try to avoid
     * carrying information between stages. Currently, the longest
     * path layering sets temp to the rank position in fixRanks()
     * and the crossing reduction uses this. This meant temp couldn't
     * be used for hashing the nodes in the model dfs and so hashCode
     * was created
     */
    temp: any;
    /**
     * Function: getNextLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer up
     */
    getNextLayerConnectedCells(layer: any): mxCell[];
    /**
     * Function: getPreviousLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer down
     */
    getPreviousLayerConnectedCells(layer: any): mxCell[];
    /**
     * Function: isEdge
     * 
     * Returns whether or not this cell is an edge
     */
    isEdge(): boolean;
    /**
     * Function: isVertex
     * 
     * Returns whether or not this cell is a node
     */
    isVertex(): boolean;
    /**
     * Function: getGeneralPurposeVariable
     * 
     * Gets the value of temp for the specified layer
     */
    getGeneralPurposeVariable(layer: any): any;
    /**
     * Function: setGeneralPurposeVariable
     * 
     * Set the value of temp for the specified layer
     */
    setGeneralPurposeVariable(layer: any, value: number): any;
    /**
     * Function: setX
     * 
     * Set the value of x for the specified layer
     */
    setX(layer: any, value: number);
    /**
     * Function: getX
     * 
     * Gets the value of x on the specified layer
     */
    getX(layer: any): number;
    /**
     * Function: setY
     * 
     * Set the value of y for the specified layer
     */
    setY(layer: any, value: number);


}

declare var mxGraphAbstractHierarchyCell: {
    new (): mxGraphAbstractHierarchyCell;
    prototype: mxGraphAbstractHierarchyCell;
}

interface mxGraphHierarchyEdge extends mxGraphAbstractHierarchyCell {

    /**
     * Variable: edges
     * 
     * The graph edge(s) this object represents. Parallel edges are all grouped
     * together within one hierarchy edge.
     */
    edges: mxCell[];
    /**
     * Variable: ids
     * 
     * The object identities of the wrapped cells
     */
    ids: any;
    /**
     * Variable: source
     * 
     * The node this edge is sourced at
     */
    source: any;
    /**
     * Variable: target
     * 
     * The node this edge targets
     */
    target: any;
    /**
     * Variable: isReversed
     * 
     * Whether or not the direction of this edge has been reversed
     * internally to create a DAG for the hierarchical layout
     */
    isReversed: boolean;
    /**
     * Function: invert
     * 
     * Inverts the direction of this internal edge(s)
     */
    invert(layer: any);
    /**
     * Function: getNextLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer up
     */
    getNextLayerConnectedCells(layer: any): mxCell[];
    /**
     * Function: getPreviousLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer down
     */
    getPreviousLayerConnectedCells(layer: any): mxCell[];
    /**
     * Function: isEdge
     * 
     * Returns true.
     */
    isEdge(): boolean;
    /**
     * Function: getGeneralPurposeVariable
     * 
     * Gets the value of temp for the specified layer
     */
    getGeneralPurposeVariable(layer: any): number;
    /**
     * Function: setGeneralPurposeVariable
     * 
     * Set the value of temp for the specified layer
     */
    setGeneralPurposeVariable(layer: any, value: number);
    /**
     * Function: getCoreCell
     * 
     * Gets the first core edge associated with this wrapper
     */
    getCoreCell(): mxCell;

}

declare var mxGraphHierarchyEdge: {
    new (edges: mxCell[]): mxGraphHierarchyEdge;
    prototype: mxGraphHierarchyEdge;
}

interface mxGraphHierarchyModel {

    /**
     * Variable: maxRank
     *
     * Stores the largest rank number allocated
     */
    maxRank: number;
    /**
     * Variable: vertexMapper
     *
     * Map from graph vertices to internal model nodes.
     */
    vertexMapper: any;
    /**
     * Variable: edgeMapper
     *
     * Map from graph edges to internal model edges
     */
    edgeMapper: any;
    /**
     * Variable: ranks
     *
     * Mapping from rank number to actual rank
     */
    ranks: number;
    /**
     * Variable: roots
     *
     * Store of roots of this hierarchy model, these are real graph cells, not
     * internal cells
     */
    roots: mxCell[];
    /**
     * Variable: parent
     *
     * The parent cell whose children are being laid out
     */
    parent: mxCell;
    /**
     * Variable: dfsCount
     *
     * Count of the number of times the ancestor dfs has been used.
     */
    dfsCount: number;
    /**
     * Variable: SOURCESCANSTARTRANK
     *
     * High value to start source layering scan rank value from.
     */
    SOURCESCANSTARTRANK: number;
    /**
     * Variable: tightenToSource
     *
     * Whether or not to tighten the assigned ranks of vertices up towards
     * the source cells.
     */
    tightenToSource: boolean;
    /**
     * Function: createInternalCells
     *
     * Creates all edges in the internal model
     *
     * Parameters:
     *
     * layout - Reference to the <mxHierarchicalLayout> algorithm.
     * vertices - Array of <mxCells> that represent the vertices whom are to
     * have an internal representation created.
     * internalVertices - The array of <mxGraphHierarchyNodes> to have their
     * information filled in using the real vertices.
     */
    createInternalCells(layout: any, vertices: mxCell[], internalVertices: mxGraphHierarchyNode[]);
    /**
     * Function: initialRank
     *
     * Basic determination of minimum layer ranking by working from from sources
     * or sinks and working through each node in the relevant edge direction.
     * Starting at the sinks is basically a longest path layering algorithm.
    */
    initialRank();
    /**
     * Function: fixRanks
     *
     * Fixes the layer assignments to the values stored in the nodes. Also needs
     * to create dummy nodes for edges that cross layers.
     */
    fixRanks();
    /**
     * Function: visit
     *
     * A depth first search through the internal heirarchy model.
     *
     * Parameters:
     *
     * visitor - The visitor function pattern to be called for each node.
     * trackAncestors - Whether or not the search is to keep track all nodes
     * directly above this one in the search path.
     */
    visit(visitor: any, dfsRoots: any[], trackAncestors: boolean, seenNodes: Object);
    /**
     * Function: dfs
     *
     * Performs a depth first search on the internal hierarchy model
     *
     * Parameters:
     *
     * parent - the parent internal node of the current internal node
     * root - the current internal node
     * connectingEdge - the internal edge connecting the internal node and the parent
     * internal node, if any
     * visitor - the visitor pattern to be called for each node
     * seen - a set of all nodes seen by this dfs a set of all of the
     * ancestor node of the current node
     * layer - the layer on the dfs tree ( not the same as the model ranks )
     */
    dfs(parent: mxCell, root: mxCell, connectingEdge: mxCell, visitor: any, seen: any[], layer: any);
    /**
     * Function: extendedDfs
     *
     * Performs a depth first search on the internal hierarchy model. This dfs
     * extends the default version by keeping track of cells ancestors, but it
     * should be only used when necessary because of it can be computationally
     * intensive for deep searches.
     *
     * Parameters:
     *
     * parent - the parent internal node of the current internal node
     * root - the current internal node
     * connectingEdge - the internal edge connecting the internal node and the parent
     * internal node, if any
     * visitor - the visitor pattern to be called for each node
     * seen - a set of all nodes seen by this dfs
     * ancestors - the parent hash code
     * childHash - the new hash code for this node
     * layer - the layer on the dfs tree ( not the same as the model ranks )
     */
    extendedDfs(parent: mxCell, root: mxCell, connectingEdge: mxCell, visitor: any, seen: any[], ancestors: any, childHash: any, layer: any);
    
}

declare var mxGraphHierarchyModel: {
    new (layout: any, vertices: mxCell[], roots: mxCell[], parent: mxCell, tightenToSource: boolean): mxGraphHierarchyModel;
    prototype: mxGraphHierarchyModel;
}

interface mxGraphHierarchyNode {

    /**
     * Variable: cell
     * 
     * The graph cell this object represents.
     */
    cell: mxCell;
    /**
     * Variable: id
     * 
     * The object identity of the wrapped cell
     */
    id: any;
    /**
     * Variable: connectsAsTarget
     * 
     * Collection of hierarchy edges that have this node as a target
     */
    connectsAsTarget: any[];
    /**
     * Variable: connectsAsSource
     * 
     * Collection of hierarchy edges that have this node as a source
     */
    connectsAsSource: any[];
    /**
     * Variable: hashCode
     * 
     * Assigns a unique hashcode for each node. Used by the model dfs instead
     * of copying HashSets
     */
    hashCode: string;
    /**
     * Function: getRankValue
     * 
     * Returns the integer value of the layer that this node resides in
     */
    getRankValue(layer: any): number;
    /**
     * Function: getNextLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer up
     */
    getNextLayerConnectedCells(layer: any): any;
    /**
     * Function: getPreviousLayerConnectedCells
     * 
     * Returns the cells this cell connects to on the next layer down
     */
    getPreviousLayerConnectedCells(layer: any): any;
    /**
     * Function: isVertex
     * 
     * Returns true.
     */
    isVertex(): boolean;
    /**
     * Function: getGeneralPurposeVariable
     * 
     * Gets the value of temp for the specified layer
     */
    getGeneralPurposeVariable(layer: any): any;
    /**
     * Function: setGeneralPurposeVariable
     * 
     * Set the value of temp for the specified layer
     */
    setGeneralPurposeVariable(layer: any, value: number);
    /**
     * Function: isAncestor
     */
    isAncestor(otherNode: any): boolean;
    /**
     * Function: getCoreCell
     * 
     * Gets the core vertex associated with this wrapper
     */
    getCoreCell(): mxCell;


}

declare var mxGraphHierarchyNode: {
    new (cell: mxCell): mxGraphHierarchyNode;
    prototype: mxGraphHierarchyNode;
}

interface mxSwimlaneModel {

    /**
     * Variable: maxRank
     *
     * Stores the largest rank number allocated
     */
    maxRank: number;
    /**
     * Variable: vertexMapper
     *
     * Map from graph vertices to internal model nodes.
     */
    vertexMapper: mxCell[];
    /**
     * Variable: edgeMapper
     *
     * Map from graph edges to internal model edges
     */
    edgeMapper: mxCell[];
    /**
     * Variable: ranks
     *
     * Mapping from rank number to actual rank
     */
    ranks: number[];
    /**
     * Variable: roots
     *
     * Store of roots of this hierarchy model, these are real graph cells, not
     * internal cells
     */
    roots: any;
    /**
     * Variable: parent
     *
     * The parent cell whose children are being laid out
     */
    parent: mxCell;
    /**
     * Variable: dfsCount
     *
     * Count of the number of times the ancestor dfs has been used.
     */
    dfsCount: number;
    /**
     * Variable: SOURCESCANSTARTRANK
     *
     * High value to start source layering scan rank value from.
     */
    SOURCESCANSTARTRANK: number;
    /**
     * Variable: ranksPerGroup
     *
     * An array of the number of ranks within each swimlane
     */
    ranksPerGroup: number[];
    /**
     * Function: createInternalCells
     *
     * Creates all edges in the internal model
     *
     * Parameters:
     *
     * layout - Reference to the <mxHierarchicalLayout> algorithm.
     * vertices - Array of <mxCells> that represent the vertices whom are to
     * have an internal representation created.
     * internalVertices - The array of <mxGraphHierarchyNodes> to have their
     * information filled in using the real vertices.
     */
    createInternalCells(layout: any, vertices: mxCell[], internalVertices: mxGraphHierarchyNode[]);
    /**
     * Function: initialRank
     *
     * Basic determination of minimum layer ranking by working from from sources
     * or sinks and working through each node in the relevant edge direction.
     * Starting at the sinks is basically a longest path layering algorithm.
    */
    initialRank();
    /**
     * Function: maxChainDfs
     *
     * Performs a depth first search on the internal hierarchy model. This dfs
     * extends the default version by keeping track of chains within groups.
     * Any cycles should be removed prior to running, but previously seen cells
     * are ignored.
     *
     * Parameters:
     *
     * parent - the parent internal node of the current internal node
     * root - the current internal node
     * connectingEdge - the internal edge connecting the internal node and the parent
     * internal node, if any
     * seen - a set of all nodes seen by this dfs
     * chainCount - the number of edges in the chain of vertices going through
     * the current swimlane
     */
    maxChainDfs(parent: mxCell, root: mxCell, connectingEdge: mxCell, seen: mxCell[], chainCount: number);
    /**
     * Function: fixRanks
     *
     * Fixes the layer assignments to the values stored in the nodes. Also needs
     * to create dummy nodes for edges that cross layers.
     */
    fixRanks();
    /**
     * Function: visit
     *
     * A depth first search through the internal heirarchy model.
     *
     * Parameters:
     *
     * visitor - The visitor function pattern to be called for each node.
     * trackAncestors - Whether or not the search is to keep track all nodes
     * directly above this one in the search path.
     */
    visit(visitor: any, dfsRoots: mxCell[], trackAncestors: boolean, seenNodes: any);
    /**
     * Function: dfs
     *
     * Performs a depth first search on the internal hierarchy model
     *
     * Parameters:
     *
     * parent - the parent internal node of the current internal node
     * root - the current internal node
     * connectingEdge - the internal edge connecting the internal node and the parent
     * internal node, if any
     * visitor - the visitor pattern to be called for each node
     * seen - a set of all nodes seen by this dfs a set of all of the
     * ancestor node of the current node
     * layer - the layer on the dfs tree ( not the same as the model ranks )
     */
    dfs(parent: mxCell, root: mxCell, connectingEdge: mxCell, visitor: any, seen: mxCell[], layer: any);
    /**
     * Function: extendedDfs
     *
     * Performs a depth first search on the internal hierarchy model. This dfs
     * extends the default version by keeping track of cells ancestors, but it
     * should be only used when necessary because of it can be computationally
     * intensive for deep searches.
     *
     * Parameters:
     *
     * parent - the parent internal node of the current internal node
     * root - the current internal node
     * connectingEdge - the internal edge connecting the internal node and the parent
     * internal node, if any
     * visitor - the visitor pattern to be called for each node
     * seen - a set of all nodes seen by this dfs
     * ancestors - the parent hash code
     * childHash - the new hash code for this node
     * layer - the layer on the dfs tree ( not the same as the model ranks )
     */
    extendedDfs(parent: mxCell, root: mxCell, connectingEdge: mxCell, visitor: any, seen: mxCell[], ancestors: any, childHash: any, layer: any);

}

declare var mxSwimlaneModel: {
    new (layout: any, vertices, any, roots: any, parent: any, tightenToSource: boolean): mxSwimlaneLayout;
    prototype: mxSwimlaneLayout;
}

interface mxCoordinateAssignment { //extends mxHierarchicalLayoutStage { ??

    
    /**
     * Variable: layout
     * 
     * Reference to the enclosing <mxHierarchicalLayout>.
     */
    layout: mxHierarchicalLayout;
    /**
     * Variable: intraCellSpacing
     * 
     * The minimum buffer between cells on the same rank. Default is 30.
     */
    intraCellSpacing: number;
    /**
     * Variable: interRankCellSpacing
     * 
     * The minimum distance between cells on adjacent ranks. Default is 10.
     */
    interRankCellSpacing: number;
    /**
     * Variable: parallelEdgeSpacing
     * 
     * The distance between each parallel edge on each ranks for long edges.
     * Default is 10.
     */
    parallelEdgeSpacing: number;
    /**
     * Variable: maxIterations
     * 
     * The number of heuristic iterations to run. Default is 8.
     */
    maxIterations: number;
    /**
     * Variable: prefHozEdgeSep
     * 
     * The preferred horizontal distance between edges exiting a vertex
     */
    prefHozEdgeSep: number;
    /**
     * Variable: prefVertEdgeOff
     * 
     * The preferred vertical offset between edges exiting a vertex
     */
    prefVertEdgeOff: number;
    /**
     * Variable: minEdgeJetty
     * 
     * The minimum distance for an edge jetty from a vertex
     */
    minEdgeJetty: number;
    /**
     * Variable: channelBuffer
     * 
     * The size of the vertical buffer in the center of inter-rank channels
     * where edge control points should not be placed
     */
    channelBuffer: number;
    /**
     * Variable: jettyPositions
     * 
     * Map of internal edges and (x,y) pair of positions of the start and end jetty
     * for that edge where it connects to the source and target vertices.
     * Note this should technically be a WeakHashMap, but since JS does not
     * have an equivalent, housekeeping must be performed before using.
     * i.e. check all edges are still in the model and clear the values.
     * Note that the y co-ord is the offset of the jetty, not the
     * absolute point
     */
    jettyPositions: any;
    /**
     * Variable: orientation
     * 
     * The position of the root ( start ) node(s) relative to the rest of the
     * laid out graph. Default is <mxConstants.DIRECTION_NORTH>.
     */
    orientation: any;
    /**
     * Variable: initialX
     * 
     * The minimum x position node placement starts at
     */
    initialX: number;
    /**
     * Variable: limitX
     * 
     * The maximum x value this positioning lays up to
     */
    limitX: number;
    /**
     * Variable: currentXDelta
     * 
     * The sum of x-displacements for the current iteration
     */
    currentXDelta: number;
    /**
     * Variable: widestRank
     * 
     * The rank that has the widest x position
     */
    widestRank: number;
    /**
     * Variable: rankTopY
     * 
     * Internal cache of top-most values of Y for each rank
     */
    rankTopY: number;
    /**
     * Variable: rankBottomY
     * 
     * Internal cache of bottom-most value of Y for each rank
     */
    rankBottomY: number;
    /**
     * Variable: widestRankValue
     * 
     * The X-coordinate of the edge of the widest rank
     */
    widestRankValue: number;
    /**
     * Variable: rankWidths
     * 
     * The width of all the ranks
     */
    rankWidths: number;
    /**
     * Variable: rankY
     * 
     * The Y-coordinate of all the ranks
     */
    rankY: number;
    /**
     * Variable: fineTuning
     * 
     * Whether or not to perform local optimisations and iterate multiple times
     * through the algorithm. Default is true.
     */
    fineTuning: boolean;
    /**
     * Variable: edgeStyle
     * 
     * The style to apply between cell layers to edge segments
     */
    edgeStyle: any;
    /**
     * Variable: nextLayerConnectedCache
     * 
     * A store of connections to the layer above for speed
     */
    nextLayerConnectedCache: any;
    /**
     * Variable: previousLayerConnectedCache
     * 
     * A store of connections to the layer below for speed
     */
    previousLayerConnectedCache: any;
    /**
     * Variable: groupPadding
     * 
     * Padding added to resized parents
     */
    groupPadding: number;
    /**
     * Utility method to display current positions
     */
    printStatus();
    /**
     * Function: execute
     * 
     * A basic horizontal coordinate assignment algorithm
     */
    execute(parent?: any);
    /**
     * Function: minNode
     * 
     * Performs one median positioning sweep in both directions
     */
    minNode(model: Object);
    /**
     * Function: medianPos
     * 
     * Performs one median positioning sweep in one direction
     * 
     * Parameters:
     * 
     * i - the iteration of the whole process
     * model - an internal model of the hierarchical layout
     */
    medianPos(i: number, model: Object);
    /**
     * Function: rankMedianPosition
     * 
     * Performs median minimisation over one rank.
     * 
     * Parameters:
     * 
     * rankValue - the layer number of this rank
     * model - an internal model of the hierarchical layout
     * nextRankValue - the layer number whose connected cels are to be laid out
     * relative to
     */
    rankMedianPosition(rankValue: number, model: any, nextRankValue: number);

}

declare var mxCoordinateAssignment: {
    new (layout: mxHierarchicalLayout, intraCellSpacing: number, interRankCellSpacing: number,
        orientation: any, initialX: number, parallelEdgeSpacing: number): mxCoordinateAssignment;
    prototype: mxCoordinateAssignment;
}



interface mxHierarchicalEdgeStyle { // inside mxCoordinateAssignment

    ORTHOGONAL: number;
    POLYLINE: number;
    STRAIGHT: number;
    CURVE: number;

}

interface mxHierArchicalLayoutStage { // empty??

    execute(parent?: any);

}

declare var mxHierarchicalLayoutStage: {
    // empty??
}

interface mxMedianHybridCrossingReduction extends mxHierArchicalLayoutStage {

    layout: mxHierarchicalLayout;
    maxIterations: number;
    nestedBestRanks: any;
    currentBestCrossings: number;
    iterationsWithoutImprovement: number;
    maxNoImprovementIterations: number;
    execute(parent?: any);
    calculateCrossings(model: any): number;
    calculateRankCrossing(i: number, model: any): number;
    transpose(mainLoopIteration: number, model: any): any;
    weightedMedian(iteration: number, model: any);
    medianRank(rankValue: number, downwardSweep: boolean);
    medianValue(connectedCells: any, rankValue: number): number;

}

declare var mxMedianHybridCrossingReduction: {
    new (layout: mxHierarchicalLayout): mxMedianHybridCrossingReduction;
    prototype: mxMedianHybridCrossingReduction;
}

interface MedianCellSorter { // inside mxMedianHybridCrossingReduction

    medianValue: number;
    cell: mxCell;
    compare(a: Object, b: Object): number;

}

interface mxMinimumCycleRemover extends mxHierArchicalLayoutStage {

    /**
     * Variable: layout
     * 
     * Reference to the enclosing <mxHierarchicalLayout>.
     */
    layout: mxHierarchicalLayout;
    /**
     * Function: execute
     * 
     * Takes the graph detail and configuration information within the facade
     * and creates the resulting laid out graph within that facade for further
     * use.
     */
    execute(parent?: any);


}

declare var mxMinimumCycleRemover: {
    new (layout: mxHierarchicalLayout): mxMinimumCycleRemover;
    prototype: mxMinimumCycleRemover;
}

interface mxSwimlaneOrdering extends mxHierArchicalLayoutStage {

    /**
     * Variable: layout
     * 
     * Reference to the enclosing <mxHierarchicalLayout>.
     */
    layout: mxHierarchicalLayout;
    /**
     * Function: execute
     * 
     * Takes the graph detail and configuration information within the facade
     * and creates the resulting laid out graph within that facade for further
     * use.
     */
    execute(parent?: any);


}

declare var mxSwimlaneOrdering: {
    new (layout: mxHierarchicalLayout): mxSwimlaneOrdering;
    prototype: mxSwimlaneOrdering;
}

//}