const {response} = require ("express");
const express = require("express");
const https = require("https");
const date = require(__dirname +"/date.js")


const app = express();
let items = ["Wake Up", "Take a Bath", "Drink Water"];
let workItems = [];
//Express templates
app.set('view engine', 'ejs');          

//Body parser
app.use(express.urlencoded({extended : true}));

//public folder
app.use(express.static(__dirname + "/public"));


app.get("/", function(request, response){
    //calling the function from the date.js file
let day = date.getDate();
    response.render("list", {listTitle: day, newlistitems :items});
});

app.post("/", function(req, res){
    let item = req.body.newitems;
    // to seperate the data from both the lists:
    if(req.body.list === "Work List"){
    workItems.push(item);
    res.redirect("/work");
    }
    else{
   items.push(item);
   res.redirect("/");
    }
    
});
app.get("/work", function(req, res){
    res.render("list", {listTitle : "Work List", newlistitems: workItems});

});

// app.post("/work", function(req, res){
//     let item = req.bosy.newitems;
//     workItems.push(item);
//     res.redirect("/work");
// });
           

app.listen(3000, function(){
    console.log("running on port 3000");
});

