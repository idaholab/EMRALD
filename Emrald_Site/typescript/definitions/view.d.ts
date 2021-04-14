// Copyright 2021 Battelle Energy Alliance

/// <reference path="model.d.ts" />

//declare module mxGraphModule {



interface mxGraph extends mxEventSource {
    mouseListeners : mxEventSource[];
    isMouseDown: boolean;
    model: mxGraphModel;
    view: mxGraphView;
    stylesheet: mxStylesheet;
    selectionModel: mxGraphSelectionModel;
    cellEditor: mxCellEditor;
    cellRenderer: mxCellRenderer;
    multiplicities: mxMultiplicity[];
    renderHint: string;
    dialect: string;
    gridSize: number;
    gridEnabled: boolean;
    portsEnabled: boolean;
    nativeDblClickEnabled: boolean;
    doubleTapEnabled: boolean;
    doubleTapTimeout: number;
    doubleTapTolerance: number;
    lastTouchX: number;
    lastTouchY: number;
    lastTouchTime: number;
    tapAndHoldEnabled: boolean;
    tapAndHoldDelay: number;
    tapAndHoldInProgress: boolean;
    tapAndHoldValid: boolean;
    initialTouchX: number;
    initialTouchY: number;
    tolerance: number;
    defaultOverlap: number;
    defaultParent: string;
    alternateEdgeStyle: string;
    backgroundImage: mxImage;
    pageVisible: boolean;
    pageBreaksVisible: boolean;
    pageBreakColor: string;
    pageBreakDashed: boolean;
    minPageBreakDist: number;
    preferPageSize: boolean;
    pageFormat: string; // ?
    pageScale: number;
    enabled: boolean;
    escapeEnabled: boolean;
    invokesStopCellEditing: boolean;
    enterStopsCellEditing: boolean;
    useScrollbarsForPanning: boolean;
    exportEnabled: boolean;
    importEnabled: boolean;
    cellsLocked: boolean;
    cellsCloneable: boolean;
    foldingEnabled: boolean;
    cellsEditable: boolean;
    cellsDeletable: boolean;
    cellsMovable: boolean;
    edgeLabelsMovable: boolean;
    vertexLabelsMovable: boolean;
    dropEnabled: boolean;
    splitEnabled: boolean;
    cellsResizable: boolean;
    cellsBendable: boolean;
    cellsSelectable: boolean;
    cellsDisconnectable: boolean;
    autoSizeCells: boolean;
    autoSizeCellsOnAdd: boolean;
    autoScroll: boolean;
    timerAutoScroll: boolean;
    allowAutoPanning: boolean;
    ignoreScrollbars: boolean;
    autoExtend: boolean;
    maximumGraphBounds: mxRectangle;
    minimumGraphSize: mxRectangle;
    minimumContainerSize: mxRectangle;
    maximumContainerSize: mxRectangle;
    resizeContainer: boolean;
    border: number;
    keepEdgesInForeground: boolean;
    keepEdgesInBackground: boolean;
    allowNegativeCoordinates: boolean;
    constrainChildren: boolean;
    constrainChildrenOnResize: boolean;
    extendParents: boolean;
    extendParentsOnAdd: boolean;
    extendParentsOnMove: boolean;
    recursiveResize: boolean;
    collapseToPreferredSize: boolean;
    zoomFactor: number;
    keepSelectionVisibleOnZoom: boolean;
    centerZoom: boolean;
    resetViewOnRootChange: boolean;
    resetEdgesOnResize: boolean;
    resetEdgesOnMove: boolean;
    resetEdgesOnConnect: boolean;
    allowLoops: boolean;
    defaultLoopStyle: mxEdgeStyle; 
    multigraph: boolean;
    connectableEdges: boolean;
    allowDanglingEdges: boolean;
    cloneInvalidEdges: boolean;
    disconnectOnMove: boolean;
    labelsVisible: boolean;
    htmlLabels: boolean;
    swimlaneSelectionEnabled: boolean;
    swimlaneNesting: boolean;
    swimlaneIndicatorColorAttribute: string;
    imageBundles: Array<mxImage>; 
    minFitScale: number;
    maxFitScale: number;
    panDx: number;
    panDy: number;
    collapsedImage: mxImage;
    expandedImage: mxImage;
    warningImage: mxImage;
    alreadyConnectedResource: string;
    containsValidationErrorsResource: string;
    collapseExpandResource: string;

    init(container: Element): boolean; 
    createHandlers(container: Element);
    createSelectionModel(): mxGraphSelectionModel; ///////////
    createStylesheet(): mxStylesheet;
    createGraphView(): mxGraphView;
    createCellRenderer(): mxCellRenderer;
    createCellEditor(): mxCellEditor;
    getModel(): mxGraphModel;
    getView(): mxGraphView;
    getStylesheet(): mxStylesheet;
    setStylesheet(stylesheet: mxStylesheet);
    getSelectionModel(): mxGraphSelectionModel;
    setSelectionModel(selectionModel: mxGraphSelectionModel);
    getSelectionCellsForChanges(changes: any[]): mxCell[]; // 
    graphModelChanged(changes: any[]);                     // changes: type?
    getRemovedCellsForChanges(changes: any[]): any[];      // return mxCell[]?
    processChange(change: Object);
    removeStateForCell(cell: mxCell);
    addCellOverlay(cell: mxCell, overlay: mxCellOverlay): mxCellOverlay;
    getCellOverlays(cell: mxCell): mxCellOverlay[]; 
    removeCellOverlay(cell: mxCell, overlay?: mxCellOverlay): mxCellOverlay;
    removeCellOverlays(cell: mxCell): mxCellOverlay[]; 
    clearCellOverlays(cell?: mxCell);
    setCellWarning(cell: mxCell, warning: string, img?: mxImage, isSelect?: boolean): mxCellOverlay;

    startEditing(evt?: Event);                              
    startEditingAtCell(cell: mxCell, evt?: Event);         
    getEditingValue(cell: mxCell, evt?: Event): string;             
    stopEditing(cancel: boolean);
    labelChanged(cell: mxCell, value: string, evt?: Event): mxCell; 
    cellLabelChanged(cell: mxCell, value: string, autoSize: boolean);

    escape(evt: Event);
    click(me: mxMouseEvent);
    dblClick(evt: Event, cell?: mxCell);
    tapAndHold(me: mxMouseEvent, state?: mxCellState); 
    scrollPointToVisible(x: number, y: number, extend: boolean, border: number); 
    createPanningManager(): mxPanningManager;
    getBorderSizes(): mxRectangle;
    getPreferredPageSize(bounds: any, width: number, height: number): mxRectangle; // bounds??
    sizeDidChange();
    doResizeContainer(width: number, height: number);
    updatePageBreaks(visible: boolean, width: number, height: number);

    getCellStyle(cell: mxCell): any[]; 
    postProcessCellStyle(style: any): any; // style: Object?
    setCellStyle(style: string, cells: mxCell[]);
    toggleCellStyle(key: string, defaultValue?: boolean, cells?: mxCell);
    toggleCellStyles(key: string, defaultValue?: boolean, cells?: mxCell[]);
    setCellStyles(key: string, value: string, cells?: mxCell[]);
    toggleCellStyleFlags(key: string, flag: number, cells?: mxCell[]);
    setCellStyleFlags(key: string, flag: number, value: boolean, cells?: mxCell[]);

    alignCells(align: any, cells: mxCell[], param?: number): mxCell[]; // align: string?
    flipEdge(edge: mxCell): mxCell;
    addImageBundle(bundle: mxImageBundle);
    removeImageBundle(bundle: mxImageBundle); 
    getImageFromBundles(key: mxCellState): any; // return string?

    orderCells(back: boolean, cells: mxCell[]): mxCell[];
    cellsOrdered(cells: mxCell[], back: boolean);

    groupCells(group: mxCell, border?: number, cells?: mxCell[]): Array<any>; // return mxCell[]?
    getCellsForGroup(cells: mxCell[]): mxCell[]; 
    getBoundsForGroup(group: mxCell , children: mxCell[], border: number): mxRectangle; // return mxRectangle?
    createGroupCell(cells: mxCell[]): mxCell;
    ungroupCells(cells: mxCell[]): any[]; // return mxCell[]?
    removeCellsFromParent(cells: mxCell[]): mxCell[];
    updateGroupBounds(cells: mxCell[], border?: number, moveGroup?: boolean): mxCell[];

    cloneCells(cells: mxCell[], allowInvalidEdges?: boolean): any[]; // return mxCell[]?
    insertVertex(parent: mxCell, id?: string, value?: Object, x?: number, y?: number, width?: number, height?: number,
        style?: string, relative?: boolean): mxCell;
    createVertex(parent: mxCell, id?: string, value?: Object, x?: number, y?: number, width?: number, height?: number,
        style?: string, relative?: boolean): mxCell;
    insertEdge(parent: mxCell, id?: string, value?: Object, source?: mxCell, target?: mxCell, style?: string): mxCell;
    createEdge(parent: mxCell, id?: string, value?: Object, source?: mxCell, target?: mxCell, style?: string): mxCell;
    addEdge(edge: mxCell, parent: mxCell, source?: mxCell, target?: mxCell, index?: any): mxCell[];       // 
    addCell(cell: mxCell, parent?: mxCell, index?: any, source?: mxCell, target?: mxCell): mxCell;         // index: number?
    addCells(cells: mxCell[], parent: mxCell, index?: any, source?: mxCell, target?: mxCell): mxCell[];   // 
    cellsAdded(cells: mxCell[], parent: mxCell, index?: number, source?: mxCell, target?: mxCell, absolute?: boolean, constrain?: boolean);
    autoSizeCell(cell: mxCell[], recurse?: boolean);
    removeCells(cells: mxCell[], includeEdges?: boolean): mxCell[];
    cellsRemoved(cells: mxCell[]);
    splitEdge(edge: mxCell, cells: mxCell[], newEdge: mxCell, dx?: number, dy?: number): mxCell; // newEdge?

    toggleCells(show: boolean, cells: mxCell[], includeEdges?: boolean): mxCell[];
    cellsToggled(cells: mxCell[], show: boolean);

    foldCells(collapse: boolean, recurse?: boolean, cells?: mxCell[], checkFoldable?: boolean): mxCell[];
    cellsFolded(cells: mxCell[], collapse: boolean, recurse: boolean, checkFoldable?: boolean);
    swapBounds(cell: mxCell, willCollapse: boolean);
    updateAlternateBounds(cell: mxCell, geo: mxGeometry, willCollapse: boolean);
    addAllEdges(cells: mxCell[]): mxCell[];
    getAllEdges(cells: mxCell[]): mxCell[]; // mxCell[]?

    updateCellSize(cell: mxCell, ignoreChildren?: boolean): mxCell;
    cellSizeUpdated(cell: mxCell, ignoreChildren?: boolean);
    getPreferredSizeForCell(cell: mxCell): mxRectangle;
    resizeCell(cell: mxCell, bounds: mxRectangle, recurse?: boolean): mxCell;
    resizeCells(cell: mxCell[], bounds: mxRectangle[], recurse?: boolean): mxCell[]; // bounds: array of mxRectangle
    cellsResized(cells: mxCell[], bounds: mxRectangle[], recurse?: boolean);         //
    cellResized(cell: mxCell, bounds: mxRectangle, ignoreRelative: boolean, recurse?: boolean);
    resizeChildCells(cell: mxCell, newGeo: mxGeometry);
    constrainChildCells(cell: mxCell);
    scaleCell(cell: mxCell, dx: number, dy: number, recurse: boolean);
    extendParent(cell: mxCell);

    importCells(cells: mxCell[], dx: number, dy: number, target?: mxCell, evt?: Event): mxCell[];
    moveCells(cells: mxCell[], dx: number, dy: number, clone: boolean, target: mxCell, evt: Event): mxCell[];
    cellsMoved(cells: mxCell[], dx: number, dy: number, disconnect: boolean, constrain: boolean, extend: boolean);
    translateCell(cell: mxCell[], dx: number, dy: number);
    getCellContainmentArea(cell: mxCell): mxRectangle;
    getMaximumGraphBounds: () => mxRectangle; /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constrainChild(cell: mxCell);
    resetEdges(cells: mxCell[]);
    resetEdge(edge: mxCell): mxCell;
    getAllConnectionConstraints(terminal: mxCellState, source: boolean): mxConnectionConstraint[]; 
    getConnectionConstraint(edge: mxCellState, terminal: mxCellState, source: boolean): mxConnectionConstraint;
    setConnectionConstraint(edge: mxCell, terminal: mxCell, source: boolean, constraint?: mxConnectionConstraint);
    getConnectionPoint(vertex: mxCellState, constraint: mxConnectionConstraint): mxPoint;
    connectCell(edge: mxCell, terminal: mxCell, source: boolean, constraint?: mxConnectionConstraint): mxCell;
    cellConnected(edge: mxCell, terminal: mxCell, source: boolean, constraint: mxConnectionConstraint);
    disconnectGraph(cells: mxCell[]);

    getCurrentRoot(): mxCell;
    getTranslateForRoot(cell: mxCell): any; // returns null
    isPort(cell: mxCell): boolean;
    getTerminalForPort(cell: mxCell, source?: any): mxCell; // source: type?
    getChildOffsetForCell(cell: mxCell): any; // returns null
    enterGroup(cell?: mxCell);
    exitGroup();
    home();
    isValidRoot(cell: mxCell): boolean;

    getGraphBounds(): mxRectangle;
    getCellBounds(cell: mxCell, includeEdges?: boolean, includeDescendants?: boolean): mxRectangle;
    getBoundingBoxFromGeometry(cells: mxCell[], includeEdges: boolean): mxRectangle;
    refresh(cell?: mxCell);
    snap(value: number): number;
    panGraph(dx: number, dy: number);
    zoomIn();
    zoomOut();
    zoomActual();
    zoomTo(scale: number, center?: boolean);
    zoom(factor: number, center?: boolean);
    zoomToRect(rect: mxRectangle);
    fit(border?: number, keepOrigin?: boolean): number;
    scrollCellToVisible(cell: mxCell, center?: boolean);
    scrollRectToVisible(rect: mxRectangle): boolean;
    getCellGeometry(cell: mxCell): mxGeometry;
    isCellVisible(cell: mxCell): boolean;
    isCellCollapsed(cell: mxCell): boolean;
    isCellConnectable(cell: mxCell): boolean;
    isOrthogonal(edge: mxCellState): boolean;
    isLoop(state: mxCellState): boolean;
    isCloneEvent(evt: Event): boolean;
    isToggleEvent(evt: Event): boolean;
    isGridEnabledEvent(evt: Event): boolean;
    isConstrainedEvent(evt: Event): boolean;

    validationAlert(message: string);
    isEdgeValid(edge: mxCell, source: mxCell, target:mxCell): boolean;
    getEdgeValidationError(edge: mxCell, source: mxCell, target: mxCell): string;
    validateEdge(edge: mxCell, source: mxCell, target: mxCell): any; // returns null
    validateGraph(cell?: mxCell, context?: Object): string; 
    getCellValidationError(cell: mxCell): string;
    validateCell(cell: mxCell, context: Object): any; // returns null

    getBackgroundImage(): mxImage;
    setBackgroundImage(image: mxImage);
    getFoldingImage(state: mxCellState): mxImage;
    convertValueToString(cell: mxCell): string;
    getLabel(cell: mxCell): string;
    isHtmlLabel(cell: mxCell): boolean;
    isHtmlLabels(): boolean;
    setHtmlLabels(value: boolean);
    isWrapping(cell: mxCell): boolean;
    isLabelClipped(cell: mxCell): boolean;
    getTooltip(state: mxCellState, node: Element, x: number, y: number): any; // return string or DOM
    getTooltipForCell(cell: mxCell): any; // return string or DOM
    getCursorForMouseEvent(me : mxMouseEvent): any; // returns null
    getCursorForCell(cell: mxCell): any; // returns null
    getStartSize(swimlane: mxCell): mxRectangle;
    getImage(state: mxCellState): string; // Returns the image URL for the given cell state.
    getVerticalAlign(state: mxCellState): string; // returns the value stored under <mxConstants.STYLE_VERTICAL_ALIGN>
    getIndicatorColor(state: mxCellState): string; // returns the value stored under <mxConstants.STYLE_INDICATOR_COLOR>
    getIndicatorGradientColor(state: mxCellState): string; // returns the value stored under <mxConstants.STYLE_INDICATOR_GRADIENTCOLOR>
    getIndicatorShape(state: mxCellState): string; // returns the value stored under <mxConstants.STYLE_INDICATOR_SHAPE>
    getIndicatorImage(state: mxCellState): string; // returns the value stored under <mxConstants.STYLE_INDICATOR_IMAGE>
    getBorder(): number;
    setBorder(value: number);
    isSwimlane(cell: mxCell): boolean;

    isResizeContainer(): boolean;
    setResizeContainer(value: boolean);
    isEnabled(): boolean;
    setEnabled(value: boolean);
    isEscapeEnabled(): boolean;
    setEscapeEnabled(value: boolean);
    isInvokesStopCellEditing(): boolean;
    setInvokesStopCellEditing(value: boolean);
    isEnterStopsCellEditing(): boolean;
    setEnterStopsCellEditing(value: boolean);
    isCellLocked(cell: mxCell): boolean;
    isCellsLocked(): boolean;
    setCellsLocked(value: boolean);
    getCloneableCells(cells: mxCell): boolean;
    isCellCloneable(cell?: mxCell): boolean;
    isCellsCloneable(): boolean;
    setCellsCloneable(value: boolean);
    getExportableCells(cells: mxCell[]): mxCell[];
    canExportCell(cell: mxCell): boolean;
    getImportableCells(cells: mxCell[]): mxCell[];
    canImportCell(cell: mxCell): boolean;
    isCellSelectable(cell: mxCell): boolean;
    isCellsSelectable(): boolean;
    setCellsSelectable(value: boolean);
    getDeletableCells(cells: mxCell[]): mxCell[];
    isCellDeletable(cell: mxCell): boolean;
    isCellsDeletable(): boolean;
    setCellsDeletable(value : boolean);
    isLabelMovable(cell: mxCell): boolean;
    isCellRotatable(cell: mxCell): boolean;
    getMovableCells(cells: mxCell[]): mxCell[];
    isCellMovable(cell: mxCell): boolean;
    isCellsMovable(): boolean;
    setCellsMovable(value: boolean);
    isGridEnabled(): boolean;
    setGridEnabled(value: boolean);
    isPortsEnabled(): boolean;
    setPortsEnabled(value: boolean);
    getGridSize(): number;
    setGridSize(value: number);
    getTolerance(): number;
    setTolerance(value: number);
    isVertexLabelsMovable(): boolean;
    setVertexLabelsMovable(value: boolean);
    isEdgeLabelsMovable(): boolean;
    setEdgeLabelsMovable(value: boolean);
    isSwimlaneNesting(): boolean;
    setSwimlaneNesting(value: boolean);
    isSwimlaneSelectionEnabled(): boolean;
    setSwimlaneSelectionEnabled(value: boolean);
    isMultigraph(): boolean;
    setMultigraph(value: boolean);
    isAllowLoops(): boolean;
    setAllowDanglingEdges(value: boolean);
    isAllowDanglingEdges(): boolean;
    setConnectableEdges(value: boolean);
    isConnectableEdges(): boolean;
    setCloneInvalidEdges(value: boolean);
    isCloneInvalidEdges(): boolean;
    setAllowLoops(value: boolean);
    isDisconnectOnMove(): boolean;
    setDisconnectOnMove(value: boolean);
    isDropEnabled(): boolean;
    setDropEnabled(value: boolean);
    isSplitEnabled(): boolean;
    setSplitEnabled(value: boolean);
    isCellResizable(cell: mxCell): boolean;
    isCellsResizable(): boolean;
    setCellsResizable(value: boolean);
    isTerminalPointMovable(cell: mxCell, source: boolean): boolean;
    isCellBendable(cell: mxCell): boolean;
    isCellsBendable(): boolean;
    setCellsBendable(value: boolean);
    isCellEditable(cell: mxCell): boolean;
    isCellsEditable(): boolean;
    setCellsEditable(value: boolean);
    isCellDisconnectable(cell: mxCell, terminal: mxCell, source: boolean): boolean;
    isCellsDisconnectable(): boolean;
    setCellsDisconnectable(value: boolean);
    isValidSource(cell: mxCell): boolean;
    isValidTarget(cell: mxCell): boolean;
    isValidConnection(source: mxCell, target: mxCell): boolean;
    setConnectable(connectable: boolean);
    isConnectable(connectable?: any): boolean; // parameter?.. made it optional: any
    setTooltips(enabled: boolean);
    setPanning(enabled:boolean);
    isEditing(cell: mxCell): boolean;
    isAutoSizeCell(cell: mxCell): boolean;
    isAutoSizeCells(): boolean;
    setAutoSizeCells(value: boolean);
    isExtendParent(cell: mxCell): boolean;
    isExtendParents(): boolean;
    setExtendParents(value: boolean);
    isExtendParentsOnAdd(): boolean;
    setExtendParentsOnAdd(value: boolean);
    isExtendParentsOnMove(): boolean;
    setExtendParentsOnMove(value: boolean);
    isRecursiveResize(): boolean;
    setRecursiveResize(value: boolean);
    isConstrainChild(cell: mxCell): boolean;
    isConstrainChildren(): boolean;
    setConstrainChildrenOnResize(value: boolean);
    isConstrainChildrenOnResize(): boolean;
    setConstrainChildren(value: boolean);
    isAllowNegativeCoordinates(): boolean;
    setAllowNegativeCoordinates(value: boolean);
    getOverlap(cell: mxCell): number;
    isAllowOverlapParent(cell: mxCell): boolean;
    getFoldableCells(cells: mxCell[], collapse?: any): mxCell[];  // what is 
    isCellFoldable(cell: mxCell, collapse?: any): boolean;        // collapse?
    isValidDropTarget(cell: mxCell, cells: mxCell[], evt: Event): boolean;
    isSplitTarget(target: mxCell, cells: mxCell[], evt: Event): boolean;
    getDropTarget(cells: mxCell[], evt: Event, cell: mxCell): mxCell;
    getDefaultParent(): mxCell;
    setDefaultParent(cell: mxCell);
    getSwimlane(cell: mxCell): mxCell;
    getSwimlaneAt(x: number, y: number, parent: mxCell): mxCell;
    getCellAt(x: number, y: number, parent: mxCell, vertices?: boolean, edges?: boolean): mxCell;
    intersects(state: mxCellState, x: number, y: number): mxCell;
    hitsSwimlaneContent(swimlane: mxCell, x: number, y: number): boolean;
    getChildVertices(parent: mxCell): mxCell[];
    getChildEdges(parent: mxCell): mxCell[];
    getChildCells(parent: mxCell, vertices?: boolean, edges?: boolean): mxCell[];
    getConnections(cell: mxCell, parent?: mxCell): mxCell[];
    getIncomingEdges(cell: mxCell, parent?: mxCell): mxCell[];
    getOutgoingEdges(cell: mxCell, parent?: mxCell): mxCell[];
    getEdges(cell: mxCell, parent?: mxCell, incoming?: boolean, outgoing?: boolean, includeLoops?: boolean, recurse?: boolean): mxCell[];
    isValidAncestor(cell: mxCell, parent: mxCell, recurse: boolean): boolean;
    getOpposites(edges: mxCell[], terminal: mxCell, sources?: boolean, targets?: boolean): any[];
    getEdgesBetween(source: mxCell, target: mxCell, directed?: boolean): any[]; // parameter
    getPointForEvent(evt: Event, addOffset?: boolean): mxPoint;
    getCells(x: number, y: number, width: number, height: number, parent: mxCell, result?: any[]): any[]; // "Optional array to store the result in."
    getCellsBeyond(x0: number, y0: number, parent?: mxCell, rightHalfpane?: boolean, bottomHalfpane?: boolean): any[];
    findTreeRoots(parent: mxCell, isolate?: boolean, invert?: boolean): mxCell[];
    traverse(vertex: mxCell, directed?: boolean, func?: any, edge?: mxCell, visited?: mxCell[]);

    isCellSelected(cell: mxCell): boolean;
    isSelectionEmpty(): boolean;
    clearSelection(): any;
    getSelectionCount(): number;
    getSelectionCell(): mxCell;
    getSelectionCells(): mxCell[];
    setSelectionCell(cell: mxCell);
    setSelectionCells(cells: mxCell[]);
    addSelectionCell(cell: mxCell);
    addSelectionCells(cell: mxCell[]);
    removeSelectionCell(cell: mxCell);
    removeSelectionCells(cells: mxCell[]);
    selectRegion(rect: mxRectangle, evt: Event): mxCell[];
    selectNextCell();
    selectPreviousCell();
    selectParentCell();
    selectChildCell();
    selectCell(isNext: boolean, isParent: boolean, isChild: boolean);
    selectAll(parent?: mxCell);
    selectVertices(parent: mxCell);
    selectEdges(parent: mxCell);
    selectCells(vertices: boolean, edges: boolean, parent?: mxCell);
    selectCellForEvent(cell: mxCell, evt: Event);
    selectCellsForEvent(cells: mxCell[], evt: Event);

    createHandler(state: mxCellState): any; // returns new <mxEdgeHandler> of the corresponding cell is an edge, otherwise it returns an <mxVertexHandler>. 

    addMouseListener(listener: any); // The listener must implement the mouseDown, mouseMove, mouseUp methods as shown in <mxMouseEvent> class
    removeMouseListener(listener: any);
    updateMouseEvent(me: mxMouseEvent);
    getStateForTouchEvent(evt: Event): mxCellState;
    isEventIgnored(evtName: string, me: mxMouseEvent, sender?: any): boolean; // sender?
    isSyntheticEventIgnored(evtName: string, me: mxMouseEvent, sender?: any): boolean;
    isEventSourceIgnored(evtName: string, me: mxMouseEvent): boolean;
    fireMouseEvent(evtName: string, me: mxMouseEvent, sender?: any);
    consumeMouseEvent(evtName: string, me: mxMouseEvent, sender?: any);
    fireGestureEvent(evt: Event, cell?: mxCell);
    destroy();

}

declare var mxGraph: {
    new (container?: HTMLElement, model?: mxGraphModel, renderHint?:boolean, stylesheet?: string): mxGraph;
    prototype: mxGraph;
  }

interface mxGraphView extends mxEventSource {
    doneResource: string;
    updatingDocumentResource: string;
    allowEval: boolean;
    captureDocumentGesture: boolean;
    optimizeVmlReflows: boolean;
    rendering:boolean;
    graph: any; // set to null
    currentRoot: mxCell; // set to null
    graphBounds: mxRectangle; // null
    scale: number;
    translate: mxPoint; // null
    updateStyle: boolean;
    lastNode: Element; // DOM
    lastHtmlNode: Element;
    lastForegroundNode: Element;
    lastForegroundHtmlNode: Element;
    getGraphBounds(): mxRectangle;
    setGraphBounds(value: mxRectangle);
    getBounds(cells: mxCell[]): mxRectangle;
    setCurrentRoot(root: mxCell): mxCell;
    scaleAndTranslate(scale: number, dx: number, dy: number);
    getScale(): number;
    setScale(value: number);
    getTranslate(): mxPoint;
    setTranslate(dx: number, dy: number);
    refresh();
    revalidate();
    clear(cell?: mxCell, force?: boolean, recurse?: boolean);
    invalidate(cell?: mxCell, recurse?: boolean, includeEdges?: boolean);
    validate(cell: mxCell);
    getEmptyBounds(): mxRectangle;
    getBoundingBox(state: mxCellState, recurse?: boolean): mxRectangle;
    createBackgroundPageShape(bounds: mxRectangle): mxRectangleShape;
    validateBackground();
    validateBackgroundImage();
    validateBackgroundPage();
    getBackgroundPageBounds(): mxRectangle;
    redrawBackgroundImage(backgroundImage: mxImageShape, bg: mxImage);
    validateCell(cell: mxCell, visible?: boolean): mxCell;
    validateCellState(cell: mxCell, recurse?: boolean): mxCellState;
    updateCellState(state: mxCellState);
    updateVertexState(state: mxCellState, geo: mxGeometry);
    updateEdgeState(state: mxCellState, geo: mxGeometry);
    updateVertexLabelOffset(state: mxCellState);
    resetValidationState();
    stateValidated(state: mxCellState);
    updateFixedTerminalPoints(edge: mxCellState, source: mxCellState, target: mxCellState);
    updateFixedTerminalPoint(edge: mxCellState, terminal: mxCellState, source: boolean, constraint: mxConnectionConstraint);
    updatePoints(edge: mxCellState, points: mxPoint[], source: mxCellState, target: mxCellState); 
    transformControlPoint(state: mxCellState, pt: mxPoint): mxPoint;
    getEdgeStyle(edge: mxCellState, points: mxPoint[], source: mxCellState, target: mxCellState): string;
    updateFloatingTerminalPoints(state: mxCellState, source: mxCellState, target: mxCellState);
    updateFloatingTerminalPoint(edge: mxCellState, start: mxCellState, end: mxCellState, source: boolean);
    getTerminalPort(state: mxCellState, terminal: mxCellState, source: boolean): mxCellState;
    getPerimeterPoint(terminal: mxCellState, next: mxPoint, orthogonal: boolean, border?: boolean): mxPoint;
    getRoutingCenterX(state: mxCellState): number;
    getRoutingCenterY(state: mxCellState): number;
    getPerimeterBounds(terminal: mxCellState, border: number): mxRectangle; // or number?
    getPerimeterFunction(state: mxCellState): any; // return string or function or null
    getNextPoint(edge: mxCellState, opposite: mxCellState, source: boolean): mxPoint;
    getVisibleTerminal(edge: mxCell, source: boolean): mxCellState;
    updateEdgeBounds(state: mxCellState);
    getPoint(state: mxCellState, geometry: mxGeometry): mxPoint;
    getRelativePoint(edgeState: mxCellState, x: number, y: number): mxPoint;
    updateEdgeLabelOffset(state: mxCellState);
    getState(cell: mxCell, create?: boolean): mxCellState;
    isRendering(): boolean;
    setRendering(value: boolean);
    isAllowEval(): boolean;
    setAllowEval(value: boolean);
    getStates(): any; // ?
    setStates(value: any); // ?
    getCellStates(cells: any[]): any[]; // mxCell[] and mxCellStates[] 
    removeState(cell: mxCell): mxCellState;
    createState(cell: mxCell): mxCellState;
    getCanvas(): Element;
    getBackgroundPane(): Element;
    getDrawPane(): Element;
    getOverlayPane(): Element;
    isContainerEvent(evt: Event): boolean;
    isScrollEvent(evt: Event): boolean;
    init();
    installListeners();
    createHtml();
    updateHtmlCanvasSize(width: number, height: number);
    createHtmlPane(width: number, height: number): Element;
    createVml();
    createVmlPane(width: number, height: number): Element;
    createSvg();
    updateContainerStyle(container: mxRectangle);
    destroy();

}

declare var mxGraphView: {
    new (graph): mxGraphView;
    prototype: mxGraphView
  }

interface mxCurrentRootChange { // this was at the end of mxGraphView.js. 

    execute();

}

declare var mxCurrentRootChange: {
    new (view, root): mxCurrentRootChange;
    prototype: mxCurrentRootChange;
}

interface mxCellRenderer {

    defaultEdgeShape: mxConnector;
    defaultVertexShape: mxRectangleShape;
    defaultTextShape: mxText;
    legacyControlPosition: boolean;
    defaultShapes: Object;
    registerShape(key: string, shape: mxShape); // not a .prototype?
    initializeShape(state: mxCellState);
    createShape(state: mxCellState);
    createIndicatorShape(state: mxCellState);
    getShape(name: any); // string?
    getShapeConstructor(state: mxCellState): mxShape; // ?
    configureShape(state: mxCellState);
    postConfigureShape(state: mxCellState);
    resolveColor(state: mxCellState, field: any, key: number); // field: number?
    getLabelValue(state: mxCellState): string;
    createLabel(state: mxCellState, value: any); // value: any?
    initializeLabel(state: mxCellState);
    createCellOverlays(state: mxCellState);
    initializeOverlay(state: mxCellState, overlay: mxImageShape);
    installCellOverlayListeners(state: mxCellState, overlay: mxCellOverlay, shape: mxShape);
    createControl(state: mxCellState);
    initControl(state: mxCellState, control: mxShape, handleEvents: boolean, clickHandler?: boolean);
    isShapeEvent(state: mxCellState, evt: Event): boolean;
    isLabelEvent(state: mxCellState, evt: Event): boolean;
    installListeners(state: mxCellState);
    redrawLabel(state: mxCellState, forced: boolean);
    getTextScale(state: mxCellState): number;
    getLabelBounds(state: mxCellState): mxRectangle;
    rotateLabelBounds(state: mxCellState, bounds: mxRectangle);
    redrawCellOverlays(state: mxCellState, forced: boolean);
    redrawControl(state: mxCellState, forced: boolean);
    getControlBounds(state: mxCellState, w: number, h: number): mxRectangle;
    insertStateAfter(state: mxCellState, node: Element, htmlNode: Element): Element[]; 
    getShapesForState(state: mxCellState): mxShape[]; 
    redraw(state: mxCellState, force?: boolean, rendering?: boolean);
    redrawShape(state: mxCellState, force?: boolean, rendering?: boolean): boolean;
    destroy(state: mxCellState);
    
}

declare var mxCellRenderer: { 
    new (): mxCellRenderer;
    prototype: mxCellRenderer
}


interface mxCellState extends mxRectangle {

    view: mxGraphView;
    cell: mxCell;
    style: any[]; // Contains an array of key, value pairs that represent the style of cell
    invalid: boolean;
    origin: mxPoint;
    absolutePoints: mxPoint;
    absoluteOffset: mxPoint;
    visibleSourceState: any; // Caches the visible source terminal state.
    visibleTargetState: any; // "               "  target "            "
    terminalDistance: number;
    length: number;
    segments: number[];
    shape: mxShape;
    text: mxText;
    getPerimeterBounds(border?: any, bounds?: mxRectangle): mxRectangle; // border?: number?
    setAbsoluteTerminalPoint(point: mxPoint, isSource: boolean);
    setCursor(cursor: any); // any?
    getVisibleTerminal(source: boolean): mxCell;
    getVisibleTerminalState(source: boolean): mxCell;
    setVisibleTerminalState(terminalState: mxCellState, source: boolean);
    destroy();
    clone(): mxCellState;

}

declare var mxCellState: {
    new (view: mxGraphView, cell: mxCell, style: any[]): mxCellState; // any[] = Array of key, value pairs that constitute the style.
    prototype: mxCellState;
}

interface mxCellEditor { 

    graph: mxGraph;
    textarea: any; // Element?
    editingCell: mxCell;
    trigger: Event;
    modified: boolean;
    autoSize: boolean;
    selectText: boolean;
    emptyLabelText: string;
    textNode: string;
    zIndex: number;
    init();
    isEventSource(evt: Event): boolean;
    resize();
    isModified(): boolean;
    setModified(value: boolean);
    focusLost();
    startEditing(cell: mxCell, trigger?: Event);
    isSelectText(): boolean;
    createTextDiv(): Element;
    stopEditing(cancel: boolean);
    getInitialValue(state: mxCellState, trigger: Event): any; // string?
    getCurrentValue(): any; // string?
    isHideLabel(state: mxCellState): boolean;
    getMinimumSize(state: mxCellState): mxRectangle;
    getEditorBounds(state: mxCellState): mxRectangle;
    getEmptyLabelText(cell: mxCell): string;
    getEditingCell(): mxCell;
    destroy();

}

declare var mxCellEditor: {
    new (graph: mxGraph): mxCellEditor;
    prototype: mxCellEditor;
}

interface mxCellOverlay extends mxEventSource {

    image: mxImage;
    tooltip?: string;
    align: any; // string?
    verticalAlign: any; // string?
    offset: mxPoint;
    cursor: any; // string?
    defaultOverlap: number;
    getBounds(state: mxCellState): mxRectangle;
    toString(): string;

} 

declare var mxCellOverlay: {
    new (image: mxImage, tooltip?: string, align?: string, verticalAlign?: string, offset?: mxPoint, cursor?: string): mxCellOverlay;
    prototype: mxCellOverlay;
}

interface mxCellStatePreview {

    graph: mxGraph;
    deltas: mxGraph;
    count: number;
    isEmpty(): boolean;
    moveState(state: mxCellState, dx: number, dy: number, add: boolean, includeEdges: boolean): mxPoint;
    show(visitor: any);                                                                   //  
    translateState(state: mxCellState, dx: number, dy: number);                           // visitor?
    revalidateState(state: mxCellState, dx: number, dy: number, visitor: any);            //
    addEdges(state: mxCellState);

}

declare var mxCellStatePreview: {
    new (graph: mxGraph): mxCellStatePreview;
    prototype: mxCellStatePreview;
}

interface mxConnectionConstraint {

    point: mxPoint;
    perimeter: boolean;

}

declare var mxConnectionConstraint: {
    new (point?: mxPoint, perimeter?: boolean): mxConnectionConstraint;
    prototype: mxConnectionConstraint;
}

interface mxEdgeStyle {

    // points - List of relative control points. 
    // result - Array of < mxPoints > that represent the actual points of the edge.
    EntityRelation(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    Loop(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    ElbowConnector(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    SideToSide(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    TopToBottom(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    SegmentConnector(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);

    orthBuffer: number;
    orthPointsFallBack: boolean;
    dirVectors: number[][]; // [[-1, 0], [ 0, -1 ], ... ]
    wayPoints1: number[][];
    routePatterns: number[][];
    inlineRoutePatterns: number[][];
    vertexSeperations: number[];
    limits: number[][];
    LEFT_MASK: number;
    TOP_MASK: number;
    RIGHT_MASK: number;
    BOTTOM_MASK: number;
    LEFT: number;
    TOP: number;
    RIGHT: number;
    BOTTOM: number;
    SIDE_MASK: number;
    CENTER_MASK: number;
    SOURCE_MASK: number;
    TARGET_MASK: number;
    VERTEX_MASK: number;

    OrthConnector(state: mxCellState, source: mxCellState, target: mxCellState, points: any[], result: any[]);
    getRoutePattern(dir: number[], quad: number, dx: number, dy: number): any[][]; // return?

}

declare var mxEdgeStyle: {
    new (): mxEdgeStyle;
    prototype: mxEdgeStyle;
}

interface mxGraphSelectionModel extends mxEventSource {
    
    doneResource: string;
    updatingSelectionResource: string;
    graph: mxGraph;
    singleSelection: boolean;
    isSingleSelection(): boolean;
    setSingleSelection(singleSelection: boolean);
    isSelected(cell: mxCell): boolean;
    isEmpty(): boolean;
    clear();
    setCell(cell: mxCell);
    setCells(cells: mxCell[]);
    getFirstSelectableCell(cells: mxCell[]): mxCell;
    addCell(cell: mxCell);
    addCells(cells: mxCell[]);
    removeCell(cell: mxCell);
    removeCells(cells: mxCell[]);
    changeSelection(added: any[], removed: any[]); // ?????
    cellAdded(cell: mxCell);
    cellRemoved(cell: mxCell);
    execute();

}

declare var mxGraphSelectionModel: {
    new (graph: mxGraph): mxGraphSelectionModel;
    prototype: mxGraphSelectionModel;
}

interface mxSelectionChange { // at the end of mxGraphSelectionModel.js

    execute();

}

declare var mxSelectionChange:{
    new (selectionModel: mxGraph, added: any[], removed: any[]): mxSelectionChange; // not sure of types
    prototype: mxSelectionChange;
}

interface mxLayoutManager extends mxEventSource {

    graph: mxGraph;
    bubbling: boolean;
    enabled: boolean;
    updateHandler: any; // Holds the function that handles the endUpdate event.
    moveHandler: any; // Holds the function that handles the move event.
    isEnabled(): boolean;
    setEnabled(enabled: boolean);
    isBubbling(): boolean;
    setBubbling(value: boolean);
    getGraph(): mxGraph;
    setGraph(graph: mxGraph);
    getLayout(parent: mxGraph): any; // return null
    beforeUndo(undoableEdit: any); // undoableEdit: type?
    cellsMoved(cells: mxCell[], evt: Event);
    getCellsForChanges(changes: any[]): any[]; //
    getCellsForChange(change: Object): any[];
    layoutCells(cells: mxCell[]);
    executeLayout(layout: mxCell, parent: mxCell); // mxCell?
    destroy();

}

declare var mxLayoutManager: {
    new (graph: mxGraph): mxLayoutManager;
    prototype: mxLayoutManager;
}

interface mxMultiplicity {

    type: string;
    attr?: string;
    value?: string;
    source: boolean;
    min: number;
    max: number;
    validNeighbors: string[];
    validNeighborsAllowed: boolean;
    countError: string;
    typeError: string;
    check(graph: mxGraph, edge: mxCell, source: mxCell, target: mxCell, sourceOut: number, targetIn: number): string;
    checkNeighbors(graph: mxGraph, edge: mxCell, source: mxCell, target: mxCell): boolean;
    checkTerminal(graph: mxGraph, terminal: mxCellState, edge: mxCell): boolean;
    checkType(graph: mxGraph, value: string, type: string, attr: string, attrValue: any);

}

declare var mxMultiplicity: {
    new (source: boolean, type: string, attr?: string, value?: string, min?: number, max?: number, validNeighbors?: string[], countError?: string, typeError?: string, validNeighborsAllowed?: boolean): mxMultiplicity;
    prototype: mxMultiplicity; 
}

interface mxOutline {

    source: mxGraph;
    outline: mxGraph;
    graphRenderHint: string;
    enabled: boolean;
    showViewport: boolean;
    border: number;
    sizerSize: number;
    labelsVisible: boolean;
    updateOnPan: boolean;
    sizerImage?: mxImage;
    suspended: boolean;
    forceVmlHandles: boolean;
    createGraph(container: mxGraph): mxGraph;
    init(container: mxGraph);
    isEnabled(): boolean;
    setEnabled(value: boolean);
    setZoomEnabled(value: boolean);
    refresh();
    createSizer(): mxRectangle;
    getSourceContainerSize(): mxRectangle;
    getOutlineOffset(scale: any); // scale: number? return null
    getSourceGraphBounds(): mxRectangle;
    update(revalidate: boolean);
    mouseDown(sender: any, me: mxMouseEvent);
    mouseMove(sender: any, me: mxMouseEvent);
    getTranslateForEvent(me: mxMouseEvent): mxPoint;
    mouseUp(sender: any, me: mxMouseEvent);
    destroy();

}

declare var mxOutline: {
    new (source: mxGraph, container: Element): mxOutline;
    prototype: mxOutline;
}

interface mxPerimeter {

    RectanglePerimeter(bounds: mxRectangle, vertex: mxCellState, next: mxPoint, orthogonal: boolean): mxPoint;
    EllipsePerimeter(bounds: mxRectangle, vertex: mxCellState, next: mxPoint, orthogonal: boolean): mxPoint;
    RhombusPerimeter(bounds: mxRectangle, vertex: mxCellState, next: mxPoint, orthogonal: boolean): mxPoint;
    TrianglePerimeter(bounds: mxRectangle, vertex: mxCellState, next: mxPoint, orthogonal: boolean): mxPoint;
    HexagonPerimeter(bounds: mxRectangle, vertex: mxCellState, next: mxPoint, orthogonal: boolean): mxPoint;

}

declare var mxPerimeter: {
    new (): mxPerimeter;
    prototype: mxPerimeter;
}

interface mxPrintPreview {

    graph: mxGraph;
    pageFormat: mxRectangle;
    scale: number;
    border: number;
    x0: number;
    y0: number;
    autoOrigin: boolean;
    printOverlays: boolean;
    printBackgroundImage: boolean;
    borderColor: string;
    title: string;
    pageSelector: boolean;
    wnd: mxWindow; 
    pageCount: number;
    getWindow(): mxWindow; 
    getDoctype(): string;
    open(css?: string);
    writeHead(doc: any, css: string); // doc: Object?
    createPageSelector(vpages: number, hpages: number): Element;
    renderPage(w: number, h: number, dx: number, dy: number, content: any): Element; // content: any?
    getRoot(): mxCell;
    addGraphFragment(dx: number, dy: number, scale: number, pageNumber: number, div: Element);
    insertBackgroundImage(div: Element, dx: number, dy: number);
    getCoverPages(): any; // return null
    getAppendices(): any; // return null
    print(css?: string);
    close();

}

declare var mxPrintPreview: {
    new (graph: mxGraph, scale?: number, pageFormat?: mxRectangle, border?: number, x0?: number, y0?: number, borderColor?: string, title?: string, pageSelector?: boolean): mxPrintPreview;
    prototype: mxPrintPreview;
}

interface mxSpaceManager extends mxEventSource {

    graph: mxGraph;
    enabled: boolean;
    shiftRightwards: boolean;
    shiftDownwards: boolean;
    extendParents: boolean;
    resizeHandler: any; // Holds the function that handles the move event
    foldHandler: any; // Holds the function that handles the fold event.
    isCellIgnored(cell: mxCell): boolean;
    isCellShiftable(cell: mxCell): boolean;
    isEnabled(): boolean;
    setEnabled(value: boolean);
    isShiftRightwards(): boolean;
    setShiftRightwards(value: boolean);
    isShiftDownwards(): boolean;
    setShiftDownwards(value: boolean);
    isExtendParents(): boolean;
    setExtendParents(value: boolean);
    getGraph(): mxGraph;
    setGraph(graph: mxGraph);
    cellsResized(cells: mxCell[]);
    cellResized(cell: mxCell);
    shiftCell(cell: mxCell[], dx: number, dy: number, Ox0: number, y0: number, right: number, bottom: number, fx: number, fy: number, extendParent: boolean);
    getCellsToShift(state: mxCellState): any[];
    destroy();
    
}

declare var mxSpaceManager: {
    new (graph: mxGraph, shiftRightwards?: boolean, shiftDownwards?: boolean, extendParents?: boolean): mxSpaceManager; 
    prototype: mxSpaceManager;
}

interface mxStyleRegistry {

    values: any[]; // "Maps from strings to objects."
    putValue(name: string, obj: any);
    getValue(name: string): any;
    getName(value: any): string;
        
}

declare var mxStyleRegistry: {
    new (): mxStyleRegistry;
    prototype: mxStyleRegistry;
}

interface mxStylesheet {

    styles: any; // array?
    createDefaultVertexStyle(): Object;
    createDefaultEdgeStyle(): Object;
    putDefaultVertexStyle(style: Object);
    putDefaultEdgeStyle(style: Object);
    getDefaultVertexStyle(): Object;
    getDefaultEdgeStyle(): Object;
    putCellStyle(name: string, style: Object);
    getCellStyle(name: string, defaultStyle?: Object);

}

declare var mxStylesheet: {
    new (): mxStylesheet;
    prototype: mxStylesheet;
}

interface mxSwimlaneManager extends mxEventSource {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph: mxGraph;
    /**
     * Variable: enabled
     * 
     * Specifies if event handling is enabled. Default is true.
     */
    enabled: boolean;
    /**
     * Variable: horizontal
     * 
     * Specifies the orientation of the swimlanes. Default is true.
     */
    horizontal: boolean;
    /**
     * Variable: addEnabled
     * 
     * Specifies if newly added cells should be resized to match the size of their
     * existing siblings. Default is true.
     */
    addEnabled:  boolean;
    /**
     * Variable: resizeEnabled
     * 
     * Specifies if resizing of swimlanes should be handled. Default is true.
     */
    resizeEnabled: boolean;
    /**
     * Variable: moveHandler
     * 
     * Holds the function that handles the move event.
     */
    addHandler: any;
    /**
     * Variable: moveHandler
     * 
     * Holds the function that handles the move event.
     */
    resizeHandler: any;
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
    setEnabled(value: boolean);
    /**
     * Function: isHorizontal
     * 
     * Returns <horizontal>.
     */
    isHorizontal(): boolean;
    /**
     * Function: setHorizontal
     * 
     * Sets <horizontal>.
     */
    setHorizontal(value: boolean);
    /**
     * Function: isAddEnabled
     * 
     * Returns <addEnabled>.
     */
    isAddEnabled(): boolean;
    /**
     * Function: setAddEnabled
     * 
     * Sets <addEnabled>.
     */
    setAddEnabled(value: boolean);
    /**
     * Function: isResizeEnabled
     * 
     * Returns <resizeEnabled>.
     */
    isResizeEnabled(): boolean;
    /**
     * Function: setResizeEnabled
     * 
     * Sets <resizeEnabled>.
     */
    setResizeEnabled(value: boolean);
    /**
     * Function: getGraph
     * 
     * Returns the graph that this manager operates on.
     */
    getGraph(): mxGraph;
    /**
     * Function: setGraph
     * 
     * Sets the graph that the manager operates on.
     */
    setGraph(graph: mxGraph);
    /**
     * Function: isSwimlaneIgnored
     * 
     * Returns true if the given swimlane should be ignored.
     */
    isSwimlaneIgnored(swimlane: mxCell): boolean;
    /**
     * Function: isCellHorizontal
     * 
     * Returns true if the given cell is horizontal. If the given cell is not a
     * swimlane, then the global orientation is returned.
     */
    isCellHorizontal(cell: mxCell): boolean;
    /**
     * Function: cellsAdded
     * 
     * Called if any cells have been added.
     * 
     * Parameters:
     * 
     * cell - Array of <mxCell[]> that have been added.
     */
    cellsAdded(cells: mxCell[]);
    /**
     * Function: swimlaneAdded
     * 
     * Updates the size of the given swimlane to match that of any existing
     * siblings swimlanes.
     * 
     * Parameters:
     * 
     * swimlane - <mxCell> that represents the new swimlane.
     */
    swimlaneAdded(swimlane: mxCell);
    /**
     * Function: cellsResized
     * 
     * Called if any cells have been resizes. Calls <swimlaneResized> for all
     * swimlanes where <isSwimlaneIgnored> returns false.
     * 
     * Parameters:
     * 
     * cells - Array of <mxCell[]> whose size was changed.
     */
    cellsResized(cells: mxCell[]);
    /**
     * Function: resizeSwimlane
     * 
     * Called from <cellsResized> for all swimlanes that are not ignored to update
     * the size of the siblings and the size of the parent swimlanes, recursively,
     * if <bubbling> is true.
     * 
     * Parameters:
     * 
     * swimlane - <mxCell> whose size has changed.
     */
    resizeSwimlane(swimlane: mxCell, w: number, h: number, parentHorizontal: boolean);
    /**
     * Function: destroy
     * 
     * Removes all handlers from the <graph> and deletes the reference to it.
     */
    destroy();
    
}

declare var mxSwimlaneManager: {
    new (graph: mxGraph, horizontal: boolean, addEnabled: boolean, resizeEnabled: boolean): mxSwimlaneManager;
    prototype: mxSwimlaneManager;
}

interface mxTemporaryCellStates {

    /**
     * Variable: view
     *
     * Holds the width of the rectangle. Default is 0.
     */
    view: number;
    /**
     * Variable: oldStates
     *
     * Holds the height of the rectangle. Default is 0.
     */
    oldStates: number;
    /**
     * Variable: oldBounds
     *
     * Holds the height of the rectangle. Default is 0.
     */
    oldBounds: number;
    /**
     * Variable: oldScale
     *
     * Holds the height of the rectangle. Default is 0.
     */
    oldScale: number;
    /**
     * Function: destroy
     * 
     * Returns the top, left corner as a new <mxPoint>.
     */
    destroy();
    
}

declare var mxTemporaryCellStates: {
    new (view?: number, scale?: number, cells?: mxCell[]): mxTemporaryCellStates;
    prototype: mxTemporaryCellStates;
}

//}

