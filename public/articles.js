
var fs = require('fs');

var articles = [];

try{
    var data = fs.readFileSync("articles.db")
    articles = JSON.parse(data.toString()).articles;
}catch(e){}

articles.create = function(data){
    var art = {
        createTime:Date.now(),
        updateTime:Date.now(),
        id:"ID-"+Date.now(),
        typeId:data.type,
        img:data.img?data.img.toString("base64"):"",
        title:data.title,
        content:data.content
    }
    articles.unshift(art);
}

articles.del = function (id) {
    var index= this.getIndex(id);
    if(index!==null){
        this.splice(index,1)
    }
}

articles.getIndex = function (id) {
    var self = this;
    var index = null;
    this.forEach(function (art,idex) {
        if(art.id===id){
            index = idex;
        }
    })
    return index;
}

articles.findByType = function (type) {
    var self = this;
    var rs = [];
    this.forEach(function (art) {
        if(art.typeId ===type){
            rs.push(art)
        }
    })
    return rs;
}

articles.has = function (type) {
    var self = this;
    var bool = false;
    try{
        this.forEach(function (art) {
            if(art.typeId == type){
                bool = true;
                throw new Error();
            }
        })
    }catch(e){}
    return bool;
}

articles.get = function (id) {
    var index = this.getIndex(id);
    if(index!==null){
        return this[index];
    }else{
        return null;
    }
}

articles.update = function(data,id){
    var index = this.getIndex(id);
    if(index!==null){
        var art = this[index];
        art.title = data.title;
        art.img = data.img?data.img.toString("base64"):"";
        art.content = data.content;
        art.typeId = data.type;
        art.updateTime  = Date.now();
    }
}

function save(){
    fs.writeFile("articles.db",JSON.stringify({articles:articles}))
}

setInterval(save,1000*10);
module.exports = articles;
