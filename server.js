const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./Routes/User_Route");
const adminRoute = require("./Routes/Admin_Route");
const nftroute = require("./Routes/Nft_Route");
const port = 8080;
const app = express();

app.use(express.json()); 

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/NFT", nftroute);
mongoose
  .connect("mongodb://127.0.0.1:27017/NFTBAZAR")
  .then(() => {
    app.listen(port, () => {
      console.log("App is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const mesg = err.mesg || "Internal server Error";
  res.status(statusCode).json({ mesg: mesg, type: err.type });
});
