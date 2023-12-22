const {check } = require('express-validator');
module.exports = {
    validateDOB : check('birthdate')
    .exists()
    .trim()
    .isDate()
    .withMessage('birthdate must bein the form YYYY/MM/DD'),

    validateEmail: check('email')
    .exists()
    .isEmail()
    .withMessage('Invalid Email'),

    validatefirstName: check('firstName')
    .exists()
    .isLength({min:1 ,max:50})
    .withMessage('Invalid name- must be atleast 3 characters and atmost 50'),
     
    validatelastName: check('lastName')
    .exists()
    .isLength({min:1 ,max:50})
    .withMessage('Invalid name- must be atleast 3 characters and atmost 50'),

    validateUsername: check('username')
    .exists()
    .isLength({min:1 ,max:50})
    .withMessage('Invalid username- must be atleast 3 characters and atmost 50'),

    validatePassword:check('password')
    .isStrongPassword()
    .withMessage('Invalid password- criteria: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1')
    .exists()
    

    
}