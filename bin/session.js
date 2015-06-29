

var cache = {};
var sid = Date.now();

module.exports = function(req,res,next) {

    Object.defineProperty(req, "session", {
        get: function () {
            return cache[this.sessionId]||(cache[this.sessionId] = {});
        },
        set: function (value) {
            cache[this.sessionId] = value;
        }
    });
    if (!(req.headers.cookie && (req.sessionId = parse(req.headers.cookie).Session))) {
        req.sessionId = sid+=1;
        res.setHeader("Set-Cookie", ["Session=" + req.sessionId]);
    }

    next();
}
function parse(str){
    var arr = str.split(";");
    var obj = {};
    arr.forEach(function(filed){
        var o=filed.split("=");
        obj[o[0]] = o[1];

    })
    return obj;
}

