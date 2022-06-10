// Copyright 2021 Battelle Energy Alliance

// ----------------------------------------
// Class WcfService
//
// Dependencies:
//  JQuery
//
// ----------------------------------------
// Constructor(s)
// ----------------------------------------
'use strict';
var WcfService = (function (_super) {
  __extends(WcfService, _super);
  function WcfService(aUrl, sType, rType) {
    _super.apply(this, arguments);
    var _urlServiceLocation = aUrl || (aUrl = document.location.protocol + "//" + document.location.host + "/");
    var _sendType = sType || (sType = 'application/json; charset=utf-8');
    var _receiveType = rType || (rType = 'json');
    var _async = true;
    var _processData = false;
    this.statusMessage = null;
    this.debugConsoleOn = false;
    // ----------------------------------------
    // "Private" section
    // ----------------------------------------

    var _getNowAsString = function () {
      var currentdate = new Date();
      var now = currentdate.getDate() + "/"
              + (currentdate.getMonth() + 1) + "/"
              + currentdate.getFullYear() + "@"
              + currentdate.getHours() + ":"
              + currentdate.getMinutes() + ":"
              + currentdate.getSeconds()
      ;
      return now;
    }

    var _showDebugMessage = function (msg) {
      msg = _getNowAsString() + ", wcfService.js: " + msg;
      if (this.debugConsoleOn)
        console.log(msg);
      this.statusMessage = msg;
    }.bind(this);


    // Unwrap (.NET ".d") and deserialize result.
    var _unwrapResult = function (result) {
        var unwrappedResult = result;
        if (Object.prototype.hasOwnProperty.call(result, "d")) {
        if (typeof require == 'undefined')  //if run under node-webkit
          unwrappedResult = eval('(' + result.d + ')');
        else
          unwrappedResult = JSON.parse(result.d);//$.parseJSON(result.d);
      }
      this.resultObject = unwrappedResult;
      return unwrappedResult;
    }.bind(this);

    //
    // Method to call a WCF service
    //
    // Arguments:
    //  string method        - GET, POST, PUT or DELETE verb
    //  string url         - Location of the service, i.e.: "Service.svc/GetUser";
    //  string data        - Data sent to server, i.e.: '{"Id": "' + userid + '"}'
    //  string sendType    - content type sent to server
    //  string receiveType  - Expected data format from server

    // jQueryCall make use of JQuery library which return a jqxhrPromise.  Data to be processed by caller.
    var _jQueryCall = function (method, url, data, sendType, receiveType) {

      sendType = sendType || _sendType;
      receiveType = receiveType || _receiveType;
      _showDebugMessage("_jQueryCall(" + method + ": " + _urlServiceLocation + url + ") -- [sendType: " + sendType + ", Data: '" + data + "', ReceiveType: " + receiveType + "]");
      var onSuccessFn = onSuccessFn || _succeededHandler;
      var onErrorFn = onErrorFn || _failedHandler;

      url = _urlServiceLocation + '/' + url;
      //if (method == "GET" && data)
      //  data = "id=" + data;
      return new Promise(function (resolveFn, rejectFn) {
        //$.ajax is already async call, but we want to provide a promises mechanism to allow for caller to process the data.
        var jqxhrPromise = $.ajax({
          cache: false,
          async: _async,
          type: method,
          url: url,
          data: data,
          crossDomain: true,
          contentType: 'application/json', //sendType, 
          dataType: 'text', //receiveType,
          processData: _processData,
          xhrFields: {
            withCredentials: false
          },
          headers: {
            
          },
          success: function (result) {
            _showDebugMessage("result [" + result + "]");
            if (_processData) {
              result = _unwrapResult(result);
            }
            setTimeout(function () {
              // Delay execution of success handler.
              // Mainly done to see any visual feedback in the browser.
              resolveFn(result);
            }, 1000);
          }.bind(this),
          error: function (xhr, statusCodeText, statusText) {
              _showDebugMessage("error [" + xhr + "] [" + statusCodeText + "] [" + statusText + "]");
              // TODO: too many arguments
            rejectFn(xhr, statusCodeText, statusText);
          }
        }); //end of jquery.ajax() call
      });  //promise
    }.bind(this);


    //jsCall make use of Promise asynchronization which data handler are delegate to caller with .then() function.
    var _jsCall = function (method, url, data, sendType, receiveType) {
      sendType = sendType || _sendType;
      receiveType = receiveType || _receiveType;
      
      url = _urlServiceLocation + '/'+ url;
      _showDebugMessage(
          "_jsCall( '" + method + "', '" + url + "', '" + data + "', '" + sendType + "', '" + receiveType + " )" +
          "\n\n" +
          "async [" + _async + "]"
      );

      return new Promise(function (resolveFn, rejectFn) {
        var xhr = new XMLHttpRequest();

        if (method == "GET" && data) {
          data = "id=" + data;
        }
        //Support CORS protocol -- cross domain invoker.
        if ("withCredentials" in xhr) {
          _async = true;
        }
        else if (typeof XDomainRequest != "undefined") {
          xhr = XDomainRequest();
          _async = undefined;
        }
        else {
          throw new Error("CORS not supported.")
        }
        xhr.onreadystatechange = function onChanged() {
          if ((this.readyState == this.DONE) && (this.status == 200)) {
            var result = this.response;
            if (_processData) {
              _showDebugMessage("result [" + result + "]");
              result = _unwrapResult(result);
            }
            setTimeout(function () {
              // Delay execution of success handler.
              // Mainly done to see any visual feedback in the browser.
              //resolveFn is a callback function call by Promise.
              resolveFn(result);
            }.bind(this), 1000);
          }
        };
        xhr.onerror = function () {
          _showDebugMessage("error [" + xhr + "] [" + xhr.statusText + "]");
          rejectFn(new Error('Service request failed, cause: ' + xhr.statusText));
        };
        xhr.open(method, url, _async);
        xhr.responseType = 'text'; // receiveType;   //default: "json"
        xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
        xhr.setRequestHeader("Access-Control-Allow-Methods", "*");
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('content-type','text/plain');// sendType);//default: "application/json"
        xhr.send(data);
      }.bind(this));
    }.bind(this);
    //----------------------------------
    var _failedHandler = function (xhr, statusCodeText, statusText) {

      var msg = "Service call failed: ";

      if (xhr) {
        msg = msg
            + statusText + " (" + statusCodeText + " [" + xhr.status + "])"
            + "\n\n"
            + xhr.responseText
        ;
      }
      else {
        msg = msg + "reason unknown";
      }

      msg = _getNowAsString() + ", wcfService.js: " + msg;
      console.log(msg);

      this.statusMessage = msg;
    }.bind(this);


    var _succeededHandler = function (result) {
      var msg =
          _getNowAsString() + ", wcfService.js: " +
          "Service call succeeded [" + result + "]"
      ;
      console.log(msg);
      this.statusMessage = msg;
    }.bind(this);

    // ----------------------------------------
    // "public" section
    // ----------------------------------------
    this.post = function (url, data, sendType, receiveType) {
      //if jquery is present, use it.  Otherwise use the Javascript version.
      if (typeof $ == 'undefined') {
        return _jsCall("POST", url, data, sendType, receiveType);
      }
      else {
        return _jQueryCall("POST", url, data, sendType, receiveType);
      }
    }

    this.get = function (url, data, sendType, receiveType) {
      if (typeof $ == 'undefined') {  //jquery is not used
        return _jsCall("GET", url, data, sendType, receiveType);
      }
      else {
        return _jQueryCall("GET", url, data, sendType, receiveType);
      }
    }

    this.update = function (url, data, sendType, receiveType) {
      if (typeof $ == 'undefined') {  //jquery is not used
        return _jQueryCall("PUT", url, data, sendType, receiveType);
      }
      else {
        return _jsCall("PUT", url, data, sendType, receiveType);
      }
    }
    this.delete = function (url, data, sendType, receiveType) {
      if (typeof $ == 'undefined') {
        return _jQueryCall("DELETE", url, data, sendType, receiveType);
      } else {
        return _jsCall("DELETE", url, data, sendType, receiveType);
      }
    }
  }
  return WcfService;
})(Object);
