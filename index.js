const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const Chat=require("./public/chat.js");
const port=8000;
const mongoose=require("mongoose");

main().then(()=>{
    console.log("MongoDB connection successfull");
}).catch((err)=>{
    console.log("Failure");
});

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

app.listen(port,()=>{
    console.log("Server Started");
});

app.get("/chats", async (req,res)=>{
    let chats=await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
});

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/chats/new/add",(req,res)=>{
    let temp=req.body;
    const chat=new Chat(temp);

    chat.save().then(()=>{
        res.redirect("/chats");
    }).catch((err)=>{
        res.send("Error Occurred !!! , Couldn't Add new Chat");
    });
});