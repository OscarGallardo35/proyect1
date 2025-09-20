import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';

const router = Router();

router.get('/', orderController.list);
router.post('/', orderController.create);
router.get('/:id', orderController.get);
router.put('/:id', orderController.update);

export default router;
