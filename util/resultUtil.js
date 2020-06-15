let result = {};
const codeSuccess = 1000;

result.success = function (data) {
    return {
        code: codeSuccess,
        msg: 'success!',
        data: data
    };

};

result.error = function (code, msg) {
    return {
        code: code,
        msg: msg,
        data: null
    };

};

module.exports = result;
