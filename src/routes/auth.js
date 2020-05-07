const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const verify = require('./verifyToken');

//REGISTER
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

//LOGIN
router.post('/login', async (req, res)=>{
  const {email, password} = req.body;

  //Validate data
  const {error} = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the email is in the database
  const user = await User.findOne({email});
  if(!user) return res.status(400).send('Email or password is wrong');

  //check if password is correct
  const validPass = await bcrypt.compare(password, user.password);
  if(!validPass) return res.status(400).send('invalid password');

  //Create and assign token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

  //res.send('Logged in!');

});

//LIST USER
router.get('/list-users', verify ,async (req, res)=>{

  const user = await User.find();
  return res.json(user);

});

module.exports = router;