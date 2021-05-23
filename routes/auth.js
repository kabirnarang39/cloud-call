const express = require('express');
const User=require('../models/user')
const {check,body}=require('express-validator');
const authController = require('../controllers/auth');
var ExpressBrute = require('express-brute');
 
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',bruteforce.prevent,[check('email').isEmail().withMessage('Cant find a user with this email!').normalizeEmail(),
body('password',
'Password Should Be valid')
.isLength({min:5}).
isAlphanumeric()
.trim()
], authController.postLogin);

router.post('/signup',[
check('email').isEmail().withMessage('Enter a valid Email')
.custom((value,{req})=>{
   return User.findOne({email:value})
    .then(userDoc=>{
      if(userDoc){
      return Promise.reject('Email already exists!')
      }
})
})
.normalizeEmail(),
body('username',
'Please enter a username with atleast 5 characters').isLength({min:5}).trim(),
body('password',
'Please enter a password with atleast 8 characters and a combination of numbers and text').isLength({min:8}).isAlphanumeric().trim(),
body('confirmPassword').trim()
.custom((value,{req})=>{
    if(value!==req.body.password){
        throw new Error('Passwords does not match!')
    }
    return true;
})
], authController.postSignup);

router.post('/logout', authController.postLogout);
router.get('/reset',authController.getReset)
router.post('/reset',authController.postReset)
router.get('/reset/:token',authController.getUpdatePassword)
router.post('/reset-password',authController.postNewPassword)
module.exports = router;