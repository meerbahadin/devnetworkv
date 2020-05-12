const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const axios = require('axios');
const {
    check,
    validationResult
} = require('express-validator');

//models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//route api/profile
//acess public

//get logged in user profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            res.status(400).json({
                msg: 'There is no profile'
            })
        } else {
            res.json(profile);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//Create or update @private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } else {

    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkden,
    } = req.body;

    //build profile object

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //build sociaal object

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = location;
    if (linkden) profileFields.social.linkden = bio;
    if (instagram) profileFields.social.instagram = status;

    try {

        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            //If the profile exist we gonna update the profile
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            })
            return res.json(profile);

        } else {

            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);

        }

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }

})

//get all profile and profile by id
//@public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.log(error.message());
        res.status(500).send('Server Error');
    }
});

//get user profile by id
//@public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind = 'ObjectId') {
            return res.status(400).json({
                msg: 'Porfile not found'
            });
        }
        res.status(500).send('Server Error');
    }
});

//Delete user and profile
//@Private
router.delete('/', auth, async (req, res) => {

    //remove the profile
    await Profile.findOneAndRemove({
        user: req.user.id
    });

    //remove user.
    await User.findOneAndRemove({
        _id: req.user.id
    });
    res.json({
        msg: 'User Removed'
    });


});

//adding expersince and education
//@private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'Your starting date is required').not().isEmpty(),

]], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    // console.log(newExp);

    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);

    } catch (error) {
        console.log(error.message).res.status(500);
    }

});

//delete exp from profile

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).
        indexOf(req.params.exp_id);
        console.log(removeIndex);

        if (removeIndex === -1) {
            return res.json('No Experience Found');
        }

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (error) {
        console.log(error.message)
    }
});



//add or update education
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field Of Study is required').not().isEmpty(),
    check('from', 'Your starting date is required').not().isEmpty(),

]], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };


    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);

    } catch (error) {

        console.log(error.message).res.status(500);
    }

});


//delete education from profile

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).
        indexOf(req.params.edu_id);
        console.log(removeIndex);

        if (removeIndex === -1) {
            return res.json('No Education Found');
        }

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (error) {
        console.log(error.message)
    }
});


//Get request api/profile/github/:username
//@Public

router.get('/github/:username', (req, res) => {
    try {
        axios({
                method: 'get',
                url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
                headers: {
                    'user-agent': 'node.js',
                    Authorization: `token ${config.get('githubToken')}`
                }
            })
            .then(function (response) {
                console.log(response.data)
                return response.data;
            }).then(data => {
                res.json(data);
            })
            .catch(err => {
                console.log(err);
            });



    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');
    }
});



module.exports = router;