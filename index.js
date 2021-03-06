
var App = require('./bin/App');
var static = require('./bin/static');
var query = require('./bin/query');
var post = require('./bin/post');
var text = require('./bin/text');
var redirect = require('./bin/redirect');
var download = require('./bin/download');
var session = require('./bin/session');
var view = require('./bin/view');
var fs = require('fs');

var types = require('./public/types');
var articles = require('./public/articles');
var admin = {loginname:"admin",password:"123"};
var url = require('url');
var qs = require('querystring');
var app = new App();
app.use(static(__dirname+"/static"));
app.use(query);
app.use(post);
app.use(text);
app.use(redirect);
app.use(download);
app.use(session);
app.use(view(__dirname+="/views"));
//app.use(view(__dirname+="/testviews"));

function test(){
    ///^\/commit\/(\w+)(?:\.\.(\w+))?$/.test("/commit/adb..wert");
    //return "1:"+RegExp.$1 +"2:"+ RegExp.$2+"3:"+RegExp.$3;

    //var path = "/img/:articleId";
    //path = path.replace(/\? (.*)$/,"")// query 内容，不再解析
    //path = path.replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g,"[0-9a-zA-Z\-_]*")//防止.* ,把＊都替换掉
    //path = path.replace(/(:(.*?(?=\/)))|(:(.*?(?=$)))/g, "([0-9a-zA-Z\-_]*)")
    //path = path.replace(/\/$/g,"")
    //path = path.replace(/\//g,"\\/")
    //var regexp = new RegExp("^"+path+"\\/?$");
    //var pass = regexp.test("/img/ID-1446818022916");
    //if(pass)
    //    return RegExp["$"+(1)];
    //else
    //    return "-1";

    var name = "boundary=123321";
    var isMulti = /(boundary=)/gi.test(name);
    var boundary = RegExp["$'"];
    return boundary;

    //var query = url.parse("127.0.0.1:3000/demo/show?a=1/haha").query;
    //var querystring = qs.parse(query);
    //return querystring;
}
console.log("test:"+test());

function isLogined(req){
    return req.session.islogined;
}

app.get("/type/manage", function (req,res) {
    if(isLogined(req)){
        res.view("type_manage.html",{types:types})
    }else{
        res.redirect("/");
    }
});

app.get("/", function (req,res) {
    var arts;
    var query = req.query;
    if(query){
        var type = query.type;
        arts = articles.findByType(type);
    }else{
        arts=articles;
    }
    var msg = {
        islogined:isLogined(req),
        title:"My Blog",
        types:types,
        articles:arts
    };
    res.view("index.html", msg);
});

app.get("/login", function (req,res) {
    res.view("login.html",{
        islogined:isLogined(req),
        msg:"hello iaming,glad to see you!"
    })
});

app.post("/login", function (req,res) {
    if(req.body.loginname == admin.loginname && req.body.password == admin.password){
        req.session.islogined = true;
        res.redirect("/");
    }else{
        res.view("login.html",{msg:"登录信息有误，请重新输入"})
    }
});

app.get("/logout", function (req,res) {
    req.session.islogined = false;
    res.redirect("/");
});

app.get("/create", function (req,res) {
    if(isLogined(req)){
        res.view("create.html",{types:types})
    }else{
        res.redirect("/")
    }
});

app.get("/article/:id",function(req,res){
    var art = articles.get(req.params.id);
    if(art){
        res.view("view.html",{article:art})
    }else{
        res.text("No Article")
    }
});

app.get("/img/:articleId", function (req,res) {
    var art = articles.get(req.params.articleId);
    res.download("img",new Buffer(art.img,"base64"));
});

app.post("/create",function(req,res){
    if(isLogined(req)){
        req.body.img = req.files.img;
        articles.create(req.body);
    }
    res.redirect("/")
});

app.get("/del/:id", function (req,res) {
    if(isLogined(req)){
        articles.del(req.params.id)
    }
    res.redirect("/")
});

app.get("/edit/:id",function(req,res){
    var art = articles.get(req.params.id);
    if(art && isLogined(req)){
        res.view("edit.html",{types:types,article:art})
    }else{
        res.redirect("/")
    }
});

app.post("/update/:id", function (req, res) {
    if(isLogined(req)){
        req.body.img = req.files.img;
        articles.update(req.body,req.params.id)
    }
    res.redirect("/")
});


app.post("/type/create", function (req, res) {
    if(isLogined(req)){
        types.create(req.body.title)
    }
    res.redirect("/type/manage")
});

app.post("/type/del/:id", function (req, res) {
    if(isLogined(req)){
        types.del(req.params.id);
    }
    res.redirect("/type/manage")
});

app.post("/type/update/:id", function (req,res) {
    if(isLogined(req)){
        console.log("type update");
        console.log(req.body.title);
        console.log(req.params.id);
        types.update(req.body.title,req.params.id)
    }
    res.redirect("/type/manage")
});
app.get("/about", function (req,res) {
    var info=[
        ["name","lin"],["age",25],["address","fj"]
    ];
    res.view("about.html",{title:"Demo",info:info})
});
app.listen(3000);
//app.get("/", function (req,res) {
//    res.view("index.html",{title:"Demo",name:"lin"});
//})
//
//app.get("/about", function (req,res) {
//    var info=[
//        ["name","lin"],["age",25],["address","fj"]
//    ]
//    res.view("about.html",{title:"Demo",info:info})
//})
//
//app.get("/gettest",function (req,res) {
//    console.log(req.headers)
//    res.write("this is get method"+req.query.name+" "+ req.query.id);
//    res.end();
//});
//
//app.get("/gettest/*/:id/ok",function(req,res){
//    res.write("o my god");
//    res.end();
//});
//app.get("/gettest/:name/:age",function(req,res){
//    res.write("name:"+req.params.name+"\n age:"+req.params.age);
//    res.end();
//});
//
//app.get("/text/:id", function (req,res) {
//    res.text(req.params.id);
//});
//
//app.get("/baidu",function(req,res){
//    res.redirect("http://www.baidu.com");
//});
//
//app.get("/redirect", function (req,res) {
//    res.redirect("/test1.html");
//});
//app.get("/redirect2", function (req,res) {
//    res.redirect("redirect3");
//});
//
//app.get("/redirect2/redirect3",function(req,res){
//    res.text("redirect3");
//});
//
//app.post("/posttest",function (req,res) {
//    fs.writeFileSync(req.body.file_name,req.files.file_data);
//    res.write("ok");
//    res.end();
//});
//
//
//app.get("/download", function (req,res) {
//    var buf = new Buffer("haha");
//    res.download("download.o",buf);
//});
//
//app.get("/session",function(req,res){
//    req.session = req.session||0;
//    req.session+=1;
//    res.write(req.session.toString());
//    res.end();
//})


