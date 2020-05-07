const router = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res)=>{
  const {name, email, password} = req.body;

  //EASER WAY TO VALIDADE THE DATA
  //const {error} = schema.validate(req.body);
  const {error} = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //check if the user is already in te the database
  const emailExists = await User.findOne({email});
  if(emailExists) return res.status(400).send('Email already exists');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create a new user
  const user = new User({name, email, password: hashedPassword,});
  try{
    const savedUser = await user.save();
    //res.send(savedUser);
    res.send({user: user._id});
  }catch(err){
    res.status(400).send(err);
  }

});

module.exports = router;