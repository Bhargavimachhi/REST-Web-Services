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

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

app.listen(port,()=>{
    console.log("Server Started");
});

app.get("/",(req,res)=>{
    res.redirect(`http://localhost:${port}/chats`);
});

app.get("/chats", async (req,res)=>{
    console.log("/chats");
    let chats=await Chat.find();
    res.render("index.ejs",{chats});
});

app.get("/chats/new",(req,res)=>{
    console.log("/chats/new");
    res.render("new.ejs");
});

app.post("/chats/new/add",(req,res)=>{
    console.log("/chats/new/add post");
    let {from,to,msg}=req.body;
    const chat=new Chat({
        from : from,
        to : to,
        msg : msg,
        date : new Date(),
    });

    chat.save().then(()=>{
        res.redirect("/chats");
    }).catch((err)=>{
        res.send("Error Occurred !!! , Couldn't Add new Chat");
    });
});

app.get("/chats/:id",async (req,res)=>{
    console.log("/chats/:id");
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("view.ejs",{chat});
});