/* test/sample-test.js, testing of the contract, using hardhat */

describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace") 
    // get a reference to that contract
     
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed() // Market is now deployed

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString() //listingPrice needs to be a string

    const auctionPrice = ethers.utils.parseUnits('1', 'ether') // create a value for the auction price, ethers.utils.parseUnits allows us to work with whole units rather than wei

    /* create two tokens and list them on the actual market */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners() 
    // using ethers library to get some test accounts, it returns an array, destructuring is done. we will be working with the very first item in that array.  by using underscore to ignore the address bcz we dont want buyer and seller should be different

    /* execute sale of token to another user, by the buyer */
    await nftMarketplace.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    /* resell a token */
    await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems() 
    items = await Promise.all(items.map(async i => { // we have done asynchronous mapping here
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(), // price comes out to be 1 eth, expressed in wei
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items) // printing the list of items
  })
}) 