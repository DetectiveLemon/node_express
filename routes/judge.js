var express = require('express');
var question = require('../oracle/question');
let resultUtil = require('../util/resultUtil');
let check_token = require('./check_token');
var router = express.Router();

router.use(check_token);

router.post('/', async function(req, res, next) {
    let arr = req.body['data'];
    let r;
    r = await question.checkAnswer(arr);
    res.json(resultUtil.success(r));
});

module.exports = router;
