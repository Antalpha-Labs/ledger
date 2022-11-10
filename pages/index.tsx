import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useEffect } from 'react';


const Home: NextPage = (props) => {
  useEffect(() => {
    const NEXT_PUBLIC_ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY as string;
    // console.log('NEXT_PUBLIC_ALCHEMY', NEXT_PUBLIC_ALCHEMY);
    const provider = new ethers.providers.AlchemyProvider('arbitrum', NEXT_PUBLIC_ALCHEMY);
    console.log(provider)
    // provider.getTransaction(NEXT_PUBLIC_TESTHASH as string).then((res) => {
    //   console.log(res)
    // });
  }, [])
  return (
    <div>
      <div className="text-3xl mb-5 mt-5">Tales of Elleria</div>
      <div className="flex flex-row items-center">
        <div className="mr-5">
          <select className="select-sm w-full max-w-xs">
            <option selected>2022</option>
          </select>
        </div>
        <div>
          <div className="form-control">
            <div className="input-group">
              <input type="text" placeholder="Search Address…" className="input input-bordered" />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div> 
      <div>
        <div className="mb-6 text-2xl">
          Data Statistical 
        </div>
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
                  <td>3</td>
                </tr>
                <tr>
                  <td>RECEIVE</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>SHOW</td>
                  <td>-1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <div className="tabs">
            <a className="tab tab-lifted tab-active">1M</a> 
            <a className="tab tab-lifted">2M</a> 
            <a className="tab tab-lifted">3M</a>
            <a className="tab tab-lifted">4M</a> 
            <a className="tab tab-lifted">5M</a>
            <a className="tab tab-lifted">6M</a> 
            <a className="tab tab-lifted">7M</a>
            <a className="tab tab-lifted">8M</a> 
            <a className="tab tab-lifted">9M</a>
            <a className="tab tab-lifted">10M</a> 
            <a className="tab tab-lifted">11M</a>
            <a className="tab tab-lifted">12M</a>
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
                <tr>
                  <td>PAYMENT</td>
                  <td>
                    <a 
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>PAYMENT</td>
                  <td>
                    <a
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>22.099</td>
                </tr>
                <tr>
                  <td>RECEIVE</td>
                  <td>
                    <a
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>332.22</td>
                </tr>
                <tr>
                  <td>PAYMENT</td>
                  <td>
                    <a
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>22.099</td>
                </tr>
                <tr>
                  <td>RECEIVE</td>
                  <td>
                    <a
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>332.22</td>
                </tr>
                <tr>
                  <td>PAYMENT</td>
                  <td>
                    <a
                      target="_blank" 
                      className="link link-info" 
                      href="https://arbiscan.io/tx/0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3" 
                      rel="noreferrer"
                    >
                      0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3
                    </a>
                  </td>
                  <td>22.099</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-row justify-end mb-6">
          <div className="btn-group grid grid-cols-2">
            <button className="btn btn-outline">Previous page</button>
            <button className="btn btn-outline">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
