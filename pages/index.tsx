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
        Content
      </div>
    </div>
  )
}

export default Home
