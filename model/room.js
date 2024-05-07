const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    roomName:{
        type:String,
        required:true
    },
    roomDesc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    totallRooms:{
        type:Number,
        required:true,
        default:0
    },
    occupiedRoom: {
        type: Number,
        default:0
    },
    availableRooms:{
        type:Number,
    },
    currentBookings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "booking"
    }],
    roomImg:{
        type:String,
    }
});

const Room = mongoose.model('room', roomSchema);

module.exports = Room;