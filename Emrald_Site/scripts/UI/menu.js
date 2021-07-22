// Copyright 2021 Battelle Energy Alliance

"use strict";

function openCSharpTool() {
  alert("Hey!!! C# here.");
}

function openPythonTool() {
  alert("Hey!!! Python here.");
}
//---------------------------------------------
//support dynamic menuing.  
// when a menu function is not found, it default to this.
var notDefined = function (menuName) {
  alert("The menu function '" + menuName + "' is undefined.");
}

if (typeof Navigation === 'undefined')
  var Navigation; 
(function (Navigation) {
  var Menu = (function (_super) {
    __extends(_super, Menu);
    function Menu(menuFile) {
      _super.apply(this, arguments);

      this.menuUrl = menuFile || "resources/menu.json";
      this.loadMenuFile();
    }
    //Execute a function using just the function name (string) under
    //a given context.  Arguments may be passed through using third parameters.
    Menu.prototype.executeMenu = function (fName, context) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = fName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
        }

        if (context[func] === undefined)
          notDefined(fName);
        else
          context[func].apply(context, args);
        return false;  //IE requires this to be return false.
      }
    }

    //Create the menu with a hierarchical tree structure (title, function, submenu[]).   
    //It recursively call itself to generate all menu items.  It makes call to the given function name 
    //through a help <ExecuteMenu> function.

    Menu.prototype.createSubMenu = function (menuItems, parent, isMain) {
      if (menuItems && menuItems.length > 0) {
        var ul = document.createElement('ul');
        ul.id = "menu";
        parent.appendChild(ul);
        ul.isHideable = !isMain;

        for (var i = 0; i < menuItems.length; i++) {
          var mi = menuItems[i];
					var li = document.createElement('li');
					
          li.isHideable = !isMain;
          ul.appendChild(li);
          var a = document.createElement('a');
          li.appendChild(a);

          li.onmouseover = function (evt) {
            for (var j = 0; j < li.children.length; j++) {
              if (li.children[j].nodeName == 'UL') {
                li.children[j].style.visibility = 'visible';
                break; //should be only one.
              }
            }
            return false;
          }

          li.onmouseout = function (evt) {
            for (var j = 0; j < li.children.length; j++) {
              if (li.children[j].nodeName == 'UL') {
                li.children[j].style.visibility = 'hidden';
                break; //should be only one.
              }
            }
            return false;
          }

          li.onmouseup = function (evt) {
            for (var j = 0; j < li.children.length; j++) {
              if (li.children[j].nodeName == 'UL') {
                li.children[j].style.visibility = 'hidden';
                break; //should be only one.
              }
            }
            return false;
          }

          a.href = 'javascript:(0)';
          a.textContent = mi.title;
          if (mi.fnc && mi.fnc.length > 0)
            a.onclick = this.executeMenu(mi.fnc, window);
          if (mi.submenu) {
            this.createSubMenu(mi.submenu, li, false);
          }
        }
      }
    }


    //Add menu to the menu <nav> tag, supporting HTML5 only.
    //<nav> is dependent on a menu.css file.
    Menu.prototype.createMenu = function (menuObj) {

      //first attempt to use DOM node.
      var nav = document.getElementById("menu-wrap");
      if (!nav) { //create if none exists.
        nav = document.createElement('nav');
        nav.id = "menu-wrap";

        document.body.appendChild(nav);
      }

      var div = document.getElementById('menu-trigger');
      if (!div) {
        div = document.createElement('div');
        div.id = 'menu-trigger';
        nav.appendChild(div);
      }

      this.createSubMenu(menuObj.menu, nav, true);

      //$('nav ul li').mouseover(function (evt) {
      //  $(this).children('ul').css('visibility', 'visible');
      //}).mouseup(function () {
      //  $(this).children('ul').css('visibility', 'hidden');
      //}).mouseout(function () {
      //  $(this).children('ul').css('visibility', 'hidden');
      //});

    }

    //load a menu file and generate the menu.
    Menu.prototype.loadMenuFile = function () {
      getServerFile(this.menuUrl, function (jsonStr) {
        try {
          if (typeof required === 'undefined')
            var menu = eval('(' + jsonStr + ')');  //node-webkit doesn't work with JSON.parse.  So eval() the json object directly.
          else
            var menu = JSON.parse(jsonStr);
        }
        catch (ex) {
          console.log('Error parsing: ' + ex.message);
        }
        if (menu) {
          this.createMenu(menu);
        }
      }.bind(this));
    }

    return Menu;
  })(Object);
  Navigation.Menu = Menu;
})(Navigation || (Navigation = {}));
