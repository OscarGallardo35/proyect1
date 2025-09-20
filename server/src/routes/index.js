import { Router } from 'express';
import catalogRoutes from './catalogRoutes.js';
import customerRoutes from './customerRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import orderRoutes from './orderRoutes.js';
import crmRoutes from './crmRoutes.js';
import eventRoutes from './eventRoutes.js';

const router = Router();

router.use('/catalog', catalogRoutes);
router.use('/customers', customerRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/orders', orderRoutes);
router.use('/crm', crmRoutes);
router.use('/events', eventRoutes);

export default router;
