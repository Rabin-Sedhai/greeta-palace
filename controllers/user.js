const User = require("../model/user");



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
        res.cookie("uid", token).redirect("/");
        
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

async function updateUserProfile(req,res){

}


module.exports = {
    handleUserRegister,
    handleUserLogin,
    handleUserlogout,
    updateUserProfile,
};
