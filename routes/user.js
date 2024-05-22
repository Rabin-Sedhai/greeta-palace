const {Router} = require("express");
const {handleUserRegister, handleUserLogin, handleUserlogout, handleProfileUpdate} = require("../controllers/user");
const {restrictifUserLogedin} = require("../middlewares/auth");
const {restrictToUser} = require('../middlewares/auth');
const {cancelBooking, makeBooking} = require('../controllers/booking');
const Room = require("../model/room");
const User = require('../model/user');
const upload = require("../services/multer");
const router = Router();

router.get("/register",restrictifUserLogedin('uid'), (req, res) =>{
    res.render("register");
});

router.get("/login",restrictifUserLogedin('uid') ,(req,res) =>{
    res.render("login");
});

router.get("/bookroom/:id", restrictToUser(["User"]),async(req, res) => {
    const checkInDate = req.query.checkInDate;
    const checkOutDate = req.query.checkOutDate;
    const diff = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const nights = Math.round(diff);
    console.log(nights)
    const rooms = await Room.findById(req.params.id)
    const user = await User.findById(req.user._id);
    const price = nights * rooms.price;
    console.log(price);
    return res.render("booking",{
        room:rooms,
        user,
        checkInDate,
        checkOutDate,
        nights,
        price,
        title: "",
        page:"Room Booking"});
})



router.post("/bookroom/:id", restrictToUser(["User", "Admin"]),makeBooking);


router.get('/bookings',restrictToUser(["User"]),async (req,res) =>{
    const user = await User.findOne({_id: req.user._id});
    const booking = await  user.populate({path: "bookings", model: "booking"});
        return res.render('mybookings',{booking, user, error: req.flash('error'), sucess: req.flash('sucess')})
})

router.post('/updateprofile',upload.single('userImg'),handleProfileUpdate);

router.get("/booking/cancel/:id",cancelBooking);


router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);
router.get("/logout", handleUserlogout);



module.exports = router;
