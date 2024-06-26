const express = require('express');
const fs = require("fs");
const {handleAdminLogin, handleAdminRegister, adminLogout} = require('../controllers/admin');
const {restrictifAdminLogedin} = require('../middlewares/auth');
const Room = require('../model/room');
const User = require('../model/user');
const {restrictToAdmin} = require('../middlewares/auth')
const upload = require('../services/multer');
const Booking = require('../model/booking');

const router = express.Router();

   
router.get('/dashboard',restrictToAdmin(['Admin']), (req, res) => {
     res.render("admindash");
});

router.get('/login',restrictifAdminLogedin('aid'), (req, res) => {
    res.render("adminlogin");
})
router.get("/register",(req, res) => {
    res.render("adminregister");
});



router.get('/rooms', restrictToAdmin(["Admin"]), async (req, res) => {
    const pageSize = 3; 
  const page = parseInt(req.query.page) || 1;

  try {
    const totalRooms = await Room.countDocuments();
    const rooms = await Room.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render("adminrooms", {
      allrooms: rooms,
      page,
      pageSize,
      totalRooms,
      sucess: req.flash('sucess'),
      error: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Unable to fetch rooms');
    res.redirect('/admin');
  }
});




router.get('/users', restrictToAdmin(["Admin"]), async (req, res) => {
    const pageSize = 5; 
  const page = parseInt(req.query.page) || 1;

  try {
    const totalUsers = await User.countDocuments(); // Total number of users
    const users = await User.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render("adminuser", {
      allusers: users,
      page,
      pageSize,
      totalUsers,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Unable to fetch users');
    res.redirect('/admin');
  }
});




router.get('/bookings', restrictToAdmin(["Admin"]), async (req, res) => {
    const pageSize = 10;
  const page = parseInt(req.query.page) || 1;

  try {
    const totalBookings = await Booking.countDocuments(); // Total number of bookings
    const bookings = await Booking.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({ path: "BookedBy", model: "user" });

    res.render('adminbooking', {
      bookings,
      page,
      pageSize,
      totalBookings,
      sucess: req.flash('sucess'),
      error: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Unable to fetch bookings');
    res.redirect('/admin');
  }
});


router.get('/deleteroom/:id',restrictToAdmin(["Admin"]), async (req, res) => {
    const id = req.params.id;
    const room = await Room.findById(id);
    if(room.occupiedRoom >= 1){
        req.flash("error", "cannot delete room, Room is currently occupied");
        return res.redirect("/admin/rooms");
    };

    if(room.roomImg != " "){
        try{
            fs.unlinkSync('./public/uploads/' + room.roomImg)
        }
        catch(err){
            console.log(err);
        }
    }
    await Room.findByIdAndDelete(id)

    req.flash("sucess","Room deleted sucessfully");
    res.redirect('/admin/rooms')
});


router.get('/updaterooms/:id',restrictToAdmin(["Admin"]), async (req,res) => {
        let id = req.params.id;
        const rooms = await Room.findById(id);
        res.render("updaterooms",{ rooms,
        })
});


router.post('/updaterooms/:id',upload.single("roomImg"),restrictToAdmin(["Admin"]),async(req,res) => {
    let id = req.params.id;
    let new_roomimg = "";
    let room = await Room.findById(req.params.id);
    const{roomName,roomDesc, price, totallRooms} = req.body;
    if(totallRooms < 0 || price < 0){
        req.flash('error', 'Failed updating room, no.of Rooms or Price cannot be as 0');
        return res.redirect('/admin/rooms');
    }
    if(totallRooms < room.occupiedRoom){
        req.flash("error",`Cannot process request occupiedRoom ${room.occupiedRoom} is greater than totallRoom ${totallRooms}`);
        return res.redirect('/admin/rooms');
    }

        let diff = Math.abs(totallRooms - room.occupiedRoom);
        let availableRooms = diff;
        
        

        try{

        if(req.file){
        new_roomimg = req.file.filename;
        try {
            fs.unlinkSync("./public/uploads/" + req.body.old_roomimg);
        } catch (error) {
            res.send(error);
        }
    }
        else{
            new_roomimg = req.body.old_roomimg;
        }
    
        await Room.findByIdAndUpdate(id, {
            roomName,
            roomDesc,
            price,
            totallRooms,
            availableRooms: availableRooms,
            roomImg:new_roomimg,
        })
        req.flash('sucess','Room has been updated sucessfully!');
        res.redirect("/admin/rooms");
    }
    catch(err){
        req.flash("error","something went wrong processing request!");
        res.redirect("/admin/rooms")
    }
        
})


router.get("/booking/updatebooking/:id",async(req,res) => {
    const bookings = await  Booking.findById(req.params.id).populate({path: "BookedBy", model: "user"});
    console.log(bookings)
    res.render("updatebookings",{bookings});
})


router.post("/login",handleAdminLogin);
router.post("/register",handleAdminRegister);
router.get("/logout",adminLogout);
// ..................................................................................................................

router.post("/rooms",restrictToAdmin(["Admin"]),upload.single("roomImg"),async (req,res) => {
    const{roomName, roomDesc, price,totallRooms, roomImg} = req.body;

    if(totallRooms < 0 || price < 0){
        req.flash('error', 'Error Addding room, no.of rooms cannot be zero or less than 0')
       return res.redirect('/admin/rooms');
    }

    try{
        const room = await new Room ({
            roomName,
            roomDesc,
            price,
            totallRooms,
            availableRooms:totallRooms,
            roomImg:req.file.filename,
        });
        room.save();
        req.flash('sucess','Room has been added!')
        res.redirect("/admin/rooms")
    }
    catch(error){
        req.flash('error','Failed to add new room!')
        res.redirect("/admin/rooms")
    }
})


router.post("/booking/updatebooking/:id",restrictToAdmin(["Admin"]),async(req,res) =>{
    const {status} = req.body;
    const booking = await Booking.findById(req.params.id);
    if(!status){
        req.flash("error","No status input was given");
        res.redirect("/admin/rooms");
    }

    try{
        await booking.updateOne({status:status});
        req.flash("sucess","updated Sucessfully");
        res.redirect('/admin/bookings');

    }
    catch(err){
        req.flash("error","error while updating booking");
        res.redirect('/admin/bookings')
    }
})

module.exports = router;