import { Router } from 'express';
import healthRoutes from './health.routes.js';
import metaRoutes from './meta.routes.js';
import profileRoutes from './profile.routes.js';
import farmsRoutes from './farms.routes.js';
import advisoriesRoutes from './advisories.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use(healthRoutes);
router.use(metaRoutes);
router.use(profileRoutes);
router.use(farmsRoutes);
router.use(advisoriesRoutes);
router.use(dashboardRoutes);

export default router;
