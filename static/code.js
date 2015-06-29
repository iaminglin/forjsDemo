var url = require('url');
var qs = require('querystring');
var fs = require('fs');


//static
function url2path(urlpath){
    return url.parse(urlpath).path;
}

function static(parent_path){
    return function (ret,res,next) {
        var path = url2path(req.url);
        fs.readFile(parent_path+path, function (err,data) {
            if(err){
                res.write(data);
                res.end();
            }else{
                res.statusCode = 404;
                next();
            }
        })
    }
}

//query
function query(req, res, next) {
    var queryobj = url.parse(req.url).query;
    if (queryobj) {
        try {
            var qsstr = qs.parse(queryobj);
            req.query = qsstr || {};
        } catch (e) {
            req.query = {};
        }

    }
    next();

}

//pathRegexp
function Regexp(path) {
    var paramNames = [];
    path = path.replace(/\? (.*)$/, "")
        .replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g, "[0-9a-zA-Z\-_]*")
        .replace(/(:(.*?(?=\/)))|(:(.*?(?=$)))/g, function () {
            var len = arguments.length - 3;
            for (var i = 0; i < len; i++) {
                var avg = arguments[i + 1];
                if (typeof avg === "string" && avg[0] !== ":") {
                    paramNames.push(avg);
                }
            }
        })
        .replace(/\/$/g, "")
        .replace(/\//g, "\\\/");
    var regexp = new RegExp("^" + path + "\\/?$");
    regexp.paramNames = paramNames;
    return regexp;
}

//download
function download(req,res,next){
    res.download = function(filename,buf){
        if(Buffer.isBuffer(buf)){
            res.writeHead(200,{
                "content-disposition":"attachment filename="+filename,
                "content-type":"application/octet-stream",
                "content-length":buf.length
            });
            res.write(buf);
            res.end();
        }else{
            res.end();
        }
    };
    next();
}

//text
function text(req,res,next){
    res.text= function(data){
        res.writeHead(200,{
           "content-type":"text/plain"
        });
        res.write(data);
        res.end();
    };
    next();
}


//redirect
function localtion(req,url){
    if(/^http:\/\//.test(url)){
        return url;
    }else if(/^\//.test(url)){
        return "http://"+req.headers.host+url;
    }else {
        return "http://"+req.headers.host+req.url+"/"+url;
    }
}
function redirect(req,res,next){
    res.redirect = function(url){
        res.writeHead(304,{
            Location:localtion(req,url)
        });
        res.end();
    };
    next();

}