const {response} = require ("express");
const express = require("express");
const https = require("https");
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
//check if day is weekend
   let today =  new Date();
//    var dayIndex  = date.getDay();
//    const dayList  =["sunday", "monday" , "tuesday" , "wednesday", "thursday", "friday", "saturday"];
//    var day = dayList[dayIndex];
 
let options ={
weekday: "long",
day: "numeric",
month : "long"
}

let day = today.toLocaleDateString("en-US", options);

    response.render("list", {listTitle: day, newlistitems :items});
});

app.post("/", function(req, res){
    let item = req.body.newitems;
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

