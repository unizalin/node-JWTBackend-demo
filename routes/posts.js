var express = require("express");
var router = express.Router();
const postsController = require("../controllers/post.controller");
const {isAuth} = require('../server/auth');
const handleErrorAsync = require("../server/handleErrorAsync")

// create and save a new post
router.post("/addPost", isAuth , handleErrorAsync(postsController.create));

// retrieve all posts from db
router.get("/getAllPosts", isAuth ,handleErrorAsync( postsController.findAll) );

// find a single post by id
router.get("/getOnePost/:id", handleErrorAsync(postsController.findOne));

// updateComment 
router.post("/updateComment", handleErrorAsync(postsController.updateComment));

// update a post by id
router.patch("/updatePost/:id", isAuth , handleErrorAsync(postsController.updatePost));

// delete a post by id
router.delete("/deletePost/:id", isAuth , handleErrorAsync(postsController.delete));

// delete all posts
router.delete("/deleteAllPosts", handleErrorAsync(postsController.deleteAll));


// delete all posts
router.post("/:id/likes/" , isAuth , handleErrorAsync(postsController.addLikes));

router.delete("/:id/likes/", isAuth , handleErrorAsync(postsController.delLikes));

module.exports = router;
