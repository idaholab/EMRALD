// Copyright 2021 Battelle Energy Alliance


//This function cannot be "strict" mode, because it overwrites the prototype of an object.
if (!this.__extends) {
  //this is used for extending class object.
  var __extends = this.__extends || function (d, b) {
    //copy all properties from parent object.
    for (var p in b)
      if (Object.prototype.hasOwnProperty.call(b, p))
        d[p] = b[p];
    //set the constructor to child object
    function __() { this.constructor = d; }
    //instantiate the parent's prototype with the new class.
    __.prototype = b.prototype;
    var p = new __();
    Object.keys(p).forEach((key) => {
      d.prototype[key] = p[key];
    });
  };
}

"use strict";
//A function to wait until either times up, or until a pass in "funct" returns "true", which ever occured first.
//funct - callback function, to be returned true or false.
//done - an optional callback function for notify when waiting is over.
//timeout - the amount of time in million-second to wait.
//caller - string, optional to identify the caller for monitoring purpose.
function waitToSync(funct, done, timeout, caller) {
  //This is  a hack synchronize to wait until funct() returns true or timeout becomes < 0.
  caller = caller || '';
  if ((funct === undefined) || typeof (funct) != 'function') return;
  function waiting() {
    if (!funct()) {
      var dt = new Date();
      if (timeout > 0)
        setTimeout(waiting, 1000); //1 second.
      else {

        document.body.style.cursor = 'default';
        if (done !== undefined && (typeof done === 'function')) {
          done();
        }
      }
      timeout -= 1000;
    }
    else {
      if (done !== undefined && (typeof done === 'function'))
        done();
    }
  }
  waiting();
}

//declare Object.extend function if browser not supported.
if (!Object.extend) {
  Object.extend = function () {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = jQuery.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    // Return the modified object
    return target;
  };
}

if (!Array.prototype.add) {
  Array.prototype.add = function (obj) {
    this.push(obj);
  }
}


//===========================================
// just so we can use the 'in" operator for checking set of  value.
// arr - is an array of any intrinsic type -- int, string, or bool.
function SetOf(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = arr[i];
  }
  return obj;
}
//i.e. 'c' in SetOf(['a','b','c','d']) == true.  Old Pascal tricks.

//Similar to "instanceof" but return the name of the class as string.
function classNameOf(anObj) {
  var exec = /(\w+)\(/.exec(anObj.constructor);
  var fn = exec ? exec[1] : null;
  return fn;
}

//=================CUSTOMIZE mxDragSource========================
//overriden this to not allow container refocus, it disrupt the window editor's auto focus.
if (typeof mxDragSource !== 'undefined') {
  if (mxDragSource.prototype.drop) {
    mxDragSource.prototype.drop = function (graph, evt, dropTarget, x, y) {
      this.dropHandler(graph, evt, dropTarget, x, y);

      // Had to move this to after the insert because it will
      // affect the scrollbars of the window in IE to try and
      // make the complete container visible.
      // LATER: Should be made optional.

      //graph.container.focus();
    };
  }
}
//---------------------------------------------------------------------
// load a file from server.
function getServerFile(url, callbackFn) {
  if (typeof require !== 'undefined') {
    var fs = require('fs');
    if (fs) {
      // return;
      fs.readFile(url, 'utf-8', function (error, contents) {
        if (contents) {
          callbackFn(contents);
        }
      });
    }
  }
  else {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    }
    else { // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callbackFn(xmlhttp.responseText);
      }
    }
    xmlhttp.open("GET", document.baseURI + url, true);
    xmlhttp.send();
  }
}
//---------------------------------------------------------------------
function deepClone(item) {
  if (!item) { return item; } // null, undefined values check

  var types = [Number, String, Boolean],
      result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = deepClone(child);
      });
    } else if (typeof item == "object") {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == "function") {
        result = item.cloneNode(true);
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = deepClone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}

//------------------------------------------
function sortDOMList(list) {
  var i, switching, b, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1) ; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}



/* Example ...
//A function to wait until either times up, or until the pass in "testFn" returns "true", 
//   which ever occurred first.  It calls "testFn" every half a second.
//timeout - the amount of time in million-second to wait.
//testFn - callback function, to be returned true or false.
//doneFn - an optional callback function for notify when waiting is over.
//timesUpFn - an optional callback when times up.
//caller - string, optional to identify the caller for monitoring purpose.
function waitSync(timeout, testFn, doneFn, timesupFn, caller) {
  caller = caller || '';
  if (typeof (testFn) != 'function') return;
  function waiting() {
    if (!testFn()) {
      //as long as funct() return false (condition not met) keep waiting.
      var dt = new Date();
      console.log(caller + " - waiting: " + dt.format('yyyy-mm-dd h:MM:ss'));
      if ((timeout - 500) > 0)
        setTimeout(waiting, 500); // 1/2 second.
      else {
        //waiting times up.  Wait no more.
        console.log(caller + ': waitSync timed out!!!');
        //if timesUpFn callback provided, invoke it.
        if (typeof (timesUpFn) == 'function') {
          timesUpFn();
        }
      }
      timeout -= 500;
    }
    else {
      if (typeof doneFn == 'function')
        doneFn();
    }
  }
  waiting();
}

//Example
// js1.js
var fooFlag = false; //wait condition initial state
// TODO: code performing async operations. 
function foo() {
  //do some lengthy thing.
  setTimeout(function () { fooFlag = true;}, 5000)
}

//js2.js
var barFlag = false;
function bar() {
  //do some more lengthy stuff like access server data.
  var flag = false;
  $.ajax({
    url: "",
    success: function (data) {
      flag = true;
    },
    Error: function (error) {
      flag = true;
    }
  });
  //must wait for server return, up to 10 seconds.
  waitSync(10000,
    function () { return flag; },
    function () { barFlag = true; }
  )
}


//js3.js
foo();
bar();

waitSync(15000, //willing to wait up to 15 seconds.
  function testing(){
    return fooFlag && barFlag; //must wait for both to finish or times up.
  },
  function after_foobar() {
    //do something after
  },
  function timesup() {
    // handle things in response to wait timer up.
  }, "call from testing."
);

*/