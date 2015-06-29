var types = []
var articles = require('./articles')
var fs = require('fs');

try{
    var data = fs.readFileSync("types.db");
    types = JSON.parse(data.toString()).types;
}catch(e){}

types.create = function(title){
    var type ={
        id:"ID-"+Date.now(),
        title:title
    }
    types.unshift(type);
}

types.del = function (id) {
    var index = this.getIndex(id);
    if(index!==null && !articles.has(id)){
        this.splice(index,1);
    }
}

types.getIndex = function (id) {
    var self = this;
    var index = null;
    this.forEach(function (type,idex) {
        if(type.id === id){
            index = idex;
        }
    })
    return index;
}

types.get = function (id) {
    var index = this.getIndex(id);
    if(index!==null){
        return this[index];
    }else{
        return null;
    }
}

types.update = function (title,id) {
    var index = this.getIndex(id);
    if(index!==null && typeof title == "string"){
        var type = this[index];
        type.title = title;
    }
}

function save(){
    fs.writeFile('types.db',JSON.stringify({types:types}));
}
setInterval(save,1000*10);
module.exports = types;
