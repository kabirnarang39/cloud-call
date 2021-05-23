const express = require('express');
const User=require('../models/user')
const {check,body}=require('express-validator');
const authController = require('../controllers/auth');
const rateLimit=require('express-rate-limit');
const limit = rateLimit({
  max: 10,// max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests' // message to send
});
const router = express.Router();

router.get('/login',limit, authController.getLogin);

router.get('/signup',limit, authController.getSignup);

router.post('/login',limit,[check('email').isEmail().withMessage('Cant find a user with this email!').normalizeEmail(),
body('password',
'Password Should Be valid')
.isLength({min:5}).
isAlphanumeric()
.trim()
], authController.postLogin);

router.post('/signup',limit,[
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

router.post('/logout',limit, authController.postLogout);
router.get('/reset',limit,authController.getReset)
router.post('/reset',limit,authController.postReset)
router.get('/reset/:token',limit,authController.getUpdatePassword)
router.post('/reset-password',limit,authController.postNewPassword)
module.exports = router;