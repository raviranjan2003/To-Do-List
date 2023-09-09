const express = require("express")
const bodyParser = require("body-parser")
// const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
// console.log(date.getDay());
// console.log(date.getDate());


const app = express();
app.set("view engine","ejs");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

// connecting local database
// mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB");
mongoose.connect('mongodb+srv://ravidemo3:Ravi%402003@cluster0.uknzr4i.mongodb.net/ToDoList?retryWrites=true&w=majority');
// Creating Schema
const itemSchema = new mongoose.Schema({
    name : {
        type:String,
        required : true
    }
})

// Creating Model or collection
const Item = mongoose.model("item",itemSchema);

const item1 = new Item({
    name:"Buy Food"
})
const item2 = new Item({
    name:"Buy Veggie"
})
const item3 = new Item({
    name:"Read Book"
})

const defaultItems = [item1,item2,item3];

const newListSchema = {
    name : String,
    items : [itemSchema]
}

const NewList = mongoose.model("newListItem",newListSchema);

// Item.insertMany(defaultItems)
//     .then(()=>{
//         console.log("Inserted Successfully");
//         mongoose.connection.close();
//     })
//     .catch((err)=>{
//         console.log(err);
//     })

// Item.find()
//     .then((items)=>{
//         console.log("Following data are available");
//         // console.log(items);
//         items.forEach((item)=>{
//             console.log(item.name);
//         })
//         mongoose.connection.close();
//     })
//     .catch((err)=>{
//         console.log(err);
//     })

// Item.deleteOne({_id:"6486c24e7cd83ac24939860c"})
//     .then(()=>{
//         console.log("Deleted Successfully");
//         mongoose.connection.close();
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// const items = ["Buy Food","Make Food","Eat Food"]; 

/* 
    here we are using  'const' even we are changing it's value
    coz javascript allow to make change to it's inner content 
    like push() remove(), we can't deirectly assign any thing to it
*/  

// const workItems = [];

app.get('/',(req,res)=>{
    // res.write("Hello Ravii");
    
    // let day = date.getDate();
    // console.log(day); 

  
    Item.find()
    .then((items)=>{
        // console.log("Following data are available");
        // console.log(items);
        // items.forEach((item)=>{
        //     console.log(item.name);
        // })
        if(items.length === 0){
            Item.insertMany(defaultItems)
            .then(()=>{
                console.log("Inserted Successfully");
                res.redirect("/");
                // mongoose.connection.close();
            })
            .catch((err)=>{
                console.log(err);
            })
        }else{
            res.render("list", {value:"Home", newListItems:items,listTitle : "Today"});
        }

        // mongoose.connection.close();
    })
    .catch((err)=>{
        console.log(err);
    })
    
    
    // res.send();
})

// Creating routes dynamically 
app.get("/:customListName",(req,res)=>{
    // console.log(req.params.topic);
    const requestedRoute = _.capitalize(req.params.customListName);

    // console.log(requestedRoute);

    NewList.findOne({name:requestedRoute})
        .then((item)=>{
            // console.log("Exist")
            // console.log(item);
            if(item!=null){
                // console.log("Already Exist");
                res.render("list",{value:"Home", newListItems:item.items,listTitle : item.name});
            }else{
                const item = new NewList({
                    name : requestedRoute,
                    items:defaultItems
                })
                item.save();
                res.redirect("/"+requestedRoute);
                console.log("Inserted Successfully");
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    }
)

app.post("/",(req,res)=>{
    var itemName = req.body.newItem;
    var listName = req.body.list;
    // console.log(req.body);

    const newItem = new Item({
        name : itemName
    })

    if(listName ==="Today"){
        newItem.save();
        res.redirect("/");
    }else{
        NewList.findOne({name:listName})
            .then((item)=>{
                // console.log(item);
                item.items.push(newItem); 
                item.save();
                res.redirect("/"+listName);
            })
    }

    // Below code was working when we're not creating routes dynamically
    // Item.insertMany({name:item})
    //     .then(()=>{
    //         console.log("New item inserted");
    //         res.redirect("/");
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })


     /* Below code is for version 1 */   
    // if(req.body.list === "Work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }

    // console.log(items);
    // res.render("list",{newListItem:item,});
})

app.post("/delete",(req,res)=>{
    // console.log(req.body);
    const reqId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndRemove(reqId)
        .then(()=>{
            console.log("Deleted Successfully");
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
    }else{
        NewList.findOneAndUpdate({name:listName},{$pull:{items:{_id:reqId}}})
            .then(()=>{
                console.log("Deleted Successfully");
                res.redirect("/"+listName);
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    // 1st Method

    // if(reqId){
    //     // console.log("Deleting checked item");
    //     Item.deleteOne({_id:reqId})
    //         .then(()=>{
    //             console.log("Deleted Successfully");
    //             res.redirect("/");
    //         })
    //         .catch((err)=>{
    //             console.log(err);
    //         })
    // }

    // 2nd Method

    // if(reqId){
    //     Item.findByIdAndRemove(reqId)
    //         .then(()=>{
    //             console.log("Deleted Successfully");
    //             res.redirect("/");
    //         })
    //         .catch((err)=>{
    //             console.log(err);
    //         })
    // }
})



// app.get("/work",(req,res)=>{
//     res.render("list",{value:"Work List",newListItems: workItems,listTitle:date.getDay()});
// })

app.get("/about",(req,res)=>{
    res.render("about");
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Port 3000 is listening");
})








/*

  <!-- Using scriplet tag ( <%  %>)
    => we can write javascript code
        to change html inside ejs -->

    <!-- <% if(kindOfDay === "Weekend"){ %>
        <h1 style="color: aqua;">Yeah it's Weekend</h1>
    <% } else { %>
        <h1 style="color: red;">Opps it's weekday</h1>
    <% } %> -->

*/