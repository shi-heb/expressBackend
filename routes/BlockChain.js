//const  BlockChain = require ('../model/BlockChain');
let hash = require("object-hash");
//let validator = require("./validator");
let blockChainModel = require("../model/model");
let mongoose = require("mongoose");
const router = require ('express').Router();
let validator = require("./validator");
const TARGET_HASH = hash(1560);




class BlockChain {

    constructor() {
        //Create
        this.chain = [];
        //Transaction
        this.curr_transactions = [];
    }

    lastBock() {
        return this.chain.slice(-1)[0]; ///< we return and element 0 index (since the has only one)
    }

    isEmpty() {
        return this.chain.length == 0; ///< returns true if empty else false
    }

    addNewTransaction(sender, recipient, amount) {
        //Push the object to the Array
        this.curr_transactions.push({sender, recipient, amount});
        //Using ES6 the key and value pairs can be defined only by specifying the variable 
     }

     addNewBlock(prevHash) {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.curr_transactions,
            prevHash: prevHash,
        };
        if (validator.proofOfWork() == TARGET_HASH) {
        this.getLastBlock((lastBlock) => {
            //only if the lastBlock exists (not null or undefined)
            if(lastBlock) {
               //Link blocks together using hashes 
               block.prevHash = lastBlock.hash;
            }
        block.hash=hash(block);
        let newBlock = new blockChainModel(block);
           newBlock.save((err) => {
    if (err)
        //Error, chalk will help us deliver a nicer red message 
        return console.log("Cannot save Block to DB ", err.message);
    //We use chalk library to display colored text (green for success)
    console.log("Block Saved on the DB");
});
        //Put Hash
       // this.hash = hash(block);
        //Add to Chain
        this.chain.push(block);
        this.curr_transactions = [];
        return block;})
    }
}

    getLastBlock(callback) {
        //Get last block from Database
        return blockChainModel.findOne(
          {},
          null,
          { sort: { _id: -1 }, limit: 1 },
          (err, block) => {
            //in case of err just log it and return (stop execution)
            if (err) return console.error("Cannot get last block ", err.message);
            //get out of the function and run callback passing it the lastBlock 
            return callback(block);
          }
        );
      }


      
    

}


module.exports = BlockChain;