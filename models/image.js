
const mongoose=require('mongoose');

const ImageSchema=new mongoose.Schema({
    url:{
        type:String
    },
    publicId:{
        type:String,
        required:true
    },
    uploadBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

module.exports=mongoose.model('Iamge',ImageSchema);

