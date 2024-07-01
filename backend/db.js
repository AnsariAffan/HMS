
const mongoose = require('mongoose')
const connectToMongo = mongoose.connect('mongodb+srv://mohammadaffan777:Anam%401234@cluster0.f68xlli.mongodb.net/HospitalManagementDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log(" connection successfull...")
    })
    .catch((err) => {
        console.log(err)
    })

   
// mongodb://localhost:27017
//mongodb+srv://mohammadaffan:<password>@cluster0.fh5fk1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb://localhost:27017
//mongodb+srv://mohammadaffan:<password>@cluster0.fh5fk1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0