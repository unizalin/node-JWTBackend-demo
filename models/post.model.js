const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.ObjectId,
      ref: 'user', // 連接到 User collection
      required: [ true, 'user id 未填寫' ]
    },
    content: {
        type: String,
        required: [ true, '貼文內容未填寫' ]
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now, // 即時更新
        select: true
    },
    likes: [
      { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user' 
      }
    ],
    comments: [
      new mongoose.Schema({
        userName: String,
        userPhoto: String,
        message : String
      })
    ]
},
{
    versionKey: false
}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
