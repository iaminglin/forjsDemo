var qs = require('querystring');

module.exports = function (req,res,next) {
    var body_data;
    var chunk_list = [];
    var contentType = req.headers["content-type"];
    var contentLength = parseInt(req.headers["content-length"]);
    var isMulti = /(boundary=)/gi.test(contentType);
    var boundary = RegExp["$'"];
    var boundaryStandard = "--"+boundary+"\r\n";
    var boundaryEnd = "--"+boundary+"--\r\n";
    req.body = {};
    req.files = {};

    req.on("data", function (chunk) {
        chunk_list.push(chunk);
    });
    req.on("end", function () {
        body_data = Buffer.concat(chunk_list);
        if(isMulti){
            try {
                var readState = 0;
                var position = 0;
                var body = [];
                var backup = [];

                function handle(b) {
                    switch (readState) {
                        case 0:
                            if (body_data.slice(position, position + boundaryStandard.length).toString() == boundaryStandard) {

                                if (backup.length > 0) {
                                    body.push(backup);// backup 为正文
                                    backup = [];
                                } else {
                                    position += boundaryStandard.length;
                                    readState = 1;
                                }
                            } else if (body_data.slice(position, position + boundaryEnd.length).toString() == boundaryEnd) {

                                if (backup.length > 0) {
                                    body.push(backup)
                                }
                                return true;
                            } else {

                                backup.push(b);
                                position += 1;
                            }
                            break;
                        case 1:
                            if (backup.length >= 3) {

                                var arr = backup.slice(backup.length - 3, backup.length);
                                arr.push(b);
                                backup.push(b);
                                if (new Buffer(arr).toString() === "\r\n\r\n") {
                                    body.push(backup);
                                    backup = [];
                                    readState = 2;

                                }
                            } else {

                                backup.push(b);
                            }
                            position += 1;
                            break;
                        case 2:

                            backup.push(b);
                            position += 1;
                            break;
                    }
                }

                for (; position < body_data.length;) {
                    var b = body_data[position];
                    if (readState === 0 || readState === 2) {
                        if (b === 45) {
                            readState = 0;
                        } else {
                            readState = 2;
                        }
                    }
                    var end = handle(b);  //return true;
                    if (end) {
                        for (var i = 0; i < body.length;) {
                            var header = new Buffer(body[i]).toString();
                            var arr = body[i + 1];
                            var data = new Buffer(arr.slice(0, arr.length - 2));
                            /name=\"(.*?)\"/g.test(header);
                            var fieldname = RegExp.$1;
                            var isFile = /filename/g.test(header);
                            if (isFile) {
                                req.files[fieldname] = data;
                            } else {
                                req.body[fieldname] = data.toString();
                            }
                            i += 2;
                        }
                        break;
                    }
                }
            }catch (e){}
        }else{
           try{
               req.body=qs.parse(body_data.toString());
           }catch(e){}
        }

        next();
    })

}
