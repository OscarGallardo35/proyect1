import { Router } from 'express';
import { supplierController } from '../controllers/supplierController.js';

const router = Router();

router.get('/', supplierController.list);
router.post('/', supplierController.create);
router.get('/:id', supplierController.get);
router.put('/:id', supplierController.update);

export default router;
