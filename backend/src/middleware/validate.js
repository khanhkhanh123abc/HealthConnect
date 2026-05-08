// Joi schema validator factory. By default validates req.body; pass `source` to
// switch to req.query or req.params.
const validate = (schema, source = 'body') => (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
    });
    if (error) {
        return res.status(400).json({
            errCode: 1,
            errMessage: error.details.map(d => d.message).join('; ')
        });
    }
    req[source] = value;
    return next();
};

module.exports = { validate };
