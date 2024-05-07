var name_error = document.getElementById("name-error")
var email_error = document.getElementById("email-error")
var phone_error = document.getElementById("phone-error")
var pass_error = document.getElementById("pass-error")
var sbtn = document.getElementById("sbtn")

function validateName (){
    var fname = document.getElementById("fname");

    if(fname.value.length == 0){
        name_error.innerHTML = "Full name is required";
        fname.style.border = "2px solid red";
        return false;
    }
    if(!fname.value.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)){
        name_error.innerHTML = "Please Enter Full name";
        fname.style.border = "2px solid red";
        return false;
    }
    name_error.innerHTML = " ";
    fname.style.border = "2px solid green";
    return true;
}

function validateEmail (){
    var email = document.getElementById("email");

    if(email.value.length == 0){
        email_error.innerHTML = "email is required";
        email.style.border = "2px solid red";
        return false;
    }
    if(!email.value.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{3,4}$/)){
        email_error.innerHTML = "Invalid Email!";
        email.style.border = "2px solid red";
        return false;
    }
    email_error.innerHTML = " ";
    email.style.border = "2px solid green";
    return true;
}

function validatePhone (){
    var phone = document.getElementById("phone");

    if(phone.value.length == 0){
        phone_error.innerHTML = "Phone number is required";
        phone.style.border = "2px solid red";
        return false;
    }
    if(!phone.value.length == 10){
        phone_error.innerHTML = "Phone Number must be 10 characters";
        phone.style.border = "2px solid red";
        return false;
    }
    if(!phone.value.match(/^[0-9]{10}$/)){
        phone_error.innerHTML = "Invalid Phone Number!";
        phone.style.border = "2px solid red";
        return false;
    }
    phone_error.innerHTML = " ";
    phone.style.border = "2px solid green";
    return true;
}

function validatePass (){
    var password = document.getElementById("password");

    if(password.value.length == 0){
        pass_error.innerHTML = "Please Enter your password";
        password.style.border = "2px solid red";
        return false;
    }
    if(password.value.length < 6){
        pass_error.innerHTML = "Password should be atleast 6 digits";
        password.style.border = "2px solid red";
        return false;
    }

    pass_error.innerHTML = " ";
    password.style.border = "2px solid green";
    return true;
}


function validateForm(){
    if(!validateName() || !validateEmail() || !validatePhone() || !validatePass()){
        return false;
    }
    return true;
}

function validateLoginForm(){
    if(!validateEmail() || !validatePass()){
        return false;
    }
    return true;
}
