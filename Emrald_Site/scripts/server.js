// Copyright 2021 Battelle Energy Alliance

var http = require("http");
var url = require("url");

// Starts the server
var Start = function(route, serve, reqtype) {

    // Launched when there is a request.
    var onRequest = function(request, response) {

        // Extracts the pathname from the url
        var pathname = url.parse(request.url).pathname;

        // Removes the starting "/". If this fails, then that means the request
        // was without
        // the "/", and so does not affect it.
        try {
            pathname = pathname.substring(1, pathname.length);
        } catch (err) {

        }

        // Responds to all requests apart from that for favicon.ico
        if (pathname !== "favicon.ico") {

            console.log("Request has been received");

            // Gets the path from the router
            var path = route(pathname);
            console.log("Path has been generated");
            // Gets html or whatever will be written from the pageserver
            var html = "";

            html = serve(path);
            console.log("Html has been generated");

            // Gets the type from the pageserver
            var type = reqtype(path);
            console.log("Filetype has been found");

            // Writes what type of data will be sent. Dynamically sets file
            // ending.
            response.writeHead(200, {
                "Content-Type" : "text/" + type
            });
            // writes to output
            console.log("Writing to output");
            response.write(html);
            console.log("Written to output");
            // ends connection
            response.end();
            console.log("Request answered successfully");
        }

    };

    http.createServer(onRequest).listen(8888);
    console.log("Server has been started");
};

exports.Start = Start;