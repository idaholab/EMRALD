// Copyright 2021 Battelle Energy Alliance

/// <reference path="util.d.ts" />
//declare module mxGraphModule {

   interface mxStencil {
    desc: string;
    constraints: mxConnectionConstraint[];
    parseDescription(): void;
    parseConstraints(): void;
    parseConstraint(node: Node): mxConnectionConstraint;
    defaultLocalized: boolean;
    aspect: string;
    w0: number;
    h0: number;
    bgNode: any;
    fgNode: any;
    strokewidth: number;
    evaluateTextAttribute(node: Node, attribute: any, state: mxCellState): string;
    evaluateAttribute(node: Node, attribute: any, shape: mxCellState): string;
    drawShape(canvas: mxAbstractCanvas2D, shape: mxShape, x: number, y: number, w: number, h: number);
    drawChildren(canvas: mxAbstractCanvas2D, shape: mxShape, x: number, y: number, w: number, h: number, node: Node, disabledShadow: boolean);
    computeAspect(shape: mxShape, x: number, y: number, w: number, h: number, direction: mxConstants): mxRectangle;
    drawNode(canvas: mxAbstractCanvas2D, shape: mxShape, node: Node, aspect: Object, disableShadow: boolean);
  }
  declare var mxStencil: {
    new (desc: Node): mxStencil;
    prototype: mxStencil;
  }

   interface mxShape {

    stencil: mxStencil;
    strokewidth: number;
    rotation: number;
    opacity: number;
    flipH: boolean;
    flipV: boolean;

    dialect: string;
    scale: number;
    bounds: mxRectangle;
    points: mxPoint[];
    node: Element;
    state: mxCellState;
    style: string;
    boundBox: mxRectangle;
    svgStrokeTolerance: number;
    pointerEvents: boolean;
    stencilPointerEvents: boolean;
    vmlScale: number;

    init(container: Node);
    isParseVml(): boolean;
    isHtmlAllowed(): boolean;
    getSvgScreenOffset(): number;
    create(container: Node): Element; //return DOM element.
    createSvg(): Element;
    createVml(): Element;
    createHtml(): Element;
    reconfigure();
    redraw();
    clear();
    updateBoundsFromPoints();
    getLabelBounds(rect): mxRectangle;
    checkBounds();
    createVmlGroup(): Element;
    redrawShape();
    createCanvas(): mxAbstractCanvas2D;
    createSvgCanvas(): mxSvgCanvas2D;
    createVmlCanvas(): mxVmlCanvas2D;
    updateVmlContainer();
    redrawHtmlShape();
    updateHtmlFilters(node: Node);
    updateHtmlColors(node: Node);
    updateHtmlBounds(node: Node);
    destroyCanvas(canvas: mxAbstractCanvas2D);
    paint(c: Object);
    configureCanvas(c: Object, x: number, y: number, w: number, h: number);
    getGradientBounds(c: Object, x: number, y: number, w: number, h: number): mxRectangle;
    updateTransform(c: Object, x: number, y: number, w: number, h: number);
    paintStencilShape(c: Object, x: number, y: number, w: number, h: number);
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
    paintBackground(c: Object, x: number, y: number, w: number, h: number);
    paintForeground(c: Object, x: number, y: number, w: number, h: number);
    paintEdgeShape(c: Object, pts: mxPoint[]);
    getArcSize(w: number, h: number): number;
    paintGlassEffect(c: Object, x: number, y: number, w: number, h: number, arc: number);
    apply(state: mxCellState);
    setCursor(cursor: any);
    getCursor(): any; // Returns the current cursor.
    updateBoundingBox();
    createBoundingBox(): mxRectangle;
    augmentBoundingBox(bbox: mxRectangle);
    isPaintBoundsInverted(): boolean;
    getRotation(): number;
    getTextRotation(): number;
    getShapeRotation(): number;
    createTransparentSvgRectangle(x: number, y: number, w: number, h: number): Element;
    addTransparentBackgroundRectangle(node: Node, x: number, y: number, w: number, h: number);
    setTransparentBackgroundImage(node: Node);
    releaseSvgGradients(grads: any[]);
    destroy();
  }
  declare var mxShape: {
    new (stencil): mxShape;
    prototype: mxShape;
  }

   interface mxActor extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
       redrawPath(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxActor: {
    new (bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number): mxActor;
    prototype: mxActor;
  }

   interface mxArrow extends mxShape {
    points: mxPoint[];
    fill: string;
    stroke: string;
    strokewidth: number;
    arrowWidth: number;
    spacing: number;
    endSize: number;
    paintEdgeShape(c: Object, pts: mxPoint[]);
  }
  declare var mxArrow: {
    new (points: mxPoint[], fill: string, stroke: string, strokewidth?: number, arrowWidth?: number, spacing?: number, endSize?: number): mxArrow;
    prototype: mxArrow;
  }

   interface mxCloud extends mxActor {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    redrawPath(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxCloud: {
    new (bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number): mxCloud;
    prototype: mxCloud;
  }


   interface mxPolyline extends mxShape {
    points: mxPoint[];
    stroke: string;
    strokewidth: number;
    getRotation(): number;
    getShapeRotation(): number;
    isPaintBoundsInverted(): boolean;
    paintEdgeShape(c: Object, pts: mxPoint[]);
    paintLine(c: Object, pts: mxPoint[], rounded: boolean);
  }
  declare var mxPolyline: {
    new (points: mxPoint[], stroke: string, strokewidth?: number): mxPolyline;
    prototype: mxPolyline;
  }

   interface mxMarker {
    markers: any[];
    addMarker(type: any, funct: ICallback);
    createMarker(canvas: mxAbstractCanvas2D, shape: mxShape, type: mxConstants, pe: mxPoint, unitX: number, unitY: number, size: number, source: any, sw: number, filled: boolean): ICallback;
  }

  declare function arrow(canvas: mxAbstractCanvas2D, shape: mxShape, type: mxConstants, pe: mxPoint, unitX: number, unitY: number, size: number, source: any, sw: number, filled: boolean);
  declare function diamond(canvas: mxAbstractCanvas2D, shape: mxShape, type: mxConstants, pe: mxPoint, unitX: number, unitY: number, size: number, source: any, sw: number, filled: boolean);

   interface mxConnector extends mxPolyline {
    paintEdgeShape(c: Object, pts: mxPoint[]);
    paintCurvedLine(c: Object, pts: mxPoint[]);
    createMarker(c: Object, pts: mxPoint[], source: boolean): mxMarker;
    augmentBoundingBox(bbox: Object);
  }
  declare var mxConnector: {
    new (points: mxPoint[], stroke: string, strokewidth?: number): mxConnector;
    prototype: mxConnector;
  }

   interface mxCylinder extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    maxHeight: number;
    svgStrokeTolerance: number;
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
    redrawPath(c: Object, x: number, y: number, w: number, h: number, isForeground: boolean);
  }
  declare var mxCylinder: {
    new (bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number): mxCylinder;
    prototype: mxCylinder;
  }

   interface mxDoubleEllipse extends mxShape {
       bounds: mxRectangle;
       fill: string;
       stroke: string;
       strokewidth: number;
       vmlScale: number;
       paintForeground(c: Object, x: number, y: number, w: number, h: number);
       paintBackground(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxDoubleEllipse: {
    new (bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number): mxDoubleEllipse;
    prototype: mxDoubleEllipse;
  }

   interface mxEllipse extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxEllipse: {
    new (bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number): mxEllipse;
    prototype: mxEllipse;
  }

   interface mxHexagon extends mxActor {
    redrawPath(c: Object, x: number, y: number, w: number, h: number);
  }

  declare var mxHexagon: {
    new (): mxHexagon;
    prototype: mxHexagon;
  }
    interface mxImageShape extends mxShape {
    bounds: mxRectangle;
    image: string;
    fill: string;
    stroke: string;
    strokewidth: number;
    shadow: boolean;
    preserveImageAspect: boolean;
    getSvgScreenOffset(): number;
    apply(state: mxCellState);
    isHtmlAllowed(): boolean;
    createHtml(): Element;
    paintVertexShape(c: Object, x:number, y: number, w: number, h: number);
    redrawHtmlShape();
  }
  declare var mxImageShape: {
    new (bounds: mxRectangle, image: string, fill: string, stroke: string, strokewidth?: number): mxImageShape;
    prototype: mxImageShape;
  }

   interface mxRectangleShape extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    isHtmlAllowed(): boolean;
    paintBackground(c: Object, x: number, y: number, w: number, h: number);
    paintForeground(c: Object, x: number, y: number, w: number, h: number);
    redrawHtmlShape();
    updateHtmlBounds(node: Node);
    updateHtmlColors(node: Node);
    updateHtmlFilters(node: Node);
  }
  declare var mxRectangleShape: {
    new (bounds: mxRectangle, image: string, fill: string, stroke: string, strokewidth?: number): mxRectangleShape;
    prototype: mxRectangleShape;
  }


   interface mxLabel extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    imageSize: number;
    spacing: number;
    indicatorSize: number;
    indicatorSpacing: number;
    init(container: any);
    redraw();
    isHtmlAllowed(): boolean;
    paintBackground(c: Object, x: number, y: number, w: number, h: number);
    paintImage(c: Object, x: number, y: number, w: number, h: number);
    getImageBounds(x: number, y: number, w: number, h: number): mxRectangle;
    paintIndicator(c: Object, x: number, y: number, w: number, h: number);
    getIndicatorBounds(x: number, y: number, w: number, h: number): mxRectangle;
    redrawHtmlShape();
  }
  declare var mxLabel: {
    new (bounds: mxRectangle, image: string, fill: string, stroke: string, strokewidth?: number): mxLabel;
    prototype: mxLabel;
  }


   interface mxLine extends mxShape {
    bounds: mxRectangle;
    stroke: string;
    strokewidth: number;mx
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxLine: {
    new (bounds: mxRectangle, stroke: string, strokewidth?: number): mxLine;
    prototype: mxLine;
  }

   interface mxRhombus extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
  }
   declare var mxRhombus: {
     new (bounds: mxRectangle, image: string, fill: string, stroke: string, strokewidth?: number): mxRhombus;
     prototype: mxRhombus;
  }

   interface mxStencilRegistry {
    stencil: any[];
    addStencil(name: string, stencil: mxStencil);
    getStencil(name: string): mxStencil;
  }

    interface mxSwimlane extends mxShape {
    bounds: mxRectangle;
    fill: string;
    stroke: string;
    strokewidth: number;
    imageSize: number;
    getLabelBounds(rect: mxRectangle): mxRectangle;
    getGradientBounds(c: any, x: number, y: number, w: number, h: number): mxRectangle;
    getRotation(): number;
    getTextRotation(): number;
    isPaintBoundsInverted(): boolean;
    getArcSize(w: number, h: number, start?: number): number;
    isHorizontal(): boolean;
    paintVertexShape(c: Object, x: number, y: number, w: number, h: number);
    paintSwimlane(c: Object, x: number, y: number, w: number, h: number, start: number, fill: mxConstants, swimlaneLine: boolean);
    paintRoundedSwimlane(c: Object, x: number, y: number, w: number, h: number, start: number, r: number, fill: mxConstants, swimlaneLine: boolean);
    paintSeparator(c: Object, x: number, y: number, h: number, color: mxConstants);
    getImageBounds(x: number, y: number, w: number, h: number): mxRectangle;
  }
   declare var mxSwimlane: {
     new (bounds: mxRectangle, image: string, fill: string, stroke: string, strokewidth?: number): mxSwimlane;
     prototype: mxSwimlane;
  }

   interface mxText extends mxShape {
    value: string;
    bounds: mxRectangle;
    color: string;
    align: string;
    valign: string;
    family: string;
    size: number;
    fontStyle: number;
    spacing: number;
    spacingTop: number;
    spacingRight: number;
    spacingBottom: number;
    spacingLeft: number;
    horizontal: boolean;
    background: string;
    border: string;
    wrap: boolean;
    clipped: boolean;
    overflow: string;
    labelPadding: number;
    rotation: number;
    baseSpacingTop: number;
    baseSpacingBottom: number;
    baseSpacingLeft: number;
    baseSpacingRight: number;
    replaceLinefeeds: boolean;
    verticalTextRotation: number;
    ignoreClippedStringSize: boolean;
    ignoreStringSize: boolean;
    isParseVml(): boolean;
    isHtmlAllowed(): boolean;
    getSvgScreenOffset(): number;
    checkBounds(): boolean;
    apply(state: mxCellState);
    updateBoundingBox();
    getShapeRotation(): number;
    getTextRotation(): number;
    isPaintBoundsInverted(): boolean;
    configureCanvas(c: Object, x: number, y: number, w: number, h: number);
    updateVmlContainer();
    paint(c: Object);
    redrawHtmlShape();
    updateHtmlTransform();
    updateHtmlFilter();
    updateValue();
    updateFont(node: Node);
    updateSize(node: Node);  
    updateMargin();
    getSpacing(): mxPoint;

  }
  declare var mxText: {
    new (value: string, bounds: mxRectangle, align: string, valign: string, color: string,
      family: string, size: number, fontStyle: number, spacing: number, spacingTop: number, spacingRight: number,
      spacingBottom: number, spacingLeft: number, horizontal: boolean, background: string, border: string,
      wrap: boolean, clipped: boolean, overflow: string, labelPadding: number): mxText;
    prototype: mxText;
  }

   interface mxTriangle extends mxActor {
    redrawPath(c: Object, x: number, y: number, w: number, h: number);
  }
  declare var mxTriangle: {
    new (): mxTriangle;
    prototype: mxTriangle;
  }

//}
