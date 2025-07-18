const mongoose=require('mongoose');

require('dotenv').config();

const connectTodb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected successfully")
    }catch(e){
        console.log("MongoDb connection failed");
        process.exit(1);
    }
}

module.exports=connectTodb;