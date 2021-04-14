// Copyright 2021 Battelle Energy Alliance

"use strict";


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
