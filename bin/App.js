var http = require('http');
module.exports = App;

function App(){
    var self = this;
    this._getHandle = null;
    this._postHandle = null;
    var middleList = this._middleList = [];
    this._server = http.createServer(function(req,res){
        if(middleList.length===0){

        }else{
            var middleIndex =0;
            execMiddle();
            function next(){
                middleIndex+=1;
                execMiddle();
            }

        }

        function execMiddle(){
            var middle = middleList[middleIndex];
            if(middle)
                middle(req,res,next);
            else{
                switch (req.method){
                    case "GET":
                        if(self._getHandle){
                            self._getHandle(req,res);
                        }
                        break;
                    case "POST":
                        if(self._postHandle){
                            self._postHandle(req,res);
                        }
                        break;
                }
            }
        }
    });
}
App.prototype.use = function(middle){
    this._middleList.push(middle);
}
App.prototype.listen = function(){
    this._server.listen.apply(this._server,arguments);
}

App.prototype.get = function (gethandle) {
    this._getHandle = gethandle;
}

App.prototype.post = function(posthandle){
    this._postHandle = posthandle;
}