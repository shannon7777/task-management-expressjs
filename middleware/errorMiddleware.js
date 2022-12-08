// this a custom error handler, put err in the params to overwrite the expressjs error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode? res.statusCode : 500

    res.status(statusCode);

    res.json({
        message: err.message,
        // stack trace gives us some extra information, but only for development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler