
var App = require('./bin/App');
var static = require('./bin/static');
var query = require('./bin/query');
//exports.App = app;
//exports.static = static;

//var app = new App();
//var app2 = new App();
//var module1 = require('./module1');
//var module2 = require('./module2');
//app.use(module1);
//app.use(module2);
//app2.use(module1);
//app2.use(module2);
//app.listen(3000);
//app2.listen(3001);

var app = new App();
app.use(static(__dirname+"/views"));
app.use(query);
app.get("/gettest",function (req,res) {
    res.write("this is get method"+req.query.name,req.query.id);
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
    res.write("this is post method");
    res.end();
});

app.listen(3000);
