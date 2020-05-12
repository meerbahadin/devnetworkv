const mongoose = require('mongoose');
const config = require('config');

const db = config.get("mongoURI");

const connectDb = async () => {
    try {
        //mongoose.connect return a promise so we need to await the promise

        await mongoose.connect(db , {
        useNewUrlParser : true,
        useCreateIndex:true,
        useUnifiedTopology: true,
        useFindAndModify:false});

        console.log('Mongo is ready!')
    } catch (err) {
        console.log(`You have an error : ${err}`);

        //Exit the process
        process.exit(1);
    }
}

//equals :

// const connectDb = () => {
//     try {
//         mongoose.connect("mongodb://localhost:27017/mern",{useNewUrlParser:true})
//         .then(()=>console.log('done'));
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

module.exports = connectDb;