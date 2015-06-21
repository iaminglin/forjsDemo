var url = require('url'),
    fs = require('fs');

function urlpath(url_str){
    return url.parse(url_str).path;
}

module.exports = function static(parent_path){
    return function(req,res,next){
        var path = urlpath(req.url);
        fs.readFile(parent_path+path, function (err,data) {
            if(err)
                next();
            else{
                res.write(data);
                res.end();
            }
        })
    }
}
