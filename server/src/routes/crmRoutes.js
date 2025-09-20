import { Router } from 'express';
import { crmController } from '../controllers/crmController.js';

const router = Router();

router.get('/', crmController.list);
router.post('/', crmController.create);
router.get('/:id', crmController.get);
router.post('/:id/notes', crmController.addNote);
router.put('/:id', crmController.update);

export default router;
