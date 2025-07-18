

const express=require('express');
const authMiddleware=require('../middleware/auth-middleware')
const adminMiddleware=require('../middleware/admin-middleware')
const uploadMiddleware=require('../middleware/upload-middleware')
const {uploadImageController,fetchImagesController,deleteImageController}=require('../controller/image-controller')
const router=express.Router();

//upload Image
router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImageController);
router.get('/get',fetchImagesController)
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController)




//get all the image

module.exports=router;