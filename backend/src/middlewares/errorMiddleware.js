const parseERROR = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Provide stack trace in development mode only
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = parseERROR;
