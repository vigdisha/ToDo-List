const {response} = require ("express");
const express = require("express");
const https = require("https");
const mongoose = require('mongoose');
const _ = require("lodash");
const { stringify } = require("querystring");
const { StringDecoder } = require("string_decoder");
// let uri = "mongodb+srv://disha:test123@cluster0.wcbno.mongodb.net/?retryWrites=true&w=majority";


const app = express();
// let items = ["Wake Up", "Take a Bath", "Drink Water"];
// let workItems = [];

//Express templates
app.set('view engine', 'ejs');          

//Body parser
app.use(express.urlencoded({extended : true}));

//public folder
app.use(express.static(__dirname + "/public"));

//mongoose:
mongoose.connect("mongodb+srv://disha:test123@cluster0.wcbno.mongodb.net/?retryWrites=true");
const itemsSchema = {
name: String
}
const Item = mongoose.model("Item", itemsSchema); 

const item1  = new Item ({
    name : "welcome"

});

const item2  = new Item ({
    name : "hit + to add new item"

});

const item3  = new Item ({
    name : "<-- hit this to delete"

});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(request, response){
    //calling the function from the date.js file
    
    Item.find({}, function(err, foundItems){
        //if any items
        //if none
        //create and add 3 items
        //redirect back into root route 
        if(foundItems.length === 0){
            
             Item.insertMany(defaultItems,function(err){
                 if(err){
                     console.log(err);
                 }
                 else{
             console.log("items added succesfully");
                 }
             }) ;
             response.redirect("/");
        }
        else{
        response.render("list", {listTitle: "Today", newlistitems :foundItems});
        }
    });
});

app.get("/:customListName", function(req, res){
const customListName = _.capitalize(req.params.customListName);

List.findOne({name: customListName},function(err, foundList){
   if (!err){
    if(!foundList){
       //this should be path were we create new list
       const list = new List({
       name: customListName,
       items:defaultItems
       })
       list.save();
    res.redirect("/" + customListName)
    }else{
        //show an existing list
        res.render("list", {listTitle: foundList.name, newlistitems :foundList.items})
    }
   } 
});

});

app.post("/", function(req, res){
    const itemName = req.body.newitems;
    const listName = req.body.list;
   const item = new Item({
    name: itemName
   });
   if(listName == "Today"){

       item.save();
       res.redirect("/");
   }
else{
    List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+ listName)
    })
}

});

app.post("/delete", function(req, res){
const checkedItemId = req.body.checkbox;
const listName = req.body.listName; 

    if(listName == "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("sucessfully deleted checked Item.");
        res.redirect("/");
        }
        });
    }
    else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){

        if(!err){
            res.redirect("/" + listName);
        }
    });
}
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(3000, function(){
    console.log("Successfully running");
});


