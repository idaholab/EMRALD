12/14/2015 - Leng update.
version: 0.0.0.1 - concept
This version is stable enough for demo.  There are some know issues below
that need to be worked out.  It will be a while that this project will be awaken
in the future for continue working on.

12/15/2017 - Leng update.
version: 0.0.1.0 - concept.
Wow almost to day for last time cut off too.  
--This version clean up alot of things and editing of the state are demonstratable.  
--The data model is no longer saved to the server.  It is save local as JSON string file.  
--All changes or modify to data within the State diagram view change the main data model (mainly the sidebar) directly.
--All properties editors are working properly and modifying the underlying data model.


Know issues or TODO:

1. The state in the Diagram view is not selecting properly.  It allows 
top container cell selection only and also act on mouseUp, required first
click to select and another clicks to drag.

2. Most of the TODO in the GUI Update in the Doc file are not yet implemented.


=============================================
EMRALD structure and technology

There are several projects within the EMRALD Solution (Simulation) such as SimApi, 
SimulatorDAL, and SimRunner3DTester. They are for server side database and data model 
which not being use at the moment. 

As it is now, data are stored locally on user's machine. The only required project is SimSite
and it is self contain project.  The software is a web based application developed with the 
following languages and technologies.  

Languages: 
  -JavaScript: The main development language, all of diagraming user interface are generated in code.
  -HTML5: HTML is use but mostly with forms.
  -CSS3: There are styling files for menu and navigation.  All other visual user interfaces' styling are 
     hard-coded using JavaScript code.

Libraries: These are libraries used and they are open source.
  -mxGraph: mxGraph is a fully client side JavaScript diagramming library that uses SVG and HTML for 
    rendering. https://github.com/jgraph/mxgraph.  The software make heavy use of this library.
  -jQuery: It helps query HTML document traversal and manipulation, event handling, animation, 
    and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. 
    https://jquery.com. The software makes a minimal use but it is required.
  -jQuery-ui: jQuery UI is a curated set of user interface interactions, effects, widgets, 
    and themes built on top of the jQuery JavaScript Library. https://jqueryui.com. The software us
    this library spearingly for handling split/resizable panel dividers.
  -AngularJS: A library that handle data transpor between the ViewModel and the presentation views, 
   strickly for the client user interface data storage. https://angularjs.org.  All editor forms use
   this library for temporary data storage on the browser.

All code are in JavaScript (ECMAScript 5).  All glyphs and images are open source in origin.
