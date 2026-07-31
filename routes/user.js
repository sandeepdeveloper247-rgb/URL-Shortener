const express =require("express");
const {handleUserSignup,handleUserLogin,handleUserLogout}=require("../controllers/user");

const router=express.Router();
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post('/',handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout",handleUserLogout);
module.exports=router;