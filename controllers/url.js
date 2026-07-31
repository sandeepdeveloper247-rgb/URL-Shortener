const {nanoid}=require("nanoid");
const URL=require ('../models/url');

async function handleGenerateNewShortURL(req,res){
  const {url,customAlias}=req.body;
  if(!url){
    return res.status(400).json({
      error:'url is required'
    });
  }
  try{
    new global.URL(url);
  }catch(err){
    return res.send("Please enter a valid URL.");
  }
  // const shortID=nanoid(8);
  const shortID=customAlias && customAlias.trim()!==""?customAlias.trim():nanoid(8);
  if(customAlias && !/^[a-zA-Z0-9_-]+$/.test(customAlias)){
    return res.send("Custom alias can only contain letters, numbers,'-' and '_'.")
  }
  const existingShortURL=await URL.findOne({
    shortId: shortID,
  });
  if(existingShortURL){
    return res.send("This custom alias is already taken. Please choose another one.");
  }
  const existingURL=await URL.findOne({
    redirectURL: url,
    createdBy: req.user._id,
    });
    if(existingURL){
      return res.redirect(`/?id=${existingURL.shortId}`);
    }
  await URL.create({
    shortId: shortID,
    redirectURL: url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  const allUrls=await URL.find({});

  // return res.render('home',{
  //   id: shortID,
  //   urls: allUrls,
  // });
  return res.redirect(`/?id=${shortID}`);
  // return res.json({id: shortID});
}

async function handleGetURL(req,res){
  const shortId=req.params.shortId;
  const entry=await URL.findOneAndUpdate(
    {
      shortId:shortId,
    },
    {
      $push:{
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    {
      returnDocument: "after",
    }
  );

  if(!entry){
    return res.status(404).json({
      error: "Short URL not found",
    });
  }
  return res.redirect(entry.redirectURL);
};

// async function handleGetAnalytics(req,res){
//   const shortId=req.params.shortId;
//   const result=await URL.findOne({shortId});
//   return res.json({totalClicks: result.visitHistory.length,
//     analytics: result.visitHistory,
//   });
// };
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({
        shortId,
    });

    if (!result) {
        return res.status(404).send("URL not found");
    }
    const clickData={};
    result.visitHistory.forEach((visit)=>{
      const date=visit.timestamp.toLocaleDateString();
      clickData[date]=(clickData[date] || 0)+1;
    });
    return res.render("analytics", {
        url: result,
        clickData,
    });
}
async function handleDeleteURL(req, res) {
    const id = req.params.id;

    await URL.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
});

    return res.redirect("/");
}

async function handleEditPage(req,res){
  const url=await URL.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if(!url){
    return res.status(404).senx("URL not found");
  }
  return res.render("edit",{
    url,
  });
}

async function handleUpdateURL(req,res){
  const{url}=req.body;
  try {
    new global.URL(url);
  } catch (error) {
    return res.send("Please enter a valid URL");
  }
  await URL.findOneAndUpdate({
    _id: req.params.id,
    createdBy: req.user._id,
  },
  {
    redirectURL: url,
  }
);
return res.redirect("/");
}
module.exports={
  handleGenerateNewShortURL,
  handleGetURL,
  handleGetAnalytics,
  handleDeleteURL,
  handleEditPage,
  handleUpdateURL,
};