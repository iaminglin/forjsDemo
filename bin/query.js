var url = require('url');
var qs = require('querystring');


module.exports = function (req,res,next) {
    var querystring = url.parse(req.url).query;
    if(querystring){
        try{
            var queryObj = qs.parse(querystring);
            req.query = queryObj||{};
        }catch(e){
            req.query = {};

        }
    }
    next();
}
