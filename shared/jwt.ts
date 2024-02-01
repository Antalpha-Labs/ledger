import jwt from 'jsonwebtoken';
import code from './code';

const HMAC_SHA256 = process.env.HMAC_SHA256;

export function createJWTToken(message: string){
  return jwt.sign({data: message}, HMAC_SHA256, { expiresIn: '10h' });
}

export function getJWTTokenContent(token: string){
  return new Promise((resolve, reject) => {
    jwt.verify(token, HMAC_SHA256, function(err, decoded){
      if (err){
        if (err.name === 'TokenExpiredError'){
          resolve({
            code: code.expired
          });
          return;
        }
        resolve({
          code: code.error
        })
      } else {
        resolve({
          code: code.ok
        });
      }
    });
  })
}
