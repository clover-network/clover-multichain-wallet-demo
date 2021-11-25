import React, { useCallback, useEffect, useState } from 'react'
import './App.css';
import {Text} from "rebass";
import Logo from './images/logo.svg'
import { initApi, api } from './utils/apiUtils'
import { subscribeToEvents } from './utils/tokenUtils'
import { getAddress, loadAccount } from './utils/AccountUtils';
import { useCloverAccounts, useCloverAccountsUpdate, useWrongNetworkUpdate } from './state/wallet/hooks'
import { useApiConnectedUpdate, useApiInited, useApiInitedUpdate } from './state/api/hooks'
import { useAccountInfo, useAccountInfoUpdate } from './state/wallet/hooks'
import ConnectWallet from './components/connectWallet'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { web3FromAddress } from '@polkadot/extension-dapp';
import Web3 from 'web3'
import { recoverTypedMessage } from 'eth-sig-util';

const transactionTemplate = {
    nonce: '0x05',
    value: '0x0',
};

const InputGroup = (props) => {
    return (
        <div className="input-group">
            <span>{props.lable}</span>
            <input value={props.value} type="text" onChange={(e) => props.handleInputChange(e.target.value)}/>
        </div>
    )
}

function App() {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')

    const [evmAddress, setEvmAddress] = useState('')
    const [connecting, setConnecting] = useState(false)
    const [trxAddress, setTrxAddress] = useState('')
    const [signResult, setSignResult] = useState('')

    const cloverAccounts = useCloverAccounts()
    const cloverAccountsUpdate = useCloverAccountsUpdate()



    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleConnectWallet = useCallback(async () => {
      setConnecting(true)
      if (window.clover !== undefined) { 
          const handleAccountsChanged = async (accounts) => {
              const clvAccounts = await window.clover.request({ method: 'clover_getAccounts' })
              cloverAccountsUpdate(clvAccounts)
              console.log('account changed:', clvAccounts);
          }
  
          window.clover.on('accountsChanged', handleAccountsChanged);
  
          const accounts = await window.clover.request({ method: 'eth_requestAccounts' })
          setEvmAddress(accounts[0])
          console.log('accounts:', accounts)

          if (!window.tronWeb) {
            throw new Error('no tron injector')
          }
          setTrxAddress(window.tronWeb.defaultAddress.base58)

          const clvAccounts = await window.clover.request({ method: 'clover_getAccounts' })
          console.log('clv accounts:', clvAccounts)

          const supportedChainIds = await window.clover.request({ method: 'clover_supportedChainIds', params: [clvAccounts[0][0]] })
          console.log('chain ids:', supportedChainIds)

          const ret = await window.clover.request({ method: 'clover_changeEthereumChain', params: ['0x1'] })
          console.log('switch chain:', ret)

          cloverAccountsUpdate(clvAccounts)
      }
      setConnecting(false)

    }, [cloverAccountsUpdate]);

    useEffect(() => {
        handleConnectWallet()
    }, [handleConnectWallet])

    const handleClose = () => {
        setOpen(false)
    }

    const gotoWebstore = () => {
        window.open('https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk', '_blank')
    } 

    const getV4TypedData = (chainId) => ({
      types: {
        Address: [
          { name: 'address', type: 'string' },
        ],
      },
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: Number(chainId),
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      primaryType: 'Address',
      message: {
        address: trxAddress,
      },
    });

  const handleEthSign = async () => {
    const web3 = new Web3(window.clover);
    const publicAddress = evmAddress;
    const chainId = '0x1';
    const typedData = getV4TypedData(chainId);
    web3.currentProvider.send(
      {
        method: 'eth_signTypedData_v4',
        params: [publicAddress, JSON.stringify(typedData)],
        jsonrpc: '2.0',
      },
      (err, result) => {
        if (err) {
          return console.error(err);
        }
        const recovered = recoverTypedMessage(
          {
            data: typedData,
            sig: result.result,
          },
          'V4',
        );

        if (recovered.toLowerCase() === publicAddress.toLowerCase()) {
          setSignResult(`${result.result}`)
          return console.log('sign typed message v4 => true', result.result, `Recovered signer: ${publicAddress}`, result);
        }
        setSignResult(`Failed to verify signer, got: ${recovered}`)
        return console.log(`Failed to verify signer, got: ${recovered}`);
      },
    );
  }

  return (
    <div className="wrapper">
        <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={status}>
                {message}
            </Alert>
        </Snackbar>
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
                          <Text fontSize={18} color="#1D2D31" lineHeight="150%" fontWeight="300">first connect to Clover Wallet. You can install it to chrome browser <span style={{color: '#27A577', cursor: 'pointer'}} onClick={gotoWebstore}>here</span></Text>
                          {/* <ConnectWallet handleConnectWallet={handleConnectWallet} /> */}
                          {
                            evmAddress === '' ? 
                            <button className="connect-btn" onClick={() => handleConnectWallet()}>{connecting ? 'Connect Clover Wallet' : 'Connecting...'}</button> :
                            <div className="connect-btn connected-btn">{getAddress(evmAddress)}</div>
                          }
                      </div>
                  </div>
                  <div className="center-left-row">
                      <Text fontSize={40} color="#27A577" fontFamily="Optima" fontWeight="bold" minWidth={70}>02.</Text>
                      <Text fontSize={18} color="#1D2D31" lineHeight="150%" fontWeight="300">then you can try to interact with different blockchains without switching network in the demo dapp on the right side</Text>
                  </div>
              </div>
              <div className="center-right">
                  <div className="center-right-bg" />
                  <div className="center-right-content">
                      <Text fontSize={26} textAlign="center" color="#000000" fontWeight="bold">Demo Dapp</Text>
                      <div className="custom-network">
                          <InputGroup
                              lable="Evm Address"
                              value={evmAddress}
                          />
                          <InputGroup
                              lable="Tron Address"
                              value={trxAddress}
                          />
                          <button className="sign-btn" style={{marginLeft: '15px'}} onClick={handleEthSign}>Sign Typed Message V4</button>
                      </div>
                      {
                        signResult !== '' &&
                        <div className='sign-result'>
                          <Text fontSize={16} textAlign="center" color="#000000" fontWeight={'bold'}>Sign Result:</Text>
                          <div className='sign-result-text'>
                            {signResult}
                          </div>
                        </div>
                      }
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
