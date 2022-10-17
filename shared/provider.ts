import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

export function getWeb3Provider(){
  let web3Provider = window.web3Provider;
  if (!web3Provider){
    web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    window.web3Provider = web3Provider;
  }
  return web3Provider;
}

export function getSigner(){
  const web3Provider = getWeb3Provider();
  const signner = web3Provider.getSigner();
  return signner;
}

export function useAddress(){
  const [address, setAddress] = useState('');
  useEffect(() => {
    if (!address){
      const web3Provider = getWeb3Provider();
      const selectedAddress = web3Provider.provider.selectedAddress;
      if (!selectedAddress){
        web3Provider.provider.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
          const account = accounts[0];
          setAddress(account);
        });
      } else {
        setAddress(selectedAddress);
      }
    }
  }, [address]);
  return address.toLocaleLowerCase();
}