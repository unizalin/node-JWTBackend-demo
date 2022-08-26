var express = require('express');
var router = express.Router();
const uploadController = require("../controllers/upload.controller");
const uploadImage = require('../server/image');
const {isAuth} = require('../server/auth');
const handleErrorAsync = require("../server/handleErrorAsync")


/* GET home page. */
router.get('/',uploadController.allImages);


router.post('/', isAuth , uploadImage , handleErrorAsync(uploadController.upload));


module.exports = router;


