
const express=require('express');
const {loginUser,registerUser,changePassword}=require('../controller/auth-controler')
const router=express.Router();
const authMiddleware=require('../middleware/auth-middleware')

router.post('/register',registerUser);

router.post('/login',loginUser);


router.post('/change-password',authMiddleware,changePassword);




module.exports=router;