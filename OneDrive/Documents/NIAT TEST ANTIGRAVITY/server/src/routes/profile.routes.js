import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../validators/profile.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profile.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', validate(profileUpdateSchema), updateProfile);
router.delete('/profile', deleteProfile);

export default router;
