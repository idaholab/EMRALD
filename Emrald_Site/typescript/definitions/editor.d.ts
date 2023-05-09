// Copyright 2021 Battelle Energy Alliance

/// <reference path="io.d.ts" />

//declare module mxGraphModule {

interface mxEditor extends mxEventSource {

    /**
     * Variable: askZoomResource
     * 
     * Specifies the resource key for the zoom dialog. If the resource for this
     * key does not exist then the value is used as the error message. Default
     * is 'askZoom'.
     */
    askZoomResource: string;
    /**
     * Variable: lastSavedResource
     * 
     * Specifies the resource key for the last saved info. If the resource for
     * this key does not exist then the value is used as the error message.
     * Default is 'lastSaved'.
     */
    lastSavedResource: string;
    /**
     * Variable: currentFileResource
     * 
     * Specifies the resource key for the current file info. If the resource for
     * this key does not exist then the value is used as the error message.
     * Default is 'lastSaved'.
     */
    currentFileResource: string;
    /**
     * Variable: propertiesResource
     * 
     * Specifies the resource key for the properties window title. If the
     * resource for this key does not exist then the value is used as the
     * error message. Default is 'properties'.
     */
    propertiesResource: string;
    /**
     * Variable: tasksResource
     * 
     * Specifies the resource key for the tasks window title. If the
     * resource for this key does not exist then the value is used as the
     * error message. Default is 'tasks'.
     */
    tasksResource: string;
    /**
     * Variable: helpResource
     * 
     * Specifies the resource key for the help window title. If the
     * resource for this key does not exist then the value is used as the
     * error message. Default is 'help'.
     */
    helpResource: string;
    /**
     * Variable: outlineResource
     * 
     * Specifies the resource key for the outline window title. If the
     * resource for this key does not exist then the value is used as the
     * error message. Default is 'outline'.
     */
    outlineResource: string;
    /**
     * Variable: outline
     * 
     * Reference to the <mxWindow> that contains the outline. The <mxOutline>
     * is stored in outline.outline.
     */
    outline: mxWindow;
    /**
     * Variable: graph
     *
     * Holds a <mxGraph> for displaying the diagram. The graph
     * is created in <setGraphContainer>.
     */
    graph: mxGraph;
    /**
     * Variable: graphRenderHint
     *
     * Holds the render hint used for creating the
     * graph in <setGraphContainer>. See <mxGraph>.
     * Default is null.
     */
    graphRenderHint: string;
    /**
     * Variable: toolbar
     *
     * Holds a <mxDefaultToolbar> for displaying the toolbar. The
     * toolbar is created in <setToolbarContainer>.
     */
    toolbar: mxDefaultToolbar;
    /**
     * Variable: session
     *
     * Holds a <mxSession> instance associated with this editor.
     */
    session: mxSession;
    /**
     * Variable: status
     *
     * DOM container that holds the statusbar. Default is null.
     * Use <setStatusContainer> to set this value.
     */
    status: Element;
    /**
     * Variable: popupHandler
     *
     * Holds a <mxDefaultPopupMenu> for displaying
     * popupmenus.
     */
    popupHandler: mxDefaultPopupMenu;
    /**
     * Variable: undoManager
     *
     * Holds an <mxUndoManager> for the command history.
     */
    undoManager: mxUndoManager;
    /**
     * Variable: keyHandler
     *
     * Holds a <mxDefaultKeyHandler> for handling keyboard events.
     * The handler is created in <setGraphContainer>.
     */
    keyHandler: mxDefaultKeyHandler;
    /**
     * Variable: actions
     *
     * Maps from actionnames to actions, which are functions taking
     * the editor and the cell as arguments. Use <addAction>
     * to add or replace an action and <execute> to execute an action
     * by name, passing the cell to be operated upon as the second
     * argument.
     */
    actions: any[];
    /**
     * Variable: dblClickAction
     *
     * Specifies the name of the action to be executed
     * when a cell is double clicked. Default is edit.
     * 
     * To handle a singleclick, use the following code.
     * 
     * (code)
     * editor.graph.addListener(mxEvent.CLICK, function(sender, evt)
     * {
     *   var e = evt.getProperty('event');
     *   var cell = evt.getProperty('cell');
     * 
     *   if (cell != null && !e.isConsumed())
     *   {
     *     // Do something useful with cell...
     *     e.consume();
     *   }
     * });
     * (end)
     */
    dblClickAction: string;
    /**
     * Variable: swimlaneRequired
     * 
     * Specifies if new cells must be inserted
     * into an existing swimlane. Otherwise, cells
     * that are not swimlanes can be inserted as
     * top-level cells. Default is false.
     */
    swimlaneRequired: boolean;
    /**
     * Variable: disableContextMenu
     *
     * Specifies if the context menu should be disabled in the graph container.
     * Default is true.
     */
    disableContextMenu: boolean;
    /**
     * Variable: insertFunction
     *
     * Specifies the function to be used for inserting new
     * cells into the graph. This is assigned from the
     * <mxDefaultToolbar> if a vertex-tool is clicked.
     */
    insertFunction: ICallback;
    /**
     * Variable: forcedInserting
     *
     * Specifies if a new cell should be inserted on a single
     * click even using <insertFunction> if there is a cell 
     * under the mousepointer, otherwise the cell under the 
     * mousepointer is selected. Default is false.
     */
    forcedInserting: boolean;
    /**
     * Variable: templates
     * 
     * Maps from names to protoype cells to be used
     * in the toolbar for inserting new cells into
     * the diagram.
     */
    templates: any[];
    /**
     * Variable: defaultEdge
     * 
     * Prototype edge cell that is used for creating
     * new edges.
     */
    defaultEdge: mxCell;
    /**
     * Variable: defaultEdgeStyle
     * 
     * Specifies the edge style to be returned in <getEdgeStyle>.
     * Default is null.
     */
    defaultEdgeStyle: string;
    /**
     * Variable: defaultGroup
     * 
     * Prototype group cell that is used for creating
     * new groups.
     */
    defaultGroup: any;
    /**
     * Variable: graphRenderHint
     *
     * Default size for the border of new groups. If null,
     * then then <mxGraph.gridSize> is used. Default is
     * null.
     */
    groupBorderSize: number;
    /**
     * Variable: filename
     *
     * Contains the URL of the last opened file as a string.
     * Default is null.
     */
    filename: URL;
    /**
     * Variable: lineFeed
     *
     * Character to be used for encoding linefeeds in <save>. Default is '&#xa;'.
     */
    linefeed: string;
    /**
     * Variable: postParameterName
     *
     * Specifies if the name of the post parameter that contains the diagram
     * data in a post request to the server. Default is xml.
     */
    postParameterName: string;
    /**
     * Variable: escapePostData
     *
     * Specifies if the data in the post request for saving a diagram
     * should be converted using encodeURIComponent. Default is true.
     */
    escapePostData: boolean;
    /**
     * Variable: urlPost
     *
     * Specifies the URL to be used for posting the diagram
     * to a backend in <save>.
     */
    urlPost: URL;
    /**
     * Variable: urlImage
     *
     * Specifies the URL to be used for creating a bitmap of
     * the graph in the image action.
     */
    urlImage: URL;
    /**
     * Variable: urlInit
     *
     * Specifies the URL to be used for initializing the session.
     */
    urlInit: URL;
    /**
     * Variable: urlNotify
     *
     * Specifies the URL to be used for notifying the backend
     * in the session.
     */
    urlNotify: URL;
    /**
     * Variable: urlPoll
     *
     * Specifies the URL to be used for polling in the session.
     */
    urlPoll: URL;
    /**
     * Variable: horizontalFlow
     *
     * Specifies the direction of the flow
     * in the diagram. This is used in the
     * layout algorithms. Default is false,
     * ie. vertical flow.
     */
    horizontalFlow: boolean;
    /**
     * Variable: layoutDiagram
     *
     * Specifies if the top-level elements in the
     * diagram should be layed out using a vertical
     * or horizontal stack depending on the setting
     * of <horizontalFlow>. The spacing between the
     * swimlanes is specified by <swimlaneSpacing>.
     * Default is false.
     * 
     * If the top-level elements are swimlanes, then
     * the intra-swimlane layout is activated by
     * the <layoutSwimlanes> switch.
     */
    layoutDiagram: boolean;
    /**
     * Variable: swimlaneSpacing
     *
     * Specifies the spacing between swimlanes if
     * automatic layout is turned on in
     * <layoutDiagram>. Default is 0.
     */
    swimlaneSpacing: number;
    /**
     * Variable: maintainSwimlanes
     * 
     * Specifies if the swimlanes should be kept at the same
     * width or height depending on the setting of
     * <horizontalFlow>.  Default is false.
     * 
     * For horizontal flows, all swimlanes
     * have the same height and for vertical flows, all swimlanes
     * have the same width. Furthermore, the swimlanes are
     * automatically "stacked" if <layoutDiagram> is true.
     */
    maintainSwimlanes: boolean;
    /**
     * Variable: layoutSwimlanes
     *
     * Specifies if the children of swimlanes should
     * be layed out, either vertically or horizontally
     * depending on <horizontalFlow>.
     * Default is false.
     */
    layoutSwimlanes: boolean;
    /**
     * Variable: cycleAttributeValues
     * 
     * Specifies the attribute values to be cycled when
     * inserting new swimlanes. Default is an empty
     * array.
     */
    cycleAttributeValues: any[];
    /**
     * Variable: cycleAttributeIndex
     * 
     * Index of the last consumed attribute index. If a new
     * swimlane is inserted, then the <cycleAttributeValues>
     * at this index will be used as the value for
     * <cycleAttributeName>. Default is 0.
     */
    cycleAttributeIndex: number;
    /**
     * Variable: cycleAttributeName
     * 
     * Name of the attribute to be assigned a <cycleAttributeValues>
     * when inserting new swimlanes. Default is fillColor.
     */
    cycleAttributeName: string;
    /**
     * Variable: tasks
     * 
     * Holds the <mxWindow> created in <showTasks>.
     */
    tasks: mxWindow;
    /**
     * Variable: tasksWindowImage
     *
     * Icon for the tasks window.
     */
    tasksWindowImage: any;
    /**
     * Variable: tasksTop
     * 
     * Specifies the top coordinate of the tasks window in pixels.
     * Default is 20.
     */
    tasksTop: number;
    /**
     * Variable: help
     * 
     * Holds the <mxWindow> created in <showHelp>.
     */
    help: mxWindow;
    /**
     * Variable: helpWindowImage
     *
     * Icon for the help window.
     */
    helpWindowImage: any;
    /**
     * Variable: urlHelp
     *
     * Specifies the URL to be used for the contents of the
     * Online Help window. This is usually specified in the
     * resources file under urlHelp for language-specific
     * online help support.
     */
    urlHelp: URL;
    /**
     * Variable: helpWidth
     * 
     * Specifies the width of the help window in pixels.
     * Default is 300.
     */
    helpWidth: number;
    /**
     * Variable: helpWidth
     * 
     * Specifies the width of the help window in pixels.
     * Default is 260.
     */
    helpHeight: number;
    /**
     * Variable: propertiesWidth
     * 
     * Specifies the width of the properties window in pixels.
     * Default is 240.
     */
    propertiesWidth: number;
    /**
     * Variable: propertiesHeight
     * 
     * Specifies the height of the properties window in pixels.
     * If no height is specified then the window will be automatically
     * sized to fit its contents. Default is null.
     */
    propertiesHeight: number;
    /**
     * Variable: movePropertiesDialog
     *
     * Specifies if the properties dialog should be automatically
     * moved near the cell it is displayed for, otherwise the
     * dialog is not moved. This value is only taken into 
     * account if the dialog is already visible. Default is false.
     */
    movePropertiesDialog: boolean;
    /**
     * Variable: validating
     *
     * Specifies if <mxGraph.validateGraph> should automatically be invoked after
     * each change. Default is false.
     */
    validating: boolean;
    /**
     * Variable: modified
     *
     * True if the graph has been modified since it was last saved.
     */
    modified: boolean;
    /**
     * Function: isModified
     * 
     * Returns <modified>.
     */
    isModified(): boolean;
    /**
     * Function: setModified
     * 
     * Sets <modified> to the specified boolean value.
     */
    setModified(value: boolean);
    /**
     * Function: addActions
     *
     * Adds the built-in actions to the editor instance.
     *
     * save - Saves the graph using <urlPost>.
     * print - Shows the graph in a new print preview window.
     * show - Shows the graph in a new window.
     * exportImage - Shows the graph as a bitmap image using <getUrlImage>.
     * refresh - Refreshes the graph's display.
     * cut - Copies the current selection into the clipboard
     * and removes it from the graph.
     * copy - Copies the current selection into the clipboard.
     * paste - Pastes the clipboard into the graph.
     * delete - Removes the current selection from the graph.
     * group - Puts the current selection into a new group.
     * ungroup - Removes the selected groups and selects the children.
     * undo - Undoes the last change on the graph model.
     * redo - Redoes the last change on the graph model.
     * zoom - Sets the zoom via a dialog.
     * zoomIn - Zooms into the graph.
     * zoomOut - Zooms out of the graph
     * actualSize - Resets the scale and translation on the graph.
     * fit - Changes the scale so that the graph fits into the window.
     * showProperties - Shows the properties dialog.
     * selectAll - Selects all cells.
     * selectNone - Clears the selection.
     * selectVertices - Selects all vertices.
     * selectEdges = Selects all edges.
     * edit - Starts editing the current selection cell.
     * enterGroup - Drills down into the current selection cell.
     * exitGroup - Moves up in the drilling hierachy
     * home - Moves to the topmost parent in the drilling hierarchy
     * selectPrevious - Selects the previous cell.
     * selectNext - Selects the next cell.
     * selectParent - Selects the parent of the selection cell.
     * selectChild - Selects the first child of the selection cell.
     * collapse - Collapses the currently selected cells.
     * expand - Expands the currently selected cells.
     * bold - Toggle bold text style.
     * italic - Toggle italic text style.
     * underline - Toggle underline text style.
     * shadow - Toggle shadow text style.
     * alignCellsLeft - Aligns the selection cells at the left.
     * alignCellsCenter - Aligns the selection cells in the center.
     * alignCellsRight - Aligns the selection cells at the right.
     * alignCellsTop - Aligns the selection cells at the top.
     * alignCellsMiddle - Aligns the selection cells in the middle.
     * alignCellsBottom - Aligns the selection cells at the bottom.
     * alignFontLeft - Sets the horizontal text alignment to left.
     * alignFontCenter - Sets the horizontal text alignment to center.
     * alignFontRight - Sets the horizontal text alignment to right.
     * alignFontTop - Sets the vertical text alignment to top.
     * alignFontMiddle - Sets the vertical text alignment to middle.
     * alignFontBottom - Sets the vertical text alignment to bottom.
     * toggleTasks - Shows or hides the tasks window.
     * toggleHelp - Shows or hides the help window.
     * toggleOutline - Shows or hides the outline window.
     * toggleConsole - Shows or hides the console window.
     */
    addActions();
    /**
     * Function: createSession
     *
     * Creates and returns and <mxSession> using <urlInit>, <urlPoll> and <urlNotify>.
     */
    createSession(): mxSession;
    /**
     * Function: configure
     *
     * Configures the editor using the specified node. To load the
     * configuration from a given URL the following code can be used to obtain
     * the XML node.
     * 
     * (code)
     * var node = mxUtils.load(url).getDocumentElement();
     * (end)
     * 
     * Parameters:
     * 
     * node - XML node that contains the configuration.
     */
    configure(node: Element);
    /**
     * Function: resetFirstTime
     * 
     * Resets the cookie that is used to remember if the editor has already
     * been used.
     */
    resetFirstTime();
    /**
     * Function: resetHistory
     * 
     * Resets the command history, modified state and counters.
     */
    resetHistory();
    /**
     * Function: addAction
     * 
     * Binds the specified actionname to the specified function.
     * 
     * Parameters:
     * 
     * actionname - String that specifies the name of the action
     * to be added.
     * funct - Function that implements the new action. The first
     * argument of the function is the editor it is used
     * with, the second argument is the cell it operates
     * upon.
     * 
     * Example:
     * (code)
     * editor.addAction('test', function(editor, cell)
     * {
     * 		mxUtils.alert("test "+cell);
     * });
     * (end)
     */
    addAction(actionname: string, funct: ICallback);
    /**
     * Function: execute
     * 
     * Executes the function with the given name in <actions> passing the
     * editor instance and given cell as the first and second argument. All
     * additional arguments are passed to the action as well. This method
     * contains a try-catch block and displays an error message if an action
     * causes an exception. The exception is re-thrown after the error
     * message was displayed.
     * 
     * Example:
     * 
     * (code)
     * editor.execute("showProperties", cell);
     * (end)
     */
    execute(actionname: string, cell: mxCell, evt: Event);
    /**
     * Function: addTemplate
     * 
     * Adds the specified template under the given name in <templates>.
     */
    addTemplate(name: string, template: any[]);
    /**
     * Function: getTemplate
     * 
     * Returns the template for the given name.
     */
    getTemplate(name: string): any;
    /**
     * Function: createGraph
     * 
     * Creates the <graph> for the editor. The graph is created with no
     * container and is initialized from <setGraphContainer>.
     */
    createGraph(): mxGraph;
    /**
     * Function: createSwimlaneManager
     * 
     * Sets the graph's container using <mxGraph.init>.
     */
    createSwimlaneManager(graph: mxGraph): mxSwimlaneManager;
    /**
     * Function: createLayoutManager
     * 
     * Creates a layout manager for the swimlane and diagram layouts, that
     * is, the locally defined inter- and intraswimlane layouts.
     */
    createLayoutManager(graph: mxGraph): any;
    /**
     * Function: setGraphContainer
     * 
     * Sets the graph's container using <mxGraph.init>.
     */
    setGraphContainer(container: Element);
    /**
     * Function: installDblClickHandler
     * 
     * Overrides <mxGraph.dblClick> to invoke <dblClickAction>
     * on a cell and reset the selection tool in the toolbar.
     */
    installDblClickHandler(graph: mxGraph);
    /**
     * Function: installUndoHandler
     * 
     * Adds the <undoManager> to the graph model and the view.
     */
    installUndoHandler(graph: mxGraph);
    /**
     * Function: installDrillHandler
     * 
     * Installs listeners for dispatching the <root> event.
     */
    installDrillHandler(graph: mxGraph);
    /**
     * Function: installChangeHandler
     * 
     * Installs the listeners required to automatically validate
     * the graph. On each change of the root, this implementation
     * fires a <root> event.
     */
    installChangeHandler(graph: mxGraph);
    /**
     * Function: installInsertHandler
     * 
     * Installs the handler for invoking <insertFunction> if
     * one is defined.
     */
    installInsertHandler(graph: mxGraph);
    /**
     * Function: createDiagramLayout
     * 
     * Creates the layout instance used to layout the
     * swimlanes in the diagram.
     */
    createDiagramLayout(): mxStackLayout;
    /**
     * Function: createSwimlaneLayout
     * 
     * Creates the layout instance used to layout the
     * children of each swimlane.
     */
    createSwimlaneLayout(): mxCompactTreeLayout;
    /**
     * Function: createToolbar
     * 
     * Creates the <toolbar> with no container.
     */
    createToolbar(): mxDefaultToolbar;
    /**
     * Function: setToolbarContainer
     * 
     * Initializes the toolbar for the given container.
     */
    setToolbarContainer(container: Element);
    /**
     * Function: setStatusContainer
     * 
     * Creates the <status> using the specified container.
     * 
     * This implementation adds listeners in the editor to 
     * display the last saved time and the current filename 
     * in the status bar.
     * 
     * Parameters:
     * 
     * container - DOM node that will contain the statusbar.
     */
    setStatusContainer(container: Element);
    /**
     * Function: setStatus
     * 
     * Display the specified message in the status bar.
     * 
     * Parameters:
     * 
     * message - String the specified the message to
     * be displayed.
     */
    setStatus(message: string);
    /**
     * Function: setTitleContainer
     * 
     * Creates a listener to update the inner HTML of the
     * specified DOM node with the value of <getTitle>.
     * 
     * Parameters:
     * 
     * container - DOM node that will contain the title.
     */
    setTitleContainer(container: Element);
    /**
     * Function: treeLayout
     * 
     * Executes a vertical or horizontal compact tree layout
     * using the specified cell as an argument. The cell may
     * either be a group or the root of a tree.
     * 
     * Parameters:
     * 
     * cell - <mxCell> to use in the compact tree layout.
     * horizontal - Optional boolean to specify the tree's
     * orientation. Default is true.
     */
    treeLayout(cell: mxCell, horizontal?: boolean);
    /**
     * Function: getTitle
     * 
     * Returns the string value for the current root of the
     * diagram.
     */
    getTitle(): string;
    /**
     * Function: getRootTitle
     * 
     * Returns the string value of the root cell in
     * <mxGraph.model>.
     */
    getRootTitle(): string;
    /**
     * Function: undo
     * 
     * Undo the last change in <graph>.
     */
    undo();
    /**
     * Function: redo
     * 
     * Redo the last change in <graph>.
     */
    redo();
    /**
     * Function: groupCells
     * 
     * Invokes <createGroup> to create a new group cell and the invokes
     * <mxGraph.groupCells>, using the grid size of the graph as the spacing
     * in the group's content area.
     */
    groupCells(): any[];
    /**
     * Function: createGroup
     * 
     * Creates and returns a clone of <defaultGroup> to be used
     * as a new group cell in <group>.
     */
    createGroup(): any[];
    /**
     * Function: open
     * 
     * Opens the specified file synchronously and parses it using
     * <readGraphModel>. It updates <filename> and fires an <open>-event after
     * the file has been opened. Exceptions should be handled as follows:
     * 
     * (code)
     * try
     * {
     *   editor.open(filename);
     * }
     * catch (e)
     * {
     *   mxUtils.error('Cannot open ' + filename +
     *     ': ' + e.message, 280, true);
     * }
     * (end)
     *
     * Parameters:
     * 
     * filename - URL of the file to be opened.
     */
    open(filename: URL);
    /**
     * Function: readGraphModel
     * 
     * Reads the specified XML node into the existing graph model and resets
     * the command history and modified state.
     */
    readGraphModel(node: Element);
    /**
     * Function: save
     * 
     * Posts the string returned by <writeGraphModel> to the given URL or the
     * URL returned by <getUrlPost>. The actual posting is carried out by
     * <postDiagram>. If the URL is null then the resulting XML will be
     * displayed using <mxUtils.popup>. Exceptions should be handled as
     * follows:
     * 
     * (code)
     * try
     * {
     *   editor.save();
     * }
     * catch (e)
     * {
     *   mxUtils.error('Cannot save : ' + e.message, 280, true);
     * }
     * (end)
     */
    save(url: URL, linefeed?: URL);
    /**
     * Function: postDiagram
     * 
     * Hook for subclassers to override the posting of a diagram
     * represented by the given node to the given URL. This fires
     * an asynchronous <post> event if the diagram has been posted.
     * 
     * Example:
     * 
     * To replace the diagram with the diagram in the response, use the
     * following code.
     * 
     * (code)
     * editor.addListener(mxEvent.POST, function(sender, evt)
     * {
     *   // Process response (replace diagram)
     *   var req = evt.getProperty('request');
     *   var root = req.getDocumentElement();
     *   editor.graph.readGraphModel(root)
     * });
     * (end)
     */
    postDiagram(url: URL, data: string);
    /**
     * Function: writeGraphModel
     * 
     * Hook to create the string representation of the diagram. The default
     * implementation uses an <mxCodec> to encode the graph model as
     * follows:
     * 
     * (code)
     * var enc = new mxCodec();
     * var node = enc.encode(this.graph.getModel());
     * return mxUtils.getXml(node, this.linefeed);
     * (end)
     * 
     * Parameters:
     * 
     * linefeed - Optional character to be used as the linefeed. Default is
     * <linefeed>.
     */
    writeGraphModel(linefeed: string): any;
    /**
     * Function: getUrlPost
     * 
     * Returns the URL to post the diagram to. This is used
     * in <save>. The default implementation returns <urlPost>,
     * adding <code>?draft=true</code>.
     */
    getUrlPost(): URL;
    /**
     * Function: getUrlImage
     * 
     * Returns the URL to create the image with. This is typically
     * the URL of a backend which accepts an XML representation
     * of a graph view to create an image. The function is used
     * in the image action to create an image. This implementation
     * returns <urlImage>.
     */
    getUrlImage(): URL;
    /**
     * Function: connect
     * 
     * Creates and returns a session for the specified parameters, installing
     * the onChange function as a change listener for the session.
     */
    connect(urlInit: URL, urlPoll: URL, urlNotify: URL, onChange: any): mxSession;
    /**
     * Function: swapStyles
     * 
     * Swaps the styles for the given names in the graph's
     * stylesheet and refreshes the graph.
     */
    swapStyles(first: string, second: string);
    /**
     * Function: showProperties
     * 
     * Creates and shows the properties dialog for the given
     * cell. The content area of the dialog is created using
     * <createProperties>.
     */
    showProperties(cell: mxGraph);
    /**
     * Function: isPropertiesVisible
     * 
     * Returns true if the properties dialog is currently visible.
     */
    isPropertiesVisible(): boolean;
    /**
     * Function: createProperties
     * 
     * Creates and returns the DOM node that represents the contents
     * of the properties dialog for the given cell. This implementation
     * works for user objects that are XML nodes and display all the
     * node attributes in a form.
     */
    createProperties(cell: mxCell): Element;
    /**
     * Function: hideProperties
     * 
     * Hides the properties dialog.
     */
    hideProperties();
    /**
     * Function: showTasks
     * 
     * Shows the tasks window. The tasks window is created using <createTasks>. The
     * default width of the window is 200 pixels, the y-coordinate of the location
     * can be specifies in <tasksTop> and the x-coordinate is right aligned with a
     * 20 pixel offset from the right border. To change the location of the tasks
     * window, the following code can be used:
     * 
     * (code)
     * var oldShowTasks = mxEditor.prototype.showTasks;
     * mxEditor.prototype.showTasks = function()
     * {
     *   oldShowTasks.apply(this, arguments); // "supercall"
     *   
     *   if (this.tasks != null)
     *   {
     *     this.tasks.setLocation(10, 10);
     *   }
     * };
     * (end)
     */
    showTasks();
    /**
     * Function: refreshTasks
     * 
     * Updates the contents of the tasks window using <createTasks>.
     */
    refreshTasks(div: any); // ???
    /**
     * Function: createTasks
     * 
     * Updates the contents of the given DOM node to
     * display the tasks associated with the current
     * editor state. This is invoked whenever there
     * is a possible change of state in the editor.
     * Default implementation is empty.
     */
    createTasks(div: any);
    /**
     * Function: showHelp
     * 
     * Shows the help window. If the help window does not exist
     * then it is created using an iframe pointing to the resource
     * for the <code>urlHelp</code> key or <urlHelp> if the resource
     * is undefined.
     */
    showHelp(tasks: any);
    /**
     * Function: showOutline
     * 
     * Shows the outline window. If the window does not exist, then it is
     * created using an <mxOutline>.
     */
    showOutline();
    /**
     * Function: setMode
     *
     * Puts the graph into the specified mode. The following modenames are
     * supported:
     * 
     * select - Selects using the left mouse button, new connections
     * are disabled.
     * connect - Selects using the left mouse button or creates new
     * connections if mouse over cell hotspot. See <mxConnectionHandler>.
     * pan - Pans using the left mouse button, new connections are disabled.
     */
    setMode(modename: string);
    /**
     * Function: createPopupMenu
     * 
     * Uses <popupHandler> to create the menu in the graph's
     * panning handler. The redirection is setup in
     * <setToolbarContainer>.
     */
    createPopupMenu(menu: any, cell: mxCell, evt: Event);
    /**
     * Function: createEdge
     * 
     * Uses <defaultEdge> as the prototype for creating new edges
     * in the connection handler of the graph. The style of the
     * edge will be overridden with the value returned by
     * <getEdgeStyle>.
     */
    createEdge(source: mxCell, target: mxCell): mxCell;
    /**
     * Function: getEdgeStyle
     * 
     * Returns a string identifying the style of new edges.
     * The function is used in <createEdge> when new edges
     * are created in the graph.
     */
    getEdgeStyle(): string;
    /**
     * Function: consumeCycleAttribute
     * 
     * Returns the next attribute in <cycleAttributeValues>
     * or null, if not attribute should be used in the
     * specified cell.
     */
    consumeCycleAttribute(cell: mxCell): any;
    /**
     * Function: cycleAttribute
     * 
     * Uses the returned value from <consumeCycleAttribute>
     * as the value for the <cycleAttributeName> key in
     * the given cell's style.
     */
    cycleAttribute(cell: mxCell);
    /**
     * Function: addVertex
     * 
     * Adds the given vertex as a child of parent at the specified
     * x and y coordinate and fires an <addVertex> event.
     */
    addVertex(parent: mxCell, vertex: mxCell, x: number, y: number): mxCell;
    /**
     * Function: destroy
     * 
     * Removes the editor and all its associated resources. This does not
     * normally need to be called, it is called automatically when the window
     * unloads.
     */
    destroy();

}

declare var mxEditor: {
    new (config?: Element): mxEditor;
    prototype: mxEditor;
}

interface mxDefaultToolbar {

    /**
     * Variable: editor
     *
     * Reference to the enclosing <mxEditor>.
     */
    editor: mxEditor;
    /**
     * Variable: toolbar
     *
     * Holds the internal <mxToolbar>.
     */
    toolbar: mxToolbar;
    /**
     * Variable: resetHandler
     *
     * Reference to the function used to reset the <toolbar>.
     */
    resetHandler: ICallback;
    /**
     * Variable: spacing
     *
     * Defines the spacing between existing and new vertices in
     * gridSize units when a new vertex is dropped on an existing
     * cell. Default is 4 (40 pixels).
     */
    spacing: number;
    /**
     * Variable: connectOnDrop
     * 
     * Specifies if elements should be connected if new cells are dropped onto
     * connectable elements. Default is false.
     */
    connectOnDrop: boolean;
    /**
     * Variable: init
     * 
     * Constructs the <toolbar> for the given container and installs a listener
     * that updates the <mxEditor.insertFunction> on <editor> if an item is
     * selected in the toolbar. This assumes that <editor> is not null.
     *
     * Parameters:
     *
     * container - DOM node that contains the toolbar.
     */
    init(container: Element);
    /**
     * Function: addItem
     *
     * Adds a new item that executes the given action in <editor>. The title,
     * icon and pressedIcon are used to display the toolbar item.
     * 
     * Parameters:
     *
     * title - String that represents the title (tooltip) for the item.
     * icon - URL of the icon to be used for displaying the item.
     * action - Name of the action to execute when the item is clicked.
     * pressed - Optional URL of the icon for the pressed state.
     */
    addItem(title: string, icon: URL, action: string, pressed?: URL);
    /**
     * Function: addSeparator
     *
     * Adds a vertical separator using the optional icon.
     * 
     * Parameters:
     * 
     * icon - Optional URL of the icon that represents the vertical separator.
     * Default is <mxClient.imageBasePath> + '/separator.gif'.
     */
    addSeparator(icon?: URL);
    /**
     * Function: addCombo
     *
     * Helper method to invoke <mxToolbar.addCombo> on <toolbar> and return the
     * resulting DOM node.
     */
    addCombo(): Element;
    /**
     * Function: addActionCombo
     *
     * Helper method to invoke <mxToolbar.addActionCombo> on <toolbar> using
     * the given title and return the resulting DOM node.
     * 
     * Parameters:
     * 
     * title - String that represents the title of the combo.
     */
    addActionCombo(title: string);
    /**
     * Function: addActionOption
     *
     * Binds the given action to a option with the specified label in the
     * given combo. Combo is an object returned from an earlier call to
     * <addCombo> or <addActionCombo>.
     * 
     * Parameters:
     * 
     * combo - DOM node that represents the combo box.
     * title - String that represents the title of the combo.
     * action - Name of the action to execute in <editor>.
     */
    addActionOption(combo: Element, title: string, action: string);
    /**
     * Function: addOption
     *
     * Helper method to invoke <mxToolbar.addOption> on <toolbar> and return
     * the resulting DOM node that represents the option.
     * 
     * Parameters:
     * 
     * combo - DOM node that represents the combo box.
     * title - String that represents the title of the combo.
     * value - Object that represents the value of the option.
     */
    addOption(combo: Element, title: string, value: Object):Element;
    /**
     * Function: addMode
     *
     * Creates an item for selecting the given mode in the <editor>'s graph.
     * Supported modenames are select, connect and pan.
     * 
     * Parameters:
     * 
     * title - String that represents the title of the item.
     * icon - URL of the icon that represents the item.
     * mode - String that represents the mode name to be used in
     * <mxEditor.setMode>.
     * pressed - Optional URL of the icon that represents the pressed state.
     * funct - Optional JavaScript function that takes the <mxEditor> as the
     * first and only argument that is executed after the mode has been
     * selected.
     */
    addMode(title: string, icon: URL, mode: string, pressed?: URL, funct?: ICallback): Element;
    /**
     * Function: addPrototype
     *
     * Creates an item for inserting a clone of the specified prototype cell into
     * the <editor>'s graph. The ptype may either be a cell or a function that
     * returns a cell.
     * 
     * Parameters:
     * 
     * title - String that represents the title of the item.
     * icon - URL of the icon that represents the item.
     * ptype - Function or object that represents the prototype cell. If ptype
     * is a function then it is invoked with no arguments to create new
     * instances.
     * pressed - Optional URL of the icon that represents the pressed state.
     * insert - Optional JavaScript function that handles an insert of the new
     * cell. This function takes the <mxEditor>, new cell to be inserted, mouse
     * event and optional <mxCell> under the mouse pointer as arguments.
     * toggle - Optional boolean that specifies if the item can be toggled.
     * Default is true.
     */
    addPrototype(title: string, icon: URL, ptype: any, pressed?: URL, insert?: ICallback, toggle?: boolean): any;
    /**
     * Function: drop
     * 
     * Handles a drop from a toolbar item to the graph. The given vertex
     * represents the new cell to be inserted. This invokes <insert> or
     * <connect> depending on the given target cell.
     * 
     * Parameters:
     * 
     * vertex - <mxCell> to be inserted.
     * evt - Mouse event that represents the drop.
     * target - Optional <mxCell> that represents the drop target.
     */
    drop(vertex: mxCell, evt: Event, target?: mxCell);
    /**
     * Function: insert
     *
     * Handles a drop by inserting the given vertex into the given parent cell
     * or the default parent if no parent is specified.
     * 
     * Parameters:
     * 
     * vertex - <mxCell> to be inserted.
     * evt - Mouse event that represents the drop.
     * parent - Optional <mxCell> that represents the parent.
     */
    insert(vertex: mxCell, evt: Event, target?: mxCell): mxCell;
    /**
     * Function: connect
     * 
     * Handles a drop by connecting the given vertex to the given source cell.
     * 
     * vertex - <mxCell> to be inserted.
     * evt - Mouse event that represents the drop.
     * source - Optional <mxCell> that represents the source terminal.
     */
    connect(vertex: mxCell, evt: Event, source?: mxCell);
    /**
     * Function: installDropHandler
     * 
     * Makes the given img draggable using the given function for handling a
     * drop event.
     * 
     * Parameters:
     * 
     * img - DOM node that represents the image.
     * dropHandler - Function that handles a drop of the image.
     */
    installDropHandler(img: Element, dropHandler: ICallback);
    /**
     * Function: destroy
     * 
     * Destroys the <toolbar> associated with this object and removes all
     * installed listeners. This does normally not need to be called, the
     * <toolbar> is destroyed automatically when the window unloads (in IE) by
     * <mxEditor>.
     */
    destroy();
    
}

declare var mxDefaultToolbar: {
    new (container: Element, editor: mxEditor): mxDefaultToolbar;
    prototype: mxDefaultToolbar;
}

interface mxDefaultPopupMenu {

    /**
     * Variable: imageBasePath
     *
     * Base path for all icon attributes in the config. Default is null.
     */
    imageBasePath: any;
    /**
     * Variable: config
     *
     * XML node used as the description of new menu items. This node is
     * used in <createMenu> to dynamically create the menu items if their
     * respective conditions evaluate to true for the given arguments.
     */
    config: Element;
    /**
     * Function: createMenu
     *
     * This function is called from <mxEditor> to add items to the
     * given menu based on <config>. The config is a sequence of
     * the following nodes and attributes.
     *
     * Child Nodes: 
     *
     * add - Adds a new menu item. See below for attributes.
     * separator - Adds a separator. No attributes.
     * condition - Adds a custom condition. Name attribute.
     * 
     * The add-node may have a child node that defines a function to be invoked
     * before the action is executed (or instead of an action to be executed).
     *
     * Attributes:
     *
     * as - Resource key for the label (needs entry in property file).
     * action - Name of the action to execute in enclosing editor.
     * icon - Optional icon (relative/absolute URL).
     * iconCls - Optional CSS class for the icon.
     * if - Optional name of condition that must be true(see below).
     * name - Name of custom condition. Only for condition nodes.
     *
     * Conditions:
     *
     * nocell - No cell under the mouse.
     * ncells - More than one cell selected.
     * notRoot - Drilling position is other than home.
     * cell - Cell under the mouse.
     * notEmpty - Exactly one cell with children under mouse.
     * expandable - Exactly one expandable cell under mouse.
     * collapsable - Exactly one collapsable cell under mouse.
     * validRoot - Exactly one cell which is a possible root under mouse.
     * swimlane - Exactly one cell which is a swimlane under mouse.
     *
     * Example:
     *
     * To add a new item for a given action to the popupmenu:
     * 
     * (code)
     * <mxDefaultPopupMenu as="popupHandler">
     *   <add as="delete" action="delete" icon="images/delete.gif" if="cell"/>
     * </mxDefaultPopupMenu>
     * (end)
     * 
     * To add a new item for a custom function:
     * 
     * (code)
     * <mxDefaultPopupMenu as="popupHandler">
     *   <add as="action1"><![CDATA[
     *		function (editor, cell, evt)
     *		{
     *			editor.execute('action1', cell, 'myArg');
     *		}
     *   ]]></add>
     * </mxDefaultPopupMenu>
     * (end)
     * 
     * The above example invokes action1 with an additional third argument via
     * the editor instance. The third argument is passed to the function that
     * defines action1. If the add-node has no action-attribute, then only the
     * function defined in the text content is executed, otherwise first the
     * function and then the action defined in the action-attribute is
     * executed. The function in the text content has 3 arguments, namely the
     * <mxEditor> instance, the <mxCell> instance under the mouse, and the
     * native mouse event.
     *
     * Custom Conditions:
     *
     * To add a new condition for popupmenu items:
     *  
     * (code)
     * <condition name="condition1"><![CDATA[
     *   function (editor, cell, evt)
     *   {
     *     return cell != null;
     *   }
     * ]]></condition>
     * (end)
     * 
     * The new condition can then be used in any item as follows:
     * 
     * (code)
     * <add as="action1" action="action1" icon="action1.gif" if="condition1"/>
     * (end)
     * 
     * The order in which the items and conditions appear is not significant as
     * all connditions are evaluated before any items are created.
     * 
     * Parameters:
     *
     * editor - Enclosing <mxEditor> instance.
     * menu - <mxPopupMenu> that is used for adding items and separators.
     * cell - Optional <mxCell> which is under the mousepointer.
     * evt - Optional mouse event which triggered the menu. 
     */
    createMenu(editor: mxEditor, menu: mxPopupMenu, cell?: mxCell, evt?: Event);
    /**
     * Function: addItems
     * 
     * Recursively adds the given items and all of its children into the given menu.
     * 
     * Parameters:
     *
     * editor - Enclosing <mxEditor> instance.
     * menu - <mxPopupMenu> that is used for adding items and separators.
     * cell - Optional <mxCell> which is under the mousepointer.
     * evt - Optional mouse event which triggered the menu.
     * conditions - Array of names boolean conditions.
     * item - XML node that represents the current menu item.
     * parent - DOM node that represents the parent menu item.
     */
    addItems(editor: mxEditor, menu: mxPopupMenu, cell?: mxCell, evt?: Event, conditions?: any[], item?: Element, parent?: Element);
    /**
     * Function: addAction
     *
     * Helper method to bind an action to a new menu item.
     * 
     * Parameters:
     *
     * menu - <mxPopupMenu> that is used for adding items and separators.
     * editor - Enclosing <mxEditor> instance.
     * lab - String that represents the label of the menu item.
     * icon - Optional URL that represents the icon of the menu item.
     * action - Optional name of the action to execute in the given editor.
     * funct - Optional function to execute before the optional action. The
     * function takes an <mxEditor>, the <mxCell> under the mouse and the
     * mouse event that triggered the call.
     * cell - Optional <mxCell> to use as an argument for the action.
     * parent - DOM node that represents the parent menu item.
     * iconCls - Optional CSS class for the menu icon.
     */
    addAction(menu: mxPopupMenu, editor: mxEditor, lab: string, icon?: URL, funct?: ICallback, action?: string , cell?: mxCell, parent?: Element, iconCls?: any): any;
    /**
     * Function: createConditions
     * 
     * Evaluates the default conditions for the given context.
     */
    createConditions(editor: mxEditor, cell: mxCell, evt: Event): any[];


}

declare var mxDefaultPopupMenu: {
    new (config: Element): mxDefaultPopupMenu;
    prototype: mxDefaultPopupMenu;
}

interface mxDefaultKeyHandler {

    /**
     * Variable: editor
     *
     * Reference to the enclosing <mxEditor>.
     */
    editor: mxEditor;
    /**
     * Variable: handler
     *
     * Holds the <mxKeyHandler> for key event handling.
     */
    handler: mxKeyHandler;
    /**
     * Function: bindAction
     *
     * Binds the specified keycode to the given action in <editor>. The
     * optional control flag specifies if the control key must be pressed
     * to trigger the action.
     *
     * Parameters:
     *
     * code - Integer that specifies the keycode.
     * action - Name of the action to execute in <editor>.
     * control - Optional boolean that specifies if control must be pressed.
     * Default is false.
     */
    bindAction(code: number, action: string, control?: boolean);
    /**
     * Function: destroy
     *
     * Destroys the <handler> associated with this object. This does normally
     * not need to be called, the <handler> is destroyed automatically when the
     * window unloads (in IE) by <mxEditor>.
     */
    destroy();

}

declare var mxDefaultKeyHandler: {
    new (editor: mxEditor): mxDefaultKeyHandler;
    prototype: mxDefaultKeyHandler;
}

//}