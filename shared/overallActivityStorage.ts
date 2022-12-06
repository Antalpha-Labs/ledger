import AV from 'leancloud-storage';
import code from './code';

const OverallActivity = AV.Object.extend('OverallActivity');

export async function queryOverallActivityByAddressAndDate(address: string, start: number, end: number){
  const overallActivity = new AV.Query('OverallActivity');
  overallActivity.equalTo('address', address);
  overallActivity.greaterThanOrEqualTo('dateTime', start);
  overallActivity.lessThanOrEqualTo('dateTime', end);
  return await overallActivity.find();
}
