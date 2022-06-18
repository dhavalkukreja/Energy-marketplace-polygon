// used for layout and navigation and linking to other pages

/* pages/_app.js */
import '../styles/globals.css'
import Image from 'next/image'
import Link from 'next/link' //linking to other pages
import { urlSource } from 'ipfs-http-client'

function MyApp({ Component, pageProps }) {
  return (
    <div>
    <div className='sticky top-0 left-0 right-0'> 
      <nav className="flex items-center bg-white p-3 flex-wrap">
        <span className="text-3xl font-bold text-lime-600">NFT</span>
        <span className="text-3xl font-bold text-white">-</span>
        <span className="text-3xl font-bold text-black">Marketplace</span>
          <div
            className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto text-lime-500"
          >
            <Link href="/">
              <a className="lg:inline-flex font-semibold lg:w-auto w-full px-3 py-2 rounded text-black items-center justify-center hover:bg-black hover:text-lime-500">
                <span>Home</span>
              </a>
            </Link>
            
            <Link href="/create-nft">
              <a className="lg:inline-flex font-semibold lg:w-auto w-full px-3 py-2 rounded text-black items-center justify-center hover:bg-black hover:text-lime-500">
                <span>Sell NFT</span>
              </a>
            </Link>
            
            <Link href="/my-nfts">
              <a className="lg:inline-flex font-semibold lg:w-auto w-full px-3 py-2 rounded text-black items-center justify-center hover:bg-black hover:text-lime-500">
                <span>My NFTs</span>
              </a>
            </Link>
            
            <Link href="/dashboard">
              <a className="lg:inline-flex font-semibold lg:w-auto w-full px-3 py-2 rounded text-black items-center justify-center hover:bg-black hover:text-lime-500">
                <span>Dashboard</span>
              </a>
            </Link>
          </div>
      </nav>
    </div>
      <div className='bg-black ' >
        <img className="h-60 w-screen" src="/NFTbanner.png" alt="" />
      </div>
    
      <div className='bg-black '>
       <Component {...pageProps} />
      </div>
      <div className='sticky bottom-0 left-0 right-0 flex-wrap font-semibold bg-white text-center'>
        Built by :- 
      <Link href="https://www.linkedin.com/in/dhaval-kukreja/">
              <a className="lg:inline-flex font-semibold lg:w-auto w-full px-3 py-2 rounded justify-center hover:bg-black hover:text-lime-300">
                <span>https://www.linkedin.com/in/dhaval-kukreja/</span>
              </a>
           </Link>
          <span className = "text-right text-blue-600">Deployed on Matic Mumbai testnet</span>  
      </div>
    </div>
  )
}

export default MyApp




