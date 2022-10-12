import ethSigUtil from '@metamask/eth-sig-util';
import { ethers } from 'ethers';

export function verifyEthSign(message: string, sign: string, address: string){
  const msg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
  const recoveredAddr = ethSigUtil.recoverPersonalSignature({
    'data': msg,
    'signature': sign
  });
  return recoveredAddr === address;
}