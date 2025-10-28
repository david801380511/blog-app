// Generic role-based authorization middleware
// Usage: router.get('/admin', authenticate, authorizeRoles('ADMIN'), handler)
export default function authorizeRoles(...allowed) {
  const set = new Set(allowed.length ? allowed : ['ADMIN']);
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!set.has(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Common aliases
export const adminOnly = authorizeRoles('ADMIN');
