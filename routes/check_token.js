const tokenUtil = require('../util/tokenUtil');
const resultUtil = require('../util/resultUtil');

module.exports = function (req, res, next) {
    try {
        // console.dir(req.headers);
        let token = req.headers['token'];
        if (tokenUtil.check(token) === null) {
            throw '验证失败';
        }
        next();

    } catch (e) {
        res.json(resultUtil.error(500, 'token验证失败!  '+e.message));
    }

}
