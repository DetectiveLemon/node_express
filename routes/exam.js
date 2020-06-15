const express = require('express');
const resultUtil = require('../util/resultUtil');
const tokenUtil = require('../util/tokenUtil');
const tb_exam = require('../oracle/tb_exam')
const question = require('../oracle/question');
const tb_exam_qu = require('../oracle/tb_exam_qu');
let check_token = require('./check_token');
const router = express.Router();

router.use(check_token);

router.get('/*', async function(req, res, next) {
    // console.log(111);
    await tb_exam.check();
    next();
});

router.get('/', async function(req, res, next) {
    try {
        let token = req.headers['token'];
        let en_id = tokenUtil.getEN_ID(token);
        let r = await tb_exam.getAllByEnId(en_id);
        res.send(resultUtil.success(r));
    }catch (e) {
        console.error(e);
        res.send(resultUtil.error(500, e.message));
    }

});

router.get('/:exam_id', async function(req, res, next) {
    try {
        let exam_id = req.params['exam_id'];
        let r = await tb_exam.getById(exam_id);
        r = r[0];
        r['questions'] = await tb_exam_qu.getAllByExamId(exam_id)
        res.send(resultUtil.success(r));
    }catch (e) {
        console.error(e);
        res.send(resultUtil.error(500, e.message));
    }

});

router.post('/create', async function(req, res, next) {
    try {
        let params = req.body;
        let token = req.headers['token'];
        let en_id = tokenUtil.getEN_ID(token);
        let info = params['info'] || '科目一考试';
        let hours = params['hours'] || 1;
        let exam_id = await tb_exam.create(en_id, info, hours);
        let r = {
            exam_id: exam_id
        };
        let arr_qu = await question.getRandomQuestions(10);
        await tb_exam_qu.create(exam_id, arr_qu);
        res.send(resultUtil.success(r));
    }catch (e) {
        console.error(e);
        res.send(resultUtil.error(500, e.message));
    }

});

router.post('/submit', async function (req, res, next) {
    try {
        let params = req.body;
        let arr = req.body['data'];
        let exam_id = params['exam_id'];
        for (let qu of arr){
            qu['exam_id'] = exam_id;
        }
        await tb_exam_qu.setAnswer(arr);
        let r = await tb_exam.getById(exam_id);
        r = r[0];
        r['questions'] = await tb_exam_qu.getAllByExamId(exam_id)
        res.send(resultUtil.success(r));
    }catch (e) {
        console.error(e);
        res.send(resultUtil.error(500, e.message));
    }

})

router.post('/finish', async function (req, res, next) {
    try {
        let params = req.body;
        let exam_id = params['exam_id'];
        let score = await tb_exam_qu.calcScore(exam_id);
        await tb_exam_qu.setSubmit(exam_id);
        await tb_exam.finish(exam_id, score);
        let r = await tb_exam.getById(exam_id);
        r = r[0];
        r['questions'] = await tb_exam_qu.getAllByExamId(exam_id);
        res.send(resultUtil.success(r));
    }catch (e) {
        console.error(e);
        res.send(resultUtil.error(500, e.message));
    }

})

module.exports = router;
