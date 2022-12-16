// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import AV from 'leancloud-storage';
import { wrappedResponse, Data } from '../../shared/wrappedResponse';
import code from '../../shared/code';
import initAV from '../../shared/leancloud';

initAV();

const OverallActivity = AV.Object.extend('OverallActivity');
const limit = 500;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, page, y } = req.query;
  const overallActivity = new AV.Query('OverallActivity');
  overallActivity.limit(limit);
  overallActivity.skip((Number(page) - 1) * limit);
  overallActivity.equalTo('address', address);
  overallActivity.greaterThanOrEqualTo('dateTime', new Date(`${y}-01-01 00:00:00`));
  overallActivity.lessThan('dateTime', new Date(`${Number(y) + 1}-01-01 00:00:00`));
  const data = await overallActivity.find();
  res.status(200).json(wrappedResponse(code.ok, { oa: data.map((value) => {
    return {
      id: value.get('objectId'),
      address: value.get('address'),
      blockno: value.get('blockno'),
      dateTime: value.get('dateTime'),
      txHash: value.get('txHash'),
      quantity: value.get('quantity'),
      type: value.get('type'),
      unixTimestamp: value.get('unixTimestamp')
    }
  })}));
}