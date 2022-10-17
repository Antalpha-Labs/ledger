import AV from 'leancloud-storage';

const LEANCLOUD_APPID = process.env.LEANCLOUD_APPID as string;
const LEANCLOUD_APPKEY = process.env.LEANCLOUD_APPKEY as string;

function initAV(){
  AV.init({
    appId: LEANCLOUD_APPID,
    appKey: LEANCLOUD_APPKEY
  });
}

export default initAV;