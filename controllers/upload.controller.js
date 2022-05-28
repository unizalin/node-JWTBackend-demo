const { successHandler, errorHandler } =require('../server/handle')
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');


exports.allImages = async(req,res)=>{
  try {
    const allImage = await Image.find()
    successHandler(res,'success',allImage)
  } catch (error) {
    errorHandler(res, error);
  }
}


exports.upload = async (req,res,next) =>{
  if(!req.files.length){
    return next(appError(400,"尚未上傳檔案",next))
  }
  
  // const dimensions = sizeOf(req.files[0].buffer)
  // if(dimensions.width !== dimensions.height){
  //   return next(appError(400,"尚未上傳檔案",next))
  // }
  const client = new ImgurClient({
    clientId : process.env.IMGUR_CILENTID,
    clientSecret : process.env.IMGUR_CILENT_SECRET,
    refreshToken : process.env.IMGUR_REFRESH_TOKEN
  })
  const response = await client.upload({
    image : req.files[0].buffer.toString('base64'),
    type  : 'base64',
    album : process.env.IMGUR_ALBUM_ID
  })
  successHandler(res,'success',{imgurl:response.data.link})
}
