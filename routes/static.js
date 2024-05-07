const express = require('express');
const Room = require('../model/room');


const router = express.Router();


router.get("/", (req, res) => {
    res.render("index",{title: "Welcome To Greeta Palace, A Home Away From Home.",
    page: "HOME",
    img : "bg.jpg",
    user: req.user,
    sucess: req.flash('sucess'),
    error: req.flash('error')})
})

router.get("/room", async(req, res) => {
    const room = await Room.find({});
    res.render("temprooms",{title: "Plan your vacation with The Rooms Offered By Greeta.",
    page: "Rooms",
    img : "room-1.jpg",
    user: req.user,
    rooms:room,
    sucess: req.flash('sucess'),
    error: req.flash('error')
})
})










module.exports = router;
