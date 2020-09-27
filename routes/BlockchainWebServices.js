const router = require ('express').Router();
const  blockChain = require ('./BlockChain');
const blockmodel = require('../model/model');
const  User = require ('../model/User');
const { number } = require('@hapi/joi');




router.post('/transactions/new', async(req,res)=>{
    const emailfound =  await User.findOne({email:req.body.recipient});
    const theSender =  await User.findOne({email:req.body.sender});
if (!emailfound) return res.status(400).send('recipient adress is invalid!!');
if(theSender.amount<req.body.amount) return res.status(400).send('your amount is not sufficient');

    if (req.body.sender === ''  || req.body.recipient ==="" || req.body.amount === "")
    {
       return  res.status(400).send("Missing values");
        //return;
    } 
   const  block = new blockChain();
   block.addNewTransaction({sender:req.body.sender,recipient:req.body.recipient,amount:req.body.amount});
   block.addNewBlock(null);
   
   id=theSender._id;
   id2=emailfound._id;


   await  User.findByIdAndUpdate(id, { 
  $set: { amount:theSender.amount - req.body.amount}});

  await  User.findByIdAndUpdate(id2, { 
    $set: { amount:emailfound.amount + req.body.amount}});
res.send("Transaction will be added to block ");
});

router.get('/blockList', function(req, res) {    
    blockmodel.find({}, function (err, blocks) {
        res.send(blocks);
        
    }); 
});


router.put('/acheter/',async(req, res, next) => {
    
     u = await User.findOne({_id:req.body._id});
      // a=req.body.amount;
     //b=u.amount;
      // s=a+b;
   await  User.findByIdAndUpdate(req.body._id, {
       
       
        //s :User.amount,
       // r:req.body.amount,
      $set: { amount: req.body.amount+u.amount}
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('achat des points avec succes !')
      }
    })
  })

  router.get('/detail/:id', (req, res)=> {    
    blockmodel.findById(req.params.id, (err, blocks)=>{
       res.send(blocks.transactions);
        
        
    }); 




});


router.put('/wallet/new', async(req,res)=>{
    
   theSender =  await User.findOne({email:req.body.email});

if(theSender.amount<req.body.amount) return res.status(400).send('your amount is not sufficient');

    if ( req.body.amount === "")
    {
      return  res.status(400).send("Missing values");
        //return;
    } 
   id=theSender._id;
  // a = req.body.amount;
  // b=a/3;


   await  User.findByIdAndUpdate(id, { 
  //$set: { wallet:theSender.wallet+(req.body.amount)/3},
  $set: { amount:theSender.amount-req.body.amount,wallet:theSender.wallet+(req.body.amount)/3}})

  
res.send("you just create wallet ");
});

    


module.exports = router;