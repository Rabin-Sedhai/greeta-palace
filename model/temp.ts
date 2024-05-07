router.post("/bookroom/:id",restrictToUser(["User","Admin"]),async(req, res) => {
    const info = { guestNum, checkInDate, Nights} = req.body;
    const room = await Room.findById(req.params.id);
    if(!guestNum || !checkInDate || !Nights ) 
    return res.render("booking",{
                      message: "Input Crendiatials missing, could not process request.",
                      room,
                      user: req.user});

    if(guestNum == '0' || Nights == '0')
    return res.render("booking",{message: "Error processing request, fields value cannot be 0",
                       room,
                    user: req.user});
    if(room.totallRooms == '0') return res.render("booking",{message: "Booking failed, No rooms available",room, user:req.user});
    try{
        const  book = await Booking.create({
            guestNum,
            checkInDate,
            Nights,
            BookedBy:req.user._id,
        });

        const room = await Room.findById(req.params.id);
        const updaterooms = room.totallRooms - 1;
        await room.updateOne({totallRooms: updaterooms });

        const user = await User.findOne({email : req.user.email});
        console.log(user);
        const bookingss = user.bookings.push(book._id);
        user.save();



        res.render("booking",{
            message:"Reservation sucessfull!",
            room,
            user:req.user,
        })
    }
    catch(err){
        res.render("booking",{
            message:err,
            room,
            user:req.user,
        })
    }
});