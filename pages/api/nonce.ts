import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { wrappedResponse, Data } from '../../shared/wrappedResponse';
import code from '../../shared/code';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const response = wrappedResponse(code.ok, { nonce });
  res.status(200).json(response);
}