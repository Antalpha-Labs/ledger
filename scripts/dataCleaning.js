const dotenv = require('dotenv');
const AV = require('leancloud-storage')

dotenv.config({path: '.env.local'});

const LEANCLOUD_APPID = process.env.LEANCLOUD_APPID;
const LEANCLOUD_APPKEY = process.env.LEANCLOUD_APPKEY;

AV.init({
  appId: LEANCLOUD_APPID,
  appKey: LEANCLOUD_APPKEY
});

/**
 * 以月做维度，提供查询，前端提交的参数为 1-12，由后端组合 start - end (date)，且 type = 1，去做组合查询
 */

/**
 * 以年做维度，提供 type = 1 的 quantity SUM
 */