var express = require('express');
var question = require('../oracle/question');
let resultUtil = require('../util/resultUtil');
let check_token = require('./check_token');
var router = express.Router();

router.use(check_token);

/* GET users listing. */
router.get('/:id', async function(req, res, next) {
    let r;
    r = await question.getQuestionById(req.params.id);
    res.json(resultUtil.success(r));
});

router.get('/batch/:n', async function (req, res, next) {
    let r;
    // console.log(req.param.n);
    r = await question.getRandomQuestions(req.params.n);
    res.json(resultUtil.success(r));
});

router.post('/check/:n',async  function (req,res, next) {
    let r;
    console.log(req.body);
    r = await question.checkAnswer(req.body.answer);
    res.json({"score":r});
});

module.exports = router;
