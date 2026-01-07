import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import PropertyImages from "../components/PropertyImages";
import { assets } from "../assets/data";
import toast from "react-hot-toast";

const PropertyDetails = () => {
  const { currency, properties, navigate, axios, getToken } = useAppContext();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load property data
  useEffect(() => {
    const prop = properties.find((p) => p._id === id);
    if (prop) setProperty(prop);
  }, [properties, id]);

  const today = new Date().toISOString().split("T")[0];

  // ----------------- Handle Booking -----------------
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (checkInDate > checkOutDate) {
      toast.error("Check-in date must be before check-out date");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const { data } = await axios.post(
        "/api/bookings/book",
        {
          property: id,
          checkInDate,
          checkOutDate,
          guests: Number(guests),
          paymentMethod: "Pay at Check-in",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Booking created successfully!");
        navigate("/my-bookings");
        window.scroll(0, 0);
      } else {
        toast.error(data.message || "Failed to create booking");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container">
        <PropertyImages property={property} />

        <div className="flex flex-col xl:flex-row gap-8 mt-6">
          {/* Left Side */}
          <div className="p-4 flex-2 rounded-xl border border-slate-900/10">
            <p className="flexStart gap-x-2">
              <img src={assets.pin} alt="" width={19} />
              <span>{property.address}</span>
            </p>

            <h3 className="h3 mt-2">{property.title}</h3>
            <div className="bold-18 p-1.5">
              {currency}
              {property.price.sale} || {currency}
              {property.price.rent}.00/night
            </div>

            <div className="flex justify-between items-start my-1 ">
              <h4 className="h4 text-secondary">{property.propertyType}</h4>
              <div className="flex items-baseline gap-2 text-secondary relative top-1">
                <h4 className="bold-18 relative bottom-0.5">5.0</h4>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={assets.star} alt="star" width={18} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="h4 mt-4 mb-1">Property Details</h4>
              <p className="mb-4">{property.description}</p>
            </div>

            <h4 className="h4 mt-6 mb-2">Amenities</h4>
            <div className="flex gap-3 flex-wrap">
              {property.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="py-3 px-2 rounded-lg bg-secondary/10 ring-1 ring-slate-500/10 text-sm"
                >
                  {amenity}
                </div>
              ))}
            </div>

            {/* Booking Form */}
            <form
              onSubmit={handleBooking}
              className="text-gray-500 bg-secondary/10 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 lg:gap-x-8 max-w-md lg:max-w-full ring-1 ring-slate-900/5 relative mt-10"
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <img src={assets.calendar} alt="" width={20} />
                  <label htmlFor="checkInDate">Check In</label>
                </div>
                <input
                  type="date"
                  id="checkInDate"
                  min={today}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <img src={assets.calendar} alt="" width={20} />
                  <label htmlFor="checkOutDate">Check Out</label>
                </div>
                <input
                  type="date"
                  id="checkOutDate"
                  min={checkInDate || today}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  disabled={!checkInDate}
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <img src={assets.user} alt="" width={20} />
                  <label htmlFor="guests">Guests</label>
                </div>
                <input
                  type="number"
                  id="guests"
                  min={1}
                  max={5}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flexCenter gap-1 rounded-md btn-dark min-w-44"
              >
                <img src={assets.search} alt="searchIcon" width={20} className="invert" />
                <span>{loading ? "Booking..." : "Book Property"}</span>
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="flex-1 max-w-sm">
            <div className="p-6 rounded-xl border border-slate-900/10">
              <h4 className="h4 mb-3">Contact Agent</h4>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button type="submit" className="btn-secondary rounded-lg py-1.5">
                  Send Message
                </button>
              </form>

              <h4 className="h4 mb-3 mt-8">For Buying Contact</h4>
              <div className="text-sm w-80 divide-y divide-gray-500/30 border border-gray-500/30 rounded">
                <div className="flex items-start justify-between p-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="h5">{property.agency.name}</h5>
                      <p className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30">
                        Agency
                      </p>
                    </div>
                    <p>Agency Office</p>
                  </div>
                  {property.agency.owner?.image && (
                    <img src={property.agency.owner.image} alt="" className="h-10 w-10 rounded-full" />
                  )}
                </div>

                <div className="flexStart gap-2 p-1.5">
                  <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                    <img src={assets.phone} alt="" width={14} />
                  </div>
                  <p>{property.agency.contact}</p>
                </div>

                <div className="flexStart gap-2 p-1.5">
                  <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                    <img src={assets.phone} alt="" width={14} />
                  </div>
                  <p>{property.agency.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
