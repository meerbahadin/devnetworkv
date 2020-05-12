const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check , validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

//route api/auth
//acess private
router.get('/', auth ,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//route api/users
//acess public
//login route
router.post('/', [
    check('email','Please Include Valid Email').isEmail(),
    check('password','Password is required').exists()
], async (req , res) => {
    console.log('hit');

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({errs:errs.array()})
    } else {
        console.log(req.body);
    }

    const {email , password} = req.body;

    try {
    
    //see the user of exist 
    let user = await User.findOne({email});

    if (!user) {
        return res.status(400)
        .json({errs : [{msg : 'Invalid Credentials'}]})
    }

    const isMatch = await bycrypt.compare(password,user.password);

    if(!isMatch) {
        return res.status(400)
        .json({errs : [{msg : 'Invalid Credentials'}]})
    }

    //return json web token
    const payload = {
        user:{
            id:user.id
        }
    };

    jwt.sign(
    payload,
    config.get('jwtToken'),
    {expiresIn:3600}, 
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