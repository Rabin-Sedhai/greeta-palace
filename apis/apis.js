const Booking = require('../model/booking');
const Room = require('../model/room');
const express = require('express');
const router = express.Router();

router.get("/statuscount",async (req, res) =>{
    try{
        const allbookings = await Booking.find();

        var sum = 0
        var pendingCount = 0;
        var cancelledCount = 0;
        var completeCount = 0;
        var checkedinCount = 0;

        for(const booking of allbookings){
            switch(booking.status){
                case 'Booked':
                    pendingCount++;
                    break;
                case 'cancelled':
                    cancelledCount++;
                    break;
                case 'completed':
                    completeCount++;
                    sum += booking.totallCost;
                    break;
                case 'checked-In':
                    checkedinCount++
                    break;
            }
        }
        res.json({
            sum,
            pendingCount,
            checkedinCount,
            cancelledCount,
            completeCount,
          });

    }
    catch(err){
        res.status(500).json({error :"internal server error"})
    }
  });

  router.get('/getrooms', async (req, res) => {
    try {
        const room = await Room.find({}).populate({path: "currentBookings", model: "booking"});
        res.json({Rooms :room});

    } catch (error) {
        res.status(500).json({error});
    }
  })

  module.exports = router;