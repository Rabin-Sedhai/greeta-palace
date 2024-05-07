const {verifyuserToken, verifyadminToken} = require("../services/auth");

function checkForUserAuthentication(req, res, next){
    const authoraizationValue = req.cookies?.uid;
    req.user = null;
    if(!authoraizationValue){
        return next();
    }
    const token = authoraizationValue;
    const user = verifyuserToken(token);
    
    req.user = user;
    return next();
}

function restrictToUser(roles){
    return function(req, res, next){
        if(!req.user || !roles.includes(req.user.role)) return res.redirect("/user/login");

        return next();
    }
}

function restrictifUserLogedin(token){
    return function(req, res, next){
    if(req.cookies?.uid) return res.redirect("/");

    return next();
    }
}

function restrictifAdminLogedin(token){
    return function(req, res, next){
    if(req.cookies?.aid) return res.redirect("/admin/dashboard");

    return next();
    }
}

function checkForAdminAuthentication(req, res, next){
    const authoraizationValue = req.cookies?.aid;
    req.admin = null;
    if(!authoraizationValue){
        return next();
    }
    const token = authoraizationValue;
    const admin = verifyadminToken(token);
    
    req.admin = admin;
    return next();
}

function restrictToAdmin(roles){
    return function(req, res, next){
        if(!req.admin || !roles.includes(req.admin.role)) return res.redirect("/admin/login");

        return next();
    }
}



module.exports = {
    checkForUserAuthentication,
    restrictToUser,
    checkForAdminAuthentication,
    restrictToAdmin,
    restrictifUserLogedin,
    restrictifAdminLogedin,
}
