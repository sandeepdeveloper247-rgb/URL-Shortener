const User=require("../models/user");
const{v4: uuidv4}=require('uuid');
const bcrypt = require("bcrypt");
const{setUser}=require("../service/auth");

async function handleUserSignup(req,res){
  const {name,email,password}=req.body;
  const existingUser=await User.findOne({email});
  if(existingUser){
    return res.send("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return res.redirect("/user/login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const user=await User.findOne({
    email: req.body.email,
  });
  if(!user){
    return res.render("login",{
      error:"Invalid Email",
    });
  }
  const isMatch=await bcrypt.compare(password,user.password);
  // if(user.password !== password){
  //   return res.render("login",{
  //     error:"Incorrect Password",
  //   });
  // }
  if(!isMatch){
    return res.render("login",{
      error:"Incorrect Password",
    });
  }
  // const sessionId=uuidv4();
  // setUser(sessionId,user);
  const token=setUser(user);
  res.cookie("uid",token);
  return res.redirect("/");
}

async function handleUserLogout(req,res){
  // const sessionId=req.cookies.uid;
  // if(sessionId){
  //   removeUser(sessionId);
  // }
  res.clearCookie("uid");

  return res.redirect('/user/login');
}

module.exports={
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
}