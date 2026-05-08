"use strict";

// Joi schema validator factory. By default validates req.body; pass `source` to
// switch to req.query or req.params.
var validate = function validate(schema) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
  return function (req, res, next) {
    var data = req[source];
    var _schema$validate = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
      }),
      error = _schema$validate.error,
      value = _schema$validate.value;
    if (error) {
      return res.status(400).json({
        errCode: 1,
        errMessage: error.details.map(function (d) {
          return d.message;
        }).join('; ')
      });
    }
    req[source] = value;
    return next();
  };
};
module.exports = {
  validate: validate
};