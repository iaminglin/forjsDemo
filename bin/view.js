var fs = require('fs');
path = require('path');

function filterRN(s){
    s = s.replace("\'","\"");
    s = s.replace(/\n/g,"\\n");
    s = s.replace(/\r/g,"\\r");
    return "result +=\'"+s+"\';\n\r";
}

module.exports = function (viewPath) {
    var viewCache = {};
    fs.readdir(viewPath, function (err,files) {
        files.forEach(function (fn) {
            var filepath = path.join(viewPath,fn);
            fs.readFile(filepath, function (err,data) {
                var str = data.toString();
                var buf = [];
                buf.push('var result = "" ;');
                var htmlPart = "";
                for(var i = 0,len = str.length;i<len;){
                    if(str.slice(i,i+2)==="<%"){
                        var end = str.indexOf("%>",i);
                        var jsPart = str.slice(i+2,end);
                        i=end+2;
                        buf.push(filterRN(htmlPart));
                        htmlPart = "";
                        if(jsPart.slice(0,1)==="="){
                            buf.push("\r\n result+="+jsPart.slice(1)+";\r\n");
                        }else{
                            buf.push("\r\n"+jsPart+"\r\n");
                        }
                    }
                    else{
                        htmlPart+=str.slice(i,i+1);
                        i+=1;
                    }
                }
                buf.push(filterRN(htmlPart));
                buf.push("return result;");
                viewCache[fn] = new Function("locals",buf.join(""));
            });
        })
    });
    return function (req,res,next) {
        res.view = function (fileName,locals) {
            res.write(viewCache[fileName](locals));

            res.end();
        };
        next();
    }
};
