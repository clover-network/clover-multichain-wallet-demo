import React, { useState } from 'react'
import './App.css';
import {Text} from "rebass";
import Logo from './images/logo.svg'

const InputGroup = (props) => {
    return (
        <div className="input-group">
            <span>{props.lable}</span>
            <input value={props.value} type="text" onChange={(e) => props.handleInputChange(e.target.value)}/>
        </div>
    )
}

function App() {
  const [networkName, setNetworkName] = useState('')
  const [networkUrl, setNetworkUrl] = useState('')
  const [chainId, setChainId] = useState('')
  return (
    <div className="wrapper">
      <div className='content'>
          <div className="header">
              <div>
                  <img width="48px" height="48px" src={Logo} alt=""/>
                  <Text color="#27A577" fontWeight="bold" fontFamily="Optima" marginLeft="13px" fontSize={28}>Clover wallet</Text>
              </div>
              <h3>Multi-chain Interaction Demo</h3>
          </div>
          <div className="center">
              <div className="center-left">
                  <Text fontSize={26} fontWeight='bold' color="#000000">Multi-chain connected wallet</Text>
                  <Text fontSize={18} color="#1D2D31" marginTop="12px" lineHeight="150%" fontWeight="300">
                      With the Clover Finance unique "always-on" multi-chain connected wallet, users are able to simultaneously connect with Web3js-based dapps and Polkadotjs-
                      based dapps without having to switch networks.
                  </Text>
                  <div className="center-left-row">
                      <Text fontSize={40} color="#27A577" fontFamily="Optima" fontWeight="bold" minWidth={70}>01.</Text>
                      <div>
                          <Text fontSize={18} color="#1D2D31" lineHeight="150%" fontWeight="300">first connect to Clover Wallet. You can install it to chrome browser <span style={{color: '#27A577'}}>here</span></Text>
                          <div className="connect-btn">Connect Clover Wallet</div>
                      </div>
                  </div>
                  <div className="center-left-row">
                      <Text fontSize={40} color="#27A577" fontFamily="Optima" fontWeight="bold" minWidth={70}>02.</Text>
                      <Text fontSize={18} color="#1D2D31" lineHeight="150%" fontWeight="300">then you can try to interact with different blockchains without switching network in the demo dapp on the rightside</Text>
                  </div>
              </div>
              <div className="center-right">
                  <div className="center-right-bg" />
                  <div className="center-right-content">
                      <Text fontSize={26} textAlign="center" color="#000000" fontWeight="bold">Demo Dapp</Text>
                      <div className="btn-group">
                          <button className="sign-btn">Sign with Ethereum</button>
                          <button className="sign-btn">Sign with BSC</button>
                          <button className="sign-btn">Sign with Polkadot</button>
                      </div>
                      <div className="custom-network">
                          <Text fontSize={26} fontFamily="Optima" marginLeft="15px">Custom network</Text>
                          <InputGroup
                              lable="Network Name"
                              value={networkName}
                              handleInputChange={(val) => {
                                  setNetworkName(val)
                              }}
                          />
                          <InputGroup
                              lable="Network URL"
                              value={networkUrl}
                              handleInputChange={(val) => {
                                  setNetworkUrl(val)
                              }}
                          />
                          <InputGroup
                              lable="Chain ID"
                              value={chainId}
                              handleInputChange={(val) => {
                                  setChainId(val)
                              }}
                          />
                          <button className="sign-btn" disabled>Sign with Custom Network</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
