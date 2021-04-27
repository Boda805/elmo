import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import Header from './Header';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Development from "./Development"
import { ConnectWallet } from "./ConnectWallet";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import ExperimentArtifact from "../contracts/Experiments.json";
import contractAddress from "../contracts/contract-address.json";
import { NETWORKS } from "../constants.js";
import { useUserAddress } from "eth-hooks";

const HARDHAT_NETWORK_ID = '1337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const targetNetwork = NETWORKS['localhost'];

const App = () => {
    const [route, setRoute] = useState();
    const [address, setAddress] = useState();
    const [token, setToken] = useState();
    const [tokenName, setTokenName] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();
    const [balance, setBalance] = useState();
    const [owner, setOwner] = useState();
    const [txBeingSent, setTxBeingSent] = useState();
    const [transactionError, setTransactionError] = useState();
    const [networkError, setNetworkError] = useState();

    // We first initialize ethers by creating a provider using window.ethereum
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    //const _provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl);

    
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const _token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      _provider
    );


    const _checkNetwork = ()=>  {
      if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
        return true;
      }
  
      setNetworkError('Please connect Metamask to Localhost:8545')
      
      return false;
    }

    // const sign = _token.connect(_provider.getSigner(0));
    // const tx = await sign.transfer("0x8A4F0832F661DB078A535AC0E427C41F1BD90820", 3);
    // const receipt = await tx.wait();
    
    // console.log(sign);
    
    useEffect(() => {
        const fetch = async () => {
        const _tokenName = await _token.name();
        const _tokenSymbol = await _token.symbol();
        setTokenName(_tokenName);
        setTokenSymbol(_tokenSymbol);
      }
      fetch();
    }, []);

    
    const _connectWallet = async (t) => {
      // This method is run when the user clicks the Connect. It connects the
      // dapp to the user's wallet, and initializes it.
  
      // To connect to the user's wallet, we have to run this method.
      // It returns a promise that will resolve to the user's address.
      const [selectedAddress] = await window.ethereum.enable();
  
      // Once we have the address, we can initialize the application.
  
      // First we check the network
      if (!_checkNetwork()) {
        return;
      }
  
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
      // This method initializes the dapp
      // We first store the user's address in the component's state
      setAddress(userAddress);
    }

    const _transferTokens = async (to, amount) => {

      try {
 
        setTransactionError(undefined);
        
        const signedToken = _token.connect(_provider.getSigner(address));

        // We send the transaction, and save its hash in the Dapp's state. This
        // way we can indicate that we are waiting for it to be mined.
        const tx = await signedToken.transfer(to, amount);
        setTxBeingSent(tx.hash);
  
        // We use .wait() to wait for the transaction to be mined. This method
        // returns the transaction's receipt.
        const receipt = await tx.wait();
  
        // // The receipt, contains a status flag, which is 0 to indicate an error.
        if (receipt.status === 0) {
        //   // We can't know the exact error that make the transaction fail once it
        //   // was mined, so we throw this generic one.
          throw new Error("Transaction failed");
        }
  
        // If we got here, the transaction was successful, so you may want to
        // update your state. Here, we update the user's balance.
        //await this._updateBalance();
      } catch (error) {
        // We check the error code to see if this error was produced because the
        // user rejected a tx. If that's the case, we do nothing.
        if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
          return;
        }
  
        // Other errors are logged and stored in the Dapp's state. This is used to
        // show them to the user, and for debugging.
        console.error(error);
        setTransactionError(error);
      } finally {
        // If we leave the try/catch, we aren't sending a tx anymore, so we clear
        // this part of the state.
        setTxBeingSent(undefined);
      }
    }

    useEffect(() => {
      setRoute(window.location.pathname)
    }, [setRoute]);

  
    return (
      <div className="Main">
        <Header connectWallet={_connectWallet}/> 
        <BrowserRouter>
          <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="/">
              <Link onClick={()=>{setRoute("/")}} to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/development">
              <Link onClick={()=>{setRoute("/development")}} to="/development">Development</Link>
            </Menu.Item>
            <Menu.Item key="/bridge">
              <Link onClick={()=>{setRoute("/bridge")}} to="/bridge">Bridge</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path="/"></Route>
  
            <Route exact path="/development"><Development 
                                                address={address} 
                                                tokenName={tokenName} 
                                                tokenSymbol={tokenSymbol}
                                                transfer={_transferTokens}
                                              />
            </Route>
  
            <Route exact path="/bridge"></Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  export default App;