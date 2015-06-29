module.exports = function (req, res, next) {
    res.download = function (filename,buf) {
        if(Buffer.isBuffer(buf)){
            res.writeHead(200,{
                'content-disposition':'attachment filename='+filename,
                'content-type':'application/octet-stream',
                'content-length':buf.length
            });
            res.write(buf);
            res.end();
        }else{
            res.end();
        }
    };
    next();
};
