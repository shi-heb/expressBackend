const router = require ('express').Router();
const  User = require ('../model/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = ({
  name : Joi.string()
  .min(6)
  .required(),
  email : Joi.string()
  .min(6)
  .required()
  .email(),
  password : Joi.string()
  .min(6)
  .required()

});

const schema2 = ({
  email : Joi.string()
  .min(6)
  .required()
  .email(),
  password : Joi.string()
  .min(6)
  .required()
});




router.post('/register',  async(req,res)=>{
   // res.send('Register');
const {error} =Joi.validate(req.body,schema);
//if(error)return res.status(400).send(error);
if (error) return res.status(400).send(error.details[0].message);


const emailExist = await User.findOne({email:req.body.email});
if (emailExist) return res.status(400).send('user existe deja')
//json({
  //text: "cette adresse existe deja"
//});
//send('email exist !!');

const salt = await bcrypt.genSalt(10);
const hachedPassword = await bcrypt.hash(req.body.password,salt);

 const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: hachedPassword
   });
   try{
       const savedUser = await user.save();
      res.send(savedUser);
       //res.json(savedUser);
   }catch(err){res.status(400).send(err);

   }  
   
});
/*router.post('/register', async (req, res) => {
    try {
       // res.send('hi');
      const {name, email, password } = req.body;
      
      //if (!isEmail(email)) {
       // throw new Error('Email must be a valid email address.');
      //}
      //if (typeof password !== 'string') {
       // throw new Error('Password must be a string.');
      //}
      const user = new User({ name,email, password });
      
      //const persistedUser = await user.save();
     // res.send('hi');
      //res.send(persistedUser);
      
  
      res.status(201).json({
        title: 'User Registration Successful',
        detail: 'Successfully registered new user',
      });
    } catch (err) {
      res.status(400).json({
        errors: [
          {
            title: 'Registration Error',
            detail: 'Something went wrong during registration process.',
            errorMessage: err.message,
          },
        ],
      });
    }
  });*/

  router.delete('/deleteuser/:id', async (req, res) => {
    const message = await User
     .findByIdAndRemove(req.params.id)
     .then(() => 'List deleted');
   
    res.json({ message });
   });

   router.get('/usersList', function(req, res) {    
    User.find({}, function (err, users) {
        res.send(users);
        
    }); 
});

router.post('/login',async(req,res)=>{
  
  const {error} =Joi.validate(req.body,schema2);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({email:req.body.email});
  if (!user) return res.status(400).send('email or password are incorrect !!');
  const validPass = await bcrypt.compare(req.body.password,user.password);
  if(!validPass)return res.status(400).send('invalid password');

  const payload = {
    _id: user._id,
    nom: user.name,
    email: user.email,
    role:user.role,
    isactive:user.isactive
  }


  //create and assign token
  //const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
  const token = jwt.sign(payload,process.env.TOKEN_SECRET);
  //const nom = user.name;
  //const id = user._id;
 // const mail = user.email;




  //res.header('auth_token',token).send({token,nom,id,mail});
  res.header('auth_token',token).send({token});

 // res.send('successss ,,, logIn yep')

});

router.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['auth_token'], process.env.TOKEN_SECRET)

  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
//grant simple user to admin 
router.put('/grantToAdmin/:id',(req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: { role: 'admin' }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Student updated successfully !')
    }
  })
})

//from admin to simple user
router.put('/grantToUser/:id',(req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: { role: 'user' }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Student updated successfully !')
    }
  })
})

//activate user 
router.put('/activateUser/:id',(req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: { isactive: 'true' }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Student updated successfully !')
    }
  })
})

//desactivate user 
router.put('/desactivateUser/:id',(req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: { isactive: 'false' }
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Student updated successfully !')
    }
  })
})

module.exports = router;