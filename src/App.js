import React, { useCallback, useEffect, useState } from 'react'
import './App.css';
import {Text} from "rebass";
import Logo from './images/logo.svg'
import { initApi, api } from './utils/apiUtils'
import { subscribeToEvents } from './utils/tokenUtils'
import { loadAccount } from './utils/AccountUtils';
import { useCloverAccounts, useCloverAccountsUpdate, useWrongNetworkUpdate } from './state/wallet/hooks'
import { useApiConnectedUpdate, useApiInited, useApiInitedUpdate } from './state/api/hooks'
import { useAccountInfo, useAccountInfoUpdate } from './state/wallet/hooks'
import ConnectWallet from './components/connectWallet'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { web3FromAddress } from '@polkadot/extension-dapp';

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
    const [networkName, setNetworkName] = useState('BSC MAIN NET')
    const [networkUrl, setNetworkUrl] = useState('https://binance.ankr.com/')
    const [chainId, setChainId] = useState('0x38')
    const [tokenSymbol, setTokenSymbol] = useState('bnb')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')

    const cloverAccounts = useCloverAccounts()
    const cloverAccountsUpdate = useCloverAccountsUpdate()

    const apiInited = useApiInited()
    const apiInitedUpdate = useApiInitedUpdate()
    const updateApiConnected = useApiConnectedUpdate()
    const accountInfo = useAccountInfo();

    const onApiInited = useCallback(() => {
        apiInitedUpdate(true)
        updateApiConnected(true)
    }, [apiInitedUpdate, updateApiConnected])

    const updateAccountInfo = useAccountInfoUpdate()
    const updateWrongNetwork = useWrongNetworkUpdate()

    const initPolkaApi = useCallback(async () => {
        await initApi(onApiInited, () => {updateApiConnected(true)}, () => {updateApiConnected(false)})
    }, [onApiInited, updateApiConnected])

    useEffect(() => {
        initPolkaApi()
    }, [initPolkaApi])

    useEffect(() => {
        if (!apiInited) {
            return
        }
        subscribeToEvents(apiInited, accountInfo, updateAccountInfo).catch((e) => {console.log(e)})
    }, [apiInited, accountInfo, updateAccountInfo])


    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleConnectWallet = useCallback(async () => {
        if (!apiInited) {
            initPolkaApi()
        }
        const result = await loadAccount(updateAccountInfo, updateWrongNetwork);
        if (result) {
            setOpen(true)
            setStatus(result.status)
            setMessage(result.message)
        }

        if (window.clover !== undefined) { 
            const handleAccountsChanged = async (accounts) => {
                const clvAccounts = await window.clover.request({ method: 'clover_getAccounts' })
                cloverAccountsUpdate(clvAccounts)
                console.log('account changed:', clvAccounts);
            }
    
            window.clover.on('accountsChanged', handleAccountsChanged);
    
            const accounts = await window.clover.request({ method: 'eth_requestAccounts' })
            console.log('accounts:', accounts)

            const clvAccounts = await window.clover.request({ method: 'clover_getAccounts' })
            console.log('clv accounts:', clvAccounts)

            const supportedChainIds = await window.clover.request({ method: 'clover_supportedChainIds', params: [clvAccounts[0][0]] })
            console.log('chain ids:', supportedChainIds)

            const ret = await window.clover.request({ method: 'clover_changeEthereumChain', params: ['0x1'] })
            console.log('switch chain:', ret)

            cloverAccountsUpdate(clvAccounts)
        }

    }, [apiInited, initPolkaApi, updateAccountInfo, updateWrongNetwork, cloverAccountsUpdate]);

    useEffect(() => {
        if (!apiInited) {
            return
        }
        handleConnectWallet()
    }, [handleConnectWallet, apiInited])

    const handleClose = () => {
        setOpen(false)
    }

    const handleEth = useCallback(async () => {
        const chainId = '0x1'
        const currentEvmAccount = cloverAccounts[0][1]
        
        await window.clover.request({
          method: 'eth_sendTransaction',
          params: [{...transactionTemplate, chainId: chainId, from: currentEvmAccount, to: currentEvmAccount}],
        });
    }, [cloverAccounts])

    const handleBsc = useCallback(async () => {
        const chainId = '0x38'
        const currentEvmAccount = cloverAccounts[0][1]
        
        await window.clover.request({
          method: 'eth_sendTransaction',
          params: [{...transactionTemplate, chainId: chainId, from: currentEvmAccount, to: currentEvmAccount}],
        });
    }, [cloverAccounts])

    const handleClover = useCallback(async () => {
        const currentClvAccount = cloverAccounts[0][0]
        const injected = await web3FromAddress(currentClvAccount)
        api.getApi().setSigner(injected.signer)
        const unsub = await api.getApi().tx.balances
                            .transfer(currentClvAccount, 0)
                            .signAndSend(currentClvAccount, (result) => {
                                console.log(`Current status is ${result.status}`);
                            
                                if (result.status.isInBlock) {
                                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                                } else if (result.status.isFinalized) {
                                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                                  unsub();
                                }
                              })
    }, [cloverAccounts])

    const gotoWebstore = () => {
        window.open('https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk', '_blank')
    }

    const connectToCustomNetwork = async () => {
        if (window.clover !== undefined) {
            const provider = window.clover
            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainId,
                            chainName: networkName,
                            nativeCurrency: {
                                // name: 'BNB',
                                symbol: tokenSymbol,
                                decimals: 18,
                            },
                            rpcUrls: [networkUrl],
                            // blockExplorerUrls: ['https://bscscan.com/'],
                        },
                    ],
                })
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        } else {
            return false
        }
    }

    const handleCustomTrans = useCallback(async () => {
        const cId = chainId
        const currentEvmAccount = cloverAccounts[0][1]
        
        await window.clover.request({
          method: 'eth_sendTransaction',
          params: [{...transactionTemplate, chainId: cId, from: currentEvmAccount, to: currentEvmAccount}],
        });
    }, [chainId, cloverAccounts])

    const handleCustom = async () => {
        const connect = await connectToCustomNetwork()

        if (connect) {
            setTimeout(() => handleCustomTrans(), 1000)
        }
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
                          <ConnectWallet handleConnectWallet={handleConnectWallet} />
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
                      <div className="btn-group">
                          <button className="sign-btn" onClick={() => handleEth()}>Sign with Ethereum</button>
                          <button className="sign-btn" onClick={() => handleBsc()}>Sign with BSC</button>
                          <button className="sign-btn" onClick={() => handleClover()}>Sign with Polkadot</button>
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
                          <InputGroup
                              lable="Token Symbol"
                              value={tokenSymbol}
                              handleInputChange={(val) => {
                                  setTokenSymbol(val)
                              }}
                          />
                          <button className="sign-btn" onClick={handleCustom}>Sign with Custom Network</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
