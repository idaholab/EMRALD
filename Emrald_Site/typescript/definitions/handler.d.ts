// Copyright 2021 Battelle Energy Alliance

/// <reference path="layout.d.ts" />

//declare module mxGraphModule {

interface mxEdgeHandler {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: state
     * 
     * Reference to the <mxCellState> being modified.
     */
    state: mxCellState;
    /**
     * Variable: marker
     * 
     * Holds the <mxTerminalMarker> which is used for highlighting terminals.
     */
    marker: mxTerminalMarker;
    /**
     * Variable: constraintHandler
     * 
     * Holds the <mxConstraintHandler> used for drawing and highlighting
     * constraints.
     */
    constraintHandler: mxConstraintHandler;
    /**
     * Variable: error
     * 
     * Holds the current validation error while a connection is being changed.
     */
    error: string;
    /**
     * Variable: shape
     * 
     * Holds the <mxShape> that represents the preview edge.
     */
    shape: mxShape;
    /**
     * Variable: bends
     * 
     * Holds the <mxShapes> that represent the points.
     */
    bends: mxShape[];
    /**
     * Variable: labelShape
     * 
     * Holds the <mxShape> that represents the label position.
     */
    labelShape: mxShape;
    /**
     * Variable: cloneEnabled
     * 
     * Specifies if cloning by control-drag is enabled. Default is true.
     */
    cloneEnabled: boolean;
    /**
     * Variable: addEnabled
     * 
     * Specifies if adding bends by shift-click is enabled. Default is false.
     * Note: This experimental feature is not recommended for production use.
     */
    addEnabled: boolean;
    /**
     * Variable: removeEnabled
     * 
     * Specifies if removing bends by shift-click is enabled. Default is false.
     * Note: This experimental feature is not recommended for production use.
     */
    removeEnabled: boolean;
    /**
     * Variable: preferHtml
     * 
     * Specifies if bends should be added to the graph container. This is updated
     * in <init> based on whether the edge or one of its terminals has an HTML
     * label in the container.
     */
    preferHtml: boolean;
    /**
     * Variable: allowHandleBoundsCheck
     * 
     * Specifies if the bounds of handles should be used for hit-detection in IE
     * Default is true.
     */
    allowHandleBoundsCheck: boolean;
    /**
     * Variable: snapToTerminals
     * 
     * Specifies if waypoints should snap to the routing centers of terminals.
     * Default is false.
     */
    snapToTerminals: boolean;
    /**
     * Variable: handleImage
     * 
     * Optional <mxImage> to be used as handles. Default is null.
     */
    handleImage?: mxImage;
    /**
     * Variable: tolerance
     * 
     * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
     */
    tolerance?: number;
    /**
     * Function: init
     * 
     * Initializes the shapes required for this edge handler.
     */
    init();
    /**
     * Function: isAddPointEvent
     * 
     * Returns true if the given event is a trigger to add a new point. This
     * implementation returns true if shift is pressed.
     */
    isAddPointEvent(evt: Event): boolean;
    /**
     * Function: isRemovePointEvent
     * 
     * Returns true if the given event is a trigger to remove a point. This
     * implementation returns true if shift is pressed.
     */
    isRemovePointEvent(evt: Event): boolean;
    /**
     * Function: getSelectionPoints
     * 
     * Returns the list of points that defines the selection stroke.
     */
    getSelectionPoints(state: mxCellState): mxPoint[];
    /**
     * Function: createSelectionShape
     * 
     * Creates the shape used to draw the selection border.
     */
    createSelectionShape(points: mxPoint[]): mxPolyline;
    /**
     * Function: getSelectionColor
     * 
     * Returns <mxConstants.EDGE_SELECTION_COLOR>.
     */
    getSelectionColor(): string;
    /**
     * Function: getSelectionStrokeWidth
     * 
     * Returns <mxConstants.EDGE_SELECTION_STROKEWIDTH>.
     */
    getSelectionStrokeWidth(): number;
    /**
     * Function: isSelectionDashed
     * 
     * Returns <mxConstants.EDGE_SELECTION_DASHED>.
     */
    isSelectionDashed(): boolean;
    /**
     * Function: isConnectableCell
     * 
     * Returns true if the given cell is connectable. This is a hook to
     * disable floating connections. This implementation returns true.
     */
    isConnectableCell(cell: mxCell):  boolean;
    /**
     * Function: createMarker
     * 
     * Creates and returns the <mxCellMarker> used in <marker>.
     */
    createMarker(): mxCellMarker;
    /**
     * Function: validateConnection
     * 
     * Returns the error message or an empty string if the connection for the
     * given source, target pair is not valid. Otherwise it returns null. This
     * implementation uses <mxGraph.getEdgeValidationError>.
     * 
     * Parameters:
     * 
     * source - <mxCell> that represents the source terminal.
     * target - <mxCell> that represents the target terminal.
     */
    validateConnection(source: mxCell, target: mxCell): string;
    /**
     * Function: createBends
     * 
     * Creates and returns the bends used for modifying the edge. This is
     * typically an array of <mxRectangleShapes>.
     */
    createBends(): any[];
    /**
     * Function: isHandleEnabled
     * 
     * Creates the shape used to display the given bend.
     */
    isHandleEnabled(index: number): boolean;
    /**
     * Function: isHandleVisible
     * 
     * Returns true if the handle at the given index is visible.
     */
    isHandleVisible(index: number): boolean;
    /**
     * Function: createHandleShape
     * 
     * Creates the shape used to display the given bend. Note that the index may be
     * null for special cases, such as when called from
     * <mxElbowEdgeHandler.createVirtualBend>. Only images and rectangles should be
     * returned if support for HTML labels with not foreign objects is required.
     */
    createHandleShape(index: number): mxShape; // return mxImageShape or mxRectangleShape
    /**
     * Function: initBend
     * 
     * Helper method to initialize the given bend.
     * 
     * Parameters:
     * 
     * bend - <mxShape> that represents the bend to be initialized.
     */
    initBend(bend: mxShape);
    /**
     * Function: getHandleForEvent
     * 
     * Returns the index of the handle for the given event.
     */
    getHandleForEvent(me: mxMouseEvent): any;
    /**
     * Function: mouseDown
     * 
     * Handles the event by checking if a special element of the handler
     * was clicked, in which case the index parameter is non-null. The
     * indices may be one of <LABEL_HANDLE> or the number of the respective
     * control point. The source and target points are used for reconnecting
     * the edge.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: start
     * 
     * Starts the handling of the mouse gesture.
     */
    start(x: number, y: number, index: number);
    /**
     * Function: clonePreviewState
     * 
     * Returns a clone of the current preview state for the given point and terminal.
     */
    clonePreviewState(point: mxPoint, terminal: mxCell): mxCell;
    /**
     * Function: getSnapToTerminalTolerance
     * 
     * Returns the tolerance for the guides. Default value is
     * gridSize * scale / 2.
     */
    getSnapToTerminalTolerance(): number;
    /**
     * Function: updateHint
     * 
     * Hook for subclassers do show details while the handler is active.
     */
    updateHint(me: mxMouseEvent, point: mxPoint): any; // ????????????????
    /**
     * Function: removeHint
     * 
     * Hooks for subclassers to hide details when the handler gets inactive.
     */
    removeHint(): any; // ???????????????????
    /**
     * Function: roundLength
     * 
     * Hook for rounding the unscaled width or height. This uses Math.round.
     */
    roundLength(length: number): number;
    /**
     * Function: getPointForEvent
     * 
     * Returns the point for the given event.
     */
    getPointForEvent(me: mxMouseEvent): mxPoint;
    /**
     * Function: getPreviewTerminalState
     * 
     * Updates the given preview state taking into account the state of the constraint handler.
     */
    getPreviewTerminalState(me: mxMouseEvent): any;
    /**
     * Function: getPreviewPoints
     * 
     * Updates the given preview state taking into account the state of the constraint handler.
     */
    getPreviewPoints(point: mxPoint): mxPoint[];
    /**
     * Function: updatePreviewState
     * 
     * Updates the given preview state taking into account the state of the constraint handler.
     */
    updatePreviewState(edge: mxCell, point: mxPoint, terminalState: mxCell);
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating the preview.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Handles the event to applying the previewed changes on the edge by
     * using <moveLabel>, <connect> or <changePoints>.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: reset
     * 
     * Resets the state of this handler.
     */
    reset();
    /**
     * Function: setPreviewColor
     * 
     * Sets the color of the preview to the given value.
     */
    setPreviewColor(color: string);
    /**
     * Function: convertPoint
     * 
     * Converts the given point in-place from screen to unscaled, untranslated
     * graph coordinates and applies the grid. Returns the given, modified
     * point instance.
     * 
     * Parameters:
     * 
     * point - <mxPoint> to be converted.
     * gridEnabled - Boolean that specifies if the grid should be applied.
     */
    convertPoint(point: mxPoint, gridEnabled: boolean): mxPoint;
    /**
     * Function: moveLabel
     * 
     * Changes the coordinates for the label of the given edge.
     * 
     * Parameters:
     * 
     * edge - <mxCell> that represents the edge.
     * x - Integer that specifies the x-coordinate of the new location.
     * y - Integer that specifies the y-coordinate of the new location.
     */
    moveLabel(edgeState: mxCell, x: number, y: number);
    /**
     * Function: connect
     * 
     * Changes the terminal or terminal point of the given edge in the graph
     * model.
     * 
     * Parameters:
     * 
     * edge - <mxCell> that represents the edge to be reconnected.
     * terminal - <mxCell> that represents the new terminal.
     * isSource - Boolean indicating if the new terminal is the source or
     * target terminal.
     * isClone - Boolean indicating if the new connection should be a clone of
     * the old edge.
     * me - <mxMouseEvent> that contains the mouse up event.
     */
    connect(edge: mxCell, terminal: mxCell, isSource: boolean, isClone: boolean, me: mxMouseEvent): mxCell;
    /**
     * Function: changeTerminalPoint
     * 
     * Changes the terminal point of the given edge.
     */
    changeTerminalPoint(edge: mxCell, point: mxPoint, isSource: boolean);
    /**
     * Function: changePoints
     * 
     * Changes the control points of the given edge in the graph model.
     */
    changePoints(edge: mxCell, points: mxPoint[]);
    /**
     * Function: addPoint
     * 
     * Adds a control point for the given state and event.
     */
    addPoint(state: mxCellState, evt: Event);
    /**
     * Function: addPointAt
     * 
     * Adds a control point at the given point.
     */
    addPointAt(state: mxCellState, x: number, y: number);
    /**
     * Function: removePoint
     * 
     * Removes the control point at the given index from the given state.
     */
    removePoint(state: mxCellState, index: number);
    /**
     * Function: getHandleFillColor
     * 
     * Returns the fillcolor for the handle at the given index.
     */
    getHandleFillColor(index: number): string;
    /**
     * Function: redraw
     * 
     * Redraws the preview, and the bends- and label control points.
     */
    redraw();
    /**
     * Function: redrawHandles
     * 
     * Redraws the handles.
     */
    redrawHandles();
    /**
     * Function: redrawInnerBends
     * 
     * Updates and redraws the inner bends.
     * 
     * Parameters:
     * 
     * p0 - <mxPoint> that represents the location of the first point.
     * pe - <mxPoint> that represents the location of the last point.
     */
    redrawInnerBends(p0: mxPoint, pe: mxPoint);
    /**
     * Function: drawPreview
     * 
     * Redraws the preview.
     */
    drawPreview();
    /**
     * Function: refresh
     * 
     * Refreshes the bends of this handler.
     */
    refresh();
    /**
     * Function: destroyBends
     * 
     * Destroys all elements in <bends>.
     */
    destroyBends();
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes. This does
     * normally not need to be called as handlers are destroyed automatically
     * when the corresponding cell is deselected.
     */
    destroy();

}

declare var mxEdgeHandler: {
    new (state: mxCellState): mxEdgeHandler;
    prototype: mxEdgeHandler;
}

interface mxCellHighlight {

    /**
     * Variable: keepOnTop
     * 
     * Specifies if the highlights should appear on top of everything
     * else in the overlay pane. Default is false.
     */
    keepOnTop: boolean;
    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: state
     * 
     * Reference to the <mxCellState>.
     */
    state: mxCellState;
    /**
     * Variable: spacing
     * 
     * Specifies the spacing between the highlight for vertices and the vertex.
     * Default is 2.
     */
    spacing: number;
    /**
     * Variable: resetHandler
     * 
     * Holds the handler that automatically invokes reset if the highlight
     * should be hidden.
     */
    resetHandler: any;
    /**
     * Function: setHighlightColor
     * 
     * Sets the color of the rectangle used to highlight drop targets.
     * 
     * Parameters:
     * 
     * color - String that represents the new highlight color.
     */
    setHighlightColor(color: string);
    /**
     * Function: drawHighlight
     * 
     * Creates and returns the highlight shape for the given state.
     */
    drawHighlight();
    /**
     * Function: createShape
     * 
     * Creates and returns the highlight shape for the given state.
     */
    createShape(): mxShape;
    /**
     * Function: repaint
     * 
     * Updates the highlight after a change of the model or view.
     */
    repaint();
    /**
     * Function: hide
     * 
     * Resets the state of the cell marker.
     */
    hide();
    /**
     * Function: mark
     * 
     * Marks the <markedState> and fires a <mark> event.
     */
    highlight(state: mxCellState);
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();
    
}

declare var mxCellHighlight: {
    new (graph: mxGraph, highlightColor: string, strokeWidth: number, dashed: boolean): mxCellHighlight;
    prototype: mxCellHighlight;
}

interface mxCellMarker extends mxEventSource {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: enabled
     * 
     * Specifies if the marker is enabled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: hotspot
     * 
     * Specifies the portion of the width and height that should trigger
     * a highlight. The area around the center of the cell to be marked is used
     * as the hotspot. Possible values are between 0 and 1. Default is
     * mxConstants.DEFAULT_HOTSPOT.
     */
    hotspot: number;
    /**
     * Variable: hotspotEnabled
     * 
     * Specifies if the hotspot is enabled. Default is false.
     */
    hotspotEnabled: boolean;
    /**
     * Variable: validColor
     * 
     * Holds the valid marker color.
     */
    validColor: string;
    /**
     * Variable: invalidColor
     * 
     * Holds the invalid marker color.
     */
    invalidColor: string;
    /**
     * Variable: currentColor
     * 
     * Holds the current marker color.
     */
    currentColor: string;
    /**
     * Variable: validState
     * 
     * Holds the marked <mxCellState> if it is valid.
     */
    validState: mxCellState;
    /**
     * Variable: markedState
     * 
     * Holds the marked <mxCellState>.
     */
    markedState: mxCellState;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation
     * updates <enabled>.
     * 
     * Parameters:
     * 
     * enabled - Boolean that specifies the new enabled state.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation
     * returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setHotspot
     * 
     * Sets the <hotspot>.
     */
    setHotspot(hotspot: number);
    /**
     * Function: getHotspot
     * 
     * Returns the <hotspot>.
     */
    getHotspot(): number;
    /**
     * Function: setHotspotEnabled
     * 
     * Specifies whether the hotspot should be used in <intersects>.
     */
    setHotspotEnabled(enabled: boolean);
    /**
     * Function: isHotspotEnabled
     * 
     * Returns true if hotspot is used in <intersects>.
     */
    isHotspotEnabled(): boolean;
    /**
     * Function: hasValidState
     * 
     * Returns true if <validState> is not null.
     */
    hasValidState(): boolean;
    /**
     * Function: getValidState
     * 
     * Returns the <validState>.
     */
    getValidState(): mxCellState;
    /**
     * Function: getMarkedState
     * 
     * Returns the <markedState>.
     */
    getMarkedState(): mxCellState;
    /**
     * Function: reset
     * 
     * Resets the state of the cell marker.
     */
    reset();
    /**
     * Function: process
     * 
     * Processes the given event and cell and marks the state returned by
     * <getState> with the color returned by <getMarkerColor>. If the
     * markerColor is not null, then the state is stored in <markedState>. If
     * <isValidState> returns true, then the state is stored in <validState>
     * regardless of the marker color. The state is returned regardless of the
     * marker color and valid state. 
     */
    process(me: mxMouseEvent): mxCellState;
    /**
     * Function: markCell
     * 
     * Marks the given cell using the given color, or <validColor> if no color is specified.
     */
    markCell(cell: mxCell, color: string);
    /**
     * Function: mark
     * 
     * Marks the <markedState> and fires a <mark> event.
     */
    mark();
    /**
     * Function: unmark
     * 
     * Hides the marker and fires a <mark> event.
     */
    unmark();
    /**
     * Function: isValidState
     * 
     * Returns true if the given <mxCellState> is a valid state. If this
     * returns true, then the state is stored in <validState>. The return value
     * of this method is used as the argument for <getMarkerColor>.
     */
    isValidState(state: mxCellState): boolean;
    /**
     * Function: getMarkerColor
     * 
     * Returns the valid- or invalidColor depending on the value of isValid.
     * The given <mxCellState> is ignored by this implementation.
     */
    getMarkerColor(evt: Event, state: mxCellState, isValid: boolean): string;
    /**
     * Function: getState
     * 
     * Uses <getCell>, <getStateToMark> and <intersects> to return the
     * <mxCellState> for the given <mxMouseEvent>.
     */
    getState(me: mxMouseEvent): mxCellState;
    /**
     * Function: getCell
     * 
     * Returns the <mxCell> for the given event and cell. This returns the
     * given cell.
     */
    getCell(me: mxMouseEvent): mxCell;
    /**
     * Function: getStateToMark
     * 
     * Returns the <mxCellState> to be marked for the given <mxCellState> under
     * the mouse. This returns the given state.
     */
    getStateToMark(state: mxCellState): mxCellState;
    /**
     * Function: intersects
     * 
     * Returns true if the given coordinate pair intersects the given state.
     * This returns true if the <hotspot> is 0 or the coordinates are inside
     * the hotspot for the given cell state.
     */
    intersects(state: mxCellState, me: mxMouseEvent): boolean;
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxCellMarker: {
    new (graph: mxGraph, validColor?: string, invalidColor?: string, hotspot?: number): mxCellMarker;
    prototype: mxCellMarker;
}

interface mxCellTracker extends mxCellMarker {

    mouseDown(sender: any, me: mxMouseEvent);
    mouseMove(sender: any, me: mxMouseEvent);
    mouseUp(sender: any, me: mxMouseEvent);
    destroy();

}

declare var mxCellTracker: {
    new (graph: mxGraph, color: string, funct?: ICallback): mxCellTracker;
    prototype: mxCellTracker;
}

interface mxConnectionHandler extends mxEventSource {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: factoryMethod
     * 
     * Function that is used for creating new edges. The function takes the
     * source and target <mxCell> as the first and second argument and returns
     * a new <mxCell> that represents the edge. This is used in <createEdge>.
     */
    factoryMethod: ICallback; // boolean???????
    /**
     * Variable: moveIconFront
     * 
     * Specifies if icons should be displayed inside the graph container instead
     * of the overlay pane. This is used for HTML labels on vertices which hide
     * the connect icon. This has precendence over <moveIconBack> when set
     * to true. Default is false.
     */
    moveIconFront: boolean;
    /**
     * Variable: moveIconBack
     * 
     * Specifies if icons should be moved to the back of the overlay pane. This can
     * be set to true if the icons of the connection handler conflict with other
     * handles, such as the vertex label move handle. Default is false.
     */
    moveIconBack: boolean;
    /**
     * Variable: connectImage
     * 
     * <mxImage> that is used to trigger the creation of a new connection. This
     * is used in <createIcons>. Default is null.
     */
    connectImage: mxImage;
    /**
     * Variable: targetConnectImage
     * 
     * Specifies if the connect icon should be centered on the target state
     * while connections are being previewed. Default is false.
     */
    targetConnectImage: boolean;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: select
     * 
     * Specifies if new edges should be selected. Default is true.
     */
    select: boolean;
    /**
     * Variable: createTarget
     * 
     * Specifies if <createTargetVertex> should be called if no target was under the
     * mouse for the new connection. Setting this to true means the connection
     * will be drawn as valid if no target is under the mouse, and
     * <createTargetVertex> will be called before the connection is created between
     * the source cell and the newly created vertex in <createTargetVertex>, which
     * can be overridden to create a new target. Default is false.
     */
    createTarget: boolean;
    /**
     * Variable: marker
     * 
     * Holds the <mxTerminalMarker> used for finding source and target cells.
     */
    marker: mxTerminalMarker;
    /**
     * Variable: constraintHandler
     * 
     * Holds the <mxConstraintHandler> used for drawing and highlighting
     * constraints.
     */
    constraintHandler: mxConstraintHandler;
    /**
     * Variable: error
     * 
     * Holds the current validation error while connections are being created.
     */
    error: string;
    /**
     * Variable: waypointsEnabled
     * 
     * Specifies if single clicks should add waypoints on the new edge. Default is
     * false.
     */
    waypointsEnabled: boolean;
    /**
     * Variable: ignoreMouseDown
     * 
     * Specifies if the connection handler should ignore the state of the mouse
     * button when highlighting the source. Default is false, that is, the
     * handler only highlights the source if no button is being pressed.
     */
    ignoreMouseDown: boolean;
    /**
     * Variable: first
     * 
     * Holds the <mxPoint> where the mouseDown took place while the handler is
     * active.
     */
    first: mxPoint;
    /**
     * Variable: connectIconOffset
     * 
     * Holds the offset for connect icons during connection preview.
     * Default is mxPoint(0, <mxConstants.TOOLTIP_VERTICAL_OFFSET>).
     * Note that placing the icon under the mouse pointer with an
     * offset of (0,0) will affect hit detection.
     */
    connectIconOffset: mxPoint;
    /**
     * Variable: edgeState
     * 
     * Optional <mxCellState> that represents the preview edge while the
     * handler is active. This is created in <createEdgeState>.
     */
    edgeState?: mxCellState;
    /**
     * Variable: changeHandler
     * 
     * Holds the change event listener for later removal.
     */
    changeHandler: any;
    /**
     * Variable: drillHandler
     * 
     * Holds the drill event listener for later removal.
     */
    drillHandler: any;
    /**
     * Variable: mouseDownCounter
     * 
     * Counts the number of mouseDown events since the start. The initial mouse
     * down event counts as 1.
     */
    mouseDownCounter: number;
    /**
     * Variable: movePreviewAway
     * 
     * Switch to enable moving the preview away from the mousepointer. This is required in browsers
     * where the preview cannot be made transparent to events and if the built-in hit detection on
     * the HTML elements in the page should be used. Default is the value of <mxClient.IS_VML>.
     */
    movePreviewAway: boolean;
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation
     * returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation
     * updates <enabled>.
     * 
     * Parameters:
     * 
     * enabled - Boolean that specifies the new enabled state.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: isCreateTarget
     * 
     * Returns <createTarget>.
     */
    isCreateTarget(): boolean;
    /**
     * Function: setCreateTarget
     * 
     * Sets <createTarget>.
     */
    setCreateTarget(value: boolean);
    /**
     * Function: createShape
     * 
     * Creates the preview shape for new connections.
     */
    createShape(): mxPolyline;
    /**
     * Function: init
     * 
     * Initializes the shapes required for this connection handler. This should
     * be invoked if <mxGraph.container> is assigned after the connection
     * handler has been created.
     */
    init();
    /**
     * Function: isConnectableCell
     * 
     * Returns true if the given cell is connectable. This is a hook to
     * disable floating connections. This implementation returns true.
     */
    isConnectableCell(cell: mxCell): boolean;
    /**
     * Function: createMarker
     * 
     * Creates and returns the <mxCellMarker> used in <marker>.
     */
    createMarker(): mxCellMarker;
    /**
     * Function: start
     * 
     * Starts a new connection for the given state and coordinates.
     */
    start(state: mxCellState, x: number, y: number, edgeState: mxCellState);
    /**
     * Function: isConnecting
     * 
     * Returns true if the source terminal has been clicked and a new
     * connection is currently being previewed.
     */
    isConnecting(): boolean;
    /**
     * Function: isValidSource
     * 
     * Returns <mxGraph.isValidSource> for the given source terminal.
     * 
     * Parameters:
     * 
     * cell - <mxCell> that represents the source terminal.
     * me - <mxMouseEvent> that is associated with this call.
     */
    isValidSource(cell: mxCell, me: mxMouseEvent): boolean;
    /**
     * Function: isValidTarget
     * 
     * Returns true. The call to <mxGraph.isValidTarget> is implicit by calling
     * <mxGraph.getEdgeValidationError> in <validateConnection>. This is an
     * additional hook for disabling certain targets in this specific handler.
     * 
     * Parameters:
     * 
     * cell - <mxCell> that represents the target terminal.
     */
    isValidTarget(cell: mxCell): boolean;
    /**
     * Function: validateConnection
     * 
     * Returns the error message or an empty string if the connection for the
     * given source target pair is not valid. Otherwise it returns null. This
     * implementation uses <mxGraph.getEdgeValidationError>.
     * 
     * Parameters:
     * 
     * source - <mxCell> that represents the source terminal.
     * target - <mxCell> that represents the target terminal.
     */
    validateConnection(source: mxCell, target: mxCell): string;
    /**
     * Function: getConnectImage
     * 
     * Hook to return the <mxImage> used for the connection icon of the given
     * <mxCellState>. This implementation returns <connectImage>.
     * 
     * Parameters:
     * 
     * state - <mxCellState> whose connect image should be returned.
     */
    getConnectImage(state: mxCellState): mxImage;
    /**
     * Function: isMoveIconToFrontForState
     * 
     * Returns true if the state has a HTML label in the graph's container, otherwise
     * it returns <moveIconFront>.
     * 
     * Parameters:
     * 
     * state - <mxCellState> whose connect icons should be returned.
     */
    isMoveIconToFrontForState(state: mxCellState): boolean;
    /**
     * Function: createIcons
     * 
     * Creates the array <mxImageShapes> that represent the connect icons for
     * the given <mxCellState>.
     * 
     * Parameters:
     * 
     * state - <mxCellState> whose connect icons should be returned.
     */
    createIcons(state: mxCellState): mxImageShape[];
    /**
     * Function: redrawIcons
     * 
     * Redraws the given array of <mxImageShapes>.
     * 
     * Parameters:
     * 
     * icons - Optional array of <mxImageShapes> to be redrawn.
     */
    redrawIcons(icons?: mxImageShape[], state?: mxCellState);
    /**
     * Function: redrawIcons
     * 
     * Redraws the given array of <mxImageShapes>.
     * 
     * Parameters:
     * 
     * icons - Optional array of <mxImageShapes> to be redrawn.
     */
    getIconPosition(icon?: mxImageShape[], state?: mxCellState);
    /**
     * Function: destroyIcons
     * 
     * Destroys the connect icons and resets the respective state.
     */
    destroyIcons();
    /**
     * Function: isStartEvent
     * 
     * Returns true if the given mouse down event should start this handler. The
     * This implementation returns true if the event does not force marquee
     * selection, and the currentConstraint and currentFocus of the
     * <constraintHandler> are not null, or <previous> and <error> are not null and
     * <icons> is null or <icons> and <icon> are not null.
     */
    isStartEvent(me: mxMouseEvent): boolean;
    /**
     * Function: mouseDown
     * 
     * Handles the event by initiating a new connection.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: isImmediateConnectSource
     * 
     * Returns true if a tap on the given source state should immediately start
     * connecting. This implementation returns true if the state is not movable
     * in the graph. 
     */
    isImmediateConnectSource(state: mxCellState): boolean;
    /**
     * Function: createEdgeState
     * 
     * Hook to return an <mxCellState> which may be used during the preview.
     * This implementation returns null.
     * 
     * Use the following code to create a preview for an existing edge style:
     * 
     * (code)
     * graph.connectionHandler.createEdgeState = function(me)
     * {
     *   var edge = graph.createEdge(null, null, null, null, null, 'edgeStyle=elbowEdgeStyle');
     *   
     *   return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
     * };
     * (end)
     */
    createEdgeState(me: mxMouseEvent): any;
    /**
     * Function: updateCurrentState
     * 
     * Updates the current state for a given mouse move event by using
     * the <marker>.
     */
    updateCurrentState(me: mxMouseEvent);
    /**
     * Function: convertWaypoint
     * 
     * Converts the given point from screen coordinates to model coordinates.
     */
    convertWaypoint(point: mxPoint);
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating the preview edge or by highlighting
     * a possible source or target terminal.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: getTargetPerimeterPoint
     * 
     * Returns the perimeter point for the given target state.
     * 
     * Parameters:
     * 
     * state - <mxCellState> that represents the target cell state.
     * me - <mxMouseEvent> that represents the mouse move.
     */
    getTargetPerimeterPoint(state: mxCellState, me: mxMouseEvent): any;
    /**
     * Function: getSourcePerimeterPoint
     * 
     * Hook to update the icon position(s) based on a mouseOver event. This is
     * an empty implementation.
     * 
     * Parameters:
     * 
     * state - <mxCellState> that represents the target cell state.
     * next - <mxPoint> that represents the next point along the previewed edge.
     * me - <mxMouseEvent> that represents the mouse move.
     */
    getSourcePerimeterPoint(state: mxCellState, next: mxPoint, me: mxMouseEvent): mxPoint;
    /**
     * Function: updateIcons
     * 
     * Hook to update the icon position(s) based on a mouseOver event. This is
     * an empty implementation.
     * 
     * Parameters:
     * 
     * state - <mxCellState> under the mouse.
     * icons - Array of currently displayed icons.
     * me - <mxMouseEvent> that contains the mouse event.
     */
    updateIcons(state: mxCellState, icons: mxImageShape[], me: mxMouseEvent): any; // "//empty"
    /**
     * Function: isStopEvent
     * 
     * Returns true if the given mouse up event should stop this handler. The
     * connection will be created if <error> is null. Note that this is only
     * called if <waypointsEnabled> is true. This implemtation returns true
     * if there is a cell state in the given event.
     */
    isStopEvent(me: mxMouseEvent): boolean;
    /**
     * Function: addWaypoint
     * 
     * Adds the waypoint for the given event to <waypoints>.
     */
    addWaypointForEvent(me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Handles the event by inserting the new connection.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: reset
     * 
     * Resets the state of this handler.
     */
    reset();
    /**
     * Function: drawPreview
     * 
     * Redraws the preview edge using the color and width returned by
     * <getEdgeColor> and <getEdgeWidth>.
     */
    drawPreview();
    /**
     * Function: getEdgeColor
     * 
     * Returns the color used to draw the preview edge. This returns green if
     * there is no edge validation error and red otherwise.
     * 
     * Parameters:
     * 
     * valid - Boolean indicating if the color for a valid edge should be
     * returned.
     */
    getEdgeColor(valid: boolean): string;
    /**
     * Function: getEdgeWidth
     * 
     * Returns the width used to draw the preview edge. This returns 3 if
     * there is no edge validation error and 1 otherwise.
     * 
     * Parameters:
     * 
     * valid - Boolean indicating if the width for a valid edge should be
     * returned.
     */
    getEdgeWidth(valid: boolean): number;
    /**
     * Function: connect
     * 
     * Connects the given source and target using a new edge. This
     * implementation uses <createEdge> to create the edge.
     * 
     * Parameters:
     * 
     * source - <mxCell> that represents the source terminal.
     * target - <mxCell> that represents the target terminal.
     * evt - Mousedown event of the connect gesture.
     * dropTarget - <mxCell> that represents the cell under the mouse when it was
     * released.
     */
    connect(source: mxCell, target: mxCell, evt: Event, dropTarget: mxCell);
    /**
     * Function: selectCells
     * 
     * Selects the given edge after adding a new connection. The target argument
     * contains the target vertex if one has been inserted.
     */
    selectCells(edge: mxCell, target: mxCell);
    /**
     * Function: insertEdge
     * 
     * Creates, inserts and returns the new edge for the given parameters. This
     * implementation does only use <createEdge> if <factoryMethod> is defined,
     * otherwise <mxGraph.insertEdge> will be used.
     */
    insertEdge(parent: mxCell, id?: string, value?: Object, source?: mxCell, target?: mxCell, style?: string): mxCell;
    /**
     * Function: createTargetVertex
     * 
     * Hook method for creating new vertices on the fly if no target was
     * under the mouse. This is only called if <createTarget> is true and
     * returns null.
     * 
     * Parameters:
     * 
     * evt - Mousedown event of the connect gesture.
     * source - <mxCell> that represents the source terminal.
     */
    createTargetVertex(evt: Event, source: mxCell): mxCell;
    /**
     * Function: getAlignmentTolerance
     * 
     * Returns the tolerance for aligning new targets to sources.
     */
    getAlignmentTolerance(): number;
    /**
     * Function: createEdge
     * 
     * Creates and returns a new edge using <factoryMethod> if one exists. If
     * no factory method is defined, then a new default edge is returned. The
     * source and target arguments are informal, the actual connection is
     * setup later by the caller of this function.
     * 
     * Parameters:
     * 
     * value - Value to be used for creating the edge.
     * source - <mxCell> that represents the source terminal.
     * target - <mxCell> that represents the target terminal.
     * style - Optional style from the preview edge.
     */
    createEdge(value: any, source: mxCell, target: mxCell, style?: string): mxCell;
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes. This should be
     * called on all instances. It is called automatically for the built-in
     * instance created for each <mxGraph>.
     */
    destroy();


}

declare var mxConnectionHandler: {
    new (graph: mxGraph, factoryMethod?: ICallback): mxConnectionHandler;
    prototype: mxConnectionHandler;
}

interface mxConstraintHandler {

    /**
     * Variable: pointImage
     * 
     * <mxImage> to be used as the image for fixed connection points.
     */
    pointImage: mxImage;
    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: highlightColor
     * 
     * Specifies the color for the highlight. Default is <mxConstants.DEFAULT_VALID_COLOR>.
     */
    highlightColor: string;
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation
     * returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation
     * updates <enabled>.
     * 
     * Parameters:
     * 
     * enabled - Boolean that specifies the new enabled state.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: reset
     * 
     * Resets the state of this handler.
     */
    reset();
    /**
     * Function: getTolerance
     * 
     * Returns the tolerance to be used for intersecting connection points.
     */
    getTolerance(): number;
    /**
     * Function: getImageForConstraint
     * 
     * Returns the tolerance to be used for intersecting connection points.
     */
    getImageForConstraint(state: mxCellState, constraint: any, point: mxPoint): mxImage;
    /**
     * Function: isEventIgnored
     * 
     * Returns true if the given <mxMouseEvent> should be ignored in <update>. This
     * implementation always returns false.
     */
    isEventIgnored(me: mxMouseEvent, source: mxCell): boolean;
    /**
     * Function: isStateIgnored
     * 
     * Returns true if the given state should be ignored. This always returns false.
     */
    isStateIgnored(state: mxCellState, source: mxCell): boolean;
    /**
     * Function: destroyIcons
     * 
     * Destroys the <focusIcons> if they exist.
     */
    destroyIcons();
    /**
     * Function: destroyFocusHighlight
     * 
     * Destroys the <focusHighlight> if one exists.
     */
    destroyFocusHighlight();
    /**
     * Function: update
     * 
     * Updates the state of this handler based on the given <mxMouseEvent>.
     * Source is a boolean indicating if the cell is a source or target.
     */
    update(me: mxMouseEvent, source: mxCell);
    /**
     * Function: destroy
     * 
     * Destroy this handler.
     */
    destroy();

}

declare var mxConstraintHandler: {
    new (graph: mxGraph): mxConstraintHandler;
    prototype: mxConstraintHandler;
}

interface mxEdgeSegmentHandler extends mxEdgeHandler {

    /**
     * Function: getPreviewPoints
     * 
     * Updates the given preview state taking into account the state of the constraint handler.
     */
    getPreviewPoints(point: mxPoint): mxPoint[];
    /**
     * Function: createBends
     * 
     * Adds custom bends for the center of each segment.
     */
    createBends(): any[];
    /**
     * Function: redraw
     * 
     * Overridden to invoke <refresh> before the redraw.
     */
    redraw();
    /**
     * Function: redrawInnerBends
     * 
     * Updates the position of the custom bends.
     */
    redrawInnerBends(p0: mxPoint, pe: mxPoint);
    /**
     * Function: changePoints
     * 
     * Changes the points of the given edge to reflect the current state of the handler.
     */
    changePoints(edge: mxCell, points: mxPoint[]);

}

declare var mxEdgeSegmentHandler: {
    new (state: mxCellState): mxEdgeSegmentHandler;
    prototype: mxEdgeSegmentHandler;
}

interface mxElbowEdgeHandler extends mxEdgeHandler {

    /**
     * Specifies if a double click on the middle handle should call
     * <mxGraph.flipEdge>. Default is true.
     */
    flipEnabled: boolean;
    /**
     * Variable: doubleClickOrientationResource
     * 
     * Specifies the resource key for the tooltip to be displayed on the single
     * control point for routed edges. If the resource for this key does not
     * exist then the value is used as the error message. Default is
     * 'doubleClickOrientation'.
     */
    doubleClickOrientationResource: string;
    /**
     * Function: createBends
     * 
     * Overrides <mxEdgeHandler.createBends> to create custom bends.
     */
    createBends():any[];
    /**
     * Function: createVirtualBend
     * 
     * Creates a virtual bend that supports double clicking and calls
     * <mxGraph.flipEdge>.
     */
    createVirtualBend(): any;
    /**
     * Function: getCursorForBend
     * 
     * Returns the cursor to be used for the bend.
     */
    getCursorForBend(): string;
    /**
     * Function: getTooltipForNode
     * 
     * Returns the tooltip for the given node.
     */
    getTooltipForNode(node: Element): string;
    /**
     * Function: convertPoint
     * 
     * Converts the given point in-place from screen to unscaled, untranslated
     * graph coordinates and applies the grid.
     * 
     * Parameters:
     * 
     * point - <mxPoint> to be converted.
     * gridEnabled - Boolean that specifies if the grid should be applied.
     */
    convertPoint(point: mxPoint, gridEnabled: boolean);
    /**
     * Function: redrawInnerBends
     * 
     * Updates and redraws the inner bends.
     * 
     * Parameters:
     * 
     * p0 - <mxPoint> that represents the location of the first point.
     * pe - <mxPoint> that represents the location of the last point.
     */
    redrawInnerBends(p0: mxPoint, pe: mxPoint);

}

declare var mxElbowEdgeHandler: {
    new (state: mxCellState): mxElbowEdgeHandler;
    prototype: mxElbowEdgeHandler;
}

interface mxGraphHandler {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: maxCells
     * 
     * Defines the maximum number of cells to paint subhandles
     * for. Default is 50 for Firefox and 20 for IE. Set this
     * to 0 if you want an unlimited number of handles to be
     * displayed. This is only recommended if the number of
     * cells in the graph is limited to a small number, eg.
     * 500.
     */
    maxCells: number;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: highlightEnabled
     * 
     * Specifies if drop targets under the mouse should be enabled. Default is
     * true.
     */
    highlightEnabled: boolean;
    /**
     * Variable: cloneEnabled
     * 
     * Specifies if cloning by control-drag is enabled. Default is true.
     */
    cloneEnabled: boolean;
    /**
     * Variable: moveEnabled
     * 
     * Specifies if moving is enabled. Default is true.
     */
    moveEnabled: boolean;
    /**
     * Variable: guidesEnabled
     * 
     * Specifies if other cells should be used for snapping the right, center or
     * left side of the current selection. Default is false.
     */
    guidesEnabled: boolean;
    /**
     * Variable: guide
     * 
     * Holds the <mxGuide> instance that is used for alignment.
     */
    guide: mxGuide;
    /**
     * Variable: currentDx
     * 
     * Stores the x-coordinate of the current mouse move.
     */
    currentDx: number;
    /**
     * Variable: currentDy
     * 
     * Stores the y-coordinate of the current mouse move.
     */
    currentDy: number;
    /**
     * Variable: updateCursor
     * 
     * Specifies if a move cursor should be shown if the mouse is ove a movable
     * cell. Default is true.
     */
    updateCursor: boolean;
    /**
     * Variable: selectEnabled
     * 
     * Specifies if selecting is enabled. Default is true.
     */
    selectEnabled: boolean;
    /**
     * Variable: removeCellsFromParent
     * 
     * Specifies if cells may be moved out of their parents. Default is true.
     */
    removeCellsFromParent: boolean;
    /**
     * Variable: connectOnDrop
     * 
     * Specifies if drop events are interpreted as new connections if no other
     * drop action is defined. Default is false.
     */
    connectOnDrop: boolean;
    /**
     * Variable: scrollOnMove
     * 
     * Specifies if the view should be scrolled so that a moved cell is
     * visible. Default is true.
     */
    scrollOnMove: boolean;
    /**
     * Variable: minimumSize
     * 
     * Specifies the minimum number of pixels for the width and height of a
     * selection border. Default is 6.
     */
    minimumSize: number;
    /**
     * Variable: previewColor
     * 
     * Specifies the color of the preview shape. Default is black.
     */
    previewColor: string;
    /**
     * Variable: htmlPreview
     * 
     * Specifies if the graph container should be used for preview. If this is used
     * then drop target detection relies entirely on <mxGraph.getCellAt> because
     * the HTML preview does not "let events through". Default is false.
     */
    htmlPreview: boolean;
    /**
     * Variable: shape
     * 
     * Reference to the <mxShape> that represents the preview.
     */
    shape: mxShape;
    /**
     * Variable: scaleGrid
     * 
     * Specifies if the grid should be scaled. Default is false.
     */
    scaleGrid: boolean;
    /**
     * Variable: rotationEnabled
     * 
     * Specifies if the bounding box should allow for rotation. Default is true.
     */
    rotationEnabled: boolean;
    /**
     * Function: isEnabled
     * 
     * Returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Sets <enabled>.
     */
    setEnabled(value: boolean);
    /**
     * Function: isCloneEnabled
     * 
     * Returns <cloneEnabled>.
     */
    isCloneEnabled(): boolean;
    /**
     * Function: setCloneEnabled
     * 
     * Sets <cloneEnabled>.
     * 
     * Parameters:
     * 
     * value - Boolean that specifies the new clone enabled state.
     */
    setCloneEnabled(value: boolean);
    /**
     * Function: isMoveEnabled
     * 
     * Returns <moveEnabled>.
     */
    isMoveEnabled(): boolean;
    /**
     * Function: setMoveEnabled
     * 
     * Sets <moveEnabled>.
     */
    setMoveEnabled(value: boolean);
    /**
     * Function: isSelectEnabled
     * 
     * Returns <selectEnabled>.
     */
    isSelectEnabled(): boolean;
    /**
     * Function: setSelectEnabled
     * 
     * Sets <selectEnabled>.
     */
    setSelectEnabled(value: boolean);
    /**
     * Function: isRemoveCellsFromParent
     * 
     * Returns <removeCellsFromParent>.
     */
    isRemoveCellsFromParent(): boolean;
    /**
     * Function: setRemoveCellsFromParent
     * 
     * Sets <removeCellsFromParent>.
     */
    setRemoveCellsFromParent(value: boolean);
    /**
     * Function: getInitialCellForEvent
     * 
     * Hook to return initial cell for the given event.
     */
    getInitialCellForEvent(me: mxMouseEvent): mxCell;
    /**
     * Function: isDelayedSelection
     * 
     * Hook to return true for delayed selections.
     */
    isDelayedSelection(cell: mxCell): boolean;
    /**
     * Function: mouseDown
     * 
     * Handles the event by selecing the given cell and creating a handle for
     * it. By consuming the event all subsequent events of the gesture are
     * redirected to this handler.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: getGuideStates
     * 
     * Creates an array of cell states which should be used as guides.
     */
    getGuideStates(): mxCellState[];
    /**
     * Function: getCells
     * 
     * Returns the cells to be modified by this handler. This implementation
     * returns all selection cells that are movable, or the given initial cell if
     * the given cell is not selected and movable. This handles the case of moving
     * unselectable or unselected cells.
     * 
     * Parameters:
     * 
     * initialCell - <mxCell> that triggered this handler.
     */
    getCells(initialCell: mxCell): mxCell[];
    /**
     * Function: getPreviewBounds
     * 
     * Returns the <mxRectangle> used as the preview bounds for
     * moving the given cells.
     */
    getPreviewBounds(cells: mxCell[]): mxRectangle;
    /**
     * Function: getBoundingBox
     * 
     * Returns the <mxRectangle> that represents the bounding box for the given
     * cells. If bbox is true then the paint bounding box is returned.
     */
    getBoundingBox(cells: mxCell[]): mxRectangle;
    /**
     * Function: createPreviewShape
     * 
     * Creates the shape used to draw the preview for the given bounds.
     */
    createPreviewShape(bounds: mxRectangle): mxRectangleShape;
    /**
     * Function: start
     * 
     * Starts the handling of the mouse gesture.
     */
    start(cell: mxCell, x: number, y: number);
    /**
     * Function: useGuidesForEvent
     * 
     * Returns true if the guides should be used for the given <mxMouseEvent>.
     * This implementation returns <mxGuide.isEnabledForEvent>.
     */
    useGuidesForEvent(me: mxMouseEvent): boolean;
    /**
     * Function: snap
     * 
     * Snaps the given vector to the grid and returns the given mxPoint instance.
     */
    snap(vector: mxPoint): mxPoint;
    /**
     * Function: getDelta
     * 
     * Returns an <mxPoint> that represents the vector for moving the cells
     * for the given <mxMouseEvent>.
     */
    getDelta(me: mxMouseEvent): mxPoint;
    /**
     * Function: updateHint
     * 
     * Hook for subclassers do show details while the handler is active.
     */
    updateHint(me: mxMouseEvent): any; 
    /**
     * Function: removeHint
     * 
     * Hooks for subclassers to hide details when the handler gets inactive.
     */
    removeHint();
    /**
     * Function: roundLength
     * 
     * Hook for rounding the unscaled vector. This uses Math.round.
     */
    roundLength(length: number): number;
    /**
     * Function: mouseMove
     * 
     * Handles the event by highlighting possible drop targets and updating the
     * preview.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: updatePreviewShape
     * 
     * Updates the bounds of the preview shape.
     */
    updatePreviewShape();
    /**
     * Function: setHighlightColor
     * 
     * Sets the color of the rectangle used to highlight drop targets.
     * 
     * Parameters:
     * 
     * color - String that represents the new highlight color.
     */
    setHighlightColor(color: string);
    /**
     * Function: mouseUp
     * 
     * Handles the event by applying the changes to the selection cells.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: selectDelayed
     * 
     * Implements the delayed selection for the given mouse event.
     */
    selectDelayed(me: mxMouseEvent);
    /**
     * Function: reset
     * 
     * Resets the state of this handler.
     */
    reset();
    /**
     * Function: shouldRemoveCellsFromParent
     * 
     * Returns true if the given cells should be removed from the parent for the specified
     * mousereleased event.
     */
    shouldRemoveCellsFromParent(parent: mxCell, cells: mxCell, evt: Event): boolean;
    /**
     * Function: moveCells
     * 
     * Moves the given cells by the specified amount.
     */
    moveCells(cells: mxCell[], dx: number, dy: number, clone: boolean, target: mxCell, evt: Event);
    /**
     * Function: destroyShapes
     * 
     * Destroy the preview and highlight shapes.
     */
    destroyShapes();
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxGraphHandler: {
    new (graph: mxGraph): mxGraphHandler;
    prototype: mxGraphHandler;
}

interface mxKeyHandler {

    /**
     * Variable: graph
     * 
     * Reference to the <mxGraph> associated with this handler.
     */
    graph: mxGraph;
    /**
     * Variable: target
     * 
     * Reference to the target DOM, that is, the DOM node where the key event
     * listeners are installed.
     */
    target: Element;
    /**
     * Variable: normalKeys
     * 
     * Maps from keycodes to functions for non-pressed control keys.
     */
    normalKeys: any[];
    /**
     * Variable: shiftKeys
     * 
     * Maps from keycodes to functions for pressed shift keys.
     */
    shiftKeys: any[];
    /**
     * Variable: controlKeys
     * 
     * Maps from keycodes to functions for pressed control keys.
     */
    controlKeys: any[];
    /**
     * Variable: controlShiftKeys
     * 
     * Maps from keycodes to functions for pressed control and shift keys.
     */
    controlShiftKeys: any[];
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation returns
     * <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling by updating <enabled>.
     * 
     * Parameters:
     * 
     * enabled - Boolean that specifies the new enabled state.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: bindKey
     * 
     * Binds the specified keycode to the given function. This binding is used
     * if the control key is not pressed.
     * 
     * Parameters:
     *
     * code - Integer that specifies the keycode.
     * funct - JavaScript function that takes the key event as an argument.
     */
    bindKey(code: number, funct: ICallback);
    /**
     * Function: bindShiftKey
     * 
     * Binds the specified keycode to the given function. This binding is used
     * if the shift key is pressed.
     * 
     * Parameters:
     *
     * code - Integer that specifies the keycode.
     * funct - JavaScript function that takes the key event as an argument.
     */
    bindShiftKey(code: number, funct: ICallback);
    /**
     * Function: bindControlKey
     * 
     * Binds the specified keycode to the given function. This binding is used
     * if the control key is pressed.
     * 
     * Parameters:
     *
     * code - Integer that specifies the keycode.
     * funct - JavaScript function that takes the key event as an argument.
     */
    bindControlKey(code: number, funct: ICallback);
    /**
     * Function: bindControlShiftKey
     * 
     * Binds the specified keycode to the given function. This binding is used
     * if the control and shift key are pressed.
     * 
     * Parameters:
     *
     * code - Integer that specifies the keycode.
     * funct - JavaScript function that takes the key event as an argument.
     */
    bindControlShiftKey(code: number, funct: ICallback);
    /**
     * Function: isControlDown
     * 
     * Returns true if the control key is pressed. This uses <mxEvent.isControlDown>.
     * 
     * Parameters:
     * 
     * evt - Key event whose control key pressed state should be returned.
     */
    isControlDown(evt: Event): boolean;
    /**
     * Function: getFunction
     * 
     * Returns the function associated with the given key event or null if no
     * function is associated with the given event.
     * 
     * Parameters:
     * 
     * evt - Key event whose associated function should be returned.
     */
    getFunction(evt: Event): ICallback;
    /**
     * Function: isGraphEvent
     * 
     * Returns true if the event should be processed by this handler, that is,
     * if the event source is either the target, one of its direct children, a
     * descendant of the <mxGraph.container>, or the <mxGraph.cellEditor> of the
     * <graph>.
     * 
     * Parameters:
     * 
     * evt - Key event that represents the keystroke.
     */
    isGraphEvent(evt: Event): boolean;
    /**
     * Function: keyDown
     * 
     * Handles the event by invoking the function bound to the respective
     * keystroke if <mxGraph.isEnabled>, <isEnabled> and <isGraphEvent> all
     * return true for the given event and <mxGraph.isEditing> returns false.
     * If the graph is editing only the <enter> and <escape> cases are handled
     * by calling the respective hooks.
     * 
     * Parameters:
     * 
     * evt - Key event that represents the keystroke.
     */
    keyDown(evt: Event);
    /**
     * Function: escape
     * 
     * Hook to process ESCAPE keystrokes. This implementation invokes
     * <mxGraph.stopEditing> to cancel the current editing, connecting
     * and/or other ongoing modifications.
     * 
     * Parameters:
     * 
     * evt - Key event that represents the keystroke. Possible keycode in this
     * case is 27 (ESCAPE).
     */
    escape(evt: Event);
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its references into the DOM. This does
     * normally not need to be called, it is called automatically when the
     * window unloads (in IE).
     */
    destroy();

}

declare var mxKeyHandler: {
    new (graph: mxGraph, target?: Element): mxKeyHandler;
    prototype: mxKeyHandler;
}

interface mxPanningHandler extends mxEventSource {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: useLeftButtonForPanning
     * 
     * Specifies if panning should be active for the left mouse button.
     * Setting this to true may conflict with <mxRubberband>. Default is false.
     */
    useLeftButtonForPanning: boolean;
    /**
     * Variable: usePopupTrigger
     * 
     * Specifies if <mxEvent.isPopupTrigger> should also be used for panning.
     */
    usePopupTrigger: boolean;
    /**
     * Variable: ignoreCell
     * 
     * Specifies if panning should be active even if there is a cell under the
     * mousepointer. Default is false.
     */
    ignoreCell: boolean;
    /**
     * Variable: previewEnabled
     * 
     * Specifies if the panning should be previewed. Default is true.
     */
    previewEnabled: boolean;
    /**
     * Variable: useGrid
     * 
     * Specifies if the panning steps should be aligned to the grid size.
     * Default is false.
     */
    useGrid: boolean;
    /**
     * Variable: panningEnabled
     * 
     * Specifies if panning should be enabled. Default is true.
     */
    panningEnabled: boolean;
    /**
     * Variable: pinchEnabled
     * 
     * Specifies if pinch gestures should be handled as zoom. Default is true.
     */
    pinchEnabled: boolean;
    /**
     * Variable: maxScale
     * 
     * Specifies the maximum scale. Default is 8.
     */
    maxScale: number;
    /**
     * Variable: minScale
     * 
     * Specifies the minimum scale. Default is 0.01.
     */
    minScale: number;
    /**
     * Variable: dx
     * 
     * Holds the current horizontal offset.
     */
    dx: number;
    /**
     * Variable: dy
     * 
     * Holds the current vertical offset.
     */
    dy: number;
    /**
     * Variable: startX
     * 
     * Holds the x-coordinate of the start point.
     */
    startX: number;
    /**
     * Variable: startY
     * 
     * Holds the y-coordinate of the start point.
     */
    startY: number;
    /**
     * Function: isActive
     * 
     * Returns true if the handler is currently active.
     */
    isActive(): boolean;
    /**
     * Function: isPanningEnabled
     * 
     * Returns <panningEnabled>.
     */
    isPanningEnabled(): boolean;
    /**
     * Function: setPanningEnabled
     * 
     * Sets <panningEnabled>.
     */
    setPanningEnabled(value: boolean);
    /**
     * Function: isPinchEnabled
     * 
     * Returns <pinchEnabled>.
     */
    isPinchEnabled(): boolean;
    /**
     * Function: setPinchEnabled
     * 
     * Sets <pinchEnabled>.
     */
    setPinchEnabled(value: boolean);
    /**
     * Function: isPanningTrigger
     * 
     * Returns true if the given event is a panning trigger for the optional
     * given cell. This returns true if control-shift is pressed or if
     * <usePopupTrigger> is true and the event is a popup trigger.
     */
    isPanningTrigger(me: mxMouseEvent): boolean;
    /**
     * Function: isForcePanningEvent
     * 
     * Returns true if the given <mxMouseEvent> should start panning. This
     * implementation always returns false.
     */
    isForcePanningEvent(me: mxMouseEvent): boolean;
    /**
     * Function: mouseDown
     * 
     * Handles the event by initiating the panning. By consuming the event all
     * subsequent events of the gesture are redirected to this handler.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: start
     * 
     * Starts panning at the given event.
     */
    start(me: mxMouseEvent);
    /**
     * Function: consumePanningTrigger
     * 
     * Consumes the given <mxMouseEvent> if it was a panning trigger in
     * <mouseDown>. The default is to invoke <mxMouseEvent.consume>. Note that this
     * will block any further event processing. If you haven't disabled built-in
     * context menus and require immediate selection of the cell on mouseDown in
     * Safari and/or on the Mac, then use the following code:
     * 
     * (code)
     * mxPanningHandler.prototype.consumePanningTrigger = function(me)
     * {
     *   if (me.evt.preventDefault)
     *   {
     *     me.evt.preventDefault();
     *   }
     *   
     *   // Stops event processing in IE
     *   me.evt.returnValue = false;
     *   
     *   // Sets local consumed state
     *   if (!mxClient.IS_SF && !mxClient.IS_MAC)
     *   {
     *     me.consumed = true;
     *   }
     * };
     * (end)
     */
    consumePanningTrigger(me: mxMouseEvent);
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating the panning on the graph.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Handles the event by setting the translation on the view or showing the
     * popupmenu.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: panGraph
     * 
     * Pans <graph> by the given amount.
     */
    panGraph(dx: number, dy: number);
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxPanningHandler: {
    new (graph: mxGraph): mxPanningHandler;
    prototype: mxPanningHandler;
}

interface mxPopupMenuHandler extends mxPopupMenu {

    graph: mxGraph;
    selectOnPopup: boolean;
    clearSelectionOnBackground: boolean;
    triggerX: number;
    triggerY: number;
    init();
    isSelectOnPopup(me: mxMouseEvent): boolean;
    mouseDown(sender: any, me: mxMouseEvent);
    mouseMove(sender: any, me: mxMouseEvent);
    mouseUp(sender: any, me: mxMouseEvent);
    getCellForPopupEvent(me: mxMouseEvent): mxCell;
    destroy();

}

declare var mxPopupMenuHandler: {
    new (): mxPopupMenuHandler;
    prototype: mxPopupMenuHandler;
}

interface mxRubberband {

    /**
     * Variable: defaultOpacity
     * 
     * Specifies the default opacity to be used for the rubberband div. Default
     * is 20.
     */
    defaultOpacity: number;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: div
     * 
     * Holds the DIV element which is currently visible.
     */
    div: Element;
    /**
     * Variable: sharedDiv
     * 
     * Holds the DIV element which is used to display the rubberband.
     */
    sharedDiv: Element;
    /**
     * Variable: currentX
     * 
     * Holds the value of the x argument in the last call to <update>.
     */
    currentX: number;
    /**
     * Variable: currentY
     * 
     * Holds the value of the y argument in the last call to <update>.
     */
    currentY: number;
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation returns
     * <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation updates
     * <enabled>.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: isForceRubberbandEvent
     * 
     * Returns true if the given <mxMouseEvent> should start rubberband selection.
     * This implementation returns true if the alt key is pressed.
     */
    isForceRubberbandEvent(me: mxMouseEvent): boolean;
    /**
     * Function: mouseDown
     * 
     * Handles the event by initiating a rubberband selection. By consuming the
     * event all subsequent events of the gesture are redirected to this
     * handler.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: start
     * 
     * Sets the start point for the rubberband selection.
     */
    start(x: number, y: number);
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating therubberband selection.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: createShape
     * 
     * Creates the rubberband selection shape.
     */
    createShape(): Element;
    /**
     * Function: mouseUp
     * 
     * Handles the event by selecting the region of the rubberband using
     * <mxGraph.selectRegion>.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: reset
     * 
     * Resets the state of the rubberband selection.
     */
    reset();
    /**
     * Function: update
     * 
     * Sets <currentX> and <currentY> and calls <repaint>.
     */
    update(x: number, y: number);
    /**
     * Function: repaint
     * 
     * Computes the bounding box and updates the style of the <div>.
     */
    repaint();
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes. This does
     * normally not need to be called, it is called automatically when the
     * window unloads.
     */
    destroy();

}

declare var mxRubberband: {
    new (graph: mxGraph): mxRubberband;
    prototype: mxRubberband;
}

interface mxSelectionCellsHandler extends mxEventSource {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: refreshHandler
     * 
     * Keeps a reference to an event listener for later removal.
     */
    refreshHandler: any;
    /**
     * Variable: maxHandlers
     * 
     * Defines the maximum number of handlers to paint individually. Default is 100.
     */
    maxHandlers: number;
    /**
     * Variable: handlers
     * 
     * <mxDictionary> that maps from cells to handlers.
     */
    handlers: mxDictionary;
    /**
     * Function: isEnabled
     * 
     * Returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Sets <enabled>.
     */
    setEnabled(value: boolean);
    /**
     * Function: getHandler
     * 
     * Returns the handler for the given cell.
     */
    getHandler(cell: mxCell): any;
    /**
     * Function: reset
     * 
     * Resets all handlers.
     */
    reset();
    /**
     * Function: refresh
     * 
     * Reloads or updates all handlers.
     */
    refresh();
    /**
     * Function: mouseDown
     * 
     * Redirects the given event to the handlers.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseMove
     * 
     * Redirects the given event to the handlers.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Redirects the given event to the handlers.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxSelectionCellsHandler: {
    new (graph: mxGraph): mxSelectionCellsHandler;
    prototype: mxSelectionCellsHandler;
}

interface mxTooltipHandler {

    /**
     * Variable: zIndex
     * 
     * Specifies the zIndex for the tooltip and its shadow. Default is 10005.
     */
    zIndex: number;
    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: delay
     * 
     * Delay to show the tooltip in milliseconds. Default is 500.
     */
    delay: number;
    /**
     * Variable: ignoreTouchEvents
     * 
     * Specifies if touch and pen events should be ignored. Default is true.
     */
    ignoreTouchEvents: boolean;
    /**
     * Variable: hideOnHover
     * 
     * Specifies if the tooltip should be hidden if the mouse is moved over the
     * current cell. Default is false.
     */
    hideOnHover: boolean;
    /**
     * Variable: enabled
     * 
     * Specifies if events are handled. Default is true.
     */
    enabled: boolean;
    /**
     * Function: isEnabled
     * 
     * Returns true if events are handled. This implementation
     * returns <enabled>.
     */
    isEnabled(): boolean;
    /**
     * Function: setEnabled
     * 
     * Enables or disables event handling. This implementation
     * updates <enabled>.
     */
    setEnabled(enabled: boolean);
    /**
     * Function: isHideOnHover
     * 
     * Returns <hideOnHover>.
     */
    isHideOnHover(): boolean;
    /**
     * Function: setHideOnHover
     * 
     * Sets <hideOnHover>.
     */
    setHideOnHover(value: boolean);
    /**
     * Function: init
     * 
     * Initializes the DOM nodes required for this tooltip handler.
     */
    init();
    /**
     * Function: mouseDown
     * 
     * Handles the event by initiating a rubberband selection. By consuming the
     * event all subsequent events of the gesture are redirected to this
     * handler.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating the rubberband selection.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Handles the event by resetting the tooltip timer or hiding the existing
     * tooltip.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: resetTimer
     * 
     * Resets the timer.
     */
    resetTimer();
    /**
     * Function: reset
     * 
     * Resets and/or restarts the timer to trigger the display of the tooltip.
     */
    reset(me: mxMouseEvent, restart: boolean);
    /**
     * Function: hide
     * 
     * Hides the tooltip and resets the timer.
     */
    hide();
    /**
     * Function: hideTooltip
     * 
     * Hides the tooltip.
     */
    hideTooltip();
    /**
     * Function: show
     * 
     * Shows the tooltip for the specified cell and optional index at the
     * specified location (with a vertical offset of 10 pixels).
     */
    show(tip: any, x?: number, y?: number);
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxTooltipHandler: {
    new (graph: mxGraph, delay?: number): mxTooltipHandler;
    prototype: mxTooltipHandler;
}

interface mxVertexHandler {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: state
     * 
     * Reference to the <mxCellState> being modified.
     */
    state: mxCellState;
    /**
     * Variable: singleSizer
     * 
     * Specifies if only one sizer handle at the bottom, right corner should be
     * used. Default is false.
     */
    singleSizer: boolean;
    /**
     * Variable: index
     * 
     * Holds the index of the current handle.
     */
    index: any;
    /**
     * Variable: allowHandleBoundsCheck
     * 
     * Specifies if the bounds of handles should be used for hit-detection in IE or
     * if <tolerance> > 0. Default is true.
     */
    allowHandleBoundsCheck: boolean;
    /**
     * Variable: handleImage
     * 
     * Optional <mxImage> to be used as handles. Default is null.
     */
    handleImage?: mxImage;
    /**
     * Variable: tolerance
     * 
     * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
     */
    tolerance?: number;
    /**
     * Variable: rotationEnabled
     * 
     * Specifies if a rotation handle should be visible. Default is false.
     */
    rotationEnabled: boolean;
    /**
     * Variable: rotationRaster
     * 
     * Specifies if rotation steps should be "rasterized" depening on the distance
     * to the handle. Default is true.
     */
    rotationRaster: boolean;
    /**
     * Variable: rotationCursor
     * 
     * Specifies the cursor for the rotation handle. Default is 'crosshair'.
     */
    rotationCursor: string;
    /**
     * Variable: livePreview
     * 
     * Specifies if resize should change the cell in-place. This is an experimental
     * feature for non-touch devices. Default is false.
     */
    livePreview: boolean;
    /**
     * Variable: manageSizers
     * 
     * Specifies if sizers should be hidden and spaced if the vertex is small.
     * Default is false.
     */
    manageSizers: boolean;
    /**
     * Variable: constrainGroupByChildren
     * 
     * Specifies if the size of groups should be constrained by the children.
     * Default is false.
     */
    constrainGroupByChildren: boolean;
    /**
     * Variable: rotationHandleVSpacing
     * 
     * Vertical spacing for rotation icon. Default is -16.
     */
    rotationHandleVSpacing: number;
    /**
     * Variable: horizontalOffset
     * 
     * The horizontal offset for the handles. This is updated in <redrawHandles>
     * if <manageSizers> is true and the sizers are offset horizontally.
     */
    horizontalOffset: number;
    /**
     * Variable: verticalOffset
     * 
     * The horizontal offset for the handles. This is updated in <redrawHandles>
     * if <manageSizers> is true and the sizers are offset vertically.
     */
    verticalOffset: number;
    /**
     * Function: init
     * 
     * Initializes the shapes required for this vertex handler.
     */
    init();
    /**
     * Function: isConstrainedEvent
     * 
     * Returns true if the aspect ratio if the cell should be maintained.
     */
    isConstrainedEvent(me: mxMouseEvent): boolean;
    /**
     * Function: updateMinBounds
     * 
     * Initializes the shapes required for this vertex handler.
     */
    updateMinBounds();
    /**
     * Function: getSelectionBounds
     * 
     * Returns the mxRectangle that defines the bounds of the selection
     * border.
     */
    getSelectionBounds(state: mxCellState): mxRectangle;
    /**
     * Function: createSelectionShape
     * 
     * Creates the shape used to draw the selection border.
     */
    createSelectionShape(bounds: mxRectangle): mxRectangleShape;
    /**
     * Function: getSelectionColor
     * 
     * Returns <mxConstants.VERTEX_SELECTION_COLOR>.
     */
    getSelectionColor(): string;
    /**
     * Function: getSelectionStrokeWidth
     * 
     * Returns <mxConstants.VERTEX_SELECTION_STROKEWIDTH>.
     */
    getSelectionStrokeWidth(): number;
    /**
     * Function: isSelectionDashed
     * 
     * Returns <mxConstants.VERTEX_SELECTION_DASHED>.
     */
    isSelectionDashed(): boolean;
    /**
     * Function: createSizer
     * 
     * Creates a sizer handle for the specified cursor and index and returns
     * the new <mxRectangleShape> that represents the handle.
     */
    createSizer(cursor: any, index: any, size: number, fillColor: string): mxRectangleShape;
    /**
     * Function: isSizerVisible
     * 
     * Returns true if the sizer for the given index is visible.
     * This returns true for all given indices.
     */
    isSizerVisible(index: any): boolean;
    /**
     * Function: createSizerShape
     * 
     * Creates the shape used for the sizer handle for the specified bounds an
     * index. Only images and rectangles should be returned if support for HTML
     * labels with not foreign objects is required.
     */
    createSizerShape(bounds: mxRectangle, index: any, fillColor: string): mxShape;
    /**
     * Function: createBounds
     * 
     * Helper method to create an <mxRectangle> around the given centerpoint
     * with a width and height of 2*s or 6, if no s is given.
     */
    moveSizerTo(shape: mxShape, x: number, y: number);
    /**
     * Function: getHandleForEvent
     * 
     * Returns the index of the handle for the given event. This returns the index
     * of the sizer from where the event originated or <mxEvent.LABEL_INDEX>.
     */
    getHandleForEvent(me: mxMouseEvent): any;
    /**
     * Function: mouseDown
     * 
     * Handles the event if a handle has been clicked. By consuming the
     * event all subsequent events of the gesture are redirected to this
     * handler.
     */
    mouseDown(sender: any, me: mxMouseEvent);
    /**
     * Function: isLivePreviewBorder
     * 
     * Called if <livePreview> is enabled to check if a border should be painted.
     * This implementation returns true if the shape is transparent.
     */
    isLivePreviewBorder(): boolean;
    /**
     * Function: start
     * 
     * Starts the handling of the mouse gesture.
     */
    start(x: number, y: number, index: any);
    /**
     * Function: hideSizers
     * 
     * Hides all sizers except.
     * 
     * Starts the handling of the mouse gesture.
     */
    hideSizers();
    /**
     * Function: checkTolerance
     * 
     * Checks if the coordinates for the given event are within the
     * <mxGraph.tolerance>. If the event is a mouse event then the tolerance is
     * ignored.
     */
    checkTolerance(me: mxMouseEvent);
    /**
     * Function: updateHint
     * 
     * Hook for subclassers do show details while the handler is active.
     */
    updateHint(me: mxMouseEvent);
    /**
     * Function: removeHint
     * 
     * Hooks for subclassers to hide details when the handler gets inactive.
     */
    removeHint();
    /**
     * Function: roundAngle
     * 
     * Hook for rounding the angle. This uses Math.round.
     */
    roundAngle(angle: number): number;
    /**
     * Function: roundLength
     * 
     * Hook for rounding the unscaled width or height. This uses Math.round.
     */
    roundLength(length: number): number;
    /**
     * Function: mouseMove
     * 
     * Handles the event by updating the preview.
     */
    mouseMove(sender: any, me: mxMouseEvent);
    /**
     * Function: mouseUp
     * 
     * Handles the event by applying the changes to the geometry.
     */
    mouseUp(sender: any, me: mxMouseEvent);
    /**
     * Function: rotateCell
     * 
     * Rotates the given cell to the given rotation.
     */
    isRecursiveResize(state: mxCellState, me: mxMouseEvent): boolean;
    /**
     * Function: rotateCell
     * 
     * Rotates the given cell to the given rotation.
     */
    rotateCell(cell: mxCell, delta: number);
    /**
     * Function: reset
     * 
     * Resets the state of this handler.
     */
    reset();
    /**
     * Function: resizeCell
     * 
     * Uses the given vector to change the bounds of the given cell
     * in the graph using <mxGraph.resizeCell>.
     */
    resizeCell(cell: mxCell, dx: number, dy: number, index: any, gridEnabled: boolean, constrained: boolean, recurse: any);
    /**
     * Function: moveChildren
     * 
     * Moves the children of the given cell by the given vector.
     */
    moveChildren(cell: mxCell, dx: number, dy: number);
    /**
     * Function: union
     * 
     * Returns the union of the given bounds and location for the specified
     * handle index.
     * 
     * To override this to limit the size of vertex via a minWidth/-Height style,
     * the following code can be used.
     * 
     * (code)
     * var vertexHandlerUnion = mxVertexHandler.prototype.union;
     * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
     * {
     *   var result = vertexHandlerUnion.apply(this, arguments);
     *   
     *   result.width = Math.max(result.width, mxUtils.getNumber(this.state.style, 'minWidth', 0));
     *   result.height = Math.max(result.height, mxUtils.getNumber(this.state.style, 'minHeight', 0));
     *   
     *   return result;
     * };
     * (end)
     * 
     * The minWidth/-Height style can then be used as follows:
     * 
     * (code)
     * graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'minWidth=100;minHeight=100;');
     * (end)
     * 
     * To override this to update the height for a wrapped text if the width of a vertex is
     * changed, the following can be used.
     * 
     * (code)
     * var mxVertexHandlerUnion = mxVertexHandler.prototype.union;
     * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
     * {
     *   var result = mxVertexHandlerUnion.apply(this, arguments);
     *   var s = this.state;
     *   
     *   if (this.graph.isHtmlLabel(s.cell) && (index == 3 || index == 4) &&
     *       s.text != null && s.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
     *   {
     *     var label = this.graph.getLabel(s.cell);
     *     var fontSize = mxUtils.getNumber(s.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
     *     var ww = result.width / s.view.scale - s.text.spacingRight - s.text.spacingLeft
     *     
     *     result.height = mxUtils.getSizeForString(label, fontSize, s.style[mxConstants.STYLE_FONTFAMILY], ww).height;
     *   }
     *   
     *   return result;
     * };
     * (end)
     */
    union(bounds: mxRectangle, dx: number, dy: number, index: any, gridEnabled: boolean, scale: number, tr: any, constrained: boolean);
    /**
     * Function: redraw
     * 
     * Redraws the handles and the preview.
     */
    redraw();
    /**
     * Function: redrawHandles
     * 
     * Redraws the handles. To hide certain handles the following code can be used.
     * 
     * (code)
     * mxVertexHandler.prototype.redrawHandles = function()
     * {
     *   mxVertexHandlerRedrawHandles.apply(this, arguments);
     *   
     *   if (this.sizers != null && this.sizers.length > 7)
     *   {
     *     this.sizers[1].node.style.display = 'none';
     *     this.sizers[6].node.style.display = 'none';
     *   }
     * };
     * (end)
     */
    redrawHandles();
    /**
     * Function: drawPreview
     * 
     * Redraws the preview.
     */
    drawPreview();
    /**
     * Function: destroy
     * 
     * Destroys the handler and all its resources and DOM nodes.
     */
    destroy();

}

declare var mxVertexHandler: {
    new (state: mxCellState): mxVertexHandler;
    prototype: mxVertexHandler;
}


//}