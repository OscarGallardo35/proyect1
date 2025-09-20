import { Router } from 'express';
import { customerController } from '../controllers/customerController.js';

const router = Router();

router.get('/', customerController.list);
router.post('/', customerController.create);
router.get('/:id', customerController.get);
router.put('/:id', customerController.update);

export default router;
