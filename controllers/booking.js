const Booking = require('../model/booking');
const Room = require('../model/room');
const User = require('../model/user');
const mongoose = require('mongoose');

async function cancelBooking(req, res){
    let status = "cancelled"
    const room = await Booking.findOne({_id: req.params.id})
    const roomss = await Room.findOne({_id:room.bookedRoom.room_id});
    console.log(roomss)
    try{
    await Room.findOneAndUpdate(
        {_id: room.bookedRoom.room_id},
        {
        $inc: { availableRooms: 1, occupiedRoom: -1 },
        },
        {new: true},
    )
    await Booking.updateOne({
        _id: req.params.id
    },
    {
        status: status
    },)
    req.flash('sucess','Booking has been cancled!')
    res.redirect("/user/bookings");
} catch(error){
    req.flash("error","something went ulalalal");
    console.log(error)
}
}



async function makeBooking(req, res){
    const { guestNum, checkInDate, Nights, checkOutDate } = req.body;
    const room = await Room.findById(req.params.id);

    if (!checkInDate || !Nights) {
        return res.render("booking", {
            message: "Input Credentials missing, could not process request.",
            room,
            user: req.user
        });
    }

    if (room.totallRooms === 0) {
        return res.render("booking", {
            message: "Booking failed, No rooms available",
            room,
            user: req.user
        });
    }

    try {
        const checkIn = new Date(checkInDate).toDateString();
        const checkOut = new Date(checkOutDate).toDateString();
        const book = await Booking.create({
            checkInDate : checkIn,
            checkOutDate: checkOut,
            Nights,
            totallCost: Nights *room.price,
            BookedBy: req.user._id,
            bookedRoom: {roomName: room.roomName,room_id:room._id},
        });

        const availableRooms = room.availableRooms - 1;
        const occupiedRoom = room.occupiedRoom +1;

        await Room.updateOne(
            {
                _id: req.params.id
            },
            {
                availableRooms: availableRooms,
                occupiedRoom: occupiedRoom,
                $push: {
                    currentBookings: book._id
                }
            },
         {upsert: false, new: true},
        )

        let ObjId = new mongoose.Types.ObjectId(book.id);

        await User.updateOne(
            {
                email : req.user.email,
            },
            
            {
                $push: {
                    bookings: ObjId
                }
            },
         {upsert: false, new: true},
        )

        req.flash('sucess','Your Room Booking was Sucessfull!')
        res.redirect('/room');
    } catch (err) {
        console.log(err);
        req.flash('error','something went wrong, please try again')
        res.redirect('/room');
    }
};




module.exports = {cancelBooking, makeBooking};