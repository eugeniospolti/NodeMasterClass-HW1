var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var environment = require("./config");

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);

  var path = parsedUrl.pathname;

  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  var queryStringObject = path.queryStringObject;

  var method = req.method.toLowerCase();

  var headers = req.headers;

  var decoder = new StringDecoder("utf-8");

  var buffer = "";
  req.on("data", function(data) {
    buffer += decoder.write(data);
  });

  req.on("end", function(data) {
    buffer += decoder.end();

    var chosenHandler =
      typeof routes[trimmedPath] !== "undefined"
        ? routes[trimmedPath]
        : handlers.notFound;

    var dataToHandler = {
      path: trimmedPath,
      queryString: queryStringObject,
      headers: headers,
      payload: data
    };

    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      payload = typeof payload == "object" ? payload : {};

      var payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);

      res.end(payloadString);
    });
  });
});

var handlers = {};

handlers.hello = function(data, callback) {
  callback(200, { message: "Welcome to the my first homework!" });
};

handlers.notFound = function(data, callback) {
  callback(404);
};

var routes = {
  hello: handlers.hello
};

server.listen(environment.port, () =>
  console.log(`Server is listening on port ${environment.port}`)
);
