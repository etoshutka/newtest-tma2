// import { useState, useEffect } from 'react';
// import { Address, TonClient, beginCell } from '@ton/ton';
// import { useTonConnect } from '../useTonConnect';
// import { useTonClient } from '../useTonClient';
// import { Cell } from '@ton/core';

// interface JettonData {
//   balance: bigint | null;
//   owner: Address | null;
//   jettonCode: Cell | null;
//   walletCode: Cell | null;
// }

// async function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function getJettonData(client: TonClient, minterAddress: string): Promise<JettonData> {
//   try {
//     await sleep(1500);
//     console.log('Trying to parse minter address:', minterAddress);
//     const parsedAddress = Address.parse(minterAddress);
//     console.log('Parsed minter address:', parsedAddress.toString());
    
//     const response = await client.runMethod(parsedAddress, "get_wallet_data", []);

//     const balance = response.stack.readBigNumber();
//     const owner = response.stack.readAddress();
//     let jettonCode: Cell | null;
//     try {
//       jettonCode = response.stack.readCell();
//     } catch (error) {
//       jettonCode = null;
//     }
//     const walletCode = response.stack.readCell();

//     return {
//       balance,
//       owner,
//       jettonCode,
//       walletCode
//     };
//   } catch (error) {
//     console.error('Error in getJettonData:', error);
//     throw error;
//   }
// }

// async function calculateJettonWalletAddress(minterAddress: string, ownerAddress: Address): Promise<string> {
//   const client = new TonClient({
//     endpoint: "https://toncenter.com/api/v2/jsonRPC",
//   });
  
//   try {
//     await sleep(1500);
//     console.log('Calculating jetton wallet address for minter:', minterAddress, 'and owner:', ownerAddress.toString());
//     const parsedMinterAddress = Address.parse(minterAddress);
//     console.log('Parsed minter address:', parsedMinterAddress.toString());
    
//     const response = await client.runMethod(parsedMinterAddress, "get_wallet_address", [
//       {
//         type: 'slice',
//         cell: beginCell().storeAddress(ownerAddress).endCell()
//       }
//     ]);
//     const result = response.stack.readAddress().toString();
//     console.log('Calculated jetton wallet address:', result);
//     return result;
//   } catch (error) {
//     console.error('Error in calculateJettonWalletAddress:', error);
//     throw error;
//   }
// }

// export function useJettonBalance(jettonMasterAddress: string) {
//   const [jettonData, setJettonData] = useState<JettonData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { wallet, connected } = useTonConnect();
//   const client = useTonClient();

//   useEffect(() => {
//     async function fetchJettonData() {
//       if (!connected || !wallet || !jettonMasterAddress || !client) {
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         console.log('Fetching jetton data for master address:', jettonMasterAddress);
//         console.log('User wallet address:', wallet);
        
//         const userAddress = Address.parse(wallet);
//         console.log('Parsed user address:', userAddress.toString());
        
//         const userJettonWalletAddress = await calculateJettonWalletAddress(jettonMasterAddress, userAddress);
//         console.log('User jetton wallet address:', userJettonWalletAddress);
        
//         const data = await getJettonData(client, userJettonWalletAddress);
//         setJettonData(data);
//       } catch (err) {
//         console.error('Error fetching jetton data:', err);
//         if (err instanceof Error) {
//           if (err.message.includes('exit code -13')) {
//             setError("Contract method not found. The jetton contract might not be deployed or initialized.");
//           } else if (err.message.includes('unable to calculate jetton wallet address')) {
//             setError("Unable to calculate jetton wallet address. The jetton master contract might be incorrect.");
//           } else {
//             setError(`An error occurred: ${err.message}`);
//           }
//         } else {
//           setError('An unknown error occurred');
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchJettonData();
//   }, [wallet, connected, jettonMasterAddress, client]);

//   return { jettonData, loading, error, isConnected: connected };
// }