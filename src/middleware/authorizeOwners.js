// Owner-based authorization helpers
// Default: compare req.user.id to Number(req.params.id) (useful for /users/:id routes)
export default function authorizeOwnerByParam(paramName = 'id') {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const targetId = Number(req.params?.[paramName]);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ errors: [`${paramName} must be a positive integer`] });
    }
    if (req.user.id !== targetId) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Advanced: create a guard using a resource loader (e.g., load post and check post.userId)
// loader: async (req) => ({ ownerId }) or the resource itself which has userId/ownerId
export function createOwnershipGuard(loader, { deriveOwnerId } = {}) {
  return async function (req, res, next) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const resource = await loader(req);
      if (!resource) return res.status(404).json({ error: 'Not found' });
      const ownerId = deriveOwnerId
        ? deriveOwnerId(resource)
        : (resource.ownerId ?? resource.userId ?? resource.authorId);
      if (!Number.isInteger(ownerId)) return res.status(500).json({ error: 'Owner not resolvable' });
      if (ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      next();
    } catch (e) { next(e); }
  };
}
