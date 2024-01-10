const express = require("express");
const router = express.Router();
const USER = require('../models/userModel');
const NFTModel = require('../models/NFT');
router.get("/get_nft", async (req, res, next) => {
    try {
      // Find all users with a Subscription_status of 'confirm'
      console.log("inside getallnftcontrollerfunction")
      const confirmedSellers = await USER.find({ subscriptionStatus: 'confirm' });
  
      if (!confirmedSellers || confirmedSellers.length === 0) {
        return res.status(404).json({ message: 'No confirmed sellers found' });
      }
  
      // Extract the NFTs for each confirmed seller with nft_status as 'pending'
      const nfts = [];
      for (const seller of confirmedSellers) {
        const sellerNFTs = await NFTModel.find({ sellerEmail: seller.email, nft_status: 'pending' });
        nfts.push(...sellerNFTs);
      }
  
      return res.status(200).json({ nfts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  module.exports = router;