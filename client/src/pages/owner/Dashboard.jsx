import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/data";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, currency, axios, getToken } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings (existing logic)
  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/bookings/agency", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch owner properties (fallback)
  const getOwnerProperties = async () => {
    try {
      const { data } = await axios.get("/api/properties/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([getDashboardData(), getOwnerProperties()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white shadow rounded-xl">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flexStart gap-7 p-5 bg-[#fff4d2] rounded-xl">
          <img src={assets.house} alt="" className="hidden sm:flex w-8" />
          <div>
            <h4 className="h4">
              {dashboardData.totalBookings.toString().padStart(2, "0")}
            </h4>
            <h5 className="h5 text-secondary">Total Sales</h5>
          </div>
        </div>

        <div className="flexStart gap-7 p-5 bg-[#d1e8ff] rounded-xl">
          <img src={assets.dollar} alt="" className="hidden sm:flex w-8" />
          <div>
            <h4 className="h4">
              {currency}{dashboardData.totalRevenue || 0}
            </h4>
            <h5 className="h5 text-secondary">Total Earnings</h5>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="mt-6">
        <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr] px-6 py-3 bg-secondary rounded-t-xl">
          <h5 className="h4 hidden lg:block">Index</h5>
          <h5 className="h4">Property</h5>
          <h5 className="h4">Details</h5>
          <h5 className="h4">Amount</h5>
          <h5 className="h4">Status</h5>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading dashboard...
          </div>
        )}

        {/* BOOKINGS */}
        {!loading && dashboardData.bookings.length > 0 &&
          dashboardData.bookings.map((booking, index) => (
            <div
              key={booking._id}
              className="grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr] px-6 py-3 border-b"
            >
              <div className="hidden lg:block">{index + 1}</div>
              <div className="flex gap-2">
                <img
                  src={booking.property.images[0]}
                  alt=""
                  className="w-14 rounded"
                />
                <span>{booking.property.title}</span>
              </div>
              <div>
                {new Date(booking.checkInDate).toLocaleDateString()} –{" "}
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
              <div>{currency}{booking.totalPrice}</div>
              <span className={booking.isPaid ? "text-green-600" : "text-red-500"}>
                {booking.isPaid ? "Contact Now" : "Contact Now"}
              </span>
            </div>
          ))}

        {/* FALLBACK: PROPERTIES */}
        {!loading && dashboardData.bookings.length === 0 &&
          properties.map((property, index) => (
            <div
              key={property._id}
              className="grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr] px-6 py-3 border-b"
            >
              <div className="hidden lg:block">{index + 1}</div>
              <div className="flex gap-2">
                <img
                  src={property.images[0]}
                  alt=""
                  className="w-14 rounded"
                />
                <span>{property.title}</span>
              </div>
              <div>{property.address}</div>
              <div>
                {currency}
                {property.price?.rent || property.price?.sale || 0}
              </div>
              <span className={property.isAvailable ? "text-green-600" : "text-red-500"}>
                {property.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          ))}

        {/* Empty State */}
        {!loading &&
          dashboardData.bookings.length === 0 &&
          properties.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No properties or bookings yet.
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
