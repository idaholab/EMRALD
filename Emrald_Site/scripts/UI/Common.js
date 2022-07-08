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
    d.prototype = new __();
  };
}

"use strict";  
//===================================================
//Remap the default 'this' to a specified 'scope'.
//Call function 'funct' within 'scope' scope.
if (!Function.prototype.bind) {  //only if not natively supported, < IE9. < FF 4.0, < Chrome 7, < Opera 11.60 < Safari 5.1.4
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

//===================================================
// add a repeat function to String if it is not already present.
if (typeof String.prototype.repeat !== 'function') {
  String.prototype.repeat = function (cnt) {
    var aVal = "";
    for (var i = 0; i < cnt; i++) {
      aVal += this;
    }
    return aVal;
  }
}

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
      console.log(caller + " waiting: " + dt.toLocaleTimeString());
      if ((timeout - 1000) > 0)
        setTimeout(waiting, 1000); //1 second.
      else {

        console.log(caller + ': waitToSync timed out!!!');
        document.body.style.cursor = 'default';
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

//create an character array from start to end, or a distinct arguments of character.
// this is useful for matching up value in a set.
// for example:  if ('P' in sequence('A','Z')) == true;  or var d='D'; var b = d in sequence('A','C','D','C') == true.
// -- very similar the SetOf() below.
function sequence(start, end) {
  var seq = {};
  if ((arguments.length === 2) && start && end) {
    seq[start] = start;
    while (start < end) {
      start = String.fromCharCode(start.charCodeAt(0) + 1);
      seq[start] = start;
    }
  }
  else {
    //case where arguments is a list.
    for (var i = 0; i < arguments.length; i++) {
      seq[arguments[i]] = arguments[i];
    }
  }
  return seq;
}

//================================================
// add more function capability to Array.
if (!Array.prototype.removeItem) {
  Array.prototype.removeItem = function (item) {
    if (item) {
      if (typeof (item) === 'number') {
        var obj = this[item];
        this.splice(item, 1);
        return obj;
      }
      else {
        //object
        var ix = this.indexOf(item);
        if (ix >= 0)
          this.splice(ix, 1);
        return item;
      }
    }
  }
}

if (!Array.prototype.getItemAt) {
  Array.prototype.getItemAt = function (idx) {
    if ((idx >= 0) && (idx < this.length)) {
      return this[idx];
    }
    return null;
  }
}
if (!Array.prototype.find) {
  Array.prototype.find = function (fn) {
    if (fn) {
      for (var i = 0; i < this.length; i++) {
        if (fn(this[i]))
          return this[i];
      }
    }
    return undefined;
  }
}
if (!Array.prototype.add) {
  Array.prototype.add = function (obj) {
    this.push(obj);
  }
}

//make Array support List structure.
if (!Array.prototype.currentIndex)
  Array.prototype.currentIndex = -1;
if (!Array.prototype.isCircular)
  Array.prototype.isCircular = false;

if (!Array.prototype.get) {
  Array.prototype.get = function (idx) {
    if (idx == null) {
      if (this.length > 0)
        this.currentIndex = 0;
      else
        this.currentIndex = -1;
    }
    else {
      this.currentIndex = idx;
    }

    if ((this.currentIndex >= 0) && (this.currentIndex < this.length))
      return this[this.currentIndex];
    else
      return null;
  }
}

if (!Array.prototype.next) {
  Array.prototype.next = function () {
    if (this.currentIndex < this.length - 1) {
      ++this.currentIndex;
      return this[this.currentIndex];
    }
    else if (this.isCircular) {
      return this.first();
    }
    return null;
  }
}

if (!Array.prototype.prev) {
  Array.prototype.prev = function () {
    if (this.currentIndex > 0) {
      --this.currentIndex;
      return this[this.currentIndex];
    }
    else if (this.isCircular) {
      return this.last();
    }
    return null;
  }
}

if (!Array.prototype.first) {
  Array.prototype.first = function () {
    if (this.length === 0) {
      this.currentIndex = -1;
      return null;
    }

    this.currentIndex = 0;
    return this[0];
  }
}

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    if (this.length > 0) {
      this.currentIndex = this.length - 1;
      return this[this.currentIndex];
    }
    return null;
  }
}

if (!Array.prototype.delete) {
  Array.prototype.delete = function (idx) {
    var val = null;
    if (idx === undefined) {
      //nothing provided, delete the current object with currentIndex.
      if (this.currentIndex != -1) {
        val = this.splice(this.currentIndex, 1)[0];
        (this.currentIndex > -1) ? --this.currentIndex : (this.length > 0) ? this.currentIndex = 0 : this.currentIndex = -1
      }
    }
    else {
      if (typeof (idx) === "number") {
        if (idx < 0) return null;
        if (idx >= this.length) return null;
        val = this.splice(idx, 1)[0];
        if (idx == this.currentIndex)
          (this.currentIndex > -1) ? --this.currentIndex : (this.length > 0) ? this.currentIndex = 0 : this.currentIndex = -1
      }
      else {
        //delete object from the array.  idx is the object value.
        var i = this.indexOf(idx);
        if (i >= 0) {
          val = this[i];
          this.splice(i, 1);
        }
      }
    }
    return val;
  }
}

if (!Array.prototype.insert) {
  Array.prototype.insert = function (idx, val) {
    if (!idx) {
      this.currentIndex = this.push(val);
      return this.currentIndex;
    }
    if (idx < 0) idx = 0;
    if (idx >= this.length) idx = this.length;
    this.splice(idx, 0, val);
    this.currentIndex = idx;
    return idx;
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

//===========================================
//Build a pseudo enumerable object.
var Enum = (function () {
  function Enum(obj) {
    for (var a in obj) {
      this[a] = obj[a];// { name: a, value: obj[a] };
    }
  };

  Enum.prototype.has = function (prop) {
    if (prop in this)
      return true;
    else
      return false;
  }
  return Enum;
})();

//Similar to "instanceof" but return the name of the class as string.
function classNameOf(anObj) {
  var exec = /(\w+)\(/.exec(anObj.constructor);
  var fn = exec ? exec[1] : null;
  return fn;
}

var DataType = new Enum({ number: 1, string: 2, boolean: 3, object: 4, nops: 5 });
//example: var n=DataType.number; var b = n.name in DataType; b is true.


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

function extractSubStr(origStr, delimiter, inclDel) {
  var copyStr = "";
  var i = origStr.indexOf(delimiter);
  if (i >= 0) {
    if (inclDel)
      i += delimiter.length;
    copyStr = origStr.substr(0, i);
  }
  return copyStr;

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