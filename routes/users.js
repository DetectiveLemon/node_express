var express = require('express');
let user = require('../oracle/tb_user')
const resultUtil = require('../util/resultUtil');
const tokenUtil = require('../util/tokenUtil');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

module.exports = router;
