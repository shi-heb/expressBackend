let blockChain = require ("./BlockChain");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//const BlockChain = require("../model/BlockChain");
let blockChains = new blockChain();

let hash = require("object-hash");
mongoose.connect(process.env.DB_CONNECT,{useUnifiedTopology: true,useNewUrlParser : true,useFindAndModify: true},
  ()=>console.log('connect to db!!')
  );
const PROOF = 1560; ///< Random Proof Number 

 
//Check if the Proof is Valid
/*let validProof = (proof) => {
  let guessHash = hash(proof); ///< hash the proof
  console.log("Hashing: ", guessHash);
  return guessHash == hash(PROOF); ///< check against the real proof hash
};

//Generate Proof
let proofOfWork = () => {
  let proof = 0;
  //Loop till you get into the real proof
  while(true) {
    //check proof (Not valid, increment)
    if(!validProof(proof)) {
      proof++;
    } else {
      //We have got the proof, get out of the infinite loop;
      break;
    }
  }
  //Send Proof Back 
  return proof;
}
if (proofOfWork() == PROOF) {*/
    //if first block on chain (Previous hash is NULL)
    //let prevHash = blockChains.lastBock() ? blockChains.lastBock().hash : null;
    //New Transactions 
    blockChains.addNewTransaction("islem", "penywis", 560);
   
    //Add Block
    blockChains.addNewBlock(null);
   
/*}*/

//Log Our Chain after block adding 
console.log("Chain: ", blockChains.chain);
