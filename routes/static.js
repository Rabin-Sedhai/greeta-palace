const express = require('express');
const Room = require('../model/room');
const User = require('../model/user')


const router = express.Router();


router.get("/", async(req, res) => {
    var user;
    if(req.user){
         user = await User.findOne({_id: req.user._id});
    }
    
    res.render("index",{title: "Welcome To Greeta Palace, A Home Away From Home.",
    page: "HOME",
    img : "bg.jpg",
    user,
    sucess: req.flash('sucess'),
    error: req.flash('error')})
})

router.get("/room", async (req, res) => {
    let user;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    const roomCount = await Room.countDocuments({});
    const rooms = await Room.find({}).skip(skip).limit(limit);

    res.render("temprooms", {
        title: "Plan your vacation with The Rooms Offered By Greeta.",
        page: "Rooms",
        img: "room-1.jpg",
        user,
        rooms,
        totalRooms: roomCount,
        currentPage: page,
        totalPages: Math.ceil(roomCount / limit),
        sucess: req.flash('sucess'),
        error: req.flash('error')
    });
});

router.get('/about', (req, res) => {
    res.render("about",{
        title: "All About The Greeta Palace",
        page: "About Us",
        img: "bg2.jpg",
        sucess: req.flash('sucess'),
        error: req.flash('error')
    });

})










module.exports = router;
