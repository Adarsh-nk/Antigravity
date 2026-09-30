import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { farmSchema } from '../validators/farm.js';
import { uuidParamSchema } from '../validators/common.js';
import {
  listFarms,
  createFarm,
  getFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farms.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/farms', listFarms);
router.post('/farms', validate(farmSchema), createFarm);
router.get('/farms/:id', validate(uuidParamSchema, 'params'), getFarm);
router.put('/farms/:id', validate(uuidParamSchema, 'params'), validate(farmSchema), updateFarm);
router.delete('/farms/:id', validate(uuidParamSchema, 'params'), deleteFarm);

export default router;
