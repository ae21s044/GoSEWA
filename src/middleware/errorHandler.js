// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log stack trace for debugging

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types (e.g., Sequelize)
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists (Duplicate entry).';
    }

    res.status(statusCode).json({
        success: false,
        error: message
    });
};

module.exports = errorHandler;
