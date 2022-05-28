const { successHandler, errorHandler } = require('../server/handle');
const User = require('../models/user.model');
const handleErrorAsync = require("../server/handleErrorAsync")
const appError = require("../server/appError")
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {generateSendJWT} = require('../server/auth');

// ㄓ
exports.signUp = async(req,res,next)=>{
  const {email,password,confirmPassword,name} = req.body
  const data = {email,password,confirmPassword,name}
  
  if(!data.email|| !data.password || !data.confirmPassword || !data.name){
    return next(appError(400,"欄位為正確填寫",next))
  }
  if(data.name.trim().length<=2){
    return next(appError(400,"暱稱至少 2 個字元以上",next))
  }
  if(data.password !== data.confirmPassword){
    return next(appError(400,"密碼不一致",next))
  }
  if(!validator.isLength(data.password,{min:8})){
    return next(appError(400,"密碼低於八位數",next))
  }
  
  if(!validator.isEmail(data.email)){
    return next(appError(400,"信箱格式錯誤",next))
  }
  data.password = await bcrypt.hash(data.password,12)

  const newUser = await User.create(data)
  generateSendJWT(newUser,201,res);
}


// login
exports.signIn = async(req,res,next)=>{
  const {email,password} = req.body
  const data = {email,password}
  
  if(!data.email|| !data.password ){
    return next(appError(400,"帳號密碼不可未填寫",next))
  }
  const user = await User.findOne({email}).select('+password')
  
  const isUserAuth = await bcrypt.compare(data.password,user.password)
  

  if(!isUserAuth){
    return next(appError(400,"密碼不正確",next))
  }
  generateSendJWT(user,201,res);
}


exports.profile = async (req,res,next)=>{
  successHandler(res,'success',req.user)
}

exports.updatePassword = async (req,res,next)=>{
  const {password,confirmPassword}= req.body
  const data = {password,confirmPassword}
  if(password!==confirmPassword){
    return next(appError(400,"密碼不一致",next))
  }
  const newPassword = await bcrypt.hash(password,12)
  const user = await User.findByIdAndUpdate(req.user.id,{password:newPassword})
  generateSendJWT(user,201,res);
}

exports.updateProfile = async(req,res,next)=>{
  
  const {name,sex,photo} = req.body
  const data = {name,sex,photo}
  const userId = req.user.id
  const user = await User.findById(userId).exec();
  if(!user){
    return next(appError(400,"查無此ID，無法變更資料",next))
  }
  if(!data.name || !data.sex){
    return next(appError(400,"姓名跟性別欄位不能為空",next))
  }

  const newUser = await User.findByIdAndUpdate(userId , data)
  if(!newUser){
    return next(appError(400,"變更失敗",next))
  }
  const resultUser = await User.findById(userId).exec()
  successHandler(res,'success',resultUser)
};

exports.findAll = handleErrorAsync( async(req,res,next)=>{
    const allUser = await User.find()
    successHandler(res,'success',allUser)
})

exports.findOne = handleErrorAsync(async(req,res,next)=>{
      const userId = req.params.id
      const userItem = await User.findById(userId).exec()
      if(!userItem){
        return next(appError(400,"查無此ID",next))
      }
        successHandler(res,'success',userItem)
})

exports.deleteAll = handleErrorAsync(async(req,res,next)=>{
    await User.deleteMany({});
    successHandler(res,'success')
})

exports.deleteOne = handleErrorAsync(async(req,res,next)=>{
    const userId = req.params.id
    const delUser = await User.findByIdAndDelete(userId);
    if(!delUser){
      return next(appError(400,"查無此ID",next))
    }
    successHandler(res,'刪除成功')
})

exports.updateUser = handleErrorAsync(async(req,res,next)=>{
  const {name,email,gender,photo} = req.body
  const data = {name,email,gender,photo}
  const userId = req.params.id
  const user = await User.findById(userId).exec();
  if(!user){
    return next(appError(400,"查無此ID，無法變更資料",next))
  }
  if(!data.name|| !data.email){
    return next(appError(400,"姓名跟E-mail不能為空",next))
  }
  const updateUser = await User.findByIdAndUpdate(userId,data);
  if(!updateUser){
    return next(appError(400,"查無此ID",next))
  }
  const resultUser =await User.findById(userId).exec();
  successHandler(res,'success',resultUser)
})
