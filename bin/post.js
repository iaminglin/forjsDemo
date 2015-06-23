var qs = require('querystring');

module.exports = function (req,res,next) {
    var body_data = "";
    req.body = {};
    req.files = {};

    req.on("data", function (chunk) {
        body_data+=chunk;
    });
    req.on("end", function () {

       var isMulti = /(boundary=)/gi.test(req.headers["content-type"]);
        if(isMulti){
            var boundary = RegExp["$'"];//test
            var boundaryStandard = "--"+boundary+"\r\n";
            var boundaryEnd = boundaryStandard+"--";
            body_data = body_data.substring(boundaryStandard.length,body_data.length-boundaryEnd.length)
            var fields = body_data.split(boundary);
            var RN = "\r\n\r\n";
            fields.forEach(function (field) {
                var index = field.indexOf(RN);
                var header = field.substring(0,index);
                /name=\"(.*?)\"/g.test(header);
                var fieldName = RegExp.$1;
                var isFile = /filename/g.test(header);
                var body = field.substring(index+RN.length);
                body = body.substring(0,body.length-RN.length/2);
                if(isFile){
                    req.files[fieldName] = new Buffer(body);
                }else{
                    req.files[fieldName] = body;
                }
            })

        }else{
            try{
                req.body = qs.parse(body_data);
            }catch(e){}
        }
        next();
    })
}
