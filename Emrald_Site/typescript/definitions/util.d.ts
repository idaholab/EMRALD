// Copyright 2021 Battelle Energy Alliance

/// <reference path="view.d.ts" />

//declare module mxGraphModule {

interface mxPoint {
  x: number;
  y: number;
  equals(obj: Object): boolean;
  clone(): mxPoint;

}
  declare var mxPoint: {
  new (x: number, y: number): mxPoint;
  prototype: mxPoint;
}

   interface mxRectangle extends mxPoint {
  width: number;
  height: number;
  setRect(x: number, y: number, w: number, h: number);
  getCenterX(): number;
  getCenterY(): number;
  add(rect: mxRectangle);
  grow(amount: number);
  getPoint(): mxPoint;
  equals(obj: Object): boolean;
}
  declare var mxRectangle: {
  new (x: number, y: number, width: number, height: number): mxRectangle;
  new (): mxRectangle;
  prototype: mxRectangle;
}


interface mxAbstractCanvas2D {
  state: any;
  states: any[];
  path: any[];
  rotateHtml: boolean;
  lastX: number;
  lastY: number;
  moveOp: string;
  lineOp: string;
  quadOp: string;
  curveOp: string;
  closeOp: string;
  pointerEvents: boolean;
  createUrlConverter(): mxUrlConverter;
  reset();
  createState(): Object;
  format(value: number): number;
  addOp();
  rotatePoint(x: number, y: number, theta: number, cx: number, cy: number): mxPoint;
  save();
  restore();
  setLink(link?: any);
  scale(value: number);
  translate(dx: number, dy: number);
  setAlpha(value: number);
  setFillColor(value: string);
  setGradient(color1: string, color2: string, x: number, y: number, w: number, h: number, direction: any, alpha1: any, alpha2: any);
  setStrokeColor(value: string);
  setStrokeWidth(value: number);
  setDashed(value: boolean);
  setDashPattern(value: any);
  setLineCap(value: any);
  setLineJoin(value: any);
  setMiterLimit(value: any);
  setFontColor(value: string);
  setFontBackgroundColor(value: string);
  setFontBorderColor(value: string);
  setFontSize(value: number);
  setFontFamily(value: string);
  setFontStyle(value: string);
  setShadow(enabled: boolean);
  setShadowColor(value: string);
  setShadowAlpha(value: boolean);
  setShadowOffset(dx: number, dy: number);
  begin(x1?: number, y1?: number, x2?: number, y2?: number);
  moveTo(x: number, y: number);
  lineTo(x: number, y: number);
  quadTo(x1: number, y1: number, x2: number, y2: number);
  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number);
  arcTo(rx: number, ry: number, angle: number, largeArcFlag: any, sweepFlag: any, x: number, y: number)
    close(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number);
  end();
  root: any;
  gradients: any[];
  defs: any;
  styleEnabled: boolean;
}

declare var mxAbstractCanvas2D: {
  new (): mxAbstractCanvas2D;
  prototype: mxAbstractCanvas2D;
}

interface mxSvgCanvas2D extends mxAbstractCanvas2D {
  node: Node;
  matchHtmlAlignment: boolean;
  textEnabled: boolean;
  foEnabled: boolean;
  foAltText: string;
  strokeTolerance: number;
  refCount: number;
  blockImagePointerEents: boolean;
  reset();
  createStyle(): string;
  createElement(tagName: string, namespace: any): Element;
  createAlternateContent(fo: any, x: number, y: number, w: number, h: number, str?: string, align?: any, valign?: any, wrap?: any, format?: any, overflow?: any, rotation?: any): Element;
  createGradientId(start: string, end: string, alpha1: string, alpha2: string, direction: mxConstants): string;
  createSvgGradient(start: string, end: string, alpha1: string, alpha2: string, direction: mxConstants): Element;
  addNode(filled: boolean, stroked: boolean);
  updateFill();
  updateStroke();
  updateStrokeAttributes();
  createDashPattern(scale: number): string;
  createTolerance(node: Node): Node;
  createShadow(node: Node): Node;
  setLink(link: string);
  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number);
  begin();
  rect(x: number, y: number, w: number, h: number);
  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number);
  ellipse(x: number, y: number, w: number, h: number);
  image(x: number, y: number, w: number, h: number, src: string, aspect: boolean, flipH: boolean, flipV: boolean);
  createDiv(str: string, align: mxConstants, valign?: any, style?: string, overflow?: string): Element;
  text(x: number, y: number, w: number, h: number, str: string, align: mxConstants, valign: mxConstants, wrap: boolean, format: string, overflow: string, clip: boolean, rotation: number);
  createClip(x: number, y: number, w: number, h: number): Element;
  plainText(x: number, y: number, w: number, h: number, str: string, align: mxConstants, valign: mxConstants, wrap?: boolean, overflow?: string, clip?: boolean, rotation?: number);
  updateFont(node: Node);
  addTextBackground(node: Node, str: string, x: number, y: number, w: number, h: number, align: mxConstants, valign: mxConstants, overflow: string);
  stroke();
  fill();
  fillAndStroke();
}
  declare var mxSvgCanvas2D: {
  new (root: any, styleEnabled: boolean): mxSvgCanvas2D;
  prototype: mxSvgCanvas2D;
}

interface mxVmlCanvas2D extends mxAbstractCanvas2D {
  root: any;
  node: Node;
  textEnabled: boolean;
  moveOp: string;
  lineOp: string;
  curveOp: string;
  closeOp: string;
  rotateHtmlBackground: string;
  createElement(name: string): Document;
  createVmlElement(name: string): Element;
  vmlScale: number;
  addNode(filled: boolean, stroked: boolean);
  createTransparentFill(): Element;
  createFill(): Element;
  createStroke(): Element;
  getVmlDashStyle(): string;
  createShadow(node: Node, filled: boolean, stroked: boolean): Node;
  createShadowFill(): Element;
  createShadowStroke(): Element;
  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number);
  begin(x1: number, y1: number, x2: number, y2: number);
  quadTo(x1: number, y1: number, x2: number, y2: number);
  createRect(nodeName: string, x: number, y: number, w: number, h: number): Element;
  rect(x: number, y: number, w: number, h: number);
  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number);
  ellipse(x: number, y: number, w: number, h: number);
  image(x: number, y: number, w: number, h: number, src: URL, aspect: string, flipH: boolean, flipV: boolean);
  createDiv(str: string, align: string, valign?: any, overflow?: string): Element;
  text(x: number, y: number, w: number, h: number, str: string, align: string, valign: string,
    wrap: boolean, format: string, overflow: string, clip: boolean, rotation: boolean);
  createClip(x: number, y: number, w: number, h: number): Element;
  plainText(x: number, y: number, w: number, h: number, str: string, align: string, valign: string,
    wrap: string, overflow: string, clip: boolean, rotation: boolean);
  updateFont(node);
  addTextBackground(node: Node, str: string, x: number, y: number, w: number, h: number,
    align: string, valign: string, overflow: string);
  stroke();
  fill();
  fillAndStroke();
}
  declare var mxVmlCanvas2D: {
  new (root: any): mxVmlCanvas2D;
  prototype: mxVmlCanvas2D;
}

   interface mxEvent {
  objects: any[];
  addListener();
  removeListener();
  removeAllListeners(element: any);
  addGestureListeners(node: mxCell, startListener: any, moveListener: any, endListener: any);
  removeGestureListeners(node: mxCell, startListener: any, moveListener: any, endListener: any);
  redirectMouseEvents(node: mxCell, graph: mxGraph, state: mxCellState, down?: ICallback, move?: ICallback, up?: ICallback, dblClick?: ICallback);
  release(element: Element);
  addMouseWheelListener(funct: ICallback);
  disableContextMenu();
  getSource(evt: Event): any;
  isConsumed(evt: Event): boolean;
  isTouchEvent(evt: Event): boolean;
  isMouseEvent(evt: Event): boolean;
  isLeftMouseButton(evt: Event): boolean;
  isRightMouseButton(evt: Event): boolean;
  isPopupTrigger(evt: Event): boolean;
  isShiftDown(evt: Event): boolean;
  isAltDown(evt: Event): boolean;
  isControlDown(evt: Event): boolean;
  isMetaDown(evt: Event): boolean;
  getMainEvent(e: any): any;  //return e
  getClientX(e: any): boolean;
  getClientY(e: any): boolean;
  consume(evt: Event, preventDefault?: boolean, stopPropagation?: boolean);
  LABEL_HANDLE: number;
  ROTATION_HANDLE: number;
  MOUSE_DOWN: string;
  MOUSE_MOVE: string;
  MOUSE_UP: string;
  ACTIVATE: string;
  RESIZE_START: string;
  RESIZE: string;
  RESIZE_END: string;
  MOVE_START: string;
  MOVE: string;
  MOVE_END: string;
  PAN_START: string;
  PAN: string;
  PAN_END: string;
  MINIMIZE: string;
  NORMALIZE: string;
  MAXIMIZE: string;
  HIDE: string;
  SHOW: string;
  CLOSE: string;
  DESTROY: string;
  REFRESH: string;
  SIZE: string;
  SELECT: string;
  FIRED: string;
  FIRE_MOUSE_EVENT: string;
  GESTURE: string;
  TAP_AND_HOLD: string;
  GET: string;
  RECEIVE: string;
  CONNECT: string;
  DISCONNECT: string;
  SUSPEND: string;
  RESUME: string;
  MARK: string;
  SESSION: string;
  ROOT: string;
  POST: string;
  OPEN: string;
  SAVE: string;
  BEFORE_ADD_VERTEX: string;
  ADD_VERTEX: string;
  AFTER_ADD_VERTEX: string;
  EXECUTE: string;
  DONE: string;
  EXECUTED: string;
  BEGIN_UPDATE: string;
  START_EDIT: string;
  END_UPDATE: string;
  END_EDIT: string;
  BEFORE_UNDO: string;
  UNDO: string;
  REDO: string;
  CHANGE: string;
  NOTIFY: string;
  LAYOUT_CELLS: string;
  CLICK: string;
  SCALE: string;
  TRANSLATE: string;
  SCALE_AND_TRANSLATE: string;
  UP: string;
  DOWN: string;
  ADD: string;
  REMOVE: string;
  CLEAR: string;
  ADD_CELLS: string;
  CELLS_ADDED: string;
  MOVE_CELLS: string;
  CELLS_MOVED: string;
  RESIZE_CELLS: string;
  CELLS_RESIZED: string;
  TOGGLE_CELLS: string;
  CELLS_TOGGLED: string;
  ORDER_CELLS: string;
  CELLS_ORDERED: string;
  REMOVE_CELLS: string;
  CELLS_REMOVED: string;
  GROUP_CELLS: string;
  UNGROUP_CELLS: string;
  REMOVE_CELLS_FROM_PARENT: string;
  FOLD_CELLS: string;
  CELLS_FOLDED: string;
  ALIGN_CELLS: string;
  LABEL_CHANGED: string;
  CONNECT_CELL: string;
  CELL_CONNECTED: string;
  SPLIT_EDGE: string;
  FLIP_EDGE: string;
  START_EDITING: string;
  ADD_OVERLAY: string;
  REMOVE_OVERLAY: string;
  UPDATE_CELL_SIZE: string;
  ESCAPE: string;
  DOUBLE_CLICK: string;
  START: string;
  RESET: string;
}

interface mxEventObject {
  name: string;
  properties: any[];
  consumed: boolean;
  getName(): string;
  getProperties(): any[];
  getProperty(): any;
  isConsumed(): boolean;
  consume(): boolean;
}
  declare var mxEventObject: {
  new (name: string): mxEventObject;
  prototype: mxEventObject;
}

   interface mxEventSource {
  eventListeners: any[];
  eventsEnabled: boolean;
  eventSource: any;
  isEventsEnabled(): boolean;
  setEventsEnabled(value: boolean);
  getEventSource(): any;
  setEventSource(value: any);
  addListener(name: string, funct: ICallback);
  removeListener(funct: ICallback);
  fireEvent(evt: mxEventObject, sender: any);
}
  declare var mxEventSource: {
  new (eventSource: any): mxEventSource;
  prototype: mxEventSource;
}

  // interface mxAnimation extends mxEventSource {
  //delay: number;
  //thread: any;
  //startAnimation();
  //updateAnimation();
  //stopAnimation();
//}
  declare var mxAnimation: {
  new (delay: number): mxAnimation;
  prototype: mxAnimation;
}

   interface mxAutoSaveManager extends mxEventSource {
  graph: mxGraph;
  autoSaveDelay: number;
  autoSaveThrottle: number;
  autoSaveThreshold: number;
  ignoredChanges: number;
  lastSnapshot: number;
  enabled: boolean;
  changeHandler: ICallback;
  isEnabled(): boolean;
  setEnabled(value: boolean);
  setGraph(graph: mxGraph);
  save();
  graphModelChanged(changes?: any);
  reset();
  destroy();
}
  declare var mxAutoSaveManager: {
  new (graph: mxGraph): mxAutoSaveManager;
  prototype: mxAutoSaveManager;
}

interface mxUtils {
  errorResource: string;
  closeResource: string;
  errorImage: string;
  removeCursors(element: Element);
  getCurrentStyle(): string;
  setPrefixedStyle();
  hasScrollbars(node: Node): boolean;
  bind(scope: any, funct: ICallback): any;
  eval(expr: string): any;
  findNode(node: Node, attr: any, value: any): any;
  findNodeByAttribute(): any;
  getFunctionName(f: Object): string;
  indexOf(array: any[], obj: Object): number;
  remove(obj: Object, array: any[]): Object;
  isNode(value: Object, nodeName: string, attributeName?: any, attributeValue?: any): boolean;
  isAncestorNode(ancestor: Node, child: Node): boolean;
  getChildNodes(node: Node, nodeType?: mxConstants): Node[];
  importNode(doc: any, node: Node, allChildren: boolean): Node;
  createXmlDocument(): XMLDocument;
  parseXml(): any;
  clearSelection(): any;
  getPrettyXml(node: Node, tab?: string, indent?: string): string;
  removeWhitespace(node: Node, before?: boolean);
  htmlEntities(s: string, newline: boolean): string;
  isVml(node: Node): boolean;
  getXml(node: Node, linefeed?: string): string;
  getTextContent(node: Node): string;
  setTextContent(node: Node, text: string);
  getInnerHtml(): string;
  getOuterHtml(): string;
  write(parent: Node, text: string): Node;
  writeln(parent: Node, text: string): Node;
  br(parent: Node, count: number): any;
  button(label: string, funct: ICallback, doc?: Element): Element;
  para(parent: Node, text: string): Element;
  addTransparentBackgroundFilter(node: Node);
  linkAction(parent: Node, text: string, editor: mxEditor, action: string, pad?: number): Element;
  linkInvoke(parent: Node, text: string, editor: mxEditor, functName: string, arg: Object, pad?: number): Element;
  link(parent: Node, text: string, funct: ICallback, pad?: boolean);
  fit(node: Node);
  load(url: URL): mxXmlRequest;
  /**
   * Function: get
   * 
   * Loads the specified URL *asynchronously* and invokes the given functions
   * depending on the request status. Returns the <mxXmlRequest> in use. Both
   * functions take the <mxXmlRequest> as the only parameter. See
   * <mxUtils.load> for a synchronous implementation.
   *
   * Example:
   * 
   * (code)
   * mxUtils.get(url, function(req)
   * {
   *    var node = req.getDocumentElement();
   *    // Process XML DOM...
   * });
   * (end)
   * 
   * So for example, to load a diagram into an existing graph model, the
   * following code is used.
   * 
   * (code)
   * mxUtils.get(url, function(req)
   * {
   *   var node = req.getDocumentElement();
   *   var dec = new mxCodec(node.ownerDocument);
   *   dec.decode(node, graph.getModel());
   * });
   * (end)
   * 
   * Parameters:
   * 
   * url - URL to get the data from.
   * onload - Optional function to execute for a successful response.
   * onerror - Optional function to execute on error.
   */
  getmxXmlRequest(url: URL, onload?: ICallback, onerror?: ICallback): mxXmlRequest;
  post(url: URL, params: any, onload?: ICallback, onerror?: ICallback): mxXmlRequest;
  submit(url: URL, params: any, doc: Element, target: any): mxXmlRequest;
  loadInto(url: URL, doc: any, onload: ICallback);
  getValue(array: any[], key: any, defaultValue: any): any;
  getNumer(array: any[], key: any, defaultValue: any): number;
  getColor(array: any[], key: any, defaultValue: any): mxConstants;
  clone(obj: Object, transients?: any[], shallow?: boolean): Object;
  equalPoints(a: mxPoint[], b: mxPoint[]): boolean;
  equalEntries(a: mxRectangle[], b: mxRectangle[]): boolean;
  isNaN(value: any): boolean;
  extend(ctor: any, superCtor: any);
  toString(obj: Object): string;
  toRadians(deg: number): number;
  arcToCurves(x0: number, y0: number, r1: number, r2: number, angle: number, largeArcFlag: any, sweepFlag: any, x: number, y: number): number[];
  getBoundingBox(rect: mxRectangle, rotation: number, cx?: mxPoint): mxRectangle[];
  getRotatedPoint(pt: mxPoint, cos: number, sin: number, c?: mxPoint): mxPoint;
  getPortConstraints(terminal: mxCellState, edge: mxCellState, source: boolean, defaultValue: any): mxConstants;
  reversePortConstraints(constraint: any): any;
  findNearestSegment(state: mxCellState, x: number, y: number): number;
  rectangleIntersectsSegment(bounds: mxRectangle, p1: mxPoint, p2: mxPoint): boolean;
  contains(bounds: mxRectangle, x: number, y: number): boolean;
  intersects(a: mxRectangle, b: mxRectangle): boolean;
  intersectsHotspot(state: mxCellState, x: number, y: number, hotspot: number, min: number, max: number): boolean;
  getOffset(container: Node, scrollOffset?: boolean): mxPoint;
  getDocumentScrollOrigin(doc: Document): mxPoint;
  getScrollOrigin(node: Node): mxPoint;
  convertPoint(container: Node, x: number, y: number): mxPoint;
  ltrim(str: string, chars: string): string;
  rtrim(str: string, chars: string): string;
  trim(str: string, chars: string): string;
  isNumeric(n: string): boolean;
  mod(n: number, m: number): number;
  intersection(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): mxPoint;
  ptSegDistSq(x1: number, y1: number, x2: number, y2: number, px: number, py: number): number;
  relativeCcw(x1: number, y1: number, x2: number, y2: number, px: number, py: number): number;
  animateChanges(graph: mxGraph, changes: any);
  cascadeOpacity(graph: mxGraph, cell: mxCell, opacity: number);
  fadeOut(node: Node, from: any, remove: any, step: any, delay: number, isEnabled: boolean);
  setOpacity(node: Node, value: number);
  createImage(src: URL): Element;
  sortCells(cells: mxCell[], ascending: boolean): mxCell[];
  getStylename(style: string): string;
  getStylenames(style: string): string[];
  indexOfStylename(style: string, stylename: string): number;
  addStylename(style: string, stylename: string): string;
  removeStylename(style: string, stylename: string): string;
  removeAllStylenames(style: string): string;
  setCellStyles(model: mxGraphModel, cells: mxCell[], key: any, value: any);
  setStyle(style: string, key: any, value: any): string;
  setCellStyleFlags(model: mxGraphModel, cells: mxCell[], key: any, flag: number, value?: boolean);
  setStyleFlag(style: string, key: any, flag: number, value?: boolean): string;
  getAlignmentAsPoint(align: mxConstants, valign: mxConstants): mxPoint;
  getSizeForString(text: string, fontSize: number, fontFamily: string, textWidth?: number): mxRectangle;
  getViewXml(graph: mxGraph, scale: number, cells: mxCell[], x0: number, y0: number): any;
  getScaleForPageCount(pageCount: number, graph: mxGraph, pageFormat?: mxRectangle, border?: number): number;
  show(graph: mxGraph, doc: Document, x0: number, y0: number, w: number, h: number): Document;
  printScreen(graph: mxGraph);
  popup(content: string, isInternalWindow?: boolean);
  alert(message: string);
  prompt(message: string, defaultValue?: string): any;
  confirm(message: string): any;
  error(message: string, width: number, close?: boolean, icon?: any): mxWindow;
  makeDraggable(element: Element, graphF: mxGraph, funct: ICallback, dragElement?: Node, dx?: number, dy?: number,
    autoscroll?: boolean, scalePreview?: boolean, highlightDropTargets?: boolean, getDropTarget?: ICallback): mxDragSource;

}

interface mxAnimation extends mxEventSource {

  /**
   * Variable: delay
   * 
   * Specifies the delay between the animation steps. Defaul is 30ms.
   */
  delay: number;
  /**
   * Variable: thread
   * 
   * Reference to the thread while the animation is running.
   */
  thread: any;
  /**
   * Function: isRunning
   * 
   * Returns true if the animation is running.
   */
  isRunning(): boolean;
  /**
   * Function: startAnimation
   *
   * Starts the animation by repeatedly invoking updateAnimation.
   */
  startAnimation();
  /**
   * Function: updateAnimation
   *
   * Hook for subclassers to implement the animation. Invoke stopAnimation
   * when finished, startAnimation to resume. This is called whenever the
   * timer fires and fires an mxEvent.EXECUTE event with no properties.
   */
  updateAnimation();
  /**
   * Function: stopAnimation
   *
   * Stops the animation by deleting the timer and fires an <mxEvent.DONE>.
   */
  stopAnimation();

}

declare var mxAnimation: {
  new (delay: number): mxAnimation;
  prototype: mxAnimation;
}

interface mxClipboard {

  /** Variable: STEPSIZE
   *
   * Defines the step size to offset the cells after each paste operation.
   * Default is 10.
   */
  STEPSIZE: number;
  /**
   * Variable: insertCount
   * 
   * Counts the number of times the clipboard data has been inserted.
   */
  insertCount: number;
  /**
   * Variable: cells
   * 
   * Holds the array of <mxCells> currently in the clipboard.
   */
  cells: mxCell[];
  /**
   * Function: setCells
   * 
   * Sets the cells in the clipboard. Fires a <mxEvent.CHANGE> event.
   */
  setCells(cells: mxCell[]);
  /**
   * Function: getCells
   * 
   * Returns  the cells in the clipboard.
   */
  getCells(): boolean;
  /**
   * Function: isEmpty
   * 
   * Returns true if the clipboard currently has not data stored.
   */
  isEmpty(): boolean;
  /**
   * Function: cut
   * 
   * Cuts the given array of <mxCells> from the specified graph.
   * If cells is null then the selection cells of the graph will
   * be used. Returns the cells that have been cut from the graph.
   *
   * Parameters:
   * 
   * graph - <mxGraph> that contains the cells to be cut.
   * cells - Optional array of <mxCells> to be cut.
   */
  cut(graph: mxGraph, cells?: mxCell[]): mxCell[];
  /**
   * Function: removeCells
   * 
   * Hook to remove the given cells from the given graph after
   * a cut operation.
   *
   * Parameters:
   * 
   * graph - <mxGraph> that contains the cells to be cut.
   * cells - Array of <mxCells> to be cut.
   */
  removeCells(graph: mxGraph, cells: mxCell[]);
  /**
   * Function: copy
   * 
   * Copies the given array of <mxCells> from the specified
   * graph to <cells>.Returns the original array of cells that has
   * been cloned.
   * 
   * Parameters:
   * 
   * graph - <mxGraph> that contains the cells to be copied.
   * cells - Optional array of <mxCells> to be copied.
   */
  copy(graph: mxGraph, cells?: mxCell[]): mxCell[];
  /**
   * Function: paste
   * 
   * Pastes the <cells> into the specified graph restoring
   * the relation to <parents>, if possible. If the parents
   * are no longer in the graph or invisible then the
   * cells are added to the graph's default or into the
   * swimlane under the cell's new location if one exists.
   * The cells are added to the graph using <mxGraph.importCells>.
   * 
   * Parameters:
   * 
   * graph - <mxGraph> to paste the <cells> into.
   */
  paste(graph: mxGraph);

}

interface mxConstants {

  /**
   * Class: mxConstants
   * 
   * Defines various global constants.
   * 
   * Variable: DEFAULT_HOTSPOT
   * 
   * Defines the portion of the cell which is to be used as a connectable
   * region. Default is 0.3. Possible values are 0 < x <= 1. 
   */
  DEFAULT_HOTSPOT: number;
  /**
   * Variable: MIN_HOTSPOT_SIZE
   * 
   * Defines the minimum size in pixels of the portion of the cell which is
   * to be used as a connectable region. Default is 8.
   */
  MIN_HOTSPOT_SIZE: number;
  /**
   * Variable: MAX_HOTSPOT_SIZE
   * 
   * Defines the maximum size in pixels of the portion of the cell which is
   * to be used as a connectable region. Use 0 for no maximum. Default is 0.
   */
  MAX_HOTSPOT_SIZE: number;
  /**
   * Variable: RENDERING_HINT_EXACT
   * 
   * Defines the exact rendering hint.
   */
  RENDERING_HINT_EXACT: string;
  /**
   * Variable: RENDERING_HINT_FASTER
   * 
   * Defines the faster rendering hint.
   */
  RENDERING_HINT_FASTER: string;
  /**
   * Variable: RENDERING_HINT_FASTEST
   * 
   * Defines the fastest rendering hint.
   */
  RENDERING_HINT_FASTEST: string;
  /**
   * Variable: DIALECT_SVG
   * 
   * Defines the SVG display dialect name.
   */
  DIALECT_SVG: string;
  /**
   * Variable: DIALECT_VML
   * 
   * Defines the VML display dialect name.
   */
  DIALECT_VML: string;
  /**
   * Variable: DIALECT_MIXEDHTML
   * 
   * Defines the mixed HTML display dialect name.
   */
  DIALECT_MIXEDHTML: string;
  /**
   * Variable: DIALECT_PREFERHTML
   * 
   * Defines the preferred HTML display dialect name.
   */
  DIALECT_PREFERHTML: string;
  /**
   * Variable: DIALECT_STRICTHTML
   * 
   * Defines the strict HTML display dialect.
   */
  DIALECT_STRICTHTML: string;
  /**
   * Variable: NS_SVG
   * 
   * Defines the SVG namespace.
   */
  NS_SVG: string;
  /**
   * Variable: NS_XHTML
   * 
   * Defines the XHTML namespace.
   */
  NS_XHTML: string;
  /**
   * Variable: NS_XLINK
   * 
   * Defines the XLink namespace.
   */
  NS_XLINK: string;
  /**
   * Variable: SHADOWCOLOR
   * 
   * Defines the color to be used to draw shadows in shapes and windows.
   * Default is gray.
   */
  SHADOWCOLOR: string;
  /**
   * Variable: SHADOW_OFFSET_X
   * 
   * Specifies the x-offset of the shadow. Default is 2.
   */
  SHADOW_OFFSET_X: number;
  /**
   * Variable: SHADOW_OFFSET_Y
   * 
   * Specifies the y-offset of the shadow. Default is 3.
   */
  SHADOW_OFFSET_Y: number;
  /**
   * Variable: SHADOW_OPACITY
   * 
   * Defines the opacity for shadows. Default is 1.
   */
  SHADOW_OPACITY: number;
  /**
   * Variable: NODETYPE_ELEMENT
   * 
   * DOM node of type ELEMENT.
   */
  NODETYPE_ELEMENT: number;
  /**
   * Variable: NODETYPE_ATTRIBUTE
   * 
   * DOM node of type ATTRIBUTE.
   */
  NODETYPE_ATTRIBUTE: number;
  /**
   * Variable: NODETYPE_TEXT
   * 
   * DOM node of type TEXT.
   */
  NODETYPE_TEXT: number;
  /**
   * Variable: NODETYPE_CDATA
   * 
   * DOM node of type CDATA.
   */
  NODETYPE_CDATA: number;
  /**
   * Variable: NODETYPE_ENTITY_REFERENCE
   * 
   * DOM node of type ENTITY_REFERENCE.
   */
  NODETYPE_ENTITY_REFERENCE: number;
  /**
   * Variable: NODETYPE_ENTITY
   * 
   * DOM node of type ENTITY.
   */
  NODETYPE_ENTITY: number;
  /**
   * Variable: NODETYPE_PROCESSING_INSTRUCTION
   * 
   * DOM node of type PROCESSING_INSTRUCTION.
   */
  NODETYPE_PROCESSING_INSTRUCTION: number;
  /**
   * Variable: NODETYPE_COMMENT
   * 
   * DOM node of type COMMENT.
   */
  NODETYPE_COMMENT: number;
  /**
   * Variable: NODETYPE_DOCUMENT
   * 
   * DOM node of type DOCUMENT.
   */
  NODETYPE_DOCUMENT: number;
  /**
   * Variable: NODETYPE_DOCUMENTTYPE
   * 
   * DOM node of type DOCUMENTTYPE.
   */
  NODETYPE_DOCUMENTTYPE: number;
  /**
   * Variable: NODETYPE_DOCUMENT_FRAGMENT
   * 
   * DOM node of type DOCUMENT_FRAGMENT.
   */
  NODETYPE_DOCUMENT_FRAGMENT: number;
  /**
   * Variable: NODETYPE_NOTATION
   * 
   * DOM node of type NOTATION.
   */
  NODETYPE_NOTATION: number;
  /**
   * Variable: TOOLTIP_VERTICAL_OFFSET
   * 
   * Defines the vertical offset for the tooltip.
   * Default is 16.
   */
  TOOLTIP_VERTICAL_OFFSET: number;
  /**
   * Variable: DEFAULT_VALID_COLOR
   * 
   * Specifies the default valid colorr. Default is #0000FF.
   */
  DEFAULT_VALID_COLOR: string;
  /**
   * Variable: DEFAULT_INVALID_COLOR
   * 
   * Specifies the default invalid color. Default is #FF0000.
   */
  DEFAULT_INVALID_COLOR: string;
  /**
   * Variable: HIGHLIGHT_STROKEWIDTH
   * 
   * Defines the strokewidth to be used for the highlights.
   * Default is 3.
   */
  HIGHLIGHT_STROKEWIDTH: number;
  /**
   * Variable: CURSOR_MOVABLE_VERTEX
   * 
   * Defines the cursor for a movable vertex. Default is 'move'.
   */
  CURSOR_MOVABLE_VERTEX: string;
  /**
   * Variable: CURSOR_MOVABLE_EDGE
   * 
   * Defines the cursor for a movable edge. Default is 'move'.
   */
  CURSOR_MOVABLE_EDGE: string;
  /**
   * Variable: CURSOR_LABEL_HANDLE
   * 
   * Defines the cursor for a movable label. Default is 'default'.
   */
  CURSOR_LABEL_HANDLE: string;
  /**
   * Variable: CURSOR_BEND_HANDLE
   * 
   * Defines the cursor for a movable bend. Default is 'pointer'.
   */
  CURSOR_BEND_HANDLE: string;
  /**
   * Variable: CURSOR_CONNECT
   * 
   * Defines the cursor for a connectable state. Default is 'pointer'.
   */
  CURSOR_CONNECT: string;
  /**
   * Variable: HIGHLIGHT_COLOR
   * 
   * Defines the color to be used for the cell highlighting.
   * Use 'none' for no color. Default is #00FF00.
   */
  HIGHLIGHT_COLOR: string;
  /**
   * Variable: TARGET_HIGHLIGHT_COLOR
   * 
   * Defines the color to be used for highlighting a target cell for a new
   * or changed connection. Note that this may be either a source or
   * target terminal in the graph. Use 'none' for no color.
   * Default is #0000FF.
   */
  CONNECT_TARGET_COLOR: string;
  /**
   * Variable: INVALID_CONNECT_TARGET_COLOR
   * 
   * Defines the color to be used for highlighting a invalid target cells
   * for a new or changed connections. Note that this may be either a source
   * or target terminal in the graph. Use 'none' for no color. Default is
   * #FF0000.
   */
  INVALID_CONNECT_TARGET_COLOR: string;
  /**
   * Variable: DROP_TARGET_COLOR
   * 
   * Defines the color to be used for the highlighting target parent cells
   * (for drag and drop). Use 'none' for no color. Default is #0000FF.
   */
  DROP_TARGET_COLOR: string;
  /**
   * Variable: VALID_COLOR
   * 
   * Defines the color to be used for the coloring valid connection
   * previews. Use 'none' for no color. Default is #FF0000.
   */
  VALID_COLOR: string;
  /**
   * Variable: INVALID_COLOR
   * 
   * Defines the color to be used for the coloring invalid connection
   * previews. Use 'none' for no color. Default is #FF0000.
   */
  INVALID_COLOR: string;
  /**
   * Variable: EDGE_SELECTION_COLOR
   * 
   * Defines the color to be used for the selection border of edges. Use
   * 'none' for no color. Default is #00FF00.
   */
  EDGE_SELECTION_COLOR: string;
  /**
   * Variable: VERTEX_SELECTION_COLOR
   * 
   * Defines the color to be used for the selection border of vertices. Use
   * 'none' for no color. Default is #00FF00.
   */
  VERTEX_SELECTION_COLOR: string;
  /**
   * Variable: VERTEX_SELECTION_STROKEWIDTH
   * 
   * Defines the strokewidth to be used for vertex selections.
   * Default is 1.
   */
  VERTEX_SELECTION_STROKEWIDTH: number;
  /**
   * Variable: EDGE_SELECTION_STROKEWIDTH
   * 
   * Defines the strokewidth to be used for edge selections.
   * Default is 1.
   */
  EDGE_SELECTION_STROKEWIDTH: number;
  /**
   * Variable: SELECTION_DASHED
   * 
   * Defines the dashed state to be used for the vertex selection
   * border. Default is true.
   */
  VERTEX_SELECTION_DASHED: boolean;
  /**
   * Variable: SELECTION_DASHED
   * 
   * Defines the dashed state to be used for the edge selection
   * border. Default is true.
   */
  EDGE_SELECTION_DASHED: boolean;
  /**
   * Variable: GUIDE_COLOR
   * 
   * Defines the color to be used for the guidelines in mxGraphHandler.
   * Default is #FF0000.
   */
  GUIDE_COLOR: string;
  /**
   * Variable: GUIDE_STROKEWIDTH
   * 
   * Defines the strokewidth to be used for the guidelines in mxGraphHandler.
   * Default is 1.
   */
  GUIDE_STROKEWIDTH: number;
  /**
   * Variable: OUTLINE_COLOR
   * 
   * Defines the color to be used for the outline rectangle
   * border.  Use 'none' for no color. Default is #0099FF.
   */
  OUTLINE_COLOR: string;
  /**
   * Variable: OUTLINE_STROKEWIDTH
   * 
   * Defines the strokewidth to be used for the outline rectangle
   * stroke width. Default is 3.
   */
  OUTLINE_STROKEWIDTH: number;
  /**
   * Variable: HANDLE_SIZE
   * 
   * Defines the default size for handles. Default is 7.
   */
  HANDLE_SIZE: number;
  /**
   * Variable: LABEL_HANDLE_SIZE
   * 
   * Defines the default size for label handles. Default is 4.
   */
  LABEL_HANDLE_SIZE: number;
  /**
   * Variable: HANDLE_FILLCOLOR
   * 
   * Defines the color to be used for the handle fill color. Use 'none' for
   * no color. Default is #00FF00 (green).
   */
  HANDLE_FILLCOLOR: string;
  /**
   * Variable: HANDLE_STROKECOLOR
   * 
   * Defines the color to be used for the handle stroke color. Use 'none' for
   * no color. Default is black.
   */
  HANDLE_STROKECOLOR: string;
  /**
   * Variable: LABEL_HANDLE_FILLCOLOR
   * 
   * Defines the color to be used for the label handle fill color. Use 'none'
   * for no color. Default is yellow.
   */
  LABEL_HANDLE_FILLCOLOR: string;
  /**
   * Variable: CONNECT_HANDLE_FILLCOLOR
   * 
   * Defines the color to be used for the connect handle fill color. Use
   * 'none' for no color. Default is #0000FF (blue).
   */
  CONNECT_HANDLE_FILLCOLOR: string;
  /**
   * Variable: LOCKED_HANDLE_FILLCOLOR
   * 
   * Defines the color to be used for the locked handle fill color. Use
   * 'none' for no color. Default is #FF0000 (red).
   */
  LOCKED_HANDLE_FILLCOLOR: string;
  /**
   * Variable: OUTLINE_HANDLE_FILLCOLOR
   * 
   * Defines the color to be used for the outline sizer fill color. Use
   * 'none' for no color. Default is #00FFFF.
   */
  OUTLINE_HANDLE_FILLCOLOR: string;
  /**
   * Variable: OUTLINE_HANDLE_STROKECOLOR
   * 
   * Defines the color to be used for the outline sizer stroke color. Use
   * 'none' for no color. Default is #0033FF.
   */
  OUTLINE_HANDLE_STROKECOLOR: string;
  /**
   * Variable: DEFAULT_FONTFAMILY
   * 
   * Defines the default family for all fonts in points. Default is
   * Arial,Helvetica.
   */
  DEFAULT_FONTFAMILY: string;
  /**
   * Variable: DEFAULT_FONTSIZE
   * 
   * Defines the default size for all fonts in points. Default is 11.
   */
  DEFAULT_FONTSIZE: number;
  /**
   * Variable: LINE_HEIGHT
   * 
   * Defines the default line height for text labels. Default is 1.2.
   */
  LINE_HEIGHT: number;
  /**
   * Variable: ABSOLUTE_LINE_HEIGHT
   * 
   * Specifies if absolute line heights should be used (px) in CSS. Default
   * is false. Set this to true for backwards compatibility.
   */
  ABSOLUTE_LINE_HEIGHT: boolean;
  /**
   * Variable: DEFAULT_FONTSTYLE
   * 
   * Defines the default style for all fonts. Default is 0. This can be set
   * to any combination of font styles as follows.
   * 
   * (code)
   * mxConstants.DEFAULT_FONTSTYLE = mxConstants.FONT_BOLD | mxConstants.FONT_ITALIC;
   * (end)
   */
  DEFAULT_FONTSTYLE: number;
  /**
   * Variable: DEFAULT_STARTSIZE
   * 
   * Defines the default start size for swimlanes. Default is 40.
   */
  DEFAULT_STARTSIZE: number;
  /**
   * Variable: DEFAULT_MARKERSIZE
   * 
   * Defines the default size for all markers. Default is 6.
   */
  DEFAULT_MARKERSIZE: number;
  /**
   * Variable: DEFAULT_IMAGESIZE
   * 
   * Defines the default width and height for images used in the
   * label shape. Default is 24.
   */
  DEFAULT_IMAGESIZE: number;
  /**
   * Variable: ENTITY_SEGMENT
   * 
   * Defines the length of the horizontal segment of an Entity Relation.
   * This can be overridden using <mxConstants.STYLE_SEGMENT> style.
   * Default is 30.
   */
  ENTITY_SEGMENT: number;
  /**
   * Variable: RECTANGLE_ROUNDING_FACTOR
   * 
   * Defines the rounding factor for rounded rectangles in percent between
   * 0 and 1. Values should be smaller than 0.5. Default is 0.15.
   */
  RECTANGLE_ROUNDING_FACTOR: number;
  /**
   * Variable: LINE_ARCSIZE
   * 
   * Defines the size of the arcs for rounded edges. Default is 20.
   */
  LINE_ARCSIZE: number;
  /**
   * Variable: ARROW_SPACING
   * 
   * Defines the spacing between the arrow shape and its terminals. Default
   * is 10.
   */
  ARROW_SPACING: number;
  /**
   * Variable: ARROW_WIDTH
   * 
   * Defines the width of the arrow shape. Default is 30.
   */
  ARROW_WIDTH: number;
  /**
   * Variable: ARROW_SIZE
   * 
   * Defines the size of the arrowhead in the arrow shape. Default is 30.
   */
  ARROW_SIZE: number;
  /**
   * Variable: PAGE_FORMAT_A4_PORTRAIT
   * 
   * Defines the rectangle for the A4 portrait page format. The dimensions
   * of this page format are 826x1169 pixels.
   */
  PAGE_FORMAT_A4_PORTRAIT: mxRectangle;
  /**
   * Variable: PAGE_FORMAT_A4_PORTRAIT
   * 
   * Defines the rectangle for the A4 portrait page format. The dimensions
   * of this page format are 826x1169 pixels.
   */
  PAGE_FORMAT_A4_LANDSCAPE: mxRectangle;
  /**
   * Variable: PAGE_FORMAT_LETTER_PORTRAIT
   * 
   * Defines the rectangle for the Letter portrait page format. The
   * dimensions of this page format are 850x1100 pixels.
   */
  PAGE_FORMAT_LETTER_PORTRAIT: mxRectangle;
  /**
   * Variable: PAGE_FORMAT_LETTER_PORTRAIT
   * 
   * Defines the rectangle for the Letter portrait page format. The dimensions
   * of this page format are 850x1100 pixels.
   */
  PAGE_FORMAT_LETTER_LANDSCAPE: mxRectangle;
  /**
   * Variable: NONE
   * 
   * Defines the value for none. Default is "none".
   */
  NONE: string;
  /**
   * Variable: STYLE_PERIMETER
   * 
   * Defines the key for the perimeter style. This is a function that defines
   * the perimeter around a particular shape. Possible values are the
   * functions defined in <mxPerimeter>. Alternatively, the constants in this
   * class that start with <code>PERIMETER_</code> may be used to access
   * perimeter styles in <mxStyleRegistry>.
   */
  STYLE_PERIMETER: string;
  /**
   * Variable: STYLE_SOURCE_PORT
   * 
   * Defines the ID of the cell that should be used for computing the
   * perimeter point of the source for an edge. This allows for graphically
   * connecting to a cell while keeping the actual terminal of the edge.
   */
  STYLE_SOURCE_PORT: string;
  /**
   * Variable: STYLE_TARGET_PORT
   * 
   * Defines the ID of the cell that should be used for computing the
   * perimeter point of the target for an edge. This allows for graphically
   * connecting to a cell while keeping the actual terminal of the edge.
   */
  STYLE_TARGET_PORT: string;
  /**
   * Variable: STYLE_PORT_CONSTRAINT
   * 
   * Defines the direction(s) that edges are allowed to connect to cells in.
   * Possible values are <code>DIRECTION_NORTH, DIRECTION_SOUTH, 
   * DIRECTION_EAST</code> and <code>DIRECTION_WEST</code>.
   */
  STYLE_PORT_CONSTRAINT: string;
  /**
   * Variable: STYLE_PORT_CONSTRAINT_ROTATION
   * 
   * Define whether port constraint directions are rotated with vertex
   * rotation. 0 (default) causes port constraints to remain absolute, 
   * relative to the graph, 1 causes the constraints to rotate with
   * the vertex
   */
  STYLE_PORT_CONSTRAINT_ROTATION: string;
  /**
   * Variable: STYLE_OPACITY
   * 
   * Defines the key for the opacity style. The type of the value is 
   * numeric and the possible range is 0-100.
   */
  STYLE_OPACITY: string;
  /**
   * Variable: STYLE_TEXT_OPACITY
   * 
   * Defines the key for the text opacity style. The type of the value is 
   * numeric and the possible range is 0-100.
   */
  STYLE_TEXT_OPACITY: string;
  /**
   * Variable: STYLE_OVERFLOW
   * 
   * Defines the key for the overflow style. Possible values are 'visible',
   * 'hidden', 'fill' and 'width'. The default value is 'visible'. This value
   * specifies how overlapping vertex labels are handled. A value of
   * 'visible' will show the complete label. A value of 'hidden' will clip
   * the label so that it does not overlap the vertex bounds. A value of
   * 'fill' will use the vertex bounds and a value of 'width' will use the
   * the vertex width for the label. See <mxGraph.isLabelClipped>. Note that
   * the vertical alignment is ignored for overflow fill.
   */
  STYLE_OVERFLOW: string;
  /**
   * Variable: STYLE_ORTHOGONAL
   * 
   * Defines if the connection points on either end of the edge should be
   * computed so that the edge is vertical or horizontal if possible and
   * if the point is not at a fixed location. Default is false. This is
   * used in <mxGraph.isOrthogonal>, which also returns true if the edgeStyle
   * of the edge is an elbow or entity.
   */
  STYLE_ORTHOGONAL: string;
  /**
   * Variable: STYLE_EXIT_X
   * 
   * Defines the key for the horizontal relative coordinate connection point
   * of an edge with its source terminal.
   */
  STYLE_EXIT_X: string;
  /**
   * Variable: STYLE_EXIT_Y
   * 
   * Defines the key for the vertical relative coordinate connection point
   * of an edge with its source terminal.
   */
  STYLE_EXIT_Y: string;
  /**
   * Variable: STYLE_EXIT_PERIMETER
   * 
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the source. Possible values are 0 (false) and
   * 1 (true). Default is 1 (true).
   */
  STYLE_EXIT_PERIMETER: string;
  /**
   * Variable: STYLE_ENTRY_X
   * 
   * Defines the key for the horizontal relative coordinate connection point
   * of an edge with its target terminal.
   */
  STYLE_ENTRY_X: string;
  /**
   * Variable: STYLE_ENTRY_Y
   * 
   * Defines the key for the vertical relative coordinate connection point
   * of an edge with its target terminal.
   */
  STYLE_ENTRY_Y: string;
  /**
   * Variable: STYLE_ENTRY_PERIMETER
   * 
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the target. Possible values are 0 (false) and
   * 1 (true). Default is 1 (true).
   */
  STYLE_ENTRY_PERIMETER: string;
  /**
   * Variable: STYLE_WHITE_SPACE
   * 
   * Defines the key for the white-space style. Possible values are 'nowrap'
   * and 'wrap'. The default value is 'nowrap'. This value specifies how
   * white-space inside a HTML vertex label should be handled. A value of
   * 'nowrap' means the text will never wrap to the next line until a
   * linefeed is encountered. A value of 'wrap' means text will wrap when
   * necessary. This style is only used for HTML labels.
   * See <mxGraph.isWrapping>.
   */
  STYLE_WHITE_SPACE: string;
  /**
   * Variable: STYLE_ROTATION
   * 
   * Defines the key for the rotation style. The type of the value is 
   * numeric and the possible range is 0-360.
   */
  STYLE_ROTATION: string;
  /**
   * Variable: STYLE_FILLCOLOR
   * 
   * Defines the key for the fill color. Possible values are all HTML color
   * names or HEX codes, as well as special keywords such as 'swimlane,
   * 'inherit' or 'indicated' to use the color code of a related cell or the
   * indicator shape.
   */
  STYLE_FILLCOLOR: string;
  /**
   * Variable: STYLE_FILLCOLOR
   * 
   * Defines the key for the fill color of the swimlane background. Possible
   * values are all HTML color names or HEX codes. Default is no background.
   */
  STYLE_SWIMLANE_FILLCOLOR: string;
  /**
   * Variable: STYLE_MARGIN
   * 
   * Defines the key for the margin between the ellipses in the double ellipse shape.
   * Possible values are all positive numbers.
   */
  STYLE_MARGIN: string;
  /**
   * Variable: STYLE_GRADIENTCOLOR
   * 
   * Defines the key for the gradient color. Possible values are all HTML color
   * names or HEX codes, as well as special keywords such as 'swimlane,
   * 'inherit' or 'indicated' to use the color code of a related cell or the
   * indicator shape. This is ignored if no fill color is defined.
   */
  STYLE_GRADIENTCOLOR: string;
  /**
   * Variable: STYLE_GRADIENT_DIRECTION
   * 
   * Defines the key for the gradient direction. Possible values are
   * <DIRECTION_EAST>, <DIRECTION_WEST>, <DIRECTION_NORTH> and
   * <DIRECTION_SOUTH>. Default is <DIRECTION_SOUTH>. Generally, and by
   * default in mxGraph, gradient painting is done from the value of
   * <STYLE_FILLCOLOR> to the value of <STYLE_GRADIENTCOLOR>. Taking the
   * example of <DIRECTION_NORTH>, this means <STYLE_FILLCOLOR> color at the 
   * bottom of paint pattern and <STYLE_GRADIENTCOLOR> at top, with a
   * gradient in-between.
   */
  STYLE_GRADIENT_DIRECTION: string;
  /**
   * Variable: STYLE_STROKECOLOR
   * 
   * Defines the key for the strokeColor style. Possible values are all HTML
   * color names or HEX codes, as well as special keywords such as 'swimlane,
   * 'inherit', 'indicated' to use the color code of a related cell or the
   * indicator shape or 'none' for no color.
   */
  STYLE_STROKECOLOR: string;
  /**
   * Variable: STYLE_SEPARATORCOLOR
   * 
   * Defines the key for the separatorColor style. Possible values are all
   * HTML color names or HEX codes. This style is only used for
   * <SHAPE_SWIMLANE> shapes.
   */
  STYLE_SEPARATORCOLOR: string;
  /**
   * Variable: STYLE_STROKEWIDTH
   * 
   * Defines the key for the strokeWidth style. The type of the value is 
   * numeric and the possible range is any non-negative value larger or equal
   * to 1. The value defines the stroke width in pixels. Note: To hide a
   * stroke use strokeColor none.
   */
  STYLE_STROKEWIDTH: string;
  /**
   * Variable: STYLE_ALIGN
   * 
   * Defines the key for the align style. Possible values are <ALIGN_LEFT>,
   * <ALIGN_CENTER> and <ALIGN_RIGHT>. This value defines how the lines of
   * the label are horizontally aligned. <ALIGN_LEFT> mean label text lines
   * are aligned to left of the label bounds, <ALIGN_RIGHT> to the right of
   * the label bounds and <ALIGN_CENTER> means the center of the text lines
   * are aligned in the center of the label bounds. Note this value doesn't
   * affect the positioning of the overall label bounds relative to the
   * vertex, to move the label bounds horizontally, use
   * <STYLE_LABEL_POSITION>.
   */
  STYLE_ALIGN: string;
  /**
   * Variable: STYLE_VERTICAL_ALIGN
   * 
   * Defines the key for the verticalAlign style. Possible values are
   * <ALIGN_TOP>, <ALIGN_MIDDLE> and <ALIGN_BOTTOM>. This value defines how
   * the lines of the label are vertically aligned. <ALIGN_TOP> means the
   * topmost label text line is aligned against the top of the label bounds,
   * <ALIGN_BOTTOM> means the bottom-most label text line is aligned against
   * the bottom of the label bounds and <ALIGN_MIDDLE> means there is equal
   * spacing between the topmost text label line and the top of the label
   * bounds and the bottom-most text label line and the bottom of the label
   * bounds. Note this value doesn't affect the positioning of the overall
   * label bounds relative to the vertex, to move the label bounds
   * vertically, use <STYLE_VERTICAL_LABEL_POSITION>.
   */
  STYLE_VERTICAL_ALIGN: string;
  /**
   * Variable: STYLE_LABEL_POSITION
   * 
   * Defines the key for the horizontal label position of vertices. Possible
   * values are <ALIGN_LEFT>, <ALIGN_CENTER> and <ALIGN_RIGHT>. Default is
   * <ALIGN_CENTER>. The label align defines the position of the label
   * relative to the cell. <ALIGN_LEFT> means the entire label bounds is
   * placed completely just to the left of the vertex, <ALIGN_RIGHT> means
   * adjust to the right and <ALIGN_CENTER> means the label bounds are
   * vertically aligned with the bounds of the vertex. Note this value
   * doesn't affect the positioning of label within the label bounds, to move
   * the label horizontally within the label bounds, use <STYLE_ALIGN>.
   */
  STYLE_LABEL_POSITION: string;
  /**
   * Variable: STYLE_VERTICAL_LABEL_POSITION
   * 
   * Defines the key for the vertical label position of vertices. Possible
   * values are <ALIGN_TOP>, <ALIGN_BOTTOM> and <ALIGN_MIDDLE>. Default is
   * <ALIGN_MIDDLE>. The label align defines the position of the label
   * relative to the cell. <ALIGN_TOP> means the entire label bounds is
   * placed completely just on the top of the vertex, <ALIGN_BOTTOM> means
   * adjust on the bottom and <ALIGN_MIDDLE> means the label bounds are
   * horizontally aligned with the bounds of the vertex. Note this value
   * doesn't affect the positioning of label within the label bounds, to move
   * the label vertically within the label bounds, use
   * <STYLE_VERTICAL_ALIGN>.
   */
  STYLE_VERTICAL_LABEL_POSITION: string;
  /**
   * Variable: STYLE_IMAGE_ASPECT
   * 
   * Defines the key for the image aspect style. Possible values are 0 (do
   * not preserve aspect) or 1 (keep aspect). This is only used in
   * <mxImageShape>. Default is 1.
   */
  STYLE_IMAGE_ASPECT: string;
  /**
   * Variable: STYLE_IMAGE_ALIGN
   * 
   * Defines the key for the align style. Possible values are <ALIGN_LEFT>,
   * <ALIGN_CENTER> and <ALIGN_RIGHT>. The value defines how any image in the
   * vertex label is aligned horizontally within the label bounds of a
   * <SHAPE_LABEL> shape.
   */
  STYLE_IMAGE_ALIGN: string;
  /**
   * Variable: STYLE_IMAGE_VERTICAL_ALIGN
   * 
   * Defines the key for the verticalAlign style. Possible values are
   * <ALIGN_TOP>, <ALIGN_MIDDLE> and <ALIGN_BOTTOM>. The value defines how
   * any image in the vertex label is aligned vertically within the label
   * bounds of a <SHAPE_LABEL> shape.
   */
  STYLE_IMAGE_VERTICAL_ALIGN: string;
  /**
   * Variable: STYLE_GLASS
   * 
   * Defines the key for the glass style. Possible values are 0 (disabled) and
     */

}

interface mxDictionary {

  /**
   * Function: map
   *
   * Stores the (key, value) pairs in this dictionary.
   */
  map: any[];
  /**
   * Function: clear
   *
   * Clears the dictionary.
   */
  clear();
  /**
   * Function: get
   *
   * Returns the value for the given key.
   */
  get(key: any): any;
  /**
   * Function: put
   *
   * Stores the value under the given key and returns the previous
   * value for that key.
   */
  put(key: any, value: any): any;
  /**
   * Function: remove
   *
   * Removes the value for the given key and returns the value that
   * has been removed.
   */
  remove(key: any): any;
  /**
   * Function: getKeys
   *
   * Returns all keys as an array.
   */
  getKeys(): any[];
  /**
   * Function: getValues
   *
   * Returns all values as an array.
   */
  getValues(): any[];
  /**
   * Function: visit
   *
   * Visits all entries in the dictionary using the given function with the
   * following signature: function(key, value) where key is a string and
   * value is an object.
   * 
   * Parameters:
   * 
   * visitor - A function that takes the key and value as arguments.
   */
  visit(visitor: ICallback);

}

declare var mxDictionary: {
  new (): mxDictionary;
  prototype: mxDictionary;
}

interface mxDivResizer {

  /**
   * Function: resizeWidth
   * 
   * Boolean specifying if the width should be updated.
   */
  resizeWidth: boolean;
  /**
   * Function: resizeHeight
   * 
   * Boolean specifying if the height should be updated.
   */
  resizeHeight: boolean;
  /**
   * Function: handlingResize
   * 
   * Boolean specifying if the width should be updated.
   */
  handlingResize: boolean;
  /**
   * Function: resize
   * 
   * Updates the style of the DIV after the window has been resized.
   */
  resize();
  /**
   * Function: getDocumentWidth
   * 
   * Hook for subclassers to return the width of the document (without
   * scrollbars).
   */
  getDocumentWidth(): number;
  /**
   * Function: getDocumentHeight
   * 
   * Hook for subclassers to return the height of the document (without
   * scrollbars).
   */
  getDocumentHeight(): number;

}

declare var mxDivResizer: {
  new (div: Element, container?: Element[]): mxDivResizer;
  prototype: mxDivResizer;
}

interface mxDragSource {

  /**
   * Variable: element
   *
   * Reference to the DOM node which was made draggable.
   */
  element: Element;
  /**
   * Variable: dropHandler
   *
   * Holds the DOM node that is used to represent the drag preview. If this is
   * null then the source element will be cloned and used for the drag preview.
   */
  dropHandler: Element;
  /**
   * Variable: dragOffset
   *
   * <mxPoint> that specifies the offset of the <dragElement>. Default is null.
   */
  dragOffset: mxPoint;
  /**
   * Variable: dragElement
   *
   * Holds the DOM node that is used to represent the drag preview. If this is
   * null then the source element will be cloned and used for the drag preview.
   */
  dragElement: Element;
  /**
   * Variable: previewElement
   *
   * Optional <mxRectangle> that specifies the unscaled size of the preview.
   */
  previewElement?: mxRectangle;
  /**
   * Variable: enabled
   *
   * Specifies if this drag source is enabled. Default is true.
   */
  enabled: boolean;
  /**
   * Variable: currentGraph
   *
   * Reference to the <mxGraph> that is the current drop target.
   */
  currentGraph: mxGraph;
  /**
   * Variable: currentDropTarget
   *
   * Holds the current drop target under the mouse.
   */
  currentDropTarget: mxCell;
  /**
   * Variable: currentPoint
   *
   * Holds the current drop location.
   */
  currentPoint: mxPoint;
  /**
   * Variable: currentGuide
   *
   * Holds an <mxGuide> for the <currentGraph> if <dragPreview> is not null.
   */
  currentGuide: mxGuide;
  /**
   * Variable: currentGuide
   *
   * Holds an <mxGuide> for the <currentGraph> if <dragPreview> is not null.
   */
  currentHighlight: mxGuide;
  /**
   * Variable: autoscroll
   *
   * Specifies if the graph should scroll automatically. Default is true.
   */
  autoscroll: boolean;
  /**
   * Variable: guidesEnabled
   *
   * Specifies if <mxGuide> should be enabled. Default is true.
   */
  guidesEnabled: mxGuide;
  /**
   * Variable: gridEnabled
   *
   * Specifies if the grid should be allowed. Default is true.
   */
  gridEnabled: boolean;
  /**
   * Variable: highlightDropTargets
   *
   * Specifies if drop targets should be highlighted. Default is true.
   */
  highlightDropTargets: boolean;
  /**
   * Variable: dragElementZIndex
   * 
   * ZIndex for the drag element. Default is 100.
   */
  dragElementZIndex: number;
  /**
   * Variable: dragElementOpacity
   * 
   * Opacity of the drag element in %. Default is 70.
   */
  dragElementOpacity: number;
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
   * Function: isGuidesEnabled
   * 
   * Returns <guidesEnabled>.
   */
  isGuidesEnabled(): boolean;
  /**
   * Function: setGuidesEnabled
   * 
   * Sets <guidesEnabled>.
   */
  setGuidesEnabled(value: boolean);
  /**
   * Function: isGridEnabled
   * 
   * Returns <gridEnabled>.
   */
  isGridEnabled(): boolean;
  /**
   * Function: setGridEnabled
   * 
   * Sets <gridEnabled>.
   */
  setGridEnabled(value: boolean);
  /**
   * Function: getGraphForEvent
   * 
   * Returns the graph for the given mouse event. This implementation returns
   * null.
   */
  getGraphForEvent(evt: Event): any;
  /**
   * Function: getDropTarget
   * 
   * Returns the drop target for the given graph and coordinates. This
   * implementation uses <mxGraph.getCellAt>.
   */
  getDropTarget(graph: mxGraph, x: number, y: number): mxCell;
  /**
   * Function: createDragElement
   * 
   * Creates and returns a clone of the <dragElementPrototype> or the <element>
   * if the former is not defined.
   */
  createDragElement(evt: Event): any;
  /**
   * Function: createPreviewElement
   * 
   * Creates and returns an element which can be used as a preview in the given
   * graph.
   */
  createPreviewElement(graph: mxGraph): any;
  /**
   * Function: mouseDown
   * 
   * Returns the drop target for the given graph and coordinates. This
   * implementation uses <mxGraph.getCellAt>.
   * 
   * To ignore popup menu events for a drag source, this function can be
   * overridden as follows.
   * 
   * (code)
   * var mouseDown = dragSource.mouseDown;
   * 
   * dragSource.mouseDown = function(evt)
   * {
   *   if (!mxEvent.isPopupTrigger(evt))
   *   {
   *     mouseDown.apply(this, arguments);
   *   }
   * };
   * (end)
   */
  mouseDown(evt: Event);
  /**
   * Function: startDrag
   * 
   * Creates the <dragElement> using <createDragElement>.
   */
  startDrag(evt: Event);
  /**
   * Function: stopDrag
   * 
   * Removes and destroys the <dragElement>.
   */
  stopDrag(evt: Event);
  /**
   * Function: graphContainsEvent
   * 
   * Returns true if the given graph contains the given event.
   */
  graphContainsEvent(graph: mxGraph, evt: Event): boolean;
  /**
   * Function: mouseMove
   * 
   * Gets the graph for the given event using <getGraphForEvent>, updates the
   * <currentGraph>, calling <dragEnter> and <dragExit> on the new and old graph,
   * respectively, and invokes <dragOver> if <currentGraph> is not null.
   */
  mouseMove(evt: Event);
  /**
   * Function: mouseUp
   * 
   * Processes the mouse up event and invokes <drop>, <dragExit> and <stopDrag>
   * as required.
   */
  mouseUp(evt: Event);
  /**
   * Function: dragEnter
   * 
   * Actives the given graph as a drop target.
   */
  dragEnter(graph: mxGraph, evt: Event);
  /**
   * Function: dragExit
   * 
   * Deactivates the given graph as a drop target.
   */
  dragExit(graph: mxGraph, evt: Event);
  /**
   * Function: dragOver
   * 
   * Implements autoscroll, updates the <currentPoint>, highlights any drop
   * targets and updates the preview.
   */
  dragOver(graph: mxGraph, evt: Event);
  /**
   * Function: drop
   * 
   * Returns the drop target for the given graph and coordinates. This
   * implementation uses <mxGraph.getCellAt>.
   */
  drop(graph: mxGraph, evt: Event, dropTarget: mxCell, x: number, y: number);

}

declare var mxDragSource: {
  new (element: Element, dropHandler: Element): mxDragSource;
  prototype: mxDragSource;
}

interface mxEffects {

  /**
   * Function: animateChanges
   * 
   * Asynchronous animated move operation. See also: <mxMorphing>.
   * 
   * Example:
   * 
   * (code)
   * graph.model.addListener(mxEvent.CHANGE, function(sender, evt)
   * {
   *   var changes = evt.getProperty('edit').changes;
   * 
   *   if (changes.length < 10)
   *   {
   *     mxEffects.animateChanges(graph, changes);
   *   }
   * });
   * (end)
   * 
   * Parameters:
   * 
   * graph - <mxGraph> that received the changes.
   * changes - Array of changes to be animated.
   * done - Optional function argument that is invoked after the
   * last step of the animation.
   */
  animateChangesgraph(mxGraph, changes: any[], done?: ICallback);
  /**
   * Function: cascadeOpacity
   * 
   * Sets the opacity on the given cell and its descendants.
   * 
   * Parameters:
   * 
   * graph - <mxGraph> that contains the cells.
   * cell - <mxCell> to set the opacity for.
   * opacity - New value for the opacity in %.
   */
  cascadeOpacity(graph: mxGraph, cell: mxCell, opacity: number);
  /**
   * Function: fadeOut
   * 
   * Asynchronous fade-out operation.
   */
  fadeOut(node: mxCell, from: number, remove: boolean, step: number, delay: number, isEnabled: boolean);

}

declare var mxEffects: {
  new (): mxEffects;
  prototype: mxEffects;
}

interface mxForm {

  table: Element;
  body: Element;
  getTable(): Element;
  addButtons(okFunct: ICallback, cancFunct: ICallback);
  addText(name: string, value: any): any;
  addCheckbox(name: string, value: any): any;
  addTextarea(name: string, value: any, rows?: number): any;
  addCombo(name: string, isMultiSelect: boolean, size: number): any;
  addOption(combo: any, label: string, value: any, isSelected: number);
  addField(name: string, input: any): any;

}

declare var mxForm: {
  new (className?: string): mxForm;
  prototype: mxForm;
}

interface mxGuide {

  /**
   * Variable: graph
   *
   * Reference to the enclosing <mxGraph> instance.
   */
  graph: mxGraph;
  /**
   * Variable: states
   * 
   * Contains the <mxCellStates> that are used for alignment.
   */
  states: mxCellState[];
  /**
   * Variable: horizontal
   *
   * Specifies if horizontal guides are enabled. Default is true.
   */
  horizontal: boolean;
  /**
   * Variable: vertical
   *
   * Specifies if vertical guides are enabled. Default is true.
   */
  vertical: boolean;
  /**
   * Variable: vertical
   *
   * Holds the <mxShape> for the horizontal guide.
   */
  guideX: mxShape;
  /**
   * Variable: vertical
   *
   * Holds the <mxShape> for the vertical guide.
   */
  guideY: mxShape;
  /**
   * Function: setStates
   * 
   * Sets the <mxCellStates> that should be used for alignment.
   */
  setStates(states: mxCellState[]);
  /**
   * Function: isEnabledForEvent
   * 
   * Returns true if the guide should be enabled for the given native event. This
   * implementation always returns true.
   */
  isEnabledForEvent(evt: Event): boolean;
  /**
   * Function: getGuideTolerance
   * 
   * Returns the tolerance for the guides. Default value is
   * gridSize * scale / 2.
   */
  getGuideTolerance(): number;
  /**
   * Function: createGuideShape
   * 
   * Returns the mxShape to be used for painting the respective guide. This
   * implementation returns a new, dashed and crisp <mxPolyline> using
   * <mxConstants.GUIDE_COLOR> and <mxConstants.GUIDE_STROKEWIDTH> as the format.
   * 
   * Parameters:
   * 
   * horizontal - Boolean that specifies which guide should be created.
   */
  createGuideShape(horizontal: boolean): mxPolyline;
  /**
   * Function: move
   * 
   * Moves the <bounds> by the given <mxPoint> and returnt the snapped point.
   */
  move(bounds: Object, delta: mxPoint, gridEnabled: boolean): mxPoint;
  /**
   * Function: hide
   * 
   * Hides all current guides.
   */
  hide();
  /**
   * Function: destroy
   * 
   * Destroys all resources that this object uses.
   */
  destroy();

}

declare var mxGuide: {
  new (graph: mxGraph, states: mxCellState[]): mxGuide;
  prototype: mxGuide;
}

interface mxImage {

  src: string;
  width: number;
  height: number;

}

declare var mxImage: {
  new (src: string, width: number, height: number): mxImage;
  prototype: mxImage;
}

interface mxImageBundle {

  /**
   * Variable: images
   * 
   * Maps from keys to images.
   */
  images: any;
  /**
   * Variable: alt
   * 
   * Specifies if the fallback representation should be returned.
   */
  alt: boolean;
  /**
   * Function: putImage
   * 
   * Adds the specified entry to the map. The entry is an object with a value and
   * fallback property as specified in the arguments.
   */
  putImage(key: any, value: any, fallback?: any);
  /**
   * Function: getImage
   * 
   * Returns the value for the given key. This returns the value
   * or fallback, depending on <alt>. The fallback is returned if
   * <alt> is true, the value is returned otherwise.
   */
  getImage(key: any): any;

}

declare var mxImageBundle: {
  new (alt?: boolean): mxImageBundle;
  prototype: mxImageBundle;
}

interface mxImageExport {

  /**
   * Variable: includeOverlays
   * 
   * Specifies if overlays should be included in the export. Default is false.
   */
  includeOverlays: boolean;
  /**
   * Function: drawState
   * 
   * Draws the given state and all its descendants to the given canvas.
   */
  drawState(state: mxCellState, canvas: any);
  /**
   * Function: drawState
   * 
   * Draws the given state and all its descendants to the given canvas.
   */
  visitStatesRecursive(state: mxCellState, canvas: any, visitor: ICallback);
  /**
   * Function: getLinkForCellState
   * 
   * Returns the link for the given cell state and canvas. This returns null.
   */
  getLinkForCellState(state: mxCellState, canvas: any): any;
  /**
   * Function: drawShape
   * 
   * Draws the given state to the given canvas.
   */
  drawCellState(state: mxCellState, canvas: any);
  /**
   * Function: drawOverlays
   * 
   * Draws the overlays for the given state. This is called if <includeOverlays>
   * is true.
   */
  drawOverlays(state: mxCellState, canvas: any);

}

declare var mxImageExport: {
  new (): mxImageExport;
  prototype: mxImageExport;
}

interface mxLog {

  /**
   * Class: mxLog
   * 
   * A singleton class that implements a simple console.
   * 
   * Variable: consoleName
   * 
   * Specifies the name of the console window. Default is 'Console'.
   */
  consoleName: string;
  /**
   * Variable: TRACE
   * 
   * Specified if the output for <enter> and <leave> should be visible in the
   * console. Default is false.
   */
  TRACE: boolean;
  /**
   * Variable: DEBUG
   * 
   * Specifies if the output for <debug> should be visible in the console.
   * Default is true.
   */
  DEBUG: boolean;
  /**
   * Variable: WARN
   * 
   * Specifies if the output for <warn> should be visible in the console.
   * Default is true.
   */
  WARN: boolean;
  /**
   * Variable: buffer
   * 
   * Buffer for pre-initialized content.
   */
  buffer: string;
  /**
   * Function: init
   *
   * Initializes the DOM node for the console. This requires document.body to
   * point to a non-null value. This is called from within <setVisible> if the
   * log has not yet been initialized.
   */
  init();
  /**
   * Function: info
   * 
   * Writes the current navigator information to the console.
   */
  info();
  /**
   * Function: addButton
   * 
   * Adds a button to the console using the given label and function.
   */
  addButton(lab: any, funct: ICallback);
  /**
   * Function: isVisible
   * 
   * Returns true if the console is visible.
   */
  isVisible(): boolean;
  /**
   * Function: show
   * 
   * Shows the console.
   */
  show();
  /**
   * Function: setVisible
   * 
   * Shows or hides the console.
   */
  setVisible(visible: boolean);
  /**
   * Function: enter
   * 
   * Writes the specified string to the console
   * if <TRACE> is true and returns the current 
   * time in milliseconds.
   *
   * Example:
   * 
   * (code)
   * mxLog.show();
   * var t0 = mxLog.enter('Hello');
   * // Do something
   * mxLog.leave('World!', t0);
   * (end)
   */
  enter(str: string): any;
  /**
   * Function: leave
   * 
   * Writes the specified string to the console
   * if <TRACE> is true and computes the difference
   * between the current time and t0 in milliseconds.
   * See <enter> for an example.
   */
  leave(str: string, t0: number);
  /**
   * Function: debug
   * 
   * Adds all arguments to the console if <DEBUG> is enabled.
   *
   * Example:
   * 
   * (code)
   * mxLog.show();
   * mxLog.debug('Hello, World!');
   * (end)
   */
  debug();
  /**
   * Function: warn
   * 
   * Adds all arguments to the console if <WARN> is enabled.
   *
   * Example:
   * 
   * (code)
   * mxLog.show();
   * mxLog.warn('Hello, World!');
   * (end)
   */
  warn();
  /**
   * Function: write
   * 
   * Adds the specified strings to the console.
   */
  write();
  /**
   * Function: writeln
   * 
   * Adds the specified strings to the console, appending a linefeed at the
   * end of each string.
   */
  writeln();

}

declare var mxLog: {
  new (): mxLog;
  prototype: mxLog;
}

interface mxMorphing extends mxEventSource {

  /**
   * Variable: graph
   * 
   * Specifies the delay between the animation steps. Defaul is 30ms.
   */
  graph: mxGraph; // PROBABLY?
  /**
   * Variable: steps
   * 
   * Specifies the maximum number of steps for the morphing.
   */
  steps: number;
  /**
   * Variable: step
   * 
   * Contains the current step.
   */
  step: number;
  /**
   * Variable: ease
   * 
   * Ease-off for movement towards the given vector. Larger values are
   * slower and smoother. Default is 4.
   */
  ease: number;
  /**
   * Variable: cells
   * 
   * Optional array of cells to be animated. If this is not specified
   * then all cells are checked and animated if they have been moved
   * in the current transaction.
   */
  cells: mxCell[];
  /**
   * Function: updateAnimation
   *
   * Animation step.
   */
  updateAnimation();
  /**
   * Function: show
   *
   * Shows the changes in the given <mxCellStatePreview>.
   */
  show(move: mxCellStatePreview);
  /**
   * Function: animateCell
   *
   * Animates the given cell state using <mxCellStatePreview.moveState>.
   */
  animateCell(cell: mxCell, move: mxCellStatePreview, recurse: boolean);
  /**
   * Function: stopRecursion
   *
   * Returns true if the animation should not recursively find more
   * deltas for children if the given parent state has been animated.
   */
  stopRecursion(state: mxCellState, delta: any): boolean;
  /**
   * Function: getDelta
   *
   * Returns the vector between the current rendered state and the future
   * location of the state after the display will be updated.
   */
  getDelta(state: mxCellState): mxPoint;
  /**
   * Function: getOriginForCell
   *
   * Returns the top, left corner of the given cell. TODO: Improve performance
   * by using caching inside this method as the result per cell never changes
   * during the lifecycle of this object.
   */
  getOriginForCell(cell: mxCell): mxPoint;

}

declare var mxMorphing: {
  new (graph: mxGraph, steps?: number, ease?: number, delay?: number): mxMorphing;
  prototype: mxMorphing;
}

interface mxMouseEvent {

  /**
   * Variable: consumed
   *
   * Holds the consumed state of this event.
   */
  consumed: boolean;
  /**
   * Variable: evt
   *
   * Holds the inner event object.
   */
  evt: Event;
  /**
   * Variable: graphX
   *
   * Holds the x-coordinate of the event in the graph. This value is set in
   * <mxGraph.fireMouseEvent>.
   */
  graphX: mxGraph;
  /**
   * Variable: graphY
   *
   * Holds the y-coordinate of the event in the graph. This value is set in
   * <mxGraph.fireMouseEvent>.
   */
  graphY: mxGraph;
  /**
   * Variable: state
   *
   * Holds the optional <mxCellState> associated with this event.
   */
  state?: mxCellState;
  /**
   * Function: getEvent
   * 
   * Returns <evt>.
   */
  getEvent(): Event;
  /**
   * Function: getSource
   * 
   * Returns the target DOM element using <mxEvent.getSource> for <evt>.
   */
  getSource(): Element;
  /**
   * Function: isSource
   * 
   * Returns true if the given <mxShape> is the source of <evt>.
   */
  isSource(shape: mxShape): boolean;
  /**
   * Function: getX
   * 
   * Returns <evt.clientX>.
   */
  getX(): any;
  /**
   * Function: getY
   * 
   * Returns <evt.clientY>.
   */
  getY(): any;
  /**
   * Function: getGraphX
   * 
   * Returns <graphX>.
   */
  getGraphX(): mxGraph;
  /**
   * Function: getGraphY
   * 
   * Returns <graphY>.
   */
  getGraphY(): mxGraph;
  /**
   * Function: getState
   * 
   * Returns <state>.
   */
  getState(): mxCellState;
  /**
   * Function: getCell
   * 
   * Returns the <mxCell> in <state> is not null.
   */
  getCell(): mxCell;
  /**
   * Function: isPopupTrigger
   *
   * Returns true if the event is a popup trigger.
   */
  isPopupTrigger(): boolean;
  /**
   * Function: isConsumed
   *
   * Returns <consumed>.
   */
  isConsumed(): boolean;
  /**
   * Function: consume
   *
   * Sets <consumed> to true and invokes preventDefault on the native event
   * if such a method is defined. This is used mainly to avoid the cursor from
   * being changed to a text cursor in Webkit. You can use the preventDefault
   * flag to disable this functionality.
   * 
   * Parameters:
   * 
   * preventDefault - Specifies if the native event should be canceled. Default
   * is true.
   */
  consume(preventDefault: boolean);

}

declare var mxMouseEvent: {
  new (evt: Event, state?: mxCellState): mxMouseEvent;
  prototype: mxMouseEvent;
}

interface mxObjectIdentity {

  FIELD_NAME: string;
  counter: number;
  /**
 * Function: get
 * 
 * Returns the object id for the given object.
 */
  getFieldName(obj: any): string;
  clear(obj: Object);

}

declare var mxObjectIdentity: {
  new (): mxObjectIdentity;
  prototype: mxObjectIdentity;
}

interface mxPanningManager {

  damper: number;
  delay: number;
  handleMouseOut: boolean;
  border: number;

}

declare var mxPanningManager: {
  new (graph: mxGraph): mxPanningManager;
  prototype: mxPanningManager;
}

interface mxPopupMenu extends mxEventSource {

  /**
   * Variable: submenuImage
   * 
   * URL of the image to be used for the submenu icon.
   */
  submenuImage: string;
  /**
   * Variable: zIndex
   * 
   * Specifies the zIndex for the popupmenu and its shadow. Default is 1006.
   */
  zIndex: number;
  /**
   * Variable: factoryMethod
   * 
   * Function that is used to create the popup menu. The function takes the
   * current panning handler, the <mxCell> under the mouse and the mouse
   * event that triggered the call as arguments.
   */
  factoryMethod: ICallback;
  /**
   * Variable: useLeftButtonForPopup
   * 
   * Specifies if popupmenus should be activated by clicking the left mouse
   * button. Default is false.
   */
  useLeftButtonForPopup: boolean;
  /**
   * Variable: enabled
   * 
   * Specifies if events are handled. Default is true.
   */
  enabled: boolean;
  /**
   * Variable: itemCount
   * 
   * Contains the number of times <addItem> has been called for a new menu.
   */
  itemCount: number;
  /**
   * Variable: autoExpand
   * 
   * Specifies if submenus should be expanded on mouseover. Default is false.
   */
  autoExpand: boolean;
  /**
   * Variable: smartSeparators
   * 
   * Specifies if separators should only be added if a menu item follows them.
   * Default is false.
   */
  smartSeparators: boolean;
  /**
   * Variable: labels
   * 
   * Specifies if any labels should be visible. Default is true.
   */
  labels: boolean;
  /**
   * Function: init
   * 
   * Initializes the shapes required for this vertex handler.
   */
  init();
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
   * Function: isPopupTrigger
   * 
   * Returns true if the given event is a popupmenu trigger for the optional
   * given cell.
   * 
   * Parameters:
   * 
   * me - <mxMouseEvent> that represents the mouse event.
   */
  isPopupTrigger(me: mxMouseEvent): boolean;
  /**
   * Function: addItem
   * 
   * Adds the given item to the given parent item. If no parent item is specified
   * then the item is added to the top-level menu. The return value may be used
   * as the parent argument, ie. as a submenu item. The return value is the table
   * row that represents the item.
   * 
   * Paramters:
   * 
   * title - String that represents the title of the menu item.
   * image - Optional URL for the image icon.
   * funct - Function associated that takes a mouseup or touchend event.
   * parent - Optional item returned by <addItem>.
   * iconCls - Optional string that represents the CSS class for the image icon.
   * IconsCls is ignored if image is given.
   * enabled - Optional boolean indicating if the item is enabled. Default is true.
   */
  addItem(title: string, image?: string, funct?: ICallback, parent?: any, iconCls?: string, enabled?: boolean): any[];
  /**
   * Function: createSubmenu
   * 
   * Creates the nodes required to add submenu items inside the given parent
   * item. This is called in <addItem> if a parent item is used for the first
   * time. This adds various DOM nodes and a <submenuImage> to the parent.
   * 
   * Parameters:
   * 
   * parent - An item returned by <addItem>.
   */
  createSubmenu(parent: any[]);
  /**
   * Function: showSubmenu
   * 
   * Shows the submenu inside the given parent row.
   */
  showSubmenu(parent: any, row: any);
  /**
   * Function: addSeparator
   * 
   * Adds a horizontal separator in the given parent item or the top-level menu
   * if no parent is specified.
   * 
   * Parameters:
   * 
   * parent - Optional item returned by <addItem>.
   * force - Optional boolean to ignore <smartSeparators>. Default is false.
   */
  addSeparator(parent?: any, force?: boolean);
  /**
   * Function: popup
   * 
   * Shows the popup menu for the given event and cell.
   * 
   * Example:
   * 
   * (code)
   * graph.panningHandler.popup = function(x, y, cell, evt)
   * {
   *   mxUtils.alert('Hello, World!');
   * }
   * (end)
   */
  popup(x: number, y: number, cell: mxCell, evt: Event);
  /**
   * Function: isMenuShowing
   * 
   * Returns true if the menu is showing.
   */
  isMenuShowing(): boolean;
  /**
   * Function: showMenu
   * 
   * Shows the menu.
   */
  showMenu();
  /**
   * Function: hideMenu
   * 
   * Removes the menu and all submenus.
   */
  hideMenu();
  /**
   * Function: hideSubmenu
   * 
   * Removes all submenus inside the given parent.
   * 
   * Parameters:
   * 
   * parent - An item returned by <addItem>.
   */
  hideSubmenu(parent: any);
  /**
   * Function: destroy
   * 
   * Destroys the handler and all its resources and DOM nodes.
   */
  destroy();


}

declare var mxPopupMenu: {
  new (factoryMethod: ICallback): mxPopupMenu;
  prototype: mxPopupMenu;
}

interface mxResources {

  /* Variable: resources
   *
   * Associative array that maps from keys to values.
   */
  resources: any[];
  /**
   * Variable: extension
   * 
   * Specifies the extension used for language files. Default is <mxResourceExtension>.
   */
  extension: any;
  /**
   * Variable: resourcesEncoded
   * 
   * Specifies whether or not values in resource files are encoded with \u or
   * percentage. Default is false.
   */
  resourcesEncoded: boolean;
  /**
   * Variable: loadDefaultBundle
   * 
   * Specifies if the default file for a given basename should be loaded.
   * Default is true.
   */
  loadDefaultBundle: boolean;
  /**
   * Variable: loadDefaultBundle
   * 
   * Specifies if the specific language file file for a given basename should
   * be loaded. Default is true.
   */
  loadSpecialBundle: boolean;
  /**
   * Function: isBundleSupported
   * 
   * Hook for subclassers to disable support for a given language. This
   * implementation always returns true.
   * 
   * Parameters:
   * 
   * basename - The basename for which the file should be loaded.
   * lan - The current language.
   */
  isLanguageSupported(lan: string): boolean;
  /**
   * Function: getDefaultBundle
   * 
   * Hook for subclassers to return the URL for the special bundle. This
   * implementation returns basename + <extension> or null if
   * <loadDefaultBundle> is false.
   * 
   * Parameters:
   * 
   * basename - The basename for which the file should be loaded.
   * lan - The current language.
   */
  getDefaultBundle(basename: string, lan: string): any;
  /**
   * Function: getSpecialBundle
   * 
   * Hook for subclassers to return the URL for the special bundle. This
   * implementation returns basename + '_' + lan + <extension> or null if
   * <loadSpecialBundle> is false or lan equals <mxClient.defaultLanguage>.
   * 
   * If <mxResources.languages> is not null and <mxClient.language> contains
   * a dash, then this method checks if <isLanguageSupported> returns true
   * for the full language (including the dash). If that returns false the
   * first part of the language (up to the dash) will be tried as an extension.
   * 
   * If <mxResources.language> is null then the first part of the language is
   * used to maintain backwards compatibility.
   * 
   * Parameters:
   * 
   * basename - The basename for which the file should be loaded.
   * lan - The language for which the file should be loaded.
   */
  getSpecialBundle(basename: string, lan: string): any;
  /**
   * Function: add
   * 
   * Adds the default and current language properties
   * file for the specified basename. Existing keys
   * are overridden as new files are added.
   *
   * Example:
   * 
   * At application startup, additional resources may be 
   * added using the following code:
   * 
   * (code)
   * mxResources.add('resources/editor');
   * (end)
   */
  add(basename: string, lan: string);
  /**
   * Function: parse
   * 
   * Parses the key, value pairs in the specified
   * text and stores them as local resources.
   */
  parse(text: string);
  /**
   * Function: get
   * 
   * Returns the value for the specified resource key.
   *
   * Example:
   * To read the value for 'welomeMessage', use the following:
   * (code)
   * var result = mxResources.get('welcomeMessage') || '';
   * (end)
   *
   * This would require an entry of the following form in
   * one of the English language resource files:
   * (code)
   * welcomeMessage=Welcome to mxGraph!
   * (end)
   * 
   * The part behind the || is the string value to be used if the given
   * resource is not available.
   * 
   * Parameters:
   * 
   * key - String that represents the key of the resource to be returned.
   * params - Array of the values for the placeholders of the form {1}...{n}
   * to be replaced with in the resulting string.
   * defaultValue - Optional string that specifies the default return value.
   */
  getKey(key: string, params: any[], defaultValue?: string): any;

}

declare var mxResources: {
  new (): mxResources;
  prototype: mxResources;
}

interface mxSession extends mxEventSource {

  /**
   * Variable: model
   * 
   * Reference to the enclosing <mxGraphModel>.
   */
  model: mxGraphModel;
  /**
   * Variable: urlInit
   * 
   * URL to initialize the session.
   */
  urlInit: string;
  /**
   * Variable: urlPoll
   * 
   * URL for polling the backend.
   */
  urlPoll: string;
  /**
   * Variable: urlNotify
   * 
   * URL to send changes to the backend.
   */
  urlNotify: string;
  /**
   * Variable: codec
   * 
   * Reference to the <mxCodec> used to encoding and decoding changes.
   */
  codec: mxCodec;
  /**
   * Variable: linefeed
   * 
   * Used for encoding linefeeds. Default is '&#xa;'.
   */
  linefeed: string;
  /**
   * Variable: escapePostData
   * 
   * Specifies if the data in the post request sent in <notify>
   * should be converted using encodeURIComponent. Default is true.
   */
  escapePostData: boolean;
  /**
   * Variable: significantRemoteChanges
   * 
   * Whether remote changes should be significant in the
   * local command history. Default is true.
   */
  significantRemoteChanges: boolean;
  /**
   * Variable: sent
   * 
   * Total number of sent bytes.
   */
  sent: number;
  /**
   * Variable: received
   * 
   * Total number of received bytes.
   */
  received: number;
  /**
   * Variable: debug
   * 
   * Specifies if the session should run in debug mode. In this mode, no
   * connection is established. The data is written to the console instead.
   * Default is false.
   */
  debug: boolean;
  /**
   * Variable: connected
   */
  connected: boolean;
  /**
   * Variable: send
   */
  suspended: boolean;
  /**
   * Variable: polling
   */
  polling: boolean;
  /**
   * Function: start
   */
  start();
  /**
   * Function: suspend
   * 
   * Suspends the polling. Use <resume> to reactive the session. Fires a
   * suspend event.
   */
  suspend();
  /**
   * Function: resume
   * 
   * Resumes the session if it has been suspended. Fires a resume-event
   * before starting the polling.
   */
  resume(type?: any, attr?: any, value?: any);
  /**
   * Function: stop
   * 
   * Stops the session and fires a disconnect event. The given reason is
   * passed to the disconnect event listener as the second argument.
   */
  stop(reason: string);
  /**
   * Function: poll
   * 
   * Sends an asynchronous GET request to <urlPoll>.
   */
  poll();
  /**
   * Function: notify
   * 
   * Sends out the specified XML to <urlNotify> and fires a <notify> event.
   */
  notify(xml: any, onLoad: any, onError: any);
  /**
   * Function: get
   * 
   * Sends an asynchronous get request to the given URL, fires a <get> event
   * and invokes the given onLoad function when a response is received.
   */
  getFunct(url: string, onLoad: ICallback, onError: ICallback);
  /**
   * Function: isValidResponse
   * 
   * Returns true if the response data in the given <mxXmlRequest> is valid.
   */
  isValidResponse(req: any): boolean;
  /**
   * Function: encodeChanges
   * 
   * Returns the XML representation for the given array of changes.
   */
  encodeChanges(changes: any[], invert: boolean): string;
  /**
   * Function: receive
   * 
   * Processes the given node by applying the changes to the model. If the nodename
   * is state, then the namespace is used as a prefix for creating Ids in the model,
   * and the child nodes are visited recursively. If the nodename is delta, then the
   * changes encoded in the child nodes are applied to the model. Each call to the
   * receive function fires a <receive> event with the given node as the second argument
   * after processing. If changes are processed, then the function additionally fires
   * a <mxEvent.FIRED> event before the <mxEvent.RECEIVE> event.
   */
  receive(node: Node);
  /**
   * Function: processState
   * 
   * Processes the given state node which contains the current state of the
   * remote model.
   */
  processState(node: Node);
  /**
   * Function: processDelta
   * 
   * Processes the given delta node which contains a sequence of edits which in
   * turn map to one transaction on the remote model each.
   */
  processDelta(node: Node);
  /**
   * Function: processEdit
   * 
   * Processes the given edit by executing its changes and firing the required
   * events via the model.
   */
  processEdit(node: Node);
  /**
   * Function: createUndoableEdit
   * 
   * Creates a new <mxUndoableEdit> that implements the notify function to fire a
   * <change> and <notify> event via the model.
   */
  createUndoableEdit(changes: any): mxUndoableEdit;
  /**
   * Function: decodeChanges
   * 
   * Decodes and executes the changes represented by the children in the
   * given node. Returns an array that contains all changes.
   */
  decodeChanges(node: Node): any[];
  /**
   * Function: decodeChange
   * 
   * Decodes, executes and returns the change object represented by the given
   * XML node.
   */
  decodeChange(node: Node): Object;
  /**
   * Function: cellRemoved
   * 
   * Adds removed cells to the codec object lookup for references to the removed
   * cells after this point in time.
   */
  cellRemoved(cell: mxCell, codec: mxCodec);

}

declare var mxSession: {
  new (model: mxGraphModel, urlInit: string, urlPoll: string, urlNotify: string): mxSession;
  prototype: mxSession;
}

interface mxToolbar extends mxEventSource {

  /**
   * Variable: container
   * 
   * Reference to the DOM nodes that contains the toolbar.
   */
  container: Element;
  /**
   * Variable: enabled
   * 
   * Specifies if events are handled. Default is true.
   */
  enabled: boolean;
  /**
   * Variable: noReset
   * 
   * Specifies if <resetMode> requires a forced flag of true for resetting
   * the current mode in the toolbar. Default is false. This is set to true
   * if the toolbar item is double clicked to avoid a reset after a single
   * use of the item.
   */
  noReset: boolean;
  /**
   * Variable: updateDefaultMode
   * 
   * Boolean indicating if the default mode should be the last selected
   * switch mode or the first inserted switch mode. Default is true, that
   * is the last selected switch mode is the default mode. The default mode
   * is the mode to be selected after a reset of the toolbar. If this is
   * false, then the default mode is the first inserted mode item regardless
   * of what was last selected. Otherwise, the selected item after a reset is
   * the previously selected item.
   */
  updateDefaultMode: boolean;
  /**
   * Function: addItem
   * 
   * Adds the given function as an image with the specified title and icon
   * and returns the new image node.
   * 
   * Parameters:
   * 
   * title - Optional string that is used as the tooltip.
   * icon - Optional URL of the image to be used. If no URL is given, then a
   * button is created.
   * funct - Function to execute on a mouse click.
   * pressedIcon - Optional URL of the pressed image. Default is a gray
   * background.
   * style - Optional style classname. Default is mxToolbarItem.
   * factoryMethod - Optional factory method for popup menu, eg.
   * function(menu, evt, cell) { menu.addItem('Hello, World!'); }
   */
  addItem(title?: string, icon?: string, funct?: ICallback, pressedIcon?: string, style?: string, factoryMethod?: any): HTMLElement;
  addCombo(style?: string): HTMLElement;
  addActionCombo(title: string, style?: string): HTMLElement;
  addOption(combo: any, title: string, value: any): HTMLElement;
  addSwitchMode(title: string, icon: string, funct: ICallback, pressedIcon: string, style: string): HTMLElement;
  addMode(title: string, icon: string, funct: ICallback, pressedIcon?: string, style?: string, toggle?: boolean): HTMLElement;
  selectMode(domNode: Node, funct: ICallback);
  resetMode(forced: boolean);
  addSeparator(icon: any): any;
  addBreak();
  addLine();
  destroy();

}

declare var mxToolbar: {
  new (container: Element): mxToolbar;
  prototype: mxToolbar;
}

interface mxUndoableEdit {

  /**
   * Variable: source
   * 
   * Specifies the source of the edit.
   */
  source: any;
  /**
   * Variable: changes
   * 
   * Array that contains the changes that make up this edit. The changes are
   * expected to either have an undo and redo function, or an execute
   * function. Default is an empty array.
   */
  changes: any[];
  /**
   * Variable: significant
   * 
   * Specifies if the undoable change is significant.
   * Default is true.
   */
  significant: boolean;
  /**
   * Variable: undone
   * 
   * Specifies if this edit has been undone. Default is false.
   */
  undone: boolean;
  /**
   * Variable: redone
   * 
   * Specifies if this edit has been redone. Default is false.
   */
  redone: boolean;
  /**
   * Function: isEmpty
   * 
   * Returns true if the this edit contains no changes.
   */
  isEmpty(): boolean;
  /**
   * Function: isSignificant
   * 
   * Returns <significant>.
   */
  isSignificant(): boolean;
  /**
   * Function: add
   * 
   * Adds the specified change to this edit. The change is an object that is
   * expected to either have an undo and redo, or an execute function.
   */
  add(change: any);
  /**
   * Function: notify
   * 
   * Hook to notify any listeners of the changes after an <undo> or <redo>
   * has been carried out. This implementation is empty.
   */
  notify();
  /**
   * Function: die
   * 
   * Hook to free resources after the edit has been removed from the command
   * history. This implementation is empty.
   */
  die();
  /**
   * Function: undo
   * 
   * Undoes all changes in this edit.
   */
  undo();
  /**
   * Function: redo
   * 
   * Redoes all changes in this edit.
   */
  redo();

}

declare var mxUndoableEdit: {
  new (source: any, significant: boolean): mxUndoableEdit;
  prototype: mxUndoableEdit;
}

interface mxUndoManager extends mxEventSource {

  /**
   * Variable: size
   * 
   * Maximum command history size. 0 means unlimited history. Default is
   * 100.
   */
  size: number;
  /**
   * Variable: history
   * 
   * Array that contains the steps of the command history.
   */
  history: any[];
  /**
   * Variable: indexOfNextAdd
   * 
   * Index of the element to be added next.
   */
  indexOfNextAdd: number;
  /**
   * Function: isEmpty
   * 
   * Returns true if the history is empty.
   */
  isEmpty(): boolean;
  /**
   * Function: clear
   * 
   * Clears the command history.
   */
  clear();
  /**
   * Function: canUndo
   * 
   * Returns true if an undo is possible.
   */
  canUndo(): boolean;
  /**
   * Function: undo
   * 
   * Undoes the last change.
   */
  undo();
  /**
   * Function: canRedo
   * 
   * Returns true if a redo is possible.
   */
  canRedo(): boolean;
  /**
   * Function: redo
   * 
   * Redoes the last change.
   */
  redo();
  /**
   * Function: undoableEditHappened
   * 
   * Method to be called to add new undoable edits to the <history>.
   */
  undoableEditHappened(undoableEdit: any);
  /**
   * Function: trim
   * 
   * Removes all pending steps after <indexOfNextAdd> from the history,
   * invoking die on each edit. This is called from <undoableEditHappened>.
   */
  trim();


}

declare var mxUndoManager: {
  new (size: number): mxUndoManager;
  prototype: mxUndoManager;
}

interface mxUrlConverter {

  /**
   * Variable: enabled
   * 
   * Specifies if the converter is enabled. Default is true.
   */
  enabled: boolean;
  /**
   * Variable: baseUrl
   * 
   * Specifies the base URL to be used as a prefix for relative URLs.
   */
  baseUrl: URL;
  /**
   * Variable: baseDomain
   * 
   * Specifies the base domain to be used as a prefix for absolute URLs.
   */
  baseDomain: URL;
  /**
   * Function: updateBaseUrl
   * 
   * Private helper function to update the base URL.
   */
  updateBaseUrl();
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
   * Function: getBaseUrl
   * 
   * Returns <baseUrl>.
   */
  getBaseUrl(): URL;
  /**
   * Function: setBaseUrl
   * 
   * Sets <baseUrl>.
   */
  setBaseUrl(value: URL);
  /**
   * Function: getBaseDomain
   * 
   * Returns <baseDomain>.
   */
  getBaseDomain(): URL;
  /**
   * Function: setBaseDomain
   * 
   * Sets <baseDomain>.
   */
  setBaseDomain(value: URL);
  /**
   * Function: isRelativeUrl
   * 
   * Returns true if the given URL is relative.
   */
  isRelativeUrl(url: URL): boolean;
  /**
   * Function: convert
   * 
   * Converts the given URL to an absolute URL with protol and domain.
   * Relative URLs are first converted to absolute URLs.
   */
  convert(url: URL): URL;

}

declare var mxUrlConverter: {
  new (): mxUrlConverter;
  prototype: mxUrlConverter;
}

interface mxWindow extends mxEventSource {

  /**
   * Variable: closeImage
   * 
   * URL of the image to be used for the close icon in the titlebar.
   */
  closeImage: URL;
  /**
   * Variable: minimizeImage
   * 
   * URL of the image to be used for the minimize icon in the titlebar.
   */
  minimizeImage: URL;
  /**
   * Variable: normalizeImage
   * 
   * URL of the image to be used for the normalize icon in the titlebar.
   */
  normalizeImage: URL;
  /**
   * Variable: maximizeImage
   * 
   * URL of the image to be used for the maximize icon in the titlebar.
   */
  maximizeImage: URL;
  /**
   * Variable: normalizeImage
   * 
   * URL of the image to be used for the resize icon.
   */
  resizeImage: URL;
  /**
   * Variable: visible
   * 
   * Boolean flag that represents the visible state of the window.
   */
  visible: boolean;
  /**
   * Variable: minimumSize
   * 
   * <mxRectangle> that specifies the minimum width and height of the window.
   * Default is (50, 40).
   */
  minimumSize: mxRectangle;
  /**
   * Variable: destroyOnClose
   * 
   * Specifies if the window should be destroyed when it is closed. If this
   * is false then the window is hidden using <setVisible>. Default is true.
   */
  destroyOnClose: boolean;
  /**
   * Variable: contentHeightCorrection
   * 
   * Defines the correction factor for computing the height of the contentWrapper.
   * Default is 6 for IE 7/8 standards mode and 2 for all other browsers and modes.
   */
  contentHeightCorrection: number;
  /**
   * Variable: title
   * 
   * Reference to the DOM node (TD) that contains the title.
   */
  title: Node;
  /**
   * Variable: content
   * 
   * Reference to the DOM node that represents the window content.
   */
  content: Node;
  /**
   * Function: init
   * 
   * Initializes the DOM tree that represents the window.
   */
  init(x: number, y: number, width: number, height: number, style: string);
  /**
   * Function: setTitle
   * 
   * Sets the window title to the given string. HTML markup inside the title
   * will be escaped.
   */
  setTitle(title: Node);
  /**
   * Function: setScrollable
   * 
   * Sets if the window contents should be scrollable.
   */
  setScrollable(scrollable: boolean);
  /**
   * Function: activate
   * 
   * Puts the window on top of all other windows.
   */
  activate();
  /**
   * Function: getElement
   * 
   * Returuns the outermost DOM node that makes up the window.
   */
  getElement(): Element;
  /**
   * Function: fit
   * 
   * Makes sure the window is inside the client area of the window.
   */
  fit();
  /**
   * Function: isResizable
   * 
   * Returns true if the window is resizable.
   */
  isResizable(): boolean;
  /**
   * Function: setResizable
   * 
   * Sets if the window should be resizable. To avoid interference with some
   * built-in features of IE10 and later, the use of the following code is
   * recommended if there are resizable <mxWindow>s in the page:
   * 
   * (code)
   * if (mxClient.IS_POINTER)
   * {
   *   document.body.style.msTouchAction = 'none';
   * }
   * (end)
   */
  setResizable(resizable: boolean);
  /**
   * Function: setSize
   * 
   * Sets the size of the window.
   */
  setSize(width: number, height: number);
  /**
   * Function: setMinimizable
   * 
   * Sets if the window is minimizable.
   */
  setMinimizable(minimizable: boolean);
  /**
   * Function: getMinimumSize
   * 
   * Returns an <mxRectangle> that specifies the size for the minimized window.
   * A width or height of 0 means keep the existing width or height. This
   * implementation returns the height of the window title and keeps the width.
   */
  getMinimumSize(): mxRectangle;
  /**
   * Function: installMinimizeHandler
   * 
   * Installs the event listeners required for minimizing the window.
   */
  installMinimizeHandler();
  /**
   * Function: setMaximizable
   * 
   * Sets if the window is maximizable.
   */
  setMaximizable(maximizable: boolean);
  /**
   * Function: installMaximizeHandler
   * 
   * Installs the event listeners required for maximizing the window.
   */
  installMaximizeHandler();
  /**
   * Function: installMoveHandler
   * 
   * Installs the event listeners required for moving the window.
   */
  installMoveHandler();
  /**
   * Function: setLocation
   * 
   * Sets the upper, left corner of the window.
   */
  setLocation(x: number, y: number);
  /**
   * Function: getX
   *
   * Returns the current position on the x-axis.
   */
  getX(): number;
  /**
   * Function: getY
   *
   * Returns the current position on the y-axis.
   */
  getY(): number;
  /**
   * Function: installCloseHandler
   *
   * Adds the <closeImage> as a new image node in <closeImg> and installs the
   * <close> event.
   */
  installCloseHandler();
  /**
   * Function: setImage
   * 
   * Sets the image associated with the window.
   * 
   * Parameters:
   * 
   * image - URL of the image to be used.
   */
  setImage(image: URL);
  /**
   * Function: setClosable
   * 
   * Sets the image associated with the window.
   * 
   * Parameters:
   * 
   * closable - Boolean specifying if the window should be closable.
   */
  setClosable(closable: boolean);
  /**
   * Function: isVisible
   * 
   * Returns true if the window is visible.
   */
  isVisible(): boolean;
  /**
   * Function: setVisible
   *
   * Shows or hides the window depending on the given flag.
   * 
   * Parameters:
   * 
   * visible - Boolean indicating if the window should be made visible.
   */
  setVisible(visible: boolean);
  /**
   * Function: show
   *
   * Shows the window.
   */
  show();
  /**
   * Function: hide
   *
   * Hides the window.
   */
  hide();
  /**
   * Function: destroy
   *
   * Destroys the window and removes all associated resources. Fires a
   * <destroy> event prior to destroying the window.
   */
  destroy();

}

declare var mxWindow: {
  new (title: string, content: Node, x: number, y: number, width: number, height?: number,
    minimizable?: boolean, movable?: boolean, replaceNode?: Node, style?: string): mxWindow;
  prototype: mxWindow;
}

interface mxXmlCanvas2D extends mxAbstractCanvas2D {

  /**
   * Variable: textEnabled
   * 
   * Specifies if text output should be enabled. Default is true.
   */
  textEnabled: boolean;
  /**
   * Variable: compressed
   * 
   * Specifies if the output should be compressed by removing redundant calls.
   * Default is true.
   */
  compressed: boolean;
  /**
   * Function: writeDefaults
   * 
   * Writes the rendering defaults to <root>:
   */
  writeDefaults();
  /**
   * Function: format
   * 
   * Returns a formatted number with 2 decimal places.
   */
  format(value: number): number;
  /**
   * Function: createElement
   * 
   * Creates the given element using the owner document of <root>.
   */
  createElement(name: string): Element;
  /**
   * Function: save
   * 
   * Saves the drawing state.
   */
  save();
  /**
   * Function: restore
   * 
   * Restores the drawing state.
   */
  restore();
  /**
   * Function: scale
   * 
   * Scales the output.
   * 
   * Parameters:
   * 
   * scale - Number that represents the scale where 1 is equal to 100%.
   */
  scale(value: number);
  /**
   * Function: translate
   * 
   * Translates the output.
   * 
   * Parameters:
   * 
   * dx - Number that specifies the horizontal translation.
   * dy - Number that specifies the vertical translation.
   */
  translate(dx: number, dy: number);
  /**
   * Function: rotate
   * 
   * Rotates and/or flips the output around a given center. (Note: Due to
   * limitations in VML, the rotation cannot be concatenated.)
   * 
   * Parameters:
   * 
   * theta - Number that represents the angle of the rotation (in degrees).
   * flipH - Boolean indicating if the output should be flipped horizontally.
   * flipV - Boolean indicating if the output should be flipped vertically.
   * cx - Number that represents the x-coordinate of the rotation center.
   * cy - Number that represents the y-coordinate of the rotation center.
   */
  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number);
  /**
   * Function: setAlpha
   * 
   * Sets the current alpha.
   * 
   * Parameters:
   * 
   * value - Number that represents the new alpha. Possible values are between
   * 1 (opaque) and 0 (transparent).
   */
  setAlpha(value: number);
  /**
   * Function: setFillColor
   * 
   * Sets the current fill color.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setFillColor(value: string);
  /**
   * Function: setGradient
   * 
   * Sets the gradient. Note that the coordinates may be ignored by some implementations.
   * 
   * Parameters:
   * 
   * color1 - Hexadecimal representation of the start color.
   * color2 - Hexadecimal representation of the end color.
   * x - X-coordinate of the gradient region.
   * y - y-coordinate of the gradient region.
   * w - Width of the gradient region.
   * h - Height of the gradient region.
   * direction - One of <mxConstants.DIRECTION_NORTH>, <mxConstants.DIRECTION_EAST>,
   * <mxConstants.DIRECTION_SOUTH> or <mxConstants.DIRECTION_WEST>.
   * alpha1 - Optional alpha of the start color. Default is 1. Possible values
   * are between 1 (opaque) and 0 (transparent).
   * alpha2 - Optional alpha of the end color. Default is 1. Possible values
   * are between 1 (opaque) and 0 (transparent).
   */
  setGradient(color1: string, color2: string, x: number, y: number, w: number, h: number,
    direction: mxConstants, alpha1?: number, alpha2?: number);
  /**
   * Function: setStrokeColor
   * 
   * Sets the current stroke color.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setStrokeColor(value: string);
  /**
   * Function: setStrokeWidth
   * 
   * Sets the current stroke width.
   * 
   * Parameters:
   * 
   * value - Numeric representation of the stroke width.
   */
  setStrokeWidth(value: number);
  /**
   * Function: setDashed
   * 
   * Enables or disables dashed lines.
   * 
   * Parameters:
   * 
   * value - Boolean that specifies if dashed lines should be enabled.
   */
  setDashed(value: boolean);
  /**
   * Function: setDashPattern
   * 
   * Sets the current dash pattern. Default is '3 3'.
   * 
   * Parameters:
   * 
   * value - String that represents the dash pattern, which is a sequence of
   * numbers defining the length of the dashes and the length of the spaces
   * between the dashes. The lengths are relative to the line width - a length
   * of 1 is equals to the line width.
   */
  setDashPattern(value: string);
  /**
   * Function: setLineCap
   * 
   * Sets the line cap. Default is 'flat' which corresponds to 'butt' in SVG.
   * 
   * Parameters:
   * 
   * value - String that represents the line cap. Possible values are flat, round
   * and square.
   */
  setLineCap(value: string);
  /**
   * Function: setLineJoin
   * 
   * Sets the line join. Default is 'miter'.
   * 
   * Parameters:
   * 
   * value - String that represents the line join. Possible values are miter,
   * round and bevel.
   */
  setLineJoin(value: string);
  /**
   * Function: setMiterLimit
   * 
   * Sets the miter limit. Default is 10.
   * 
   * Parameters:
   * 
   * value - Number that represents the miter limit.
   */
  setMiterLimit(value: number);
  /**
   * Function: setFontColor
   * 
   * Sets the current font color. Default is '#000000'.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setFontColor(value: string);
  /**
   * Function: setFontBackgroundColor
   * 
   * Sets the current font background color.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setFontBackgroundColor(value: string);
  /**
   * Function: setFontBorderColor
   * 
   * Sets the current font border color.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setFontBorderColor(value: string);
  /**
   * Function: setFontSize
   * 
   * Sets the current font size. Default is <mxConstants.DEFAULT_FONTSIZE>.
   * 
   * Parameters:
   * 
   * value - Numeric representation of the font size.
   */
  setFontSize(value: number);
  /**
   * Function: setFontFamily
   * 
   * Sets the current font family. Default is <mxConstants.DEFAULT_FONTFAMILY>.
   * 
   * Parameters:
   * 
   * value - String representation of the font family. This handles the same
   * values as the CSS font-family property.
   */
  setFontFamily(value: string);
  /**
   * Function: setFontStyle
   * 
   * Sets the current font style.
   * 
   * Parameters:
   * 
   * value - Numeric representation of the font family. This is the sum of the
   * font styles from <mxConstants>.
   */
  setFontStyle(value: string);
  /**
   * Function: setShadow
   * 
   * Enables or disables shadows.
   * 
   * Parameters:
   * 
   * value - Boolean that specifies if shadows should be enabled.
   */
  setShadow(value: boolean);
  /**
   * Function: setShadowColor
   * 
   * Sets the current shadow color. Default is <mxConstants.SHADOWCOLOR>.
   * 
   * Parameters:
   * 
   * value - Hexadecimal representation of the color or 'none'.
   */
  setShadowColor(value: string);
  /**
   * Function: setShadowAlpha
   * 
   * Sets the current shadows alpha. Default is <mxConstants.SHADOW_OPACITY>.
   * 
   * Parameters:
   * 
   * value - Number that represents the new alpha. Possible values are between
   * 1 (opaque) and 0 (transparent).
   */
  setShadowAlpha(value: boolean);
  /**
   * Function: setShadowOffset
   * 
   * Sets the current shadow offset.
   * 
   * Parameters:
   * 
   * dx - Number that represents the horizontal offset of the shadow.
   * dy - Number that represents the vertical offset of the shadow.
   */
  setShadowOffset(dx: number, dy: number);
  /**
   * Function: rect
   * 
   * Puts a rectangle into the drawing buffer.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the rectangle.
   * y - Number that represents the y-coordinate of the rectangle.
   * w - Number that represents the width of the rectangle.
   * h - Number that represents the height of the rectangle.
   */
  rect(x: number, y: number, w: number, h: number);
  /**
   * Function: roundrect
   * 
   * Puts a rounded rectangle into the drawing buffer.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the rectangle.
   * y - Number that represents the y-coordinate of the rectangle.
   * w - Number that represents the width of the rectangle.
   * h - Number that represents the height of the rectangle.
   * dx - Number that represents the horizontal rounding.
   * dy - Number that represents the vertical rounding.
   */
  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number);
  /**
   * Function: ellipse
   * 
   * Puts an ellipse into the drawing buffer.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the ellipse.
   * y - Number that represents the y-coordinate of the ellipse.
   * w - Number that represents the width of the ellipse.
   * h - Number that represents the height of the ellipse.
   */
  ellipse(x: number, y: number, w: number, h: number);
  /**
   * Function: image
   * 
   * Paints an image.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the image.
   * y - Number that represents the y-coordinate of the image.
   * w - Number that represents the width of the image.
   * h - Number that represents the height of the image.
   * src - String that specifies the URL of the image.
   * aspect - Boolean indicating if the aspect of the image should be preserved.
   * flipH - Boolean indicating if the image should be flipped horizontally.
   * flipV - Boolean indicating if the image should be flipped vertically.
   */
  image(x: number, y: number, w: number, h: number, src: string, aspect: boolean, flipH: boolean, flipV: boolean);
  /**
   * Function: begin
   * 
   * Starts a new path and puts it into the drawing buffer.
   */
  begin();
  /**
   * Function: moveTo
   * 
   * Moves the current path the given point.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the point.
   * y - Number that represents the y-coordinate of the point.
   */
  moveTo(x: number, y: number);
  /**
   * Function: lineTo
   * 
   * Draws a line to the given coordinates.
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the endpoint.
   * y - Number that represents the y-coordinate of the endpoint.
   */
  lineTo(x: number, y: number);
  /**
   * Function: quadTo
   * 
   * Adds a quadratic curve to the current path.
   * 
   * Parameters:
   * 
   * x1 - Number that represents the x-coordinate of the control point.
   * y1 - Number that represents the y-coordinate of the control point.
   * x2 - Number that represents the x-coordinate of the endpoint.
   * y2 - Number that represents the y-coordinate of the endpoint.
   */
  quadTo(x1: number, y1: number, x2: number, y2: number);
  /**
   * Function: curveTo
   * 
   * Adds a bezier curve to the current path.
   * 
   * Parameters:
   * 
   * x1 - Number that represents the x-coordinate of the first control point.
   * y1 - Number that represents the y-coordinate of the first control point.
   * x2 - Number that represents the x-coordinate of the second control point.
   * y2 - Number that represents the y-coordinate of the second control point.
   * x3 - Number that represents the x-coordinate of the endpoint.
   * y3 - Number that represents the y-coordinate of the endpoint.
   */
  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number);
  /**
   * Function: close
   * 
   * Closes the current path.
   */
  close();
  /**
   * Function: text
   * 
   * Paints the given text. Possible values for format are empty string for
   * plain text and html for HTML markup. Background and border color as well
   * as clipping is not available in plain text labels for VML. HTML labels
   * are not available as part of shapes with no foreignObject support in SVG
   * (eg. IE9, IE10).
   * 
   * Parameters:
   * 
   * x - Number that represents the x-coordinate of the text.
   * y - Number that represents the y-coordinate of the text.
   * w - Number that represents the width of the text or 0 for automatic width.
   * h - Number that represents the height of the text or 0 for automatic height.
   * str - String that specifies the text to be painted.
   * align - String that represents the horizontal alignment.
   * valign - String that represents the vertical alignment.
   * wrap - Boolean that specifies if word-wrapping is enabled. Requires w > 0.
   * format - Empty string for plain text or 'html' for HTML markup.
   * overflow - Specifies the overflow behaviour of the label. Requires w > 0 and/or h > 0.
   * clip - Boolean that specifies if the label should be clipped. Requires w > 0 and/or h > 0.
   * rotation - Number that specifies the angle of the rotation around the anchor point of the text.
   */
  text(x: number, y: number, w: number, h: number, str: string, align: string, valign: string,
    wrap: boolean, format: string, overflow: string, clip: boolean, rotation: number);
  /**
   * Function: stroke
   * 
   * Paints the outline of the current drawing buffer.
   */
  stroke();
  /**
   * Function: fill
   * 
   * Fills the current drawing buffer.
   */
  fill();
  /**
   * Function: fillAndStroke
   * 
   * Fills the current drawing buffer and its outline.
   */
  fillAndStroke();

}

declare var mxXmlCanvas2D: {
  new (root: any): mxXmlCanvas2D;
  prototype: mxXmlCanvas2D;
}

interface mxXmlRequest {

  /**
   * Variable: url
   * 
   * Holds the target URL of the request.
   */
  url: URL;
  /**
   * Variable: params
   * 
   * Holds the form encoded data for the POST request.
   */
  params: any;
  /**
   * Variable: method
   * 
   * Specifies the request method. Possible values are POST and GET. Default
   * is POST.
   */
  method: any;
  /**
   * Variable: async
   * 
   * Boolean indicating if the request is asynchronous.
   */
  async: boolean;
  /**
   * Variable: binary
   * 
   * Boolean indicating if the request is binary. This option is ignored in IE.
   * In all other browsers the requested mime type is set to
   * text/plain; charset=x-user-defined. Default is false.
   */
  binary: boolean;
  /**
   * Variable: withCredentials
   * 
   * Specifies if withCredentials should be used in HTML5-compliant browsers. Default is
   * false.
   */
  withCredentials: boolean;
  /**
   * Variable: username
   * 
   * Specifies the username to be used for authentication.
   */
  username: string;
  /**
   * Variable: password
   * 
   * Specifies the password to be used for authentication.
   */
  password: string;
  /**
   * Variable: request
   * 
   * Holds the inner, browser-specific request object.
   */
  request: Object;
  /**
   * Variable: decodeSimulateValues
   * 
   * Specifies if request values should be decoded as URIs before setting the
   * textarea value in <simulate>. Defaults to false for backwards compatibility,
   * to avoid another decode on the server this should be set to true.
   */
  decodeSimulateValues: boolean;
  /**
   * Function: isBinary
   * 
   * Returns <binary>.
   */
  isBinary(): boolean;
  /**
   * Function: setBinary
   * 
   * Sets <binary>.
   */
  setBinary(value: boolean);
  /**
   * Function: getText
   * 
   * Returns the response as a string.
   */
  //getText(): string;
  /**
   * Function: isReady
   * 
   * Returns true if the response is ready.
   */
  isReady(): boolean;
  /**
   * Function: getDocumentElement
   * 
   * Returns the document element of the response XML document.
   */
  getDocumentElement(): Element;
  /**
   * Function: getXml
   * 
   * Returns the response as an XML document. Use <getDocumentElement> to get
   * the document element of the XML document.
   */
  getXml(): XMLDocument;
  /**
   * Function: getText
   * 
   * Returns the response as a string.
   */
  getText(): string;
  /**
   * Function: getStatus
   * 
   * Returns the status as a number, eg. 404 for "Not found" or 200 for "OK".
   * Note: The NS_ERROR_NOT_AVAILABLE for invalid responses cannot be cought.
   */
  getStatus(): boolean;
  /**
   * Function: create
   * 
   * Creates and returns the inner <request> object.
   */
  create(): Object;
  /**
   * Function: send
   * 
   * Send the <request> to the target URL using the specified functions to
   * process the response asychronously.
   * 
   * Parameters:
   * 
   * onload - Function to be invoked if a successful response was received.
   * onerror - Function to be called on any error.
   */
  send(onload: ICallback, onerror: ICallback);
  /**
   * Function: setRequestHeaders
   * 
   * Sets the headers for the given request and parameters. This sets the
   * content-type to application/x-www-form-urlencoded if any params exist.
   * 
   * Example:
   * 
   * (code)
   * request.setRequestHeaders = function(request, params)
   * {
   *   if (params != null)
   *   {
   *     request.setRequestHeader('Content-Type',
   *             'multipart/form-data');
   *     request.setRequestHeader('Content-Length',
   *             params.length);
   *   }
   * };
   * (end)
   * 
   * Use the code above before calling <send> if you require a
   * multipart/form-data request.   
   */
  setRequestHeaders(request: any, params: any);
  /**
   * Function: simulate
   * 
   * Creates and posts a request to the given target URL using a dynamically
   * created form inside the given document.
   * 
   * Parameters:
   * 
   * docs - Document that contains the form element.
   * target - Target to send the form result to.
   */
  simulate(doc: Document, target: any);

}

declare var mxXmlRequest: {
  new (url: URL, params: any, method: string, async: boolean, username: string, password: string): mxXmlRequest;
  prototype: mxXmlRequest;
}


interface mxTerminalMarker extends mxCellMarker {
}

//} 