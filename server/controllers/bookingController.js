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
    const { property, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
    const user = req.user?._id;

    if (!user) return res.status(401).json({ success: false, message: "User not authenticated" });
    if (!property || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const propertyData = await Property.findById(property).populate("agency");
    if (!propertyData) return res.status(404).json({ success: false, message: "Property not found" });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid check-in or check-out date" });
    }

    // Check availability
    const bookings = await Booking.find({
      property,
      checkInDate: { $lte: checkOut },
      checkOutDate: { $gte: checkIn },
    });

    if (bookings.length > 0) {
      return res.status(400).json({ success: false, message: "Property not available for selected dates" });
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalPrice = propertyData.price.rent * nights;

    const booking = await Booking.create({
      user,
      property,
      agency: propertyData.agency?._id || null,
      guests: Number(guests),
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: "pending",
      isPaid: false,
      paymentMethod: paymentMethod || "Pay at Check-in",
    });

    // Send email (optional)
    try {
      if (req.user.email) {
        await transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: req.user.email,
          subject: "Booking Confirmation",
          html: `
            <h2>Booking Details</h2>
            <p>Booking ID: ${booking._id}</p>
            <p>Property: ${propertyData.title}</p>
            <p>Agency: ${propertyData.agency?.name || "N/A"}</p>
            <p>Check-in: ${checkIn.toDateString()}</p>
            <p>Check-out: ${checkOut.toDateString()}</p>
            <p>Total Price: ${totalPrice}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    console.log("Booking created:", booking);
    return res.status(201).json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return res.status(500).json({ success: false, message: "Failed to create booking", error: error.message });
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


// ----------------- Get WhatsApp Contact Link -----------------
export const getBookingWhatsAppLink = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("property agency user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Use agency phone if available, else fallback
    const phoneNumber =
      booking.agency?.phone || process.env.DEFAULT_WHATSAPP_NUMBER;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "No WhatsApp number configured",
      });
    }

    const message = `
Hello, I want to proceed with this booking.

Booking ID: ${booking._id}
Property: ${booking.property.title}
Check-in: ${booking.checkInDate.toDateString()}
Check-out: ${booking.checkOutDate.toDateString()}
Guests: ${booking.guests}
Total: ${booking.totalPrice}

Property Image:
${booking.property.images?.[0]}

Address:
${booking.property.address}
    `;

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    return res.json({
      success: true,
      whatsappLink,
    });
  } catch (error) {
    console.error("getBookingWhatsAppLink error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate WhatsApp link",
    });
  }
};
