import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useEffect } from 'react';

const Home: NextPage = () => {
  useEffect(() => {
    const NEXT_PUBLIC_ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY;
    const NEXT_PUBLIC_TESTHASH = process.env.NEXT_PUBLIC_TESTHASH;
    console.log('NEXT_PUBLIC_ALCHEMY', NEXT_PUBLIC_ALCHEMY);
    const provider = new ethers.providers.AlchemyProvider('arbitrum', NEXT_PUBLIC_ALCHEMY);
    provider.getTransaction(NEXT_PUBLIC_TESTHASH as string).then((res) => {
      console.log(res)
    });
  }, [])
  return (
    <div className="">
      111
    </div>
  )
}

export default Home
