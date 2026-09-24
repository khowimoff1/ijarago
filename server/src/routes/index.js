import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import {
  getCategories, getStats, getListings, getListing, createListing, getDistricts,
} from '../controllers/listingController.js';
import { sendCode, verifyCode } from '../controllers/authController.js';

const router = Router();
router.get('/health', getHealth);
router.get('/stats', getStats);
router.get('/categories', getCategories);
router.get('/districts', getDistricts);
router.get('/listings', getListings);
router.get('/listings/:id', getListing);
router.post('/listings', createListing);
router.post('/auth/send-code', sendCode);
router.post('/auth/verify', verifyCode);

export default router;
