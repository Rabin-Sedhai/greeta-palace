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
router.get("/register",restrictToAdmin(["SuperAdmin"]),(req, res) => {
    res.render("adminregister");
});

router.get('/rooms',restrictToAdmin(["Admin"]),async (req,res) =>{
    const rooms = await Room.find({});
    return res.render("adminrooms",{
        allrooms: rooms,
        sucess: req.flash('sucess'),
        error: req.flash('error')
    });
})

router.get('/users',restrictToAdmin(["Admin"]),async (req,res) =>{
    const users = await User.find({});
    return res.render("adminuser",{
        allusers: users,
    });
})

router.get('/bookings',restrictToAdmin(["Admin"]),async (req,res) =>{
    await  Booking.find({}).populate({path: "BookedBy", model: "user"}).then((bookings) => {
        return res.render('adminbooking',{bookings})
    }).catch((err) => {
        console.log(err);
    });
})

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
    const{roomName,roomDesc, price, totallRooms} = req.body;
    if(totallRooms < 0 || price < 0){
        req.flash('error', 'Failed updating room, no.of Rooms cannot be less than o');
        return res.redirect('/admin/rooms');
    }
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
            roomImg:new_roomimg,
        })
        req.flash('sucess','Room has been updated sucessfully!');
        res.redirect("/admin/rooms")
        
})


router.get("/booking/updatebooking/:id",(req,res) => {
    res.render("updatebookings");
})


router.post("/login",handleAdminLogin);
router.post("/register",restrictToAdmin(["SuperAdmin"]),handleAdminRegister);
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



module.exports = router;