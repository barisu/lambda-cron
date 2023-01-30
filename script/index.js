"use strict";
exports.__esModule = true;
exports.handler = void 0;
var handler = function (event, context, callback) {
    console.log('Hello, World!');
    var response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello, World!' })
    };
    callback(undefined, response);
};
exports.handler = handler;
