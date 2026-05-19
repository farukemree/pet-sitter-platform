/**
 * Error Handler Middleware
 * Global error handling for Express application
 */

const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params
  });

  const response = {
    success: false,
    message: err.message || 'Beklenmeyen sunucu hatası'
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const validationError = (errors) => {
  const error = new Error('Doğrulama hatası');
  error.statusCode = 400;
  error.errors = errors;
  return error;
};

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  validationError
};
