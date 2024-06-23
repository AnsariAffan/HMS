const mongoose = require('mongoose')
const connectToMongo = mongoose.connect('mongodb://localhost:27017/HSMDB')
    .then(() => {
        console.log(" connection successfull...")
    })
    .catch((err) => {
        console.log(err)
    })

   

