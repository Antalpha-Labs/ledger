import type { NextApiRequest, NextApiResponse } from 'next';
import code from '../../shared/code';
import initAV from '../../shared/leancloud';
import * as user from '../../shared/userStorage';
import { verifyEthSign } from '../../shared/eth';
import { wrappedResponse, Data } from '../../shared/wrappedResponse';
import * as jwt from '../../shared/jwt';

initAV();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === 'POST'){
    const { message, address, sign } = req.body;
    const verifyResult = verifyEthSign(message, address, sign);
    if (!verifyResult){
      const response = wrappedResponse(code.verifySignError, {});
      res.status(200).send(response);
      return;
    }

    const queryOwner = await user.queryUserByAddress(address);
    if (!queryOwner){
      const createCode = await user.create({
        address
      });
      if (createCode !== code.ok){
        const response = wrappedResponse(code.error, {});
        res.status(200).send(response);
        return;
      }
    }

    const authorizeToken = jwt.createJWTToken(message);
    const response = wrappedResponse(code.ok, { authorizeToken });
    res.status(200).send(response);
  }
}