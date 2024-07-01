const express = require('express')
const router = require('./routes/routes')
const cors = require('cors')
const app = express()
const path = require('path');
const port = 8000
 require("./db")


app.use(express.json())
app.use(cors());

// app.use("/api",router)



// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
// API endpoint
app.use("/api",router)

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${port}`);
});
