const JWT = require("jsonwebtoken");
const userSecret = "@#%$hsdfjhd#AFFSDGDSDFD452SDF";
const adminSecret = "huadguas!@#$%gsjhdbajsuhskaj6543512";


function createTokenForUser(user){

    const upayload = {
        _id : user._id,
        name : user.name,
        email: user.email,
        role: user.role,
    }

    const usertoken = JWT.sign(upayload, userSecret);
    return usertoken;
}

function verifyuserToken(usertoken){
    const payload = JWT.verify(usertoken, userSecret);
    const user = payload;
    return user;
};

function createTokenForAdmin(admin){

    const apayload = {
        _id : admin._id,
        name : admin.name,
        username: admin.username,
        role: admin.role,
        img: admin.profileimg,
    }

    const admintoken = JWT.sign(apayload, adminSecret);
    return admintoken;
}

function verifyadminToken(admintoken){
    const payload = JWT.verify(admintoken, adminSecret);
    const admin = payload;
    return admin;
};

module.exports = {
    createTokenForUser,
    verifyuserToken,
    createTokenForAdmin,
    verifyadminToken,
};