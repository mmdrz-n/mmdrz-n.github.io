function validateform() {
    var password = document.forms["registerform"]["password"].value;
    var confirmpassword = document.forms["registerform"]["confirmpassword"].value;

    if (password !== confirmpassword) {
        alert("Die Passwörter stimmen nicht überein");
        return false;
    }

    return true;
}