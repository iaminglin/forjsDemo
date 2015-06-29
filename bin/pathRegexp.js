module.exports = pathRegexp;

function pathRegexp(path){
    var paramNames = [];
    path = path.replace(/\? (.*)$/,"")// query 内容，不再解析
        .replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g,"[0-9a-zA-Z\-_]*")//防止.* ,把＊都替换掉
        .replace(/(:(.*?(?=\/)))|(:(.*?(?=$)))/g, function () {
            var len = arguments.length -3;
            for(var i = 0;i<len;i++){
                var avg = arguments[i+1];
                if(typeof avg === "string" && avg[0] !==":"){
                    paramNames.push(avg);
                }
            }
            return "([0-9a-zA-Z\-_]*)"
        })
        .replace(/\/$/g,"")
        .replace(/\//g,"\\/")
    var regexp = new RegExp("^"+path+"\\/?$");
    regexp.paramNames = paramNames;
    return regexp;
}
