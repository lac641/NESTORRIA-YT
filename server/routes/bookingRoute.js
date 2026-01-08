import express from 'express'
import { bookingCreate, CheckBookingAvailability, getAgencyBookings, getBookingWhatsAppLink, getUserBookings } from '../controllers/bookingController.js'
import { authUser } from '../middleware/authMiddleware.js'

const bookingRouter = express.Router()

bookingRouter.post('/check-availability', CheckBookingAvailability)
bookingRouter.post('/book',authUser, bookingCreate)
bookingRouter.get('/user', authUser, getUserBookings)
bookingRouter.get('/agency',authUser, getAgencyBookings)
router.get(
  "/bookings/:bookingId/whatsapp",
  auth,
  getBookingWhatsAppLink
);

export default bookingRouter