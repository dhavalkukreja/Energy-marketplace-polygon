/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react' 
// hooks - useState - keep up with local states, useEffect - invoke a function when a component loads
import axios from 'axios' // data fetching library
import Web3Modal from 'web3modal' // medium to connect to eth/matic wallet

import {
  marketplaceAddress
} from '../config'

// json representation of our smart contracts and it allows us to interact with the front end
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  // when app loads we dont have nfts, then we call the sc, we will fetch that array and update the local state

  const [loadingState, setLoadingState] = useState('not-loaded')
  // we can show or hide our UI

  useEffect(() => {
    loadNFTs()
  }, [])

  // we want loadNFTs to load automatically when app loads, so we used useEffect hook
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items, we will work with ethers.providers */

///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // this will be used to deploy on local network
    //const provider = new ethers.providers.JsonRpcProvider() 


    // this will be used to deploy on matic mumbai network
    //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/994ab600d3a94aba9a0c1310b744a0e5")

////////////////////////////////////////////////////////////////////////////////////////////////////

    // used a very generic provider since we really dont want to know much about the provider
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()
    // we are going to fetch the market items and then we need yo map over the market items and we want to map the token uri by interacting with the token uri ----------------- this will return the array for line 122 of NFT marketplace.sol 

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri) // while working with IPFS, we'll be uploading a json representation of this NFT, which will hold different information
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction usinf wallet, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() // signing the tx
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer) // we now pass signer as the third arguement

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price // this amount of money will be deducted from user's wallrt to another user's wallet
    })
    await transaction.wait() // wait bcz we will now remove that NFT and relaod the remaining NFTs
    loadNFTs() // we will gey 1 NFT less
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  // !nfts.length means that array is empty


  // now setting the UI
  return (
   
    <div className="flex justify-center">   
      <div className="px-3" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-2">
                <p style={{ height: '14px' }} className="text-1xl  text-center font-semibold text-white">{nft.name}</p>
                  <div style={{ height: '20px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-3 bg-black">
                  <p className="text-1xl font-bold text-white">{nft.price} MATIC</p>
                  <button className="mt-4 w-full bg-lime-600 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                  
                </div>
              </div>
            ))
          }
        </div>
        <br></br>
      <br></br>
      <br></br>
      </div>
      
      </div>

  )
}