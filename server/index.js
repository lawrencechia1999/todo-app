const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const client =require("./db");


dotenv.config();
// Connect DB 
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
// Ensure these are printing the expected values before establishing the connection

//middleware
const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  res.send('Todo Apps Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}/`));


// Test Connection DB
client.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL');
});


const todoListRoute = require('./routes/todoList');
app.use('/todoList', todoListRoute);
