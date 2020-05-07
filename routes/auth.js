const router = require('express').Router();
const User = require('../models/User');

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object(
  {
    name: Joi.string()
          .min(6)
          .required(),
    email: Joi.string()
          .min(6)
          .required()
          .email(),
    password: Joi.string()
              .min(6)
              .required(),
  }
);

router.post('/register', async (req, res)=>{

  //EASER WAY TO VALIDADE THE DATA
  const {error} = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const {name, email, password} = req.body;

  const user = new User({name, email, password,});
  try{
    const savedUser = await user.save();
    res.send(savedUser);
  }catch(err){
    res.status(400).send(err);
  }

});

module.exports = router;