const Post = require("../models/posts.model");
const User = require("../models/users.model")
const Comment = require("../models/comments.model")
const { successHandler } =require('../server/handle')
const appError = require("../server/appError")

// create and save a new post
exports.create = async (req, res,next) => {
    const { content , imgUrl} = req.body;
    const userId = req.user.id

    const user = await User.findById(userId).exec();
    if(!user){
      return next(appError(400,"查無此ID，無法發文",next))
    }
    if (!content) {
      return next(appError(400,"內容不能為空",next))
    }

    const newPost = await Post.create({
      user: userId,
      content,
      image : imgUrl
    });    
    successHandler(res, 'success', newPost);
};

// retrieve all posts from db
exports.findAll =  async(req, res , next) => {
    
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}
    // const allPost = await Post.find(q)
    const allPost = await Post.find(q).populate({
      path: 'user',
      select: 'name photo '
    }).populate({
      path: 'comments',
      select: 'comment user'
    }).sort(timeSort);
  
    successHandler(res,'success',allPost)
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
    console.log(req.body)
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
  const userId = req.user.id
  const postId = req.params.id
  const {comment} = req.body
  const userInfo = await User.findById(userId).exec()
  if(!userInfo){
    return next(appError(400,"無此發文者ID",next))
  }

  if(!comment){
    return next(appError(400,"無填寫留言",next))
  }

  const newComment = await Comment.create({
    post : postId,
    user : userId,
    comment
  })
  successHandler(res,'success',{comments: newComment}
  )
};

// delete a post by id
exports.delete = async( req, res, next) => {
    const postId = req.params.id
    const postUserId = await Post.findById(postId).exec()
    if(!postUserId){
      return next(appError(400,"刪除失敗，無此ID",next))
    }
    await Post.findByIdAndDelete(postId)
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
  const test = await Post.updateOne(
    {postId},
    { $addToSet: { likes: userId } },
    { new: true }
  )
  // const ww = await Post.updateOne({postId},)
  const resultPost = await Post.findById(postId).exec()
  // const allPost = await Post.find()
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


