const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    text:{
        type:String ,
        required:true
    },
    name : {
        type:String,
    },
    avatar: {
        type:String
    },
    likes: [
        {
            user:{
            type:Schema.Types.ObjectId,
            ref:'User'
            }
        }
    ],
    comments : [
        {
            user: {
            type:Schema.Types.ObjectId,
            ref:'User'
            },
            text:{
                type:String,
                required:true
            },
            name : {
                type:String,
                required:true
            },
            avatar: {
                type:String
            },
            date : {
                type:Date,
                default:Date.now()
            }
        },
    ],
    date : {
        type:Date,
        default:Date.now()
    }

});

// // Create Schema
// const PostSchema = new Schema({
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'users'
//     },
//     text: {
//       type: String,
//       required: true
//     },
//     name: {
//       type: String
//     },
//     avatar: {
//       type: String
//     },
    // likes: [
    //   {
    //     user: {
    //       type: Schema.Types.ObjectId,
    //       ref: 'users'
    //     }
    //   }
    // ],
//     comments: [
//       {
//         user: {
//           type: Schema.Types.ObjectId,
//           ref: 'users'
//         },
//         text: {
//           type: String,
//           required: true
//         },
//         name: {
//           type: String
//         },
//         avatar: {
//           type: String
//         },
//         date: {
//           type: Date,
//           default: Date.now
//         }
//       }
//     ],
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   });

const Post = mongoose.model('Post' , PostSchema);

module.exports = Post;