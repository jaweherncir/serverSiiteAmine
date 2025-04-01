const  router = require('express').Router();
const authController = require("../controller/loginUser");

router.post("/registre",authController.signUp);




module.exports=router;