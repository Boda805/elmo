import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import Header from './Header';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Transfer from "./Transfer"

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import ERC20Artifact from "../contracts/ERC20.json";
import contractAddress from "../contracts/contract-address.json";
import { NETWORKS } from "../constants.js";

const HARDHAT_NETWORK_ID = '1337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const targetNetwork = NETWORKS['kovan'];

const App = () => {
    const [route, setRoute] = useState();
    const [address, setAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [balance, setBalance] = useState();
    const [txBeingSent, setTxBeingSent] = useState();
    const [transactionError, setTransactionError] = useState();
    const [networkError, setNetworkError] = useState();

    //Web3Provider works for transactions but not JsonRpcProvider    
    //const _provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl);
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const _token = new ethers.Contract(
      contractAddress.ERC20,
      ERC20Artifact.abi,
      _provider
    );

    
    // const _checkNetwork = ()=>  {
    //   if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
    //     return true;
    //   }
    //   setNetworkError('Please connect Metamask to Localhost:8545')
    //   return false;
    // }
    
    
    const _connectWallet = async (t) => {
      const [selectedAddress] = await window.ethereum.enable();

      // if (!_checkNetwork()) {
      //   return;
      // }
  
      _initialize(selectedAddress);

      // *Needs to be updated to fit*
      // // We reinitialize it whenever the user changes their account.
      // window.ethereum.on("accountsChanged", ([newAddress]) => {
      //   // `accountsChanged` event can be triggered with an undefined newAddress.
      //   // This happens when the user removes the Dapp from the "Connected
      //   // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      //   // To avoid errors, we reset the dapp state 
      //   if (newAddress === undefined) {
      //     return this._resetState();
      //   }
        
      //   this._initialize(newAddress);
      // });
      
      // // We reset the dapp state if the network is changed
      // window.ethereum.on("networkChanged", ([networkId]) => {
      //   this._resetState();
      // });
    }
  
    const _initialize = (userAddress) => {
      setAddress(userAddress);
    }

    const _transferTokens = async (to, amount) => {

      try {
 
        setTransactionError(undefined);

        const signedToken = _token.connect(_provider.getSigner(address));
        console.log(signedToken);
        const tx = await signedToken.transfer(to, amount);
        setTxBeingSent(tx.hash);
        console.log(txBeingSent);
        const receipt = await tx.wait();
  
        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }
  
      } catch (error) {

        if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
          return;
        }

        console.error(error);
        setTransactionError(error);
      } finally {
        setTxBeingSent(undefined);
      }
    }
    
    //How do I get this to work..
    // const _tokenBalance = () => {
    //   const balance = _token.balanceOf(address)
    //   setBalance(balance);
    // }

    useEffect(() => {
      setRoute(window.location.pathname)
    }, [setRoute]);

  
    return (
      <div className="Main">
        <Header address={address} connectWallet={_connectWallet}/> 
        <BrowserRouter>
          <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="/">
              <Link onClick={()=>{setRoute("/")}} to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/transfer">
              <Link onClick={()=>{setRoute("/transfer")}} to="/transfer">Transfer</Link>
            </Menu.Item>
            <Menu.Item key="/bridge">
              <Link onClick={()=>{setRoute("/bridge")}} to="/bridge">Bridge</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path="/"></Route>
  
            <Route exact path="/transfer"><Transfer 
                                             transfer={_transferTokens}
                                             //tokenBalance={_tokenBalance}
                                          />
            </Route>
  
            <Route exact path="/bridge"></Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  export default App;