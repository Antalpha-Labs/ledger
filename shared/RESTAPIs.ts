import axios, { AxiosPromise } from 'axios';

interface Response<T>{
  code: number;
  data: T;
}

interface VerifyResult{
  authorizeToken: string;
}

export function postVerify(message: string, sign: string, address: string): AxiosPromise<Response<VerifyResult>>{
  return axios({
    method: 'post',
    url: '/api/verify',
    data: {
      message,
      sign,
      address
    }
  });
}

interface INonce{
  nonce: string;
}

export function getNonce(): AxiosPromise<Response<INonce>>{
  return axios({
    method: 'get',
    url: '/api/nonce'
  });
}