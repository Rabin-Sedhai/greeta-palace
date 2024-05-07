const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  checkInDate: {
    type: String,
    required: true
  },
  checkOutDate:{
    type: String,
    required: true
  },
  Nights: {
    type: Number,
    required:true
  },
  BookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  bookedRoom:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "room"
  },
  guestNum:{
    type:Number,
    require:true
  },
  totallCost: {
    type: Number,
    required:true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed','checked-In', 'cancelled'],
    default: 'checked-In'
  }
});


const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
