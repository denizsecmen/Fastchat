const express=require('express');
var comm=require("../commands/comm");
var app=express.Router();
app.get("/",comm.main);
module.exports=app;