const express = require('express');
const cors =  require('cors');
const mongoose = require('mongoose');

const userRoutes = require("./routes/userAuth");

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(process.env.LOCALURL,{
    useNewUrlParser: true,
    useUnifiedTopology : true
},()=>{
    console.log("DB connected !!!");
})



// Routes0
app.use( "/",userRoutes);

app.listen(PORT,()=>{
    console.log(`server connected at ${PORT}`)
})