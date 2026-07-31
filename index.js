require("dotenv").config();

const express = require("express");
const path=require("path");
const cookieParser=require('cookie-parser');
const { connectToMongoDB } = require("./connection");
const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require("./routes/user");
const { restrictToLoggedinUserOnly,checkAuth}=require('./middlewares/auth');
const URL = require("./models/url");

const app = express();
const PORT = process.env.PORT;

connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//   return res.render("home",{
//     urls: allUrls,
//   });
  // (
    // `
    // <html>
    //   <head></head>
    //   <body>
    //     <ol>
    //       ${allUrls.map((url) => `<li>${url.shortId}-${url.redirectURL}-${url.visitHistory.length}</li>`).join("")}
    //     </ol>
    //   </body>
    // </html>
    // `
    // );
// });
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
