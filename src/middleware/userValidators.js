const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

export function validateUserIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ errors: ['id must be a positive integer'] });
  next();
}

export function validateUserSignupBody(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];
  if (!email || !String(email).includes('@')) errors.push('Invalid email');
  const pw = String(password || '').trim();
  if (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX) {
    errors.push(`Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`);
  }
  if (errors.length) return res.status(400).json({ errors });
  req.body.email = String(email).trim();
  req.body.password = pw;
  next();
}

export function validateUserUpdateBody(req, res, next) {
  const { email, password, role } = req.body || {};
  const errors = [];
  if (email !== undefined && !String(email).includes('@')) errors.push('Invalid email');
  if (password !== undefined) {
    const pw = String(password).trim();
    if (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX) {
      errors.push(`Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`);
    }
  }
  if (role !== undefined && !['USER', 'ADMIN'].includes(String(role))) {
    errors.push('Invalid role');
  }
  if (errors.length) return res.status(400).json({ errors });
  if (email !== undefined) req.body.email = String(email).trim();
  if (password !== undefined) req.body.password = String(password).trim();
  if (role !== undefined) req.body.role = String(role);
  next();
}
