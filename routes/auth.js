const express = require('express');
const User=require('../models/user')
const {check,body}=require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[check('email').isEmail().withMessage('Cant find a user with this email!').normalizeEmail()
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
'Please enter a username with atleast 5 characters').isLength({min:5}).trim()
], authController.postSignup);

router.post('/logout', authController.postLogout);
router.get('/reset',authController.getReset)
router.post('/reset',authController.postReset)
router.get('/reset/:token',authController.getUpdatePassword)
router.post('/reset-password',authController.postNewPassword)
module.exports = router;