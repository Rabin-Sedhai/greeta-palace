require('dotenv').config();
var createError = require('http-errors');
const express = require('express');
const path = require("path");
var logger = require('morgan');
const dbconn = require("./conn");
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const {checkForUserAuthentication, checkForAdminAuthentication} = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const static = require('./routes/static');
const api = require('./apis/apis');
const { env } = require("process");
const {checkPendingBookings} = require('./middlewares/bookingdatecheck')
const expressSession = require('express-session');
const flash = require('connect-flash')


var app = express();

const PORT = process.env.PORT;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  cookie:{maxAge: 60000},
  saveUninitialized:false,
  secret: "hi hello"
}));


app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(checkPendingBookings);
// app.use(tempdata);
app.use(checkForUserAuthentication);
app.use(checkForAdminAuthentication);



app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/api',api);
app.use('/',static);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
