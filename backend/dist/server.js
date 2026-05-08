"use strict";

var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _web = _interopRequireDefault(require("./route/web.js"));
var _connectDB = _interopRequireDefault(require("./config/connectDB.js"));
require("dotenv/config");
var _cors = _interopRequireDefault(require("cors"));
var _cronService = require("./services/cronService.js");
var _rateLimit = require("./middleware/rateLimit.js");
var _logger = _interopRequireDefault(require("./utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
process.env.TZ = 'Asia/Ho_Chi_Minh';
(0, _cronService.startAutoCancelCron)();
var app = (0, _express["default"])();

// Trust the first proxy (Azure VM behind Nginx / load balancer) so that
// rate limiters can read the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use((0, _cors["default"])({
  origin: ['https://health-connect-sooty-omega.vercel.app', 'https://healthconnect.io.vn', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Generic API limiter applied to every /api/* route. Auth routes get a
// stricter limiter layered on top inside web.js.
app.use('/api', _rateLimit.apiLimiter);
(0, _web["default"])(app);
(0, _connectDB["default"])();
var port = process.env.PORT || 8080;
app.listen(port, function () {
  _logger["default"].info({
    port: port
  }, 'Server started');
});