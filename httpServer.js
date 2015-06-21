var http = require('http');
var fs = require('fs');
var url = require('url');
var server = http.createServer();

//function urlpath(url_str){
//    return url.parse(url_str).path;
//}
//
//server.on('request', function (req,res) {
//   // res.write("<b>good project</b>");
//    var path = urlpath(req.url);
//    fs.readFile(__dirname+"/views"+path, function (err,data) {
//        res.write(data);
//        res.end();
//    })
//
//});
//server.listen(3001);
