var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller")
const {isAuth} = require('../server/auth');
const handleErrorAsync = require("../server/handleErrorAsync")


// create signUp
router.post('/signUp', handleErrorAsync(userController.signUp))

// create signIn
router.post('/signIn', handleErrorAsync(userController.signIn))

//  get user Profile
router.get('/profile', isAuth ,handleErrorAsync( userController.profile))

router.patch('/updateProfile', isAuth ,handleErrorAsync( userController.updateProfile))

// change  user newPassword
router.post('/updatePassword', isAuth ,handleErrorAsync( userController.updatePassword))



// retrieve all user from db
router.get('/allUser', isAuth, userController.findAll);

// find a single user by id
router.post('/getUserInfo/:id', isAuth, userController.findOne)

// update user by id
router.patch("/updateUser/:id", isAuth, userController.updateUser);

// delete a user by id
router.delete("/deleteUser/:id", isAuth, userController.deleteOne);

// delete all user
router.delete("/deleteAllUsers", isAuth, userController.deleteAll);



router.get("/getLikeList/", isAuth , handleErrorAsync(userController.getLikeList));

router.post("/:id/follow" , isAuth , handleErrorAsync(userController.addFollower));

router.delete("/:id/unfollow", isAuth , handleErrorAsync(userController.delFollower));

router.get('/allFollowers', isAuth, handleErrorAsync(userController.allFollowers))

module.exports = router;
