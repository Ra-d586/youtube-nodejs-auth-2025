
const Image=require('../models/image');

const {uploadToCloudinary}=require('../helper/cloudinary-helper')
const cloudinary=require('../config/cloudinary')

const uploadImageController=async(req,res)=>{
    try{
        //check if file is missing in req object

        if(!req.file){
            return res.status(400).json({
                success:false,
                message:'file not upload'
            })
        }
        const {url,publicId}=await uploadToCloudinary(req.file.path);

        //store the image url and public id along with the uploaded user id
        const newlyUploadedImage=new Image({
            url,
            publicId,
            uploadBy:req.userInfo.userId

        })
        await newlyUploadedImage.save();

        res.status(201).json({
            success:true,
            message:'Image upload successfully'
        })


    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Failed while uplooading'
        })
    }
}
const fetchImagesController=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||5;
        const skip=(page -1)*limit;

        const sortBy=req.query.sortBy||'createdAt';
        const sortOrder=req.query.sortOrder==='asc'?1:-1;
        const totalImages=await Image.countDocuments();
        const totalPages=Math.ceil(totalImages/limit);
        const sortObj={};
        sortObj[sortBy]=sortOrder;


        const images=await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(!images){
            res.status(400).json({
                success:false,
                message:'Not fetched'
            })
        }
        res.status(201).json({
            success:true,
            currentpage:page,
            totalPages:totalPages,
            totalImages:totalImages,
            data:images
        })



    } catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Failed while uplooading'
        })
    }
}
const deleteImageController=async(req,res)=>{
    try{
        const getCurrentIdofImagetobeDeleted=req.params.id;
        const userId=req.userInfo.userId;
        const image=await Image.findById(getCurrentIdofImagetobeDeleted);
        if(!image){
            return res.status(404).json({
                success:false,
                message:'Iamge not found'
            })
        }
        if(image.uploadBy.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:'you are not authorized to delte this image because u havent upload it'

            })
        }
        //delete image from cloudinary stoarge
        await cloudinary.uploader.destroy(image.publicId);

        //dlete image from mongodb

        await Image.findByIdAndDelete(getCurrentIdofImagetobeDeleted);

        res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        })


    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Failed while uplooading'
        })
    }

}
module.exports={
    uploadImageController,fetchImagesController,deleteImageController
}