const User = require("../model/user");
const fs = require("fs");
const upload = require("../services/multer");





async function handleUserRegister (req, res) {
    const {name, email, phone, password} = req.body;
    const validateUser = await User.findOne({email});

    try{
        if (validateUser == email) {
            return;
        } else {

            await User.create({
                name,
                email,
                phone,
                password,
            });
            res.redirect("/user/login");   
        }
    }
        catch(error){
            res.render("register",{
                error: error,
            });
        }
};

async function handleUserLogin(req, res){
    const{email, password} = req.body;
    
    try{
        
        const token = await User.matchpassword(email, password);
        res.cookie("uid", token, {expires: new Date(new Date().getTime()+120*60*1000)}).redirect("/");  
    }
        catch(error){
            res.render("login",{
                error: "Email or Password didn't match.",
            });
        }
}

function handleUserlogout(req, res){
    res.clearCookie("uid").redirect("/");
}


async function handleProfileUpdate(req, res){
        let new_profileImg = "";
        const {name,email,phone,Address} = req.body;
        

        if(!req.body && !req.file){
            req.flash("error","UpdateFailed, No Update Data Was Provided!")
            return res.redirect("/user/bookings")
        }

        if(req.file){
           new_profileImg = req.file.filename;
           
           try{
            fs.unlinkSync("./public/uploads/" + req.body.old_ProfileImg);
           }
           catch(error){
            console.log(error)
           }
        }else{
            new_profileImg = req.body.old_ProfileImg;
            
        }
        
        try {
             await User.updateOne(
                {_id:req.user._id},
                { 
                    name,
                    email,
                    phone,
                    Address,
                    userImg: new_profileImg,
                });
                req.flash('sucess','Your Profile Has Been Updated!');
                res.redirect("/user/bookings")
        } catch (error) {
            req.flash('error','Profile update failed!');
                res.redirect("/user/bookings")
        }  
    }


module.exports = {
    handleUserRegister,
    handleUserLogin,
    handleUserlogout,
    handleProfileUpdate,
};
