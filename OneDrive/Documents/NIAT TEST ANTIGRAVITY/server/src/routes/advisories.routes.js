import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { singleImageUpload, validateUploadedImage } from '../middleware/upload.js';
import { aiAdvisoryLimiter, aiChatLimiter } from '../middleware/rateLimit.js';
import { uuidParamSchema, listQuerySchema } from '../validators/common.js';
import { chatMessageSchema, feedbackSchema } from '../validators/advisoryInput.js';
import {
  createAdvisory,
  listAdvisories,
  getAdvisory,
  deleteAdvisory,
  submitFeedback,
} from '../controllers/advisories.controller.js';
import { listMessages, sendChatMessage } from '../controllers/chat.controller.js';

const router = Router();

router.use(requireAuth);

router.post(
  '/advisories',
  aiAdvisoryLimiter,
  singleImageUpload,
  validateUploadedImage,
  createAdvisory
);

router.get('/advisories', validate(listQuerySchema, 'query'), listAdvisories);
router.get('/advisories/:id', validate(uuidParamSchema, 'params'), getAdvisory);
router.delete('/advisories/:id', validate(uuidParamSchema, 'params'), deleteAdvisory);

router.get('/advisories/:id/messages', validate(uuidParamSchema, 'params'), listMessages);
router.post(
  '/advisories/:id/chat',
  aiChatLimiter,
  validate(uuidParamSchema, 'params'),
  validate(chatMessageSchema),
  sendChatMessage
);

router.put(
  '/advisories/:id/feedback',
  validate(uuidParamSchema, 'params'),
  validate(feedbackSchema),
  submitFeedback
);

export default router;
