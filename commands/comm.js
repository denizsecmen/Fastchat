const mongodb=require('mongodb').MongoClient;
var url="mongodb://127.0.0.1:27017/mydb";
module.exports.main=function (req,res) {
mongodb.connect(url,(err,db)=>{
    var dbo=db.db('mydb');
    dbo.collection('chats').find({}).toArray((err,result)=>
    {
        res.render("main",{data:JSON.stringify(result)});
    }
    );
})
}