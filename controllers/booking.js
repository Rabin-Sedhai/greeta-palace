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
    

    if (!checkInDate || !Nights || Nights < 1 || !checkOutDate) {
        req.flash("error", "Incorrect details , please try again!");
        return res.redirect("/room")
    }
    
 

async function hasOverlappingBookings(checkinDate, checkoutDate) {
    const room = await Room.findOne().populate('currentBookings');

    if (!room) {
        throw new Error('No rooms found');
    }

    for (const booking of room.currentBookings) {
        if (
            booking.checkinDate <= new Date(checkoutDate) &&
            booking.checkoutDate >= new Date(checkinDate)
        ) {
            return true;
        }
    }

    return false;
    }

    const overlap = hasOverlappingBookings(checkInDate, checkOutDate);

    if(overlap){
        req.flash("error","No rooms available for requested dates!");
        return res.redirect('/room');
    }
    else{

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



    }


   




module.exports = {cancelBooking, makeBooking};