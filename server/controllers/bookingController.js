import transporter from "../config/nodemailer.js";
import Agency from "../models/Agency.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

// ----------------- Helper -----------------
const checkAvailability = async ({ checkInDate, checkOutDate, property }) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find overlapping bookings
    const bookings = await Booking.find({
      property,
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
      ]
    });

    return bookings.length === 0;
  } catch (error) {
    console.error("checkAvailability error:", error);
    throw error;
  }
};

// ----------------- Check Property Availability -----------------
export const CheckBookingAvailability = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate } = req.body;

    if (!property || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const isAvailable = await checkAvailability({ property, checkInDate, checkOutDate });
    res.json({ success: true, isAvailable });
  } catch (error) {
    console.error("CheckBookingAvailability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Create Booking -----------------
export const bookingCreate = async (req, res) => {
  console.log("BookingCreate route hit");
  try {
    const { property, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user?._id;

    if (!user) return res.status(401).json({ success: false, message: "User not authenticated" });
    if (!property || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check availability
    const isAvailable = await checkAvailability({ property, checkInDate, checkOutDate });
    if (!isAvailable) return res.status(400).json({ success: false, message: "Property not available for selected dates" });

    const propertyData = await Property.findById(property).populate("agency");
    if (!propertyData) return res.status(404).json({ success: false, message: "Property not found" });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalPrice = propertyData.price.rent * nights;

    const booking = await Booking.create({
      user,
      property,
      agency: propertyData.agency._id,
      guests: Number(guests),
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: "pending",
      isPaid: false,
      paymentMethod: "Pay at Check-in",
    });

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Property Booking/Sale",
      html: `
        <h2>Your Booking Details</h2>
        <p>Thank you for your booking! Below are your booking details</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Agency Name:</strong> ${propertyData.agency.name}</li>
          <li><strong>Location:</strong> ${propertyData.address}</li>
          <li><strong>Check-In:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice} for ${nights} night(s)</li>
        </ul>
        <p>We are excited to welcome you soon.</p>
        <p>Need to change something? Contact us.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Booking created:", booking);
    res.status(201).json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.error("Booking creation failed:", error);
    res.status(500).json({ success: false, message: "Failed to create booking", error: error.message });
  }
};

// ----------------- Get User Bookings -----------------
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user?._id;
    if (!user) return res.status(401).json({ success: false, message: "User not authenticated" });

    const bookings = await Booking.find({ user }).populate("property agency").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    res.status(500).json({ success: false, message: "Failed to get bookings", error: error.message });
  }
};

// ----------------- Get Agency Bookings -----------------
export const getAgencyBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const agency = await Agency.findOne({ owner: userId });
    if (!agency) return res.status(404).json({ success: false, message: "No agency found for this user" });

    const bookings = await Booking.find({ agency: agency._id }).populate("property agency user").sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.isPaid ? b.totalPrice : 0), 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    console.error("getAgencyBookings error:", error);
    res.status(500).json({ success: false, message: "Failed to get agency bookings", error: error.message });
  }
};
