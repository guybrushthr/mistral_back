"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _mistralai = _interopRequireDefault(require("@mistralai/mistralai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 3000;
var client = new _mistralai["default"]("FcZSsytB4tCVcdnP5A6d4zeot4Na2wfL");
app.use((0, _cors["default"])());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.get("/api", function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            console.log("El test funciona!"); // const chatResponse = await client.chat({
            //   model: "mistral-large-latest",
            //   responseFormat: { type: "json_object" },
            //   messages: [
            //     {
            //       role: "user",
            //       content:
            //         "What is the best French meal? Return the name and the ingredients in JSON format.",
            //     },
            //   ],
            // });
            // const response_chat = chatResponse.choices[0].message.content;
            // res.send(response_chat);

            res.send("El test funciona!");
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post("/api", function _callee2(req, res) {
  var chatResponse, response_chat;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("POST BODY: ", req.body);

          if (req.body) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.send("No prompt provided"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(client.chat({
            model: "mistral-large-latest",
            responseFormat: {
              type: "json_object"
            },
            messages: [{
              role: "user",
              content: req.body.prompt
            }]
          }));

        case 6:
          chatResponse = _context2.sent;
          // console.log("POST RESPONSE: ", chatResponse);
          // if (chatResponse.status_code == 200) {
          //   let response_chat = chatResponse.choices[0].message.content;
          //   if (response_chat instanceof Array) {
          //     response_chat = response_chat.join(" \n");
          //   }
          //   console.log("POST RESPONSE SUCCESSFUL: ", response_chat);
          //   res.send(response_chat);
          // } else {
          //   return "Error: " + chatResponse.status_code + chatResponse.text + ".";
          // }
          response_chat = chatResponse.choices[0].message.content;

          if (response_chat instanceof Array) {
            response_chat = response_chat.join(" \n");
          }

          console.log("POST RESPONSE SUCCESSFUL: ", response_chat);
          res.json(response_chat);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Internal Server Error");

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});