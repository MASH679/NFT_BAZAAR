const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const NFTModel = require('./NFT');
const user=new Schema({
   email: {
      type: String,
      required: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 19,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: [
        {
          validator: function (v) {
            return /^(?=.*[a-z])/.test(v);
          },
          message: "Password must contain at least one lowercase letter",
        },
        {
          validator: function (v) {
            return /^(?=.*[A-Z])/.test(v);
          },
          message: "Password must contain at least one uppercase letter",
        },
        
      ],
    },
    phoneNo: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{11}$/.test(v);
        },
        message: 'Phone number must be 11 digits.',
      },
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller'],
      default: 'buyer',
    },
    nft: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT'

      },
    ],
    transactionalIdForSeller: {
      type: String,
    },
    totalNftListed: {
      type: String,
    },
    totalNftSelling: {
      type: String,
    },
    totalNftSold: {
      type: String,
    },
    totalNftPending: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ['pending', 'confirm'],
      default: 'pending',
    },
    
});
module.exports=mongoose.model("User",user);