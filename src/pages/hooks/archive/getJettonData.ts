// import { Address, Cell} from '@ton/core';
// import { sleep, NetworkProvider } from '@ton/blueprint'; 
// import { TonClient, TupleItemSlice, beginCell } from '@ton/ton';
// import { JettonWallet } from '@/wrappers/JettonWallet';

// const CONTRACT_ADDRESS: string = ""; // Адрес основного контракта

// export async function calculateJettonWalletAddress(minterAddress: string, ownerAddress: Address): Promise<string> {

//     const client = new TonClient({
//         endpoint: "https://toncenter.com/api/v2/jsonRPC",
//     });
    
//     await sleep(1500);
//     const response = await client.runMethod(Address.parse(minterAddress), "get_wallet_address", [
//         {
//             type: 'slice',
//             cell: 
//                 beginCell()
//                     .storeAddress(ownerAddress)
//                 .endCell()
//         } as TupleItemSlice
//     ])
//     return response.stack.readAddress().toString();

// }

// export async function getJettonData(minterAddress: string): Promise<{ 
//     balance: bigint, 
//     owner: Address, 
//     jettonCode: Cell | null, 
//     walletCode: Cell 
// }> {
//     const client = new TonClient({
//         endpoint: "https://toncenter.com/api/v2/jsonRPC",
//     });

//     await sleep(1500);
//     const response = await client.runMethod(Address.parse(minterAddress), "get_wallet_data", []);

//     const balance = response.stack.readBigNumber();
//     const owner = response.stack.readAddress();
//     let jettonCode: Cell | null;
//     try {
//         jettonCode = response.stack.readCell();
//     } catch (error) {
//         jettonCode = null;
//     }
//     const walletCode = response.stack.readCell();

//     return {
//         balance,
//         owner,
//         jettonCode,
//         walletCode
//     };
// }

// async function process(
//     provider: NetworkProvider, 
//     walletAddress: string,
//     contractAddress: string
// ) {
    
//     const walletData = await getJettonData(walletAddress);
//     console.log(`wallet balance: ${walletData.balance}`);

//     const airdrop = provider.open(
//         JettonWallet.createFromAddress(Address.parse(contractAddress))
//     );

    
//     try {
//         await airdrop.getWalletData(
//         );
//         console.log(`balance: ${walletData.balance}`);

//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export async function run(provider: NetworkProvider) {
//     const walletAddress = "EQBwjm6izfuM3jkVvPnT2Bwq76vzIITF3FL3BCVKocVTdPwy"; // ЖЕТОН ВОЛЕТ КОНТРАКТА
    
//     try {
//         await process(provider, walletAddress, CONTRACT_ADDRESS);
//         console.log("Успех");
//     } catch (error) {
//         console.error("Боль:", error);
//     }
// }