'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/health', function (req, res) {
    res.status(200).json({ hello: 'world' });
});

app.listen(5001, function () {
    console.log('Listening...');
});