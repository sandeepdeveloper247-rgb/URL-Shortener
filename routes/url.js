const express=require('express');
const {handleGenerateNewShortURL,handleGetURL,handleGetAnalytics,handleDeleteURL,handleEditPage,handleUpdateURL}=require('../controllers/url')

const router=express.Router();
router.post("/delete/:id", handleDeleteURL);
router.post('/',handleGenerateNewShortURL);
router.get("/:shortId",handleGetURL);
router.get('/analytics/:shortId',handleGetAnalytics);
router.get("/edit/:id", handleEditPage);
router.post("/edit/:id", handleUpdateURL);
module.exports=router;