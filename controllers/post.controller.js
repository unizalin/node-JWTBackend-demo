const Post = require("../models/post.model"); // model Post
const User = require("../models/user.model")
const { successHandler, errorHandler } =require('../server/handle')
const appError = require("../server/appError")

// create and save a new post
exports.create = async (req, res,next) => {
    const { userId, content, image, likes ,tags} = req.body;
    let dataPost = {
      user: userId,
      tags,
      type: req.body.type || "person",
      image,
      content,
      likes,
    };
    const user = await User.findById(dataPost.user).exec();
    if(!user){
      return next(appError(400,"查無此ID，無法發文",next))
    }
    if (!dataPost.content) {
      return next(appError(400,"內容不能為空",next))
    }

    const newPost = await Post.create(dataPost);
    let payload = { postId: newPost };
    successHandler(res, 'success', payload);
};

// retrieve all posts from db
exports.findAll =  async(req, res , next) => {
    
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}
    const allPost = await Post.find(q).populate({path:'user',select: 'name photo'}).sort(timeSort)
  
    if (allPost) {
      successHandler(res,'success',allPost)
    } else {
      errorHandler(res, error)
    }
  
};

// find a single post by id
exports.findOne =  async(req, res, next) => {
    const postId = req.params.id
    const postItem = await Post.findById(postId).exec()
    if(!postItem){
      return next(appError(400,"無此ID貼文",next))
    }
    successHandler(res,'success',postItem)
  
};





// update a post by id
exports.updatePost =  async(req, res, next) => {
    const postId = req.params.id
    const {userName,content,image,likes} = req.body 
    const data ={userName,content,image,likes}
    if(!data.content){
      return next(appError(400,"內容不能為空",next))
    }
    const editPost = await Post.findByIdAndUpdate(postId, data);
    if(!editPost){
      return next(appError(400,"查無此ID，無法更新",next))
    }
    const resultPost = await Post.findById(postId).exec()
    successHandler(res,'success',resultPost)
};


//  add a comment by postId userId
exports.updateComment =  async (req, res , next ) => {
  const { postId,userId,comment} = req.body
  let data ={postId,userId,comment}
  const userInfo = await User.findById(data.userId).exec()
  if(!userInfo){
    return next(appError(400,"無此發文者ID",next))
  }
  if(!data.comment){
    return next(appError(400,"無填寫留言",next))
  }
  const postDataComments = {userName:userInfo.name,userPhoto:userInfo.photo,message:comment}
  await Post.findOneAndUpdate({id:data.postId},{ $push: { comments: postDataComments  } });
  const result = await Post.findById(data.postId).exec()
  successHandler(res,'success',result)
};

// delete a post by id
exports.delete = async( req, res, next) => {
    const postId = req.params.id
    const deletePost = await Post.findByIdAndDelete(postId)
    if(!deletePost){
      return next(appError(400,"刪除失敗，無此ID",next))
    }
    successHandler(res,"刪除成功")
};

// delete all posts
exports.deleteAll =  async(req, res, next) => {
  await Post.deleteMany({});
  successHandler(res,"全部資料已刪除")
};

exports.addLikes = async (req, res, next) =>{
  const postId = req.params.id
  const userId = req.user.id
  await Post.findOneAndUpdate(
    {postId},
    { $addToSet: { likes: userId } }
    )
  successHandler(res,'success',{postId,userId })

}

exports.delLikes = async (req, res, next) =>{
  const postId = req.params.id
  const userId = req.user.id
  await Post.findOneAndUpdate(
    {postId},
    { $pull: { likes: userId } }
    )
  successHandler(res,'success',{postId,userId })
}

