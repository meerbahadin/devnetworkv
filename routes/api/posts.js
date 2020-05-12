const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check , validationResult } = require('express-validator');


//post request for creating a post
//@private
router.post('/', [auth ,[
    check('text' , 'post body is requires')
    .not()
    .isEmpty()
]] , async(req,res) => {
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text : req.body.text,
            name :user.name,
            avatar:user.avatar,
            user:req.user.id
        });

        const post = await newPost.save();

        res.json(post)

    } catch (error) {
        console.log(error.message)
        return res.status(400).send('Server Error');
    }

    
});


//get request for get all post
//@private or you can make this route public of you want

router.get('/' , auth , async (req , res) => {
    try {

        
        const posts = await Post.find({}).sort({date:-1});

        return res.json(posts);
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).send('Server Error');

    }
});

//finding one specific post
router.get('/:id' , auth , async (req , res) => {
    try {

        const post = await Post.findById(req.params.id);
        if(!post) res.status(404).json({msg:'No Post Found'});
        return res.json(post);
        
    } catch (err) {
        console.log(err.message);
        if(err.kind === 'ObjectId') res.status(404).json({msg:'No Post Found'});
        return res.status(400).send('Server Error');

    }
});



router.delete('/:id' , auth , async (req , res) => {
    try {

        const post = await Post.findById(req.params.id);

        //u have to make sure that if a user delete a post he/she must own the post!

        if (!post) {
            return res.status(404).json({msg : 'Post not found'})
        }

        //post.user returns an object so we can NOT do this post.user !== req.user.id they will never match even if the
        //the user is authorized so we can convert it to string by toString()

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'user not authorized'})
        }

        await post.remove();

        return res.json('Post Deleted');

        
    } catch (err) {
        console.log(err.message);
        if(err.kind === 'ObjectId') res.status(404).json({msg:'No Post Found'});
        return res.status(400).send('Server Error');
    }
});

//IMPORTANT 
//add likes to a post 
//put posts/like/:id
//@private
//we use put request becase we update the like array
router.put('/like/:id' , auth , async (req , res) => {
    try {
        //we find the user by the id in the url
        const post = await Post.findById(req.params.id);
        
        //check if the user already liked the by the user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg : 'Post already liked'});
        }

        //if the uset did not liked the post we should push into likes array on the database and we should push the
        //id of the user

        post.likes.unshift({user : req.user.id});

        //finally we save it 

        await post.save();

        //we return the likes not the user
        return res.json(post.likes);

    } catch (err) {
        console.log(err.message);
        return res.status(400).send('Server Error');
    }
});

//IMPORTANT 
//unlikes post
//put posts/like/:id
//@private

router.put('/unlike/:id' , auth , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        //check if the post already liked the by the user

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg : 'Post is not liked'});
        }


        //get the remove index 
        const removIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removIndex , 1);

        await post.save();

        //we return the likes not the user
        return res.json(post.likes);

    } catch (err) {
        console.log(err.message);
        return res.status(400).send('Server Error');
    }
});

//post request for commenting on a post
//route posts/comments/:id 
//@private
router.post('/comments/:id', [auth ,[
    check('text' , 'post body is requires')
    .not()
    .isEmpty()
]] , async(req,res) => {
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text : req.body.text,
            name :user.name,
            avatar:user.avatar,
            user:req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments)

    } catch (error) {
        console.log(error.message)
        return res.status(400).send('Server Error');
    }

    
});

//delete request for deleting a comment on 
//route posts/comments/:id/:comment_id
//@private

router.delete('/comments/:id/:comment_id' , auth , async (req , res) => {
    try {
        //get the post
        const post = await Post.findById(req.params.id);

        //pull out comment on the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //make sure comment exist
        if(!comment) {
            return res.status(404).json({msg : 'comment not found'});
        }

        //check user if he/she owns the comment
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'user not athorized'});
        }

        //if the user owns the comment and everything is okay then we can delete the comment now

        const removIndex = post.comments
        .map(comment => comment.user.toString()).indexOf(req.user.id);


        post.comments.splice(removIndex , 1);

        await post.save();

        return res.json(post.comments);

    } catch (error) {
        console.log(error.message)
        return res.status(400).send('Server Error');
    }
});


module.exports = router;