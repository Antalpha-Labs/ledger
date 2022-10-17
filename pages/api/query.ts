// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { wrappedResponse, Data } from '../../shared/wrappedResponse';
import code from '../../shared/code';
import initAV from '../../shared/leancloud';

initAV();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, start, end } = req.query;

  // res.status(200).json();
}