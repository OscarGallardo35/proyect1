import { Router } from 'express';
import { catalogController } from '../controllers/catalogController.js';

const router = Router();

router.get('/', catalogController.list);
router.post('/', catalogController.create);
router.get('/:id', catalogController.get);
router.put('/:id', catalogController.update);
router.delete('/:id', catalogController.delete);

export default router;
