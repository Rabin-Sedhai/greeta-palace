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

router.get("/room", async(req, res) => {
    var user;
    if(req.user){
         user = await User.findOne({_id: req.user._id});
    }
    
    const room = await Room.find({});
    res.render("temprooms",{title: "Plan your vacation with The Rooms Offered By Greeta.",
    page: "Rooms",
    img : "room-1.jpg",
    user,
    rooms:room,
    sucess: req.flash('sucess'),
    error: req.flash('error')
})
})










module.exports = router;
