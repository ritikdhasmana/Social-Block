const { default: Web3 } = require('web3')

const SocialBlock = artifacts.require('./SocialBlock.sol')

require('chai') .use(require('chai-as-promised'))
  .should()

contract('SocialBlock', ([deployer ,author, viewer]) => {
  let socialBlock

  before(async () => {
    socialBlock = await SocialBlock.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await socialBlock.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('post test', async () => {
    let postcheck, postInd;

    before(async () => {
      postcheck = await socialBlock.createPost("Test Post", {from : author});
      postInd = await socialBlock.postInd()
    })

    it('creates posts', async () => {
      
      assert.equal(postInd, 1)
      const event = postcheck.logs[0].args
      assert.equal(event.id.toNumber(), postInd.toNumber(), 'id is correct')
      assert.equal(event.content, 'Test Post', 'content is correct')
      assert.equal(event.donations, '0','donations amount is correct')
      assert.equal(event.author, author, 'author is correct')

      //contentless post
      await socialBlock.createPost("Tes", {from : author}).should.eventually.be.rejected;
    })

    it('lists posts', async () => {
      const  post = await socialBlock.posts(postInd);
      assert.equal(post.id.toNumber(), postInd.toNumber(), 'id is correct')
      assert.equal(post.content, 'Test Post', 'content is correct')
      assert.equal(post.donations, '0','donations amount is correct')
      assert.equal(post.author, author, 'author is correct')
    })

    it('allows users to donate to posts', async () => {
      // / Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
      postcheck = await socialBlock.donate(postInd, {from : viewer, value : web3.utils.toWei('1','Ether')});
      
      
      // SUCESS
      const event = postcheck.logs[0].args
      assert.equal(event.id.toNumber(), postInd.toNumber(), 'id is correct')
      assert.equal(event.content, 'Test Post', 'content is correct')
      assert.equal(event.donations, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)

      const exepectedBalance = oldAuthorBalance.add(tipAmount)

      assert.equal(newAuthorBalance.toString(), exepectedBalance.toString())

      // FAILURE: Tries to tip a post that does not exist
      await socialBlock.donate(99, { from: viewer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })

  })
})
