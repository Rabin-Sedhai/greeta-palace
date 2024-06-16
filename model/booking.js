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
      roomName:{
        type:String,
      },
      room_id:{
        type:String
      }   
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
    enum: ['Booked', 'completed','checked-In', 'cancelled'],
    default: 'Booked'
  },
  CreatedAt:{
    type:Date,
    default: Date.now()
  }
});


const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
