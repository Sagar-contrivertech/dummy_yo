const express = require("express")
const router = express.Router()
const bussinessController = require("../controllers/bussinessControllr")
const { validatebussiness } = require("../middleware/userValidations")
const { isAuthenticated } = require('../middleware/Auth')

const multer = require("multer")

const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        cb(null , './uploadfile/')
    },
    filename : function(req, file , cb) {
        cb(null , file.originalname)
    }
})

const upload = multer({storage : storage})



router.post("/add/bussiness" , upload.single("bussinessImage") ,  isAuthenticated  , bussinessController.addbussiness)

router.get("/get/bussiness" ,bussinessController.getBussiness)

router.get("/get/bussiness/:id" ,isAuthenticated ,bussinessController.getBussinessById)

module.exports = router