/**
 * Created by LIN on 15/6/21.
 */
module.exports = function (req,res,next) {
    console.log("module2");
    next();
}