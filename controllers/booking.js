const Booking = require('../model/booking');
const Room = require('../model/room');
const User = require('../model/user');
const mongoose = require('mongoose');

async function cancelBooking(req, res) {
    const status = "cancelled";
    try {
        const booking = await Booking.findOne({ _id: req.params.id });
        
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/user/bookings");
        }

        if (booking.status === "cancelled") {
            req.flash("error", "The requested room booking has already been cancelled!");
            return res.redirect("/user/bookings");
        }

        const room = await Room.findOne({ _id: booking.bookedRoom.room_id });
        
        if (!room) {
            req.flash("error", "Room not found!");
            return res.redirect("/user/bookings");
        }

        await Room.findOneAndUpdate(
            { _id: room._id },
            {
                $inc: { availableRooms: 1, occupiedRoom: -1 },
                $pull: { currentBookings: booking._id }
            },
            { new: true }
        );

        await Booking.updateOne(
            { _id: req.params.id },
            { status: status }
        );

        req.flash('success', 'Booking has been cancelled!');
        res.redirect("/user/bookings");
    } catch (error) {
        req.flash("error", "Something went wrong!");
        console.error(error);
        res.redirect("/user/bookings");
    }
}




async function makeBooking(req, res) {
    const { guestNum, checkInDate, Nights, checkOutDate } = req.body;
    const room = await Room.findById(req.params.id);

    if (!checkInDate || !Nights || Nights < 1 || !checkOutDate) {
        req.flash("error", "Incorrect details, please try again!");
        return res.redirect("/room");
    }

    async function hasOverlappingBookings(checkInDate, checkOutDate) {
        const room = await Room.findById(req.params.id).populate('currentBookings');

        if (!room) {
            throw new Error('No rooms found');
        }

        if (!room.currentBookings || room.currentBookings.length === 0) {
            // No bookings found for this room
            return false;
        }

        for (const booking of room.currentBookings) {
            if (
                new Date(booking.checkInDate) <= new Date(checkOutDate) &&
                new Date(booking.checkOutDate) >= new Date(checkInDate)
            ) {
                return true;
            }
        }

        return false;
    }

    try {
        const overlap = await hasOverlappingBookings(checkInDate, checkOutDate);

        if (overlap && room.availableRooms == 0) {
            req.flash("error", "No rooms available for requested dates!");
            return res.redirect('/room');
        }

        // Log the user ID and total cost to ensure they're available
        if (!req.user || !req.user._id) {
            req.flash("error", "User not authenticated");
            return res.redirect("/login");
        }
        console.log("User ID:", req.user._id);

        const totalCost = Nights * room.price;
        console.log("Total Cost:", totalCost);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const book = await Booking.create({
            checkInDate: checkIn,
            checkOutDate: checkOut,
            Nights,
            totallCost: totalCost,
            BookedBy: req.user._id,
            bookedRoom: { roomName: room.roomName, room_id: room._id },
        });

        const availableRooms = room.availableRooms - 1;
        const occupiedRoom = room.occupiedRoom + 1;

        await Room.updateOne(
            { _id: req.params.id },
            {
                availableRooms: availableRooms,
                occupiedRoom: occupiedRoom,
                $push: { currentBookings: book._id },
            },
            { upsert: false, new: true },
        );

        const ObjId = new mongoose.Types.ObjectId(book.id);

        await User.updateOne(
            { email: req.user.email },
            { $push: { bookings: ObjId } },
            { upsert: false, new: true },
        );

        req.flash('sucess', 'Your Room Booking was Successful!');
        res.redirect('/room');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong, please try again');
        res.redirect('/room');
    }
}


module.exports = {cancelBooking, makeBooking};