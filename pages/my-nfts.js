import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Link from 'next/link' //linking to other pages

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() // we need to know who the msg.sender is

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await marketplaceContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  function listNFT(nft) {
    //console.log('nft:', nft)
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (loadingState === 'loaded' && !nfts.length) return (
    <div>
      <h1 className="py-10 px-20 font-bold text-2xl text-white">No NFTs Owned :(</h1>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Link href="/">
        <a className="font-semibold text-center text-3xl px-3 py-2 rounded text-white hover:text-lime-600">
          <div className='underline underline-offset-4'>Buy NFTs</div>
        </a>
      </Link>
      
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
    </div>
  )

  return (
    <div className="bg-black h-full">
    <br></br>
        <div className='text-white text-center text-3xl'> My NFT Collection</div>
    <br></br>
    <div className="flex justify-center bg-black h-full">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-1xl font-bold text-white ">Price - {nft.price} MATIC</p>
                  <button className="mt-4 w-full bg-blue-400 text-white text-lg font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  )
}