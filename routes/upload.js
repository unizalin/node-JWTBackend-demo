var express = require('express');
var router = express.Router();
const fileController = require("../controllers/upload.controller");
const uploadImage = require('../server/image');
const {isAuth} = require('../server/auth');
const handleErrorAsync = require("../server/handleErrorAsync")


/* GET home page. */
router.get('/',fileController.allImages);


router.post('/', isAuth , uploadImage , handleErrorAsync(fileController.upload));


module.exports = router;


