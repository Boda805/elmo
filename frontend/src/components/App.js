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
import contractAddress from "../contracts/contract-address.json";


const App = () => {
    const [route, setRoute] = useState();
    const [address, setAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();
    const [balance, setBalance] = useState();
    
    const _connectWallet = async (t) => {
      // This method is run when the user clicks the Connect. It connects the
      // dapp to the user's wallet, and initializes it.
  
      // To connect to the user's wallet, we have to run this method.
      // It returns a promise that will resolve to the user's address.
      const [selectedAddress] = await window.ethereum.enable();
  
      // Once we have the address, we can initialize the application.
  
      // First we check the network
      // if (!this._checkNetwork()) {
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
      // This method initializes the dapp
      // We first store the user's address in the component's state
      setAddress(userAddress);

      // Then, we initialize ethers
      _intializeEthers();
    }
  
    const _intializeEthers = async () => {
      // We first initialize ethers by creating a provider using window.ethereum
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // When, we initialize the contract using that provider and the token's
      // artifact. You can do this same thing with your contracts.
      const _token = new ethers.Contract(
        contractAddress.Token,
        TokenArtifact.abi,
        _provider.getSigner(0)
      );
      const tokenName = await _token.name();
      const tokenSymbol = await _token.symbol();
      setTokenName(tokenName);
      setTokenSymbol(tokenSymbol);
    }


    useEffect(() => {
      setRoute(window.location.pathname)
    }, [setRoute]);

  
    return (
      <div className="Main">
        <div style={{ textAlign:"right" }}>
        <ConnectWallet 
          connectWallet={_connectWallet} 
          // networkError={this.state.networkError}
          // dismiss={() => this._dismissNetworkError()}
        />
        </div>
        <Header /> 
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
                                                
                                              />
            </Route>
  
            <Route exact path="/bridge"></Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  export default App;