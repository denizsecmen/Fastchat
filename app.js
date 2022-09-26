const express=require('express');
var app=express();
const http=require('http');
const mongodb=require('mongodb').MongoClient;
const server=http.createServer(app);
const { Server }=require('socket.io');
const comand=require('./commands/comm');
var ejs=require('ejs');
var router=require("./routing/rou");
const { MONGO_CLIENT_EVENTS } = require('mongodb');
const io= new Server(server);
var url="mongodb://127.0.0.1:27017/mydb";
app.set("view engine","ejs");
mongodb.connect(url).then((db) =>{
    console.log("Connection Created!!!");
    var dbo=db.db("mydb");
    dbo.listCollections("chats").next(colinfo=>{
    if(!colinfo)
    {
        dbo.createCollection("chats").then(()=>
        {
            console.log("Collection chats created!")
        }).catch((err)=>{throw err;})
    }
    else
    {
        console.log("Chats already exsist");
    }
}
    )
}
).catch(err=>console.log(err));
app.use("/Style",express.static(__dirname+"/Style"));
app.set("views",__dirname+"/view");
app.use("/",router);
io.on('connection',function(socket){
    console.log("User Connected!!");
    socket.on('clicked',(msg)=>{
       console.log('message:'+JSON.stringify(msg));
       mongodb.connect(url,(err,db)=>
       {
        if(err)throw err;
        var dbo=db.db("mydb");
        var query={chat:msg};
        dbo.collection('chats').insertOne(query,()=>{if(err)throw err;dbo.collection('chats').count({},(err,data)=>
        {
        console.log("count:"+data.toString());
        if(data>99)
        {
        dbo.collection('chats').deleteMany({},function(err){if(err)throw err;
        console.log("Table cleared!!");
        io.emit('clicked','');
        }
        );   
        }
        }
        )})
       })
    })
})
server.listen(2000,(err)=>{
 if(err){throw err;}
 console.log("Listening port:2000")
});