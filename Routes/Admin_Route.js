const express = require("express");
const router = express.Router();
const AdminModel = require("../models/Admin");
const argon2 = require('argon2');
const SubscriptionModel = require("../models/Subscription");
const NFT = require("../models/NFT");
const User_Model = require("../models/userModel");

router.post("/admin/signup", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await AdminModel.findOne({ username });

    if (existingAdmin) {
      return res.status(401).json({ mesg: "This Admin username is already taken" });
    }

 
    const hashedPassword = await argon2.hash(password);

    const newAdmin = new AdminModel({
      username,
      password: hashedPassword,
    });

    const result = await newAdmin.save();
    res.status(200).json({ mesg: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});

router.post("/admin/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ username });

    if (!admin) {
      return res.status(401).json({ mesg: "Admin Doesn't Exist" });
    }

    
    const passwordMatch = await argon2.verify(admin.password, password);

    if (passwordMatch) {
      res.status(200).json({ mesg: "Admin Login successful" });
    } else {
      res.status(401).json({ mesg: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});


router.patch("/confirm_Subs", async (req, res, next) => {
  try {
 
    const { Id } = req.body;
    
    console.log(Id);
    
    // Find the subscription by ID
  const subscription_Id = await SubscriptionModel.findById(Id);
    console.log(subscription_Id);

    // Check if the subscription is not found
   

    const user_Email = subscription_Id.seller_Email;
    console.log(user_Email);

    // Find the user by email
    const check_User = await User_Model.findOne({ email: user_Email });
    console.log(check_User);

    if (!check_User) {
      return res.status(404).json({ mesg: "User not found" });
    }

    // Update user's subscription status to "confirm"
    check_User. subscriptionStatus = "confirm";
    check_User.role = "seller";
    await check_User.save();

    
   
    // Update subscription status to "Confirm"
    subscription_Id.sub_Status = "Confirm";
    await subscription_Id.save();

    return res.status(200).json({ mesg: "Subscription confirmed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/get_Subs", async (req, res, next) => {
  try {
    const pending_Status_Users = await SubscriptionModel.find({ sub_Status: "Pending" });

    return res.status(200).json({ pending_Status_Users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/calculate-revenue-profit", async (req, res, next) => {
  try {
    // Find all users with sub_Status "Confirm"
    const confirm_Status_Users = await SubscriptionModel.find({ sub_Status: "Confirm" });
  
    // Count the number of confirm_Status_Users
    const countOfConfirmStatusUsers = confirm_Status_Users.length;
  
    // Multiply the count by 10
    console.log(countOfConfirmStatusUsers);
  
    const result = countOfConfirmStatusUsers * 10;
  
    // Log the result to the terminal
    console.log(`Result: ${result}`);
  
    // Send the result in the response
    return res.status(200).json({ result });
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  



});
  

   module.exports = router;

   