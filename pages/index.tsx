import type { NextPage } from 'next';
import { useState } from 'react';
import { ethers } from 'ethers';
import { query, IQuery } from '../shared/RESTAPIs';
import code from '../shared/code';

let cur = 0;
let itemMax = 0;
let rangeMax = 6;
let group: IQuery[] = [];

const Home: NextPage = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<IQuery[]>([]);
  const [r, setR] = useState(ethers.utils.parseEther('0'));
  const [p, setP] = useState(ethers.utils.parseEther('0'));
  const [s, setS] = useState(ethers.utils.parseEther('0'));

  const inputHandler = (e: any) => {
    setAddress(e.target.value);
  }
  const submitHandler = async () => {
    if(ethers.utils.isAddress(address)){
      group.length = 0;
      let receive = ethers.utils.parseEther('0');
      let payment = ethers.utils.parseEther('0');
      for (let page = 0; page < Number.MAX_SAFE_INTEGER; page++) {
        const result = await query(address.toLocaleLowerCase(), page + 1);
        if (result.data.code === code.ok){
          if (result.data.data.oa.length === 0){
            break;
          }
          result.data.data.oa.forEach((item) => {
            group.push(item);
            if (item.type === 1){
              receive = receive.add(ethers.utils.parseEther(item.quantity));
            }
            if (item.type === 2){
              payment = payment.add(ethers.utils.parseEther(item.quantity));
            }
          });
        }
      }
      setR(receive);
      setP(payment);
      setS(receive.sub(payment));
      itemMax = Math.ceil(group.length/rangeMax);
      setData(group.slice(0, rangeMax));
      cur++;
      console.log(group);
    } else {
      alert('输入正确的地址');
    }
  }
  const preHandler = () => {
    const temp = cur - 2;
    if (temp < 0){
      alert('已经在第一页');
    } else {
      cur--;
      setData(group.slice(temp*rangeMax, cur*rangeMax));
    }
  }
  const nextHandler = () => {
    const temp = cur + 1;
    if (temp > itemMax){
      alert('已经在最后一页');
    } else {
      setData(group.slice(cur * rangeMax, temp * rangeMax));
      cur++;
    }
  }

  return (
    <div>
      <div className="text-3xl mb-5 mt-5">Tales of Elleria</div>
      <div className="flex flex-row items-center">
        <div className="mr-5">
          <select className="select-sm w-full max-w-xs">
            <option value={2022}>2022</option>
          </select>
        </div>
        <div>
          <div className="form-control">
            <div className="input-group">
              <input type="text" value={address} placeholder="Search Address…" className="input input-bordered" onChange={inputHandler}/>
              <button className="btn btn-square" onClick={submitHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div> 
      <div>
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>type</th>
                  <th>total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PAYMENT</td>
                  <td>{ethers.utils.formatEther(p)}</td>
                </tr>
                <tr>
                  <td>RECEIVE</td>
                  <td>{ethers.utils.formatEther(r)}</td>
                </tr>
                <tr>
                  <td>PROFIT</td>
                  <td>{ethers.utils.formatEther(s)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>type</th>
                  <th>txHash</th>
                  <th>quantity</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) => {
                    let typeValue = 'PAYMENT';
                    if (item.type === 1){
                      typeValue = 'RECEIVE';
                    }
                    const url = `https://arbiscan.io/tx/${item.txHash}`;
                    return (
                      <tr key={item.objectId}>
                        <td>{typeValue}</td>
                        <td>
                          <a 
                            target="_blank" 
                            className="link link-info" 
                            href={url} 
                            rel="noreferrer"
                          >
                            {item.txHash}
                          </a>
                        </td>
                        <td>{item.quantity}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-row justify-end mb-6">
          <div className="btn-group grid grid-cols-2">
            <button className="btn btn-outline" onClick={preHandler}>Previous page</button>
            <button className="btn btn-outline" onClick={nextHandler}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
