const Booking = require('../model/booking');
const Room = require('../model/room')

const checkPendingBookings = async (req, res, next) => {
  try {
    const pendingBookings = await Booking.find({ status: 'checked-In' });

    for (const booking of pendingBookings) {
      const checkoutDate = new Date(booking.checkOutDate);
      const currentDate = new Date();

      checkoutDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate >= checkoutDate) {
        booking.status = 'completed';
        await booking.save();

        const room = await Room.findById(booking.bookedRoom);

        room.currentBookings.pull(booking._id);
        room.availableRooms += 1;
        room.occupiedRoom -= 1;

        await room.save(); // Make sure to save the room after making changes
      }
    }

    next();
  } catch (error) {
    console.error('Error checking pending bookings:');
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {checkPendingBookings}