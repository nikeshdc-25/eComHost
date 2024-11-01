function isEmail(email){
    const emailPattern = /^([a-zA-Z][\w\.\-]+[a-zA-Z0-9])@([a-zA-Z0-9]{2,20})\.([a-zA-Z]{2,5})(\.[a-zA-Z]{2,5})?$/;
    return emailPattern.test(email);
}

function isStrong(password){
    const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}/;
    return passwordPattern.test(password);
}

function isPhone(primaryPhone){
    const phonePattern = /^(98|97|96)\d{8}$/;
    return phonePattern.test(primaryPhone);
}
export { isEmail, isStrong, isPhone };