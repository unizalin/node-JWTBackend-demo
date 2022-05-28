var express = require('express');
var router = express.Router();
const fileController = require("../controllers/file.controller");
const multer = require('multer');



var upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Allowed .jpeg .jpg'))
        }
    }
})

/* GET home page. */
router.get('/',fileController.allImages);

router.post('/uploadImage',upload.single('file'),fileController.uploadImage)

module.exports = router;


