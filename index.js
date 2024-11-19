const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const Chat=require("./public/chat.js");
const port=8000;
const mongoose=require("mongoose");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

main().then(()=>{
    console.log("MongoDB connection successfull");
}).catch((err)=>{
    console.log("Failure");
});

app.listen(port,()=>{
    console.log("Server Started");
});

app.get("/",(req,res)=>{
    res.redirect('/chats');
});

app.get("/chats", async (req,res)=>{
    let chats=await Chat.find();
    res.render("index.ejs",{chats});
});

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/chats/new/add",(req,res)=>{
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

app.get("/chats/:id/view",async(req,res)=>{
    let {id}=req.params;
    let chat =await Chat.findById(id);
    // console.log(chat);
    res.render("view.ejs",{chat});
});

app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chat =await Chat.findById(id);
    res.render("edit.ejs",{chat});
});

app.put("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let {from : newfrom,to : newto,msg : newmsg}=req.body;
    await Chat.findByIdAndUpdate(id,{
        from : newfrom,
        to : newto,
        msg : newmsg,
    },{runValidators : true , new :true});
    res.redirect("/chats");
});

app.get("/chats/:id/delete" , async(req,res)=>{
    let {id}=req.params;
    let chat =await Chat.findById(id);
    res.render("delete.ejs",{chat});
})

app.post("/chats/:id/delete",async(req,res)=>{
    let {id}=req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});