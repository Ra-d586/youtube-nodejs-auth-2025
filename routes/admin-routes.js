
const express=require('express');
const authMiddleware=require('../middleware/auth-middleware')
const router=express.Router();
const adminMiddleware=require('../middleware/admin-middleware')

router.get('/Welcome',authMiddleware,adminMiddleware,(req,res)=>{
    res.json({
        message:"Welcome to Admin Page"
    })
})

module.exports=router;