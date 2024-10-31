// This is our server class, this the first class that will be run
//It connects to mongodb data

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/UserDetails");
const User = require('./Models/UserSchema');
var express = require("express");
var app = express();
var bodyParser = require("body-parser") ;
const path = require("path");
const reader = require('xlsx');
const { render } = require("ejs");
const Articles = require("./Models/ArticlesSchema");
app.use(express.static(path.join(__dirname, "public")));


//Here we define our routers or each request by the use
//This will render our emebeded javascript code and the data will be displayed to the user

app.use(bodyParser.urlencoded({extended: true})) ;
app.set("view engine","ejs");

app.listen(4000,function(){
    console.log("Server Started...");
    
});
app.get("/",function(req,res){
    res.render("Index");
});

app.get("/Visual1",function(req,res){
    res.render("Visualization");
});

app.post("/submit",(req,res)=>{

    const UserQuery = req.body.textareaInput;
    FieldTags = ['TP','TI','AB','AU','RA','PT','PS','RG','PY','IN','PRF','SP','AD','ALL'];   
    Articles.find({},function(err,UserData){
        if(err){
        }
        else{
 
            res.render('SearchResults',{UserData,UserQuery});
        }
    });
    
});
app.get("/submit",(req,res)=>{
    res.render("SearchPage");
});
