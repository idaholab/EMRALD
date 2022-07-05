// Copyright 2021 Battelle Energy Alliance


/// <reference path="Common.js" />
/// <reference path="../mxGraph/js/util/mxWindow.js" />
/// <reference path="CustomEvent.js" />
/// <reference path="../mxGraph/js/util/mxEventSource.js" />
/// <reference path="../mxGraph/js/util/mxEventObject.js" />
/// <reference path="../mxGraph/js/util/mxUtils.js" />
/// <reference path="CustomWindowHandler.js" />

'use strict';

//DOES THIS COMMENT SHOW UP???

var shareListeners = new CustomEvent(); // globally share with all WindowFrames.
var WindowFrame = (function (_super) {
  __extends(WindowFrame, _super);
  function WindowFrame(title, content, x, y, width, height, minimizable, movable, replaceNode, style, ismodal, z_index) {
    this.z_index = z_index ? z_index : (mxWindow.activeWindow && mxWindow.activeWindow.div) ? parseInt(mxWindow.activeWindow.div.style.zIndex) + 1 : 1;
    this.isModal = ismodal;
    var baseWindowInit = this.init;
    this.init = function (x, y, width, height, style) {
      if (this.content) {
        if (baseWindowInit) {
          baseWindowInit.apply(this, arguments);
        }


        if (ismodal) {
          this.div.style.zIndex = this.z_index + 5;
          if (this.div.style.boxShadow == '') {
            this.div.style.boxShadow = '5px 5px 7px #888888';
          }

          this.modaldiv = document.createElement('div');
          this.modaldiv.style.zIndex = this.z_index + 4;
          this.modaldiv.className = 'OverlayEffect';
          document.body.appendChild(this.modaldiv);
        }
      }
    }

    //Override the mxWindow's function to install minimize button before the maximize button.
    this.constructor = function (title, content, x, y, width, height, minimizable, movable, replaceNode, style) {
      if (content != null) {
        //This is to make sure that it is strict
        var isStrict = (function () { return !this; })();
        console.log("is strict = " + isStrict);

        minimizable = (minimizable != null) ? minimizable : true;
        this.content = content;
        this.init(x, y, width, height, style);

        this.installMinimizeHandler(); //This button switch place with
        this.installMaximizeHandler(); //this.
        this.installCloseHandler();
        this.setMinimizable(minimizable);
        this.setTitle(title);

        if (movable == null || movable) {
          this.installMoveHandler();
        }

        if (replaceNode != null && replaceNode.parentNode != null) {
          replaceNode.parentNode.replaceChild(this.div, replaceNode);
        }
        else {
          document.body.appendChild(this.div);
        }
      }
    };
    this.constructor.apply(this, arguments);

    if (this.content) {
      this.closeStatus = "";
      //this.FORMCLOSE = "FORMCLOSE";

      this.setEventSource(this);
      //call back function on window is closing. 
      //expected parameters: evt - the closing event
      //return: true to allow close, false to stop closing.
      this.onClosing = null;

      //override to remove modal effects.
      var baseWindowDestroy = this.destroy;
      this.destroy = function () {
        this.iframe.url = "about:blank";  //this to make it to remove the iframe content completely.
        baseWindowDestroy.apply(this, arguments);
        if (typeof (this.modaldiv) !== 'undefined' && (this.modaldiv != null)) {
          this.modaldiv.parentNode.removeChild(this.modaldiv);
          this.modaldiv = null;
        }
      }

      this.closeNow = false;
      this.forceClose = function () {
        this.closeNow = true;
        this.closeStatus = 'Close';
        this.close();
      }

      //Okay or Cancel button clicked and it is okay to close, simulate a mousedown click event to the close image listener. The X  on the upper right corner.
      this.close = function (evt) {
        if (!evt)
          triggerEvent(this.closeImg, 'click');
      }
    };
  };

  mxWindow.prototype.maximized = false;
  mxWindow.prototype.saveX = null;
  mxWindow.prototype.saveY = null;
  mxWindow.prototype.saveHeight = null;
  mxWindow.prototype.saveWidth = null;


  //Override window's maximize handler to limit to the client.  originally, it maximized to cover the entire screen view.
  mxWindow.prototype.toggleMaximize = function (evt) {
    this.activate();

    if (this.maximize.style.display != 'none') {
      if (!this.maximized) {
        this.maximized = true;

        this.maximize.setAttribute('src', this.normalizeImage);
        this.maximize.setAttribute('title', 'Normalize');
        this.contentWrapper.style.display = '';
        this.minimize.style.visibility = 'hidden';

        // Saves window state
        this.saveX = parseInt(this.div.style.left);
        this.saveY = parseInt(this.div.style.top);
        this.saveHeight = this.table.style.height;
        this.saveWidth = this.table.style.width;

        this.div.style.left = '0px';
        this.div.style.top = '0px';
        var parentNode = this.div.parentNode;

        var docHeight = parentNode.clientHeight || 0;

        if (!mxClient.IS_QUIRKS) {
          this.div.style.width = (parentNode.clientWidth - 2) + 'px';
          this.div.style.height = (docHeight - 2) + 'px';
        }

        this.table.style.width = (parentNode.clientWidth - 2) + 'px';
        this.table.style.height = (docHeight - 2) + 'px';

        if (this.resize != null) {
          this.resize.style.visibility = 'hidden';
        }

        if (!mxClient.IS_QUIRKS) {
          var style = mxUtils.getCurrentStyle(this.contentWrapper);

          if (style.overflow == 'auto' || this.resize != null) {
            this.contentWrapper.style.height = (this.div.offsetHeight -
              this.title.offsetHeight - this.contentHeightCorrection) + 'px';
          }
        }

        this.fireEvent(new mxEventObject(mxEvent.MAXIMIZE, 'event', evt));
      }
      else {
        this.maximized = false;

        this.maximize.setAttribute('src', this.maximizeImage);
        this.maximize.setAttribute('title', 'Maximize');
        this.contentWrapper.style.display = '';
        this.minimize.style.visibility = '';

        // Restores window state
        this.div.style.left = this.saveX + 'px';
        this.div.style.top = this.saveY + 'px';

        if (!mxClient.IS_QUIRKS) {
          this.div.style.height = this.saveHeight;
          this.div.style.width = this.saveWidth;

          var style = mxUtils.getCurrentStyle(this.contentWrapper);

          if (style.overflow == 'auto' || this.resize != null) {
            this.contentWrapper.style.height = (this.div.offsetHeight -
              this.title.offsetHeight - this.contentHeightCorrection) + 'px';
          }
        }

        this.table.style.height = this.saveHeight;
        this.table.style.width = this.saveWidth;

        if (this.resize != null) {
          this.resize.style.visibility = '';
        }

        this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, 'event', evt));
      }

      mxEvent.consume(evt);
    }
  }


  mxWindow.prototype.installMaximizeHandler = function () {
    this.maximize = document.createElement('img');

    this.maximize.setAttribute('src', this.maximizeImage);
    //this.maximize.setAttribute('align', 'right');
    this.maximize.setAttribute('title', 'Maximize');
    this.maximize.style.cursor = 'default';
    this.maximize.style.marginLeft = '2px';
    this.maximize.style.cursor = 'pointer';
    this.maximize.style.display = 'none';

    this.buttons.appendChild(this.maximize);

    var funct = mxUtils.bind(this, mxWindow.prototype.toggleMaximize);

    mxEvent.addGestureListeners(this.maximize, funct);
    mxEvent.addListener(this.title, 'dblclick', funct);
  };

  mxWindow.prototype.activate = function () {
    if (!this.isModal) {
      if (mxWindow.activeWindow != this) {
        var style = mxUtils.getCurrentStyle(this.getElement());
        var index = (style != null) ? style.zIndex : 3;

        if (mxWindow.activeWindow) {
          var elt = mxWindow.activeWindow.getElement();

          if (elt != null && elt.style != null) {
            elt.style.zIndex = index;
          }
        }

        var previousWindow = mxWindow.activeWindow;
        this.getElement().style.zIndex = parseInt(index) + 1;
        mxWindow.activeWindow = this;
        this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, 'previousWindow', previousWindow));
        //mxWindow.activeWindow.contentFrame;
        var myWin = mxWindow.activeWindow.contentFrame;
        //           contentWindow.getSidebar
        //var sidebar = myWin.contentWindow.getSidebar();
        //if window has already been created
        if (myWin && myWin.contentWindow.mainApp) {
          var rootModel = myWin.contentWindow.mainApp.graph.getDefaultParent().value;
          var sb = rootModel.sidebar;
          sb.loadLocalFromwindow(rootModel);
        }


      }
    }
  };

  return WindowFrame;
})(mxWindow);

// tack onto the mxWindow object/class.
mxWindow.createFrame = function (bottomButtons, headButtons, dataObj, isModal, x, y, width, height, url, onCloseCallbackFn, callHomeFn) {
  //bottomButtons = bottomButtons || (bottomButtons = ['OK', 'Cancel']);
  isModal = isModal || (isModal = false);
  headButtons = headButtons || (headButtons = ['close']);
  var title = url;

  var wincontent = document.createElement('div');
  wincontent.style.margin = '2px';
  var content = document.createElement('div');

  var frame = document.createElement('iframe');
  frame.setAttribute('src', url);

  content.appendChild(frame);
  wincontent.appendChild(content);

  if (!x) {
    var x = (window.innerWidth || document.body.clientWidth) / 2 - 200;
    x = x < 0 ? 0 : x;
  }
  if (!y) {
    var y = (window.innerHeight || document.body.clientHeight) / 2 - 150;
    y = y < 0 ? 0 : y;
  }

  var zindex = 1;
  if (mxWindow.activeWindow && mxWindow.activeWindow.div) {
    var zindex = parseInt(mxWindow.activeWindow.div.style.zIndex) + 5;
  }

  var dataChangedHandler = function (sender, evt) {

    //'this' is referencing 'frame'
    if (this !== sender && this.contentWindow && this.contentWindow.DataChanged) {//invoke data change for other windows only.  
      this.contentWindow.DataChanged(evt.properties.dataObj);
    }

  }
  //Notify other frame of data has changed.
  shareListeners.addListener('DataChanged', dataChangedHandler, frame);

  var wf = new WindowFrame(title, wincontent, x, y, width, height, true, false, null, null, isModal, zindex);
  wf.iframe = frame;
  wf.contentFrame = frame;
  wf.onClosing = function (evt) {
    if (wf.closeNow) return true; //close the window unconditionally
    var okToClose = true;
    if (onCloseCallbackFn) {
      evt.frame = frame;
      evt.windowFrame = wf;
      okToClose = onCloseCallbackFn(wf.closeStatus, callHomeFn, evt);
    }

    if (okToClose) {
      shareListeners.removeListener(frame, dataChangedHandler);
    }

    return okToClose;
  }

  var cmdcontent = document.createElement('div');
  cmdcontent.style.margin = '0.5em';
  cmdcontent.style.height = '2.5em';
  wincontent.appendChild(cmdcontent);

  if (bottomButtons && bottomButtons.length > 0) {
    cmdcontent.style.height = '3.5em';
    cmdcontent.style.textAlign = 'center';

    var firstBtn = null;
    for (var i = 0; i < bottomButtons.length; i++) {
      var btn = document.createElement('button');
      btn.style.width = '7em';
      btn.style.cssFloat = 'none';
      btn.style.margin = '1em'; //'5px 15px 5px 15px';
      btn.textContent = bottomButtons[i].trim();
      btn.id = 'btn_' + btn.textContent.replace(/\s+/g, '');
      btn.onclick = function (evt) {
        wf.closeStatus = this.textContent;
        wf.close();
      }
      wf.addListener('UpdateButton', function (sender, evt) {
        var isModified = evt.getProperties().isModified;
        if (!isModified && (this.textContent in SetOf(['Save', 'OK', 'Ok']))) {
          //this.disabled = true;
          this.disabled = false; //Steve: Enable "OK" button for all the screens, it is to hard to capture all the changes. 
        }
        else
          this.disabled = false;
      }.bind(btn));

      cmdcontent.appendChild(btn);
      if (i == 0) {
        firstBtn = btn;
      }
    }

    if (firstBtn) {
      wf.addListener(mxEvent.SHOW, function () {
        firstBtn.focus();
      });
    }
  }

  //each time the window resize, the frame needs to be recalculate of possible size.
  var recalculateSize = function () {
    wincontent.style.height = wf.div.offsetHeight - cmdcontent.clientHeight - 2 + 'px';
    content.style.height = wincontent.clientHeight - cmdcontent.clientHeight - 2 + 'px';
    wincontent.style.width = wf.div.clientWidth - 4 + 'px';
    content.style.width = wincontent.clientWidth - 4 + 'px';
    frame.style.height = content.style.height;
    frame.style.width = content.style.width;
  }

  recalculateSize();
  wf.addListener(mxEvent.SELECTED, function (evt) {
  });

  wf.addListener(mxEvent.RESIZE, function (evt) {
    recalculateSize();
    //notify frame content that parent window has been resized.
    if (frame.contentWindow && frame.contentWindow.onWindowResize) {
      frame.contentWindow.onWindowResize();
    }
  });


  wf.addListener(mxEvent.NORMALIZE, function (evt) {
    recalculateSize();
  });

  for (var i = 0; i < headButtons.length; i++) headButtons[i] = headButtons[i].toLowerCase();

  wf.setMinimizable(false);
  if (headButtons.indexOf('minimize') > -1) {
    wf.setMinimizable(true);
  }

  if (headButtons.indexOf('maximize') > -1) {
    wf.setMaximizable(true);
    wf.addListener(mxEvent.MAXIMIZE, function (evt) {
      recalculateSize();
    });
  }

  if (headButtons.indexOf('close') > -1) {
    wf.setClosable(true);
    wf.addListener(mxEvent.CLOSE, function (self, evt) {
      wf.close(evt);
    });
  }

  wf.setVisible(true);
  wf.destroyOnClose = true;
  wf.setScrollable(false);
  wf.setResizable(true);

  $(wf.div).draggable({
    containment: "#ContentPanel",
    handle: wf.title,

    start: function () {
      $(wf.iframe).css("pointer-events", "none");
      $("iframe").css("pointer-events", "none");
    },
    stop: function () {
      $(wf.iframe).css("pointer-events", "auto");
      $("iframe").css("pointer-events", "auto");
    }
  });

  frame.onload = function () {
    if (frame.contentWindow) {
      wf.setTitle(frame.contentWindow.document.title);

      frame.contentWindow.UpdateFrameTitle = function (title) {
        wf.setTitle(title);
      }

      //if child page has editable fields and wants to be managed by the WindowFrame, it must provide a isModified function.
      if (typeof frame.contentWindow.isModified !== 'function') {
        frame.contentWindow.isModified = function () { return false; }
      }

      //if the child page want to notify other windows directly of data change, call this FrameWindow method with dataObj in as parameter.
      frame.contentWindow.NotifyDataChanged = function (dataObj) {
        shareListeners.fireEvent(new CustomEvent.CustomEventObject('DataChanged', 'dataObj', dataObj), this);  //broadcast data changed.
      }.bind(frame);

      //child page call this method to update the command buttons.
      frame.contentWindow.UpdateBttns = function () {
        var aBtn = btn || (aBtn = '');
        var isModified = false;
        if (frame.contentWindow.isModified())
          isModified = true;
        wf.fireEvent(new mxEventObject('UpdateButton', 'isModified', isModified), wf);
      }

      //if child page wants to know when the page has been loaded, provide a OnLoad function.
      if (frame.contentWindow.OnLoad)
        frame.contentWindow.OnLoad(dataObj);

      wf.fireEvent(new mxEventObject('UpdateButton', 'isModified', false), wf);
      if (frame.contentWindow.setModified)
        frame.contentWindow.setModified(false);

      recalculateSize();
    }
  }
  return wf;
}

//This function provide a default behavior for the command buttons.  
function windowClosing(btnStatus, callHomeFn, evt) {
  var dataObj = null;
  if (btnStatus in SetOf(['Save', 'OK', 'Ok', 'Save As New'])) {
    if (evt.frame.contentWindow.ValidateData) {
      var msg = evt.frame.contentWindow.ValidateData();
      if (typeof msg === 'string' && msg.length > 0) {
        alert('Validation failed, cause: ' + msg);
        return false;
      }
    }
    var status = btnStatus === 'Save' ? false : true;
    if (evt.frame.contentWindow.OnSave) {
      evt.frame.contentWindow.OnSave();
      if (evt.frame.contentWindow.UpdateBttns)
        evt.frame.contentWindow.UpdateBttns();
    }
    if (evt.frame.contentWindow.GetDataObject) {
      dataObj = evt.frame.contentWindow.GetDataObject();
      shareListeners.fireEvent(new CustomEvent.CustomEventObject('DataChanged', 'dataObj', dataObj), evt.frame);
    }
    if (callHomeFn) status = callHomeFn(btnStatus, dataObj);
    return status;
  }
  else if (btnStatus in SetOf(['Close', 'Cancel'])) {
    var status = true;
    if (typeof evt.frame.contentWindow.isModified == "function") {
      if (evt.frame.contentWindow.isModified()) {
        //this browser confirm, it is blocking.
        status = confirm("Data within this window have changed, do you want to discard the changes?");
      }
    }
    if (status) {
      var useDataObj = true;
      if (evt.frame.contentWindow.ValidateData) {
        var msg = evt.frame.contentWindow.ValidateData();
        useDataObj = !(typeof msg === 'string' && msg.length > 0);
      }
      if (evt.frame.contentWindow.GetDataObject && btnStatus == "Close" && useDataObj)
        dataObj = evt.frame.contentWindow.GetDataObject();
      if (callHomeFn) status = callHomeFn(btnStatus, dataObj);
    }
    return status;  //this prevent the WinFrame from closing, return false.
  }
  else {
    //any other kind of buttons, just call parent with the object.
    var dataObj = evt.frame.contentWindow.GetDataObject();
    if (callHomeFn) status = callHomeFn(btnStatus, dataObj);
    return status;
  }
}

Array.prototype.trimAll = function () {
  this.forEach(function (val, idx, arr) {
    arr[idx] = val.trim();
  });
  return this;
}
//this function create the FrameWindow with the default command buttons behavior.  If you rather handle those command buttons yourself, 
//use the <mxWindow.createFrame> and pass in a function to the callbackFn (last parameter).  
mxWindow.createFrameWindow = function (url, cmdButtons, titleButtons, callbackFn, dataObj, isModal, x, y, width, height) {
  return mxWindow.createFrame(cmdButtons ? cmdButtons.split(',').trimAll() : null, titleButtons ? titleButtons.split(',').trimAll() : null,
    dataObj, isModal, x, y, width, height, url, windowClosing, callbackFn);
}

//testing...
function testWindowFrame() {
  mxWindow.createFrameWindow(
    'resources/GateFields_Test.html',
    'Save, Cancel, Close',  //command buttons
    'minimize, maximize, close', //top buttons
    function (btn, dataObj) {
      return true;
    },
    false, //ismodal
    null,
    null,
    400, //width
    230 //height
  );
}

//TODO: TriggerEvent is temporary until I can figure out why
//'use strict' is not doing what it is supposed to

function triggerEvent(el, eventName) {
  var evt;
  if (document.createEvent) {
    evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, true);
  } else if (document.createEventObject) {// IE < 9
    evt = document.createEventObject();
    evt.eventType = eventName;
  }
  evt.eventName = eventName;
  evt.simulated = true;
  if (el.dispatchEvent) {
    el.dispatchEvent(evt);
  } else if (el.fireEvent && htmlEvents['on' + eventName]) {// IE < 9
    el.fireEvent('on' + evt.eventType, evt);// can trigger only real event (e.g. 'click')
  } else if (el[eventName]) {
    el[eventName]();
  } else if (el['on' + eventName]) {
    el['on' + eventName]();
  }
}



//TODO: installCloseHandler is temporary until I can figure out why
//'use strict' is not doing what it is supposed to


//overwritten to prompt user on close for okay to close.
mxWindow.prototype.installCloseHandler = function () {
  this.closeImg = document.createElement('img');

  this.closeImg.setAttribute('src', this.closeImage);
  // this.closeImg.setAttribute('align', 'right');
  this.closeImg.setAttribute('title', 'Close');
  this.closeImg.style.marginLeft = '2px';
  this.closeImg.style.cursor = 'pointer';
  this.closeImg.style.display = 'none';

  this.buttons.appendChild(this.closeImg);

  var onCloseForm = function (evt) {
    //add to query caller for it is okay to close the window.
    var okToClose = true;
    if (this.onClosing != null) {
      if (!evt.simulated) {
        this.closeStatus = 'Close';
      }
      okToClose = this.onClosing(evt);
    }
    if (!okToClose) {
      mxEvent.consume(evt);
      return;
    }

    this.fireEvent(new mxEventObject(mxEvent.CLOSE, 'event', evt));

    if (this.destroyOnClose) {
      this.destroy();
    }
    else {
      this.setVisible(false);
    }

    mxEvent.consume(evt);
  }.bind(this);

  //IE doesn't like just the 'mousedown' event on an image.
  mxEvent.addGestureListeners(this.closeImg, mxUtils.bind(this, onCloseForm));
  //With 'click' it works for all IE, Chrome and SF.
  this.closeImg.addEventListener('click', mxUtils.bind(this, onCloseForm), true);
};

/**
 * Overrides mxWindow's resize function to rely use jQuery UI
 * 
 * @param {boolean} resizable The resizeable state.
 */
mxWindow.prototype.setResizable = function(resizable = false) {
  const w = this;
  $(this.div)
    .resizable()
    .on('resizestart', (evt) => {
      w.fireEvent(new mxEventObject(mxEvent.RESIZE_START, 'event', evt));
    })
    .on('resize', (evt, ui) => {
      w.setSize(ui.size.width, ui.size.height);
      w.fireEvent(new mxEventObject(mxEvent.RESIZE, 'event', evt));
    })
    .on('resizestop', (evt) => {
      w.fireEvent(new mxEventObject(mxEvent.RESIZE_END, 'event', evt));
    });
}

// --- these code is for future use: for adding menu.
//function getServerFile(url, callbackFn) {
//  var xmlhttp;
//  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
//    xmlhttp = new XMLHttpRequest();
//  }
//  else { // code for IE6, IE5
//    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//  }
//  xmlhttp.onreadystatechange = function () {
//    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//      callbackFn(xmlhttp.responseXML);
//    }
//  }
//  xmlhttp.open("GET", url, true);
//  xmlhttp.send();
//}


//if needed to load using configuration file.
//mxWindow.loadPage = function (xmlConfig) {
//  xmlConfig = 'resources/XMLFile.xml';
//  var xml = getServerFile(xmlConfig, function (xmlDoc) {
//    var aNode;
//    winNode = xmlDoc.documentElement.getElementsByTagName('window');
//    if (winNode && winNode.length > 0) {
//      winNode = winNode[0];
//      var width = winNode.getAttribute('width') + 'px';
//      var height = winNode.getAttribute('height') + 'px';
//      var isModal = eval(winNode.getAttribute('modal') || 'false');
//      var scrollable = eval(winNode.getAttribute('scrollable') || 'false');
//      var resizable = eval(winNode.getAttribute('resizable') || 'false');
//      var title = winNode.getAttribute('title') || xmlConfig;

//      aNode = winNode.getElementsByTagName('source');
//      if (aNode && aNode.length > 0) {
//        var srcUrl = aNode[0].getAttribute('value');
//      }
//      aNode = winNode.getElementsByTagName('alternative');
//      if (aNode && aNode.length > 0) {
//        var alternateUrl = aNode[0].getAttribute('value');
//      }
//      aNode = winNode.getElementsByTagName('buttons');
//      if (aNode && aNode.length > 0) {
//        var titleButtons = aNode[0].getAttribute('value');
//        titleButtons = titleButtons.split(',');
//      }
//    }
//    if (!srcUrl && !alternateUrl) {
//      mxUtils.alert('The config file "' + xmlConfig + '" does not specific the target URL source.');
//      return;
//    }

//    var menuNode = xmlDoc.documentElement.getElementsByTagName('menu');
//    if (menuNode && menuNode.length) {
//      menuNode = menuNode[0];

//    }

//    var cmdButtons = [];
//    var commandButtons = "";
//    var comNode = xmlDoc.documentElement.getElementsByTagName('commandButtons');
//    if (comNode && comNode.length > 0) {
//      comNode = comNode[0];
//      for (var i = 0; i < comNode.childElementCount; i++) {
//        aNode = comNode.children[i];
//        if (aNode.nodeName === 'button') {
//          if (commandButtons.length == 0)
//            commandButtons += aNode.getAttribute('label');
//          else
//            commandButtons += ',' + aNode.getAttribute('label');
//          cmdButtons.push({ label: aNode.getAttribute('label'), func: aNode.getAttribute('function') });
//        }
//      }
//    }

//    var url = srcUrl || 'http://www.inl.gov';

//    var winFrame = mxWindow.createFrame(
//      cmdButtons, //bottomButtons
//      titleButtons, //headerButtons.
//      isModal, // isModal,
//      width, // width
//      height, // height
//      url,  //iframe content page
//      windowClosing);
//  });
//}
//-----------------------------------------------------------

