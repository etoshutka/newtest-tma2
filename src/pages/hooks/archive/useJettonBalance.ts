// import { useState, useEffect } from 'react';
// import { useTonConnect } from '../useTonConnect';
// import { useTonClient } from '../useTonClient';
// import { Address } from '@ton/core';
// import { getJettonData, calculateJettonWalletAddress } from './getJettonData';

// const MINTER_ADDRESS = "EQA3LxaRQBzZ_QzPsx16EAJ_AchJl0wt4r33Jf0NBofSmOY8";

// export function useJettonBalance() {
//   const { wallet } = useTonConnect();
//   const  client  = useTonClient();
//   const [balance, setBalance] = useState<bigint | null>(null);

//   useEffect(() => {
//     async function fetchBalance() {
//       if (wallet && client) {
//         try {
//           const ownerAddress = Address.parse(wallet);
//           const jettonWalletAddress = await calculateJettonWalletAddress(MINTER_ADDRESS, ownerAddress);
//           const jettonData = await getJettonData(jettonWalletAddress);
//           setBalance(jettonData.balance);
//         } catch (error) {
//           console.error("Error fetching jetton balance:", error);
//         }
//       }
//     }

//     fetchBalance();
//   }, [wallet, client]);

//   return balance;
// }