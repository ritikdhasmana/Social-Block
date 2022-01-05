import React, { Component } from 'react';
// import Identicon from 'identicon.js';
import './App.css';
import SocialBlock from '../abis/SocialBlock.json'
import Navbar from './Navbar';
import Main from './Main';

import Web3 from 'web3';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadChainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.send('eth_requestAccounts')[0]
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('No Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadChainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})

    const networkId = await web3.eth.net.getId();
    const networkData = SocialBlock.networks[networkId];
    if(networkData){
      const socialBlock= web3.eth.Contract(SocialBlock.abi,networkData.address);
      this.setState({socialBlock})
      const num_post = await socialBlock.methods.postInd().call()
      this.setState({num_post})

      for(var i=num_post;i>0;i--){
        const post = await socialBlock.methods.posts(i).call()
        this.setState({
          posts : [...this.state.posts, post]
        })
      }
      this.setState({ loading: false})
    }else{
      window.alert('Contract not deployed!');
    }
  }
  

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialBlock.methods.createPost(content).send({ from: this.state.account })
    .on("transactionHash", function () {
      console.log("Hash")
  })
  .on("receipt", function () {
      console.log("Receipt");
      window.location.reload(false);
  })
  .on("confirmation", function () {
      console.log("Confirmed");
      window.location.reload(false);
  })
  .on("error", async function () {
      console.log("Error");
      window.location.reload(false);
  });
  }
  donatePost(id, donationAmount) {
    this.setState({ loading: true })
    this.state.socialBlock.methods.donate(id).send({ from: this.state.account, value: donationAmount })
    .on("transactionHash", function () {
      console.log("Hash")
  })
  .on("receipt", function () {
      console.log("Receipt");
      window.location.reload(false);
  })
  .on("confirmation", function () {
      console.log("Confirmed");
      window.location.reload(false);
  })
  .on("error", async function () {
      console.log("Error");
      window.location.reload(false);
  });
  }
  constructor(props){
    super(props)
    this.state = {
      account : "",
      socialBlock : null,
      num_post :0,
      posts : [],
      loading : true
    }
    this.setState = this.setState.bind(this)
    this.createPost = this.createPost.bind(this)
    this.donatePost = this.donatePost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account ={this.state.account}/>
        {this.state.loading 
        ? <div id="loader" className ="text-center mt-5" ><p>loading! Try refreshing the page if it takes long....</p></div>
        :<Main 
        posts={this.state.posts}
        createPost={this.createPost}
        donatePost = {this.donatePost}
        /> 
        }
      </div>
    );
  }
}

export default App;
