// Copyright 2021 Battelle Energy Alliance

var path = require("path");

// Routes the request, so that a proper file can be found for it.
var route = function(pathname) {

    var path = process.cwd() + "\\"; // Sets up the path to the
    // current directory, the one
    // that will contain the pages.

    // If the file ending has been corrected before hand
    var corrected = false;

    if (pathname === "" || pathname === "index" || pathname === "home"
            || pathname === "index.html" || pathname === "home.html") {
        // If it should be routed to the home page.
        path += "index.html"; // Sets it to the index page
        corrected = true;

    } else {

        // If it isn't any of those, then just appends the pathname
        path += pathname;
    }

    // Splits it using "." separator. If the length of the split is only one
    // then no file type has been specified, and so one will be generated
    var pathSplit = pathname.split(".");

    if (pathSplit.length === 1 && corrected === false) {
        // If the split leaves length one then appends .html to the end.
        path += ".html";

    }
    console.log("Path is : " + path);
    return path; // Returns the path.

};

exports.route = route;