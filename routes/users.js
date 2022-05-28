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

router.get('/getLikeList', isAuth ,handleErrorAsync( userController.likeList))



// retrieve all user from db
router.get('/allUser', userController.findAll);

// find a single user by id
router.post('/getUserInfo/:id' , userController.findOne)

// update user by id
router.patch("/updateUser/:id", userController.updateUser);

// delete a user by id
router.delete("/deleteUser/:id", userController.deleteOne);

// delete all user
router.delete("/deleteAllUsers", userController.deleteAll);

module.exports = router;
