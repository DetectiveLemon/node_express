var express = require('express');
let user = require('../oracle/tb_user')
const resultUtil = require('../util/resultUtil');
const tokenUtil = require('../util/tokenUtil');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let token = req.headers['token'];
    let en_id = tokenUtil.getEN_ID(token);
    let r = await user.getUserById(en_id);
    r = r[0];
    delete r['PWD'];
    res.json(resultUtil.success(r));
  }catch (e) {
    res.json(resultUtil.error(500, e));
  }
});

router.post('/login', async function(req, res, next) {
  let params = req.body;
  let r = await user.getUserById(params.id);
  if (r.length===0){
    res.json(resultUtil.error(500, '准考证不存在!'));
  }
  else {
    if (r[0].PWD !== params.pwd){
      res.json(resultUtil.error(500, '密码错误!'));
      return;
    }
    let token = tokenUtil.create(r[0]);
    r = r[0];
    delete r.PWD;
    r.token = token;
    // res.cook
    res.json(resultUtil.success(r));
  }

});

router.post('/status/:status', async function(req, res, next){
  try {
    let token = req.headers['token'];
    let en_id = tokenUtil.getEN_ID(token);
    let status = req.params['status'];
    await user.updateStatus(en_id, status);
    res.json(resultUtil.success());
  }catch (e) {
    res.json(resultUtil.error(500, e));
  }
});

module.exports = router;
