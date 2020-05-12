const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

//route api/users
//acess public 
router.post('/', [
    check('name','Name is Required').not().notEmpty(),
    check('name', 'Enter Atleast 6 characters').isLength({min:6}),
    check('email','Please Include Valid Email').isEmail(),
    check('password','Please Enter Password With 6 Or More Characters').isLength({min:6})
], async (req , res) => {

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({errs:errs.array()})
    } else {
        console.log(req.body);
    }

    const {name , email , password} = req.body;

    try {
    
    //see the user of exist 
    let user = await User.findOne({email});

    if (user) {
        return res.status(400).json({errs : [{msg : 'User Alreadt Exist'}]})
    } 

    //get users gravatar

    const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'retro'
    },true)

    user = new User({
        name,
        email,
        avatar,
        password
    });

    //encrypt password using bycrypt
    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(password , salt);
    //save user
    await user.save();

    //return json web token

    const payload = {
        user:{
            id:user.id
        }
    };

    jwt.sign(
    payload,
    config.get('jwtToken'),
    {expiresIn:360000}, 
    (err,token) => {
        if(err) {
            throw err;
        } else {
            res.json({token});
        }
    });

        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }


    
});

module.exports = router;