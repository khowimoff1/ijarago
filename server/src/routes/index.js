import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { a } from '../utils/asyncHandler.js';
import { getHealth } from '../controllers/healthController.js';
import {
  getCategories, getStats, getListings, getListing, createListing, deleteListing, getDistricts,
} from '../controllers/listingController.js';
import { telegramAuth } from '../controllers/authController.js';
import { getMe, updateMe, getMyListings, getUserProfile } from '../controllers/userController.js';
import { createBooking, getMyBookings, getIncomingBookings, updateBooking } from '../controllers/bookingController.js';

const router = Router();
router.get('/health', getHealth);
router.get('/stats', a(getStats));
router.get('/categories', a(getCategories));
router.get('/districts', a(getDistricts));

router.get('/listings', a(getListings));
router.get('/listings/:id', a(getListing));
router.post('/listings', requireAuth, a(createListing));
router.delete('/listings/:id', requireAuth, a(deleteListing));

router.post('/auth/telegram', a(telegramAuth));

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, a(updateMe));
router.get('/me/listings', requireAuth, a(getMyListings));
router.get('/me/bookings', requireAuth, a(getMyBookings));
router.get('/me/requests', requireAuth, a(getIncomingBookings));
router.get('/users/:id', a(getUserProfile));

router.post('/bookings', requireAuth, a(createBooking));
router.patch('/bookings/:id', requireAuth, a(updateBooking));

export default router;
