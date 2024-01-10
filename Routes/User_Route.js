const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const argon2 = require('argon2');
const NFTModel = require('../models/NFT');
const Subscription = require('../models/Subscription');
const order_Model = require('../models/Orders'); 
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/signup", async (req, res, next) => {
  const { email, password, fullName, phoneNo, address} = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ mesg: "This Email is Already Registered" });
    }

    // Hash the password before saving
    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      fullName,
      phoneNo,
      address
    });

    const result = await newUser.save();
    res.status(200).json({ mesg: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ mesg: "User Doesn't Exist. Please Sign Up First" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await argon2.verify(user.password, password);

    if (passwordMatch) {
      res.status(200).json({ mesg: "Login successful" });
    } else {
      res.status(401).json({ mesg: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});

router.post("/create-nft", async (req, res, next) => {
  const { name, description, price, sellerEmail } = req.body;

  try {
    const Checkcreator = await UserModel.findOne({ email:sellerEmail });

    if (!Checkcreator) {
      return res.status(401).json({ mesg: "User With this email does not exist" });
    }

    const newNFT = new NFTModel({
      name,
      description,
      price,
      sellerEmail,
    });

     await newNFT.save();
    
    Checkcreator.nft.push(newNFT._id);
    await Checkcreator.save();
    
    res.status(200).json({ mesg: "NFT created successfully" });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});

router.post("/Buy_Subcription", async (req, res, next) => {
  const { sellerEmail,Reference_no } = req.body;

  try {
    const Checkcreator = await UserModel.findOne({ email:sellerEmail });

    if (!Checkcreator) {
      return res.status(401).json({ mesg: "User With this email does not exist" });
    }

    const newSubscription = new Subscription({
  
      seller_Email: sellerEmail,
      Reference_no
    });

     await newSubscription.save();
    
    
    return res.status(200).json({ mesg: "Your Subscription Status is Pending" });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesg: "Internal Server Error" });
  }
});

/// Order creation 
router.post("/order", async (req,res, next) => {
  const {Buyer_Email,Transection_id,payment_Info,nft_Id}=req.body;

  const new_Order = new order_Model ({
    
    buyer_Email:Buyer_Email,
    Transection_id,
    payment_Info,
    nft_Id
  });

  await new_Order.save();
  return res.status(200).json({mesg:"ORDER CREATED SUCCESSFULLY"});
});

router.get ("/get_nft", async(req,res,next)=>{
  try {
    // Find all users with a Subscription_status of 'confirm'
    const confirmedSellers = await USER.find({ Subscription_status: 'confirm' });

    if (!confirmedSellers || confirmedSellers.length === 0) {
      return res.status(404).json({ message: 'No confirmed sellers found' });
    }

    // Extract the NFTs for each confirmed seller 
    const nfts = [];
    for (const seller of confirmedSellers) {
      const sellerNFTs = await nft_model.find({ creator_email: seller.email });
      nfts.push(...sellerNFTs);
    }

    return res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
   


   
});

router.post("/UploadNFT", upload.single("nftImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: "Please Provide Nft Image" });
    }
    const { name, description, price, sellerEmail } = req.body;
    console.log(req.body);
  const Checkcreator = await UserModel.findOne({ email:sellerEmail });

  
      if (!Checkcreator) {
        return res.status(401).json({ mesg: "User With this email does not exist" });
      }
  
      const nftImage = req.file.buffer.toString("base64");
      const newNFT = new NFTModel({
        name,
        description,
        price,
        sellerEmail,
        nftImage
      });

    await newNFT.save();
    
    Checkcreator.nft.push(newNFT._id);
    await Checkcreator.save();


    res.status(200).json({ message: "NFT Created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
