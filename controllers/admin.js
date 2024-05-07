const Admin = require('../model/admin');
const Room = require('../model/room');
async function handleAdminRegister (req, res) {
const {name, email, username, password} = req.body;
const validateAdmin = await Admin.findOne({username});

try{
    if (validateAdmin == username) {
        return;
    } else {

        await Admin.create({
            name,
            email,
            username,
            password,
        });
        res.redirect("/admin/login");   
    }
}
    catch(error){
        res.render("adminregister",{
            error: "USER has been already created",
        });
    }
};

    async function handleAdminLogin(req, res){
        const{username, password} = req.body;
        
        try{
            
            const token = await Admin.matchadminpassword(username, password);
            res.cookie("aid", token).redirect("/admin/dashboard");
        }
            catch(error){
                res.render("adminlogin",{
                    error: "username or Password didn't match.",
                });
            }
    }

    function adminLogout(req, res){
        res.clearCookie("aid").redirect("/admin/login");
    }

    // .........................................................................


     
module.exports = {
    handleAdminLogin,
    handleAdminRegister,
    adminLogout,
}