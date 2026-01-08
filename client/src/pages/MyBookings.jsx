import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/data'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const { currency, axios, user, getToken } = useAppContext()

  // ---------------- Get User Bookings ----------------
  const getUserBooking = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })

      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      getUserBooking()
    }
  }, [user])

  // ---------------- WhatsApp Contact ----------------
  const openWhatsApp = (booking) => {
    const phoneNumber = '2348063969597' // replace with agency or business number

    const message = `
Hello, I want to proceed with this booking.

Booking ID: ${booking._id}
Property: ${booking?.property?.title}
Guests: ${booking.guests}
Check-in: ${new Date(booking.checkInDate).toDateString()}
Check-out: ${new Date(booking.checkOutDate).toDateString()}
Total: ${currency}${booking.totalPrice}

Property Image:
${booking?.property?.images?.[0]}

Address:
${booking?.property?.address}
    `

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`

    window.open(url, '_blank')
  }

  return (
    <div className='bg-gradient-to-r from-[#fffbee] to-white pt-28 py-16'>
      {bookings?.map((booking) => (
        <div
          key={booking._id}
          className='bg-white ring-1 ring-slate-900/5 p-2 pr-4 mt-3 rounded-lg'
        >
          {/* ---------------- Property Block ---------------- */}
          <div className='flexStart gap-3 mb-3'>
            <img
              src={booking?.property?.images?.[0]}
              alt='property'
              className='h-14 w-26 object-cover rounded-lg'
            />

            <div>
              <h5 className='h5 capitalize line-clamp-1'>
                {booking?.property?.title}
              </h5>

              <div className='flex gap-4'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='medium-14'>Guests:</h5>
                  <p>{booking.guests}</p>
                </div>

                <div className='flex items-center gap-x-2'>
                  <h5 className='medium-14'>Total:</h5>
                  <p className='text-gray-400 text-sm'>
                    {currency}
                    {booking.totalPrice}
                  </p>
                </div>
              </div>

              <p className='flex place-items-baseline gap-1 mt-0.5'>
                <img src={assets.pin} width={13} alt='' />
                {booking?.property?.address}
              </p>
            </div>
          </div>

          {/* ---------------- Summary ---------------- */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-t border-gray-300 pt-3'>
            <div className='flex gap-2 gap-x-4 flex-wrap'>
              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Booking ID</h5>
                <p className='text-gray-400 text-xs break-all'>
                  {booking._id}
                </p>
              </div>

              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Check-In:</h5>
                <p className='text-gray-400 text-xs'>
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>

              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Check-Out:</h5>
                <p className='text-gray-400 text-xs'>
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            {/* ---------------- Action ---------------- */}
            <div className='flex gap-2 gap-x-3'>
              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Communicate:</h5>
              </div>

              {!booking.isPaid && (
                <button
                  onClick={() => openWhatsApp(booking)}
                  className='btn-secondary !py-1 !text-xs rounded-sm'
                >
                  Contact Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyBookings
