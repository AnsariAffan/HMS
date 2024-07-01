require('dotenv').config();
const express = require('express')
const router = require('./routes/routes')
const cors = require('cors')
const app = express()
const port = process.env.PORT ||8000

 require("./db")


app.use(express.json())
app.use(cors());
app.use("/api",router)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})



