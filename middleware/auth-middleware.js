const jwt=require('jsonwebtoken')
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    console.log(authHeader);

    const token=authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:'Access denied'
        })
    }

    try{
        const extractToken=jwt.verify(token,process.env.JWT_SECRETKEY)
        console.log(extractToken);

        req.userInfo=extractToken;
        next()
        

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'some error occured'
        })
        
    }

}
module.exports=authMiddleware;