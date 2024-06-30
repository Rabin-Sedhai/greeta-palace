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




router.get('/bookings', restrictToUser(["User"]), async (req, res) => {
    const pageSize = 6;
    const page = parseInt(req.query.page) || 1;
    const userId = req.user._id;

    try {
        // Fetch user and populate bookings with pagination
        const user = await User.findById(userId)
            .populate({
                path: 'bookings',
                options: {
                    skip: (page - 1) * pageSize,
                    limit: pageSize,
                },
                model: 'booking'
            });

        // Count total bookings for the user
        const totalBookings = await User.findById(userId).select('bookings').then(result=>{
            if(result){
            return result.bookings.length;
            }});


        res.render('mybookings', {
            booking: user,
            user: user,
            page: page,
            pageSize: pageSize,
            totalBookings: totalBookings,
            error: req.flash('error'),
            sucess: req.flash('sucess'),
        });

    } catch (err) {
        console.error('Error fetching bookings:', err);
        req.flash('error', 'Unable to fetch bookings');
        res.redirect('/user/bookings');
    }
});


router.post('/updateprofile',upload.single('userImg'),handleProfileUpdate);

router.get("/booking/cancel/:id",cancelBooking);


router.post("/login", handleUserLogin);
router.post("/register", handleUserRegister);
router.get("/logout", handleUserlogout);



module.exports = router;
