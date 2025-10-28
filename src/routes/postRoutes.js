import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/postController.js';
import { validateIdParam, validatePostBody, validatePostBodyForUpdate } from '../middleware/postValidators.js';
import { authRequired } from '../middleware/authenticate.js';
import { createOwnershipGuard } from '../middleware/authorizeOwners.js';
import { getBlog } from '../services/postService.js';

const router = express.Router();

// Create guard that loads post and checks userId
const requirePostOwner = createOwnershipGuard(
  async (req) => getBlog(Number(req.params.id))
);

router.get('/', getAll);
router.get('/:id', validateIdParam, getOne);
router.post('/', authRequired, validatePostBody, create);
router.put('/:id', validateIdParam, authRequired, requirePostOwner, validatePostBodyForUpdate, update);
router.delete('/:id', validateIdParam, authRequired, requirePostOwner, remove);

export default router;
