
//register controller

const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const registerUser=async(req,res)=>{
    try{
        //extract user information from our request body
        const {username,email,password,role}=req.body;

        //if the user is already exists in our database
        const checkExistinguser= await User.findOne({$or:[{username},{email}]});
        if(checkExistinguser){
            res.status(400).json({
                success:false,
                message:'User is already exists '
            })
        }
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //create a new user and save in your database
        const newlycreatedUser=new User({
            username,
            email,
            password:hashedPassword,
            role:role||'user'
        })
        await newlycreatedUser.save();

        if(newlycreatedUser){
            res.status(201).json({
                success:true,
                message:'user registered successfully'
            })
        }
        else{
            res.status(400).json({
                success:false,
                message:'unable to register please try again '
            })

        }



    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'some error occured'
        })
        
    }

}

const loginUser=async(req,res)=>{
    try{

        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
           return res.status(400).json({
                success:false,
                message:'inavalid credentitials'
            })
        }


        //if thepassword is correct or not
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
           return res.status(400).json({
                success:false,
                message:'inavalid credentitials'
            })

        }
        //create user token
        const accessToken=jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRETKEY,{
            expiresIn:'15m'
        })

        
        res.status(201).json({
            success:true,
            message:'Logged in succesful',
            accessToken
        })



    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'some error occured'
        })
        
    }

}
const changePassword=async(req,res)=>{
    try{
        const userId=req.userInfo.userId;
        //extract old and new password;

        const {oldPassword,newPassword}=req.body;

        //find the current loggeed inuser
        const user=await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:'user is not found'
            })

        }
        const isPasswordMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'Old password not matching '
            })
        }
        const salt =await bcrypt.genSalt(10);
        const newHashPassword=await bcrypt.hash(newPassword,salt);
        user.password=newHashPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:'Password changed successfully'
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'some error occured'
        })
        
    }
}
module.exports={loginUser,registerUser,changePassword}