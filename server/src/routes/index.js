import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getHealth } from '../controllers/healthController.js';
import {
  getCategories, getStats, getListings, getListing, createListing, deleteListing, getDistricts,
} from '../controllers/listingController.js';
import { sendCode, verifyCode } from '../controllers/authController.js';
import { getMe, updateMe, getMyListings, getUserProfile } from '../controllers/userController.js';
import { createBooking, getMyBookings, getIncomingBookings, updateBooking } from '../controllers/bookingController.js';

const router = Router();
router.get('/health', getHealth);
router.get('/stats', getStats);
router.get('/categories', getCategories);
router.get('/districts', getDistricts);

router.get('/listings', getListings);
router.get('/listings/:id', getListing);
router.post('/listings', requireAuth, createListing);
router.delete('/listings/:id', requireAuth, deleteListing);

router.post('/auth/send-code', sendCode);
router.post('/auth/verify', verifyCode);

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateMe);
router.get('/me/listings', requireAuth, getMyListings);
router.get('/me/bookings', requireAuth, getMyBookings);
router.get('/me/requests', requireAuth, getIncomingBookings);
router.get('/users/:id', getUserProfile);

router.post('/bookings', requireAuth, createBooking);
router.patch('/bookings/:id', requireAuth, updateBooking);

export default router;
