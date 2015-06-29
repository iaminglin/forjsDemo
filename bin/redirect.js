module.exports = function (req,res,next) {
    res.redirect = function(url){
        res.writeHead(302,{
            Location:location(req,url)
        });
        res.end();
    }
    next();
}

function location(req,url){
    if(/^http:\/\//.test(url)){
        return url;
    }else if(/^\//.test(url)){
        return 'http://'+req.headers.host+url;
    }else{
        return 'http://'+req.headers.host+req.url+'/'+url;
    }
}
