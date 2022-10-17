import AV from 'leancloud-storage';
import code from './code';

const LUser = AV.Object.extend('LUser');

export interface User{
  address: string;
}

export async function create(user: User){
  const lUser = new LUser();
  lUser.set('address', user.address);
  try {
    const ob = await lUser.save();
    if (ob){
      return code.ok;
    } else {
      return code.error;
    }
  } catch(e){
    throw e;
  }
}

export async function queryUserByAddress(address: string){
  const lUserQuery = new AV.Query('LUser');
  lUserQuery.equalTo('address', address);
  try {
    const users = await lUserQuery.find();
    const user = users[0];
    if (user){
      return user;
    } else {
      return false;
    }
  } catch(e){
    throw e;
  }
}