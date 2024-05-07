const mongoose = require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const {createTokenForAdmin} = require('../services/auth');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  salt:{
    type:String
  },
  role: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

adminSchema.pre("save", function(next) {
    const admin = this;

    if(!admin.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(this.password).digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

adminSchema.static('matchadminpassword', async function(username,password){
    const admin = await this.findOne({username});
    
    if (!admin) throw new Error("email or password invalid");

    const salt = admin.salt;
    const hashedPassword = admin.password;

    const adminProvidedpass = createHmac("sha256", salt).update(password).digest("hex");
   
    if(hashedPassword !== adminProvidedpass) throw new Error("password incorrect");
    
    const admintoken = createTokenForAdmin(admin);
    console.log(admintoken);
    return admintoken;
});



const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
