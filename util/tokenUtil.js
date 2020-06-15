const jwt = require('jsonwebtoken');
const secret = 'DetectiveLemon';

let tokenUtil = {};

tokenUtil.create = function (payload) {
    return jwt.sign(payload, secret);

}

tokenUtil.check = function (token) {
    try{
        return jwt.verify(token, secret);
    }catch (e) {
        return null;
    }

}

tokenUtil.getEN_ID = function(token){
    return jwt.verify(token, secret)['EN_ID'];
}

module.exports = tokenUtil;
