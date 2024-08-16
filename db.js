
const mongoose = require('mongoose')
const dbURI = process.env.MONGODB_URI;
const localURL = process.env.LOCAL_URL

const connectToMongo = mongoose.connect(dbURI)
    .then(() => {
        console.log(" connection successfull...")
    })
    .catch((err) => {
        console.log(err)
    })

   
//mongodb+srv://mohammadaffan777:Anam%401234@cluster0.f68xlli.mongodb.net/HospitalManagementDatabase?retryWrites=true&w=majority

//PORT=8000
//MONGODB_URI=mongodb://localhost:27017/your_database_name
//JWT_SECRET=your_jwt_secret_here