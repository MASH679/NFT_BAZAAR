const mongoose = require('mongoose');
const nftSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
    required: true,
  },
  nft_status:{
    type:String,
    enum:["pending","confirm"],
    default:"pending"
  },
  nftImage:
  {
    type:String
  }
});

const NFTModel = mongoose.model('NFT', nftSchema);

module.exports = NFTModel;
