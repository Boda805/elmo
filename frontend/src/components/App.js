import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import Header from './Header';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Transfer from "./Transfer"
import Bridge from "./Bridge"
import Withdraw from "./Withdraw";

import { ethers } from "ethers";

import ERC20Artifact from "../contracts/ERC20.json";
import L2ERC20Artifact from "../contracts/L2DepositedERC20.json";
import L1_GatewayArtifact from "../contracts/OVM_L1ERC20Gateway.json";
import contractAddress from "../contracts/contract-address.json";
import { NETWORKS } from "../constants.js";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const targetNetwork = NETWORKS['kovan'];


const App = () => {
    const [route, setRoute] = useState();
    const [address, setAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [balance, setBalance] = useState();
    const [txBeingSent, setTxBeingSent] = useState();
    const [transactionError, setTransactionError] = useState();

    //Web3Provider works for transactions but not JsonRpcProvider    
    //const _provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl);
    const _provider = new ethers.providers.Web3Provider(window.ethereum);

    const _gateway = new ethers.Contract(
      contractAddress.L1_Gateway,
      L1_GatewayArtifact.abi,
      _provider
    );

    let _token;

    if (window.ethereum.chainId === '0x2a') {
      _token = new ethers.Contract(
        contractAddress.ERC20,
        ERC20Artifact.abi,
        _provider
      );
    }
      
    if (window.ethereum.chainId === '0x45') {
      _token = new ethers.Contract(
        contractAddress.L2ERC20,
        L2ERC20Artifact.abi,
        _provider
      );
    }

    const _connectWallet = async (t) => {
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // if (!_checkNetwork()) {
      //   return;
      // }
  
      setAddress(selectedAddress);

      // We reinitialize it whenever the user changes their account.
      window.ethereum.on("accountsChanged", ([newAddress]) => {    
        setAddress(newAddress);
      });
      
      // We reset the dapp state if the network is changed
      // window.ethereum.on("networkChanged", ([networkId]) => {
      //   this._resetState();
      // });
    }
  
    const _transferTokens = async (to, amount) => {

      try {
 
        setTransactionError(undefined);

        const signedToken = _token.connect(_provider.getSigner(address));
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
    
    const _deposit = async (amount) => {
      try {
        const signedGateway = _gateway.connect(_provider.getSigner(address));
        //Looks to not need approval
        //const signedToken = _token.connect(_provider.getSigner(address));
        //console.log('approving transfer...')
        //const tx1 = await signedToken.approve(contractAddress.L1_Gateway, amount);
        console.log('depositing to L2...')
        const tx = await signedGateway.deposit(amount)  
        console.log(tx);
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

    const _withdraw = async (amount) => {
      try {
        const signedGateway = _gateway.connect(_provider.getSigner(address));
        const signedToken = _token.connect(_provider.getSigner(address));
        //console.log('approving transfer...')
        //const tx1 = await signedToken.approve(contractAddress.L1_Gateway, amount);
        console.log('withdraw to L1...')
        const tx = await signedToken.withdraw(amount)  
        console.log(tx);
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

    useEffect(() => {
      if (address !== undefined) {
        _tokenBalance()
      }
    }, [route, address]);
    
    const _tokenBalance = async () => {
      if (address !== undefined) {
        const balance = await _token.balanceOf(address) / 1 //Errors w/o the divide by 1
        setBalance(balance);        
      }
    }

    useEffect(() => {
      setRoute(window.location.pathname)
    }, [setRoute]);

    return (
      <div className="Main">
        <Header address={address} connectWallet={_connectWallet}/> 
        <BrowserRouter>
          <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="/">
              <Link onClick={()=>{setRoute("/withdraw")}} to="/withdraw">Withdraw</Link>
            </Menu.Item>
            <Menu.Item key="/transfer">
              <Link onClick={()=>{setRoute("/transfer")}} to="/transfer">Transfer</Link>
            </Menu.Item>
            <Menu.Item key="/bridge">
              <Link onClick={()=>{setRoute("/bridge")}} to="/bridge">Bridge</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path="/withdraw">
              <Withdraw withdraw={_withdraw}/>
            </Route>
  
            <Route exact path="/transfer">
              <Transfer 
                transfer={_transferTokens}
                tokenBalance={balance}
              />
            </Route>
  
            <Route exact path="/bridge">
              <Bridge deposit={_deposit}/>
            </Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  export default App;