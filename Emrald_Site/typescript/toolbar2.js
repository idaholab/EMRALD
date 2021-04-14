// Copyright 2021 Battelle Energy Alliance

/// <reference path="definitions/view.d.ts" />
/// <reference path="definitions/editor.d.ts" />
/// <reference path="definitions/handler.d.ts" />
/// <reference path="definitions/io.d.ts" />
/// <reference path="definitions/layout.d.ts" />
/// <reference path="definitions/model.d.ts" />
/// <reference path="definitions/shape.d.ts" />
/// <reference path="definitions/util.d.ts" />
//----------------------
// These code just to make mxClient available to fool TS.
// mxClient in js is a global object.
var MyClient = (function () {
    function MyClient() {
        this.IS_QUIRKS = false;
    }
    MyClient.prototype.isBrowserSupported = function () {
        return true;
    };
    return MyClient;
})();

var MyUtils = (function () {
    function MyUtils() {
    }
    MyUtils.prototype.error = function (message, width, close, icon) {
    };
    MyUtils.prototype.button = function (value, clickHandler) {
        return null;
    };
    MyUtils.prototype.makeDraggable = function (element, graphF, funct, dragElement, dx, dy, autoscroll, scalePreview, highlightDropTargets, getDropTarget) {
    };
    return MyUtils;
})();

if (typeof mxClient === 'undefined') {
    //just to fool TypeScript.
    var mxClient = new MyClient();
}

if (typeof mxUtils === 'undefined') {
    var mxUtils = new MyUtils();
}

//-----------------------------
var Examples;
(function (Examples) {
    var Toolbar = (function () {
        function Toolbar() {
            this.toolbar = null;
            this.model = null;
            this.graph = null;
            this.setup();
        }
        Toolbar.prototype.setup = function () {
            var connetImage = new mxImage('images/connector.gif', 16, 16);
            if (!mxClient.isBrowserSupported()) {
                mxUtils.error('Browser is not supported!', 200, false);
                return;
            }

            var tbContainer = document.createElement('div');
            tbContainer.style.position = 'absolute';
            tbContainer.style.overflow = 'hidden';
            tbContainer.style.padding = '2px';
            tbContainer.style.left = '0px';
            tbContainer.style.top = '26px';
            tbContainer.style.width = '24px';
            tbContainer.style.bottom = '0px';

            document.body.appendChild(tbContainer);

            // Creates new toolbar without event processing
            this.toolbar = new mxToolbar(tbContainer);
            this.toolbar.enabled = false;

            // Creates the div for the graph
            var container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.overflow = 'hidden';
            container.style.left = '24px';
            container.style.top = '26px';
            container.style.right = '0px';
            container.style.bottom = '0px';
            container.style.background = 'url("sample_images/grid.gif")';

            document.body.appendChild(container);

            // Workaround for Internet Explorer ignoring certain styles
            if (mxClient.IS_QUIRKS) {
                document.body.style.overflow = 'hidden';
                new mxDivResizer(tbContainer);
                new mxDivResizer(container);
            }

            // Creates the model and the graph inside the container
            // using the fastest rendering available on the browser
            this.model = new mxGraphModel();
            this.graph = new mxGraph(container, this.model);

            // Enables new connections in the graph
            this.graph.setConnectable(true);
            this.graph.setMultigraph(false);

            // Stops editing on enter or escape keypress
            var keyHandler = new mxKeyHandler(this.graph);
            var rubberband = new mxRubberband(this.graph);

            this.addVertex('sample_images/rectangle.gif', 100, 40, '');
            this.addVertex('sample_images/rounded.gif', 100, 40, 'shape=rounded');
            this.addVertex('sample_images/ellipse.gif', 40, 40, 'shape=ellipse');
            this.addVertex('sample_images/rhombus.gif', 40, 40, 'shape=rhombus');
            this.addVertex('sample_images/triangle.gif', 40, 40, 'shape=triangle');
            this.addVertex('sample_images/cylinder.gif', 40, 40, 'shape=cylinder');
            this.addVertex('sample_images/actor.gif', 30, 40, 'shape=actor');
            this.toolbar.addLine();

            var button = mxUtils.button('Create toolbar entry from selection', this.onButtonClick);
            button.style.position = 'absolute';
            button.style.left = '2px';
            button.style.top = '2px';
            document.body.appendChild(button);
        };

        Toolbar.prototype.addVertex = function (icon, w, h, style) {
            var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
            vertex.setVertex(true);

            this.addToolbarItem(this.graph, this.toolbar, vertex, icon);
        };

        Toolbar.prototype.addToolbarItem = function (graph, toolbar, prototype, image) {
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function (graph, evt, cell) {
                graph.stopEditing(false);

                var pt = graph.getPointForEvent(evt);
                var vertex = graph.getModel().cloneCell(prototype);

                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                graph.addCell(vertex);
                graph.setSelectionCell(vertex);
            };

            // Creates the image which is used as the drag icon (preview)
            var img = toolbar.addMode(null, image, funct);
            mxUtils.makeDraggable(img, graph, funct);
        };

        Toolbar.prototype.onButtonClick = function (evt) {
            if (!this.graph.isSelectionEmpty()) {
                var cells = this.graph.getSelectionCells();
                var bounds = this.graph.getView().getBounds(cells);

                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                var funct = function (graph, evt, cell) {
                    graph.stopEditing(false);

                    var pt = graph.getPointForEvent(evt);
                    var dx = pt.x - bounds.x;
                    var dy = pt.y - bounds.y;

                    var clones = graph.importCells(cells, dx, dy);
                    graph.setSelectionCells(clones);
                };
            }
        };
        return Toolbar;
    })();
    Examples.Toolbar = Toolbar;
})(Examples || (Examples = {}));

function main() {
    var toolbar = new Examples.Toolbar();
}
