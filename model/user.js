const mongoose = require("mongoose");
const{createHmac, randomBytes} = require("crypto");
const{createTokenForUser} = require("../services/auth");
const { type } = require("os");


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    Address:{
        type:String,
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"User",
    },
    bookings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "booking"
    }],
    userImg:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
      }
});




userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(this.password).digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchpassword",async function(email,password){
    const user = await this.findOne({email});
    
    if (!user ) throw new Error("email or password invalid");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedpass = createHmac("sha256", salt).update(password).digest("hex");
   

    if(hashedPassword !== userProvidedpass) throw new Error("password incorrect");
    
    const usertoken = createTokenForUser(user);
    return usertoken;
});

const User =  mongoose.model("user", userSchema);



module.exports = User;