
const mongoose = require('mongoose')
const connectToMongo = mongoose.connect('mongodb+srv://mohammadaffan777:Anam%401234@cluster0.f68xlli.mongodb.net/HospitalManagementDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log(" connection successfull...")
    })
    .catch((err) => {
        console.log(err)
    })

   
