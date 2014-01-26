var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = '0XPyut__IqewGS275QmjU1ZiGQuSRxZUrcM4pkRj';
qiniu.conf.SECRET_KEY = '1CBOxFb3j69m8EFv2OIm6kAuztu5_BgFNCISFKzL';

function uptoken(bucketname) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);
    return putPolicy.token();
}

exports.token = function(req, res, next) {
    var uploadToken = uptoken('zhuangbility');
    res.jsonp({
        token: uploadToken
    });
};
