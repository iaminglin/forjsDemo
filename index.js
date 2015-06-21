
var App = require('./bin/App');
var static = require('./bin/static');
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
app.get(function (req,res) {
    res.write("this is get method");
    res.end();
});

app.post(function (req,res) {
    res.write("this is post method");
    res.end();
});

app.listen(3000);
