// Normalizes validation errors into { errors: [...] } with 400 status
export default function handleValidationErrors(err, _req, res, next) {
  // If an upstream validator already produced a proper response, skip
  if (res.headersSent) return next(err);

  // Express-Validator style
  if (Array.isArray(err?.errors)) {
    const messages = err.errors.map(e => e.msg || e.message || String(e));
    return res.status(400).json({ errors: messages.length ? messages : ['Bad request'] });
  }

  // Generic { errors: [...] }
  if (Array.isArray(err)) {
    return res.status(400).json({ errors: err.map(e => String(e)) });
  }
  if (err && err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({ errors: err.errors.map(e => String(e)) });
  }

  // Fallback to default error handling
  return next(err);
}
