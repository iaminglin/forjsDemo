
var App = require('./bin/App');
var static = require('./bin/static');
var query = require('./bin/query');
var post = require('./bin/post');


var app = new App();
app.use(static(__dirname+"/views"));
app.use(query);
app.use(post);
app.get("/gettest",function (req,res) {
    res.write("this is get method"+req.query.name+" "+ req.query.id);
    res.end();
});

app.get("/gettest/*/:id/ok",function(req,res){
    res.write("o my god");
    res.end();
})
app.get("/gettest/:name/:age",function(req,res){
    res.write("name:"+req.params.name+"\n age:"+req.params.age);
    res.end();
})

app.post("/posttest",function (req,res) {
    var fs = require('fs');
    fs.writeFile(__dirname+"/public/file.txt",req.files.txt,function(err){
        if(err)
            console.log(err)
        res.write("ok");
        res.end();
    })
});

//app.post("/posttest", function (req,res) {
//    var body_data = "";
//    req.on("data", function (chunk) {
//        body_data+=chunk;
//    })
//    req.on("end", function () {
//        var contextType = req.headers["context-type"];
//        console.log(req.headers)
//    })
//})

app.listen(3000);
