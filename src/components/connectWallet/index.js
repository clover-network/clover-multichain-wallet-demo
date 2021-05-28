import React, { useEffect } from 'react'
import './index.css'
import { useAccountInfoUpdate, useCloverAccounts } from '../../state/wallet/hooks';
import { useWrongNetwork } from '../../state/wallet/hooks';
import {getAddress, createEmptyAccountInfo} from './utils'
import { useApiInited, useApiConnected } from '../../state/api/hooks';

export default function ConnectWallet(props) {
    const inited = useApiInited()
    const apiConnected = useApiConnected()
    const wrongNetwork = useWrongNetwork()
    const cloverAccounts = useCloverAccounts()
    const updateAccountInfo = useAccountInfoUpdate()
    useEffect(() => {
        updateAccountInfo(createEmptyAccountInfo())
    }, [updateAccountInfo]);
    const { handleConnectWallet } = props
    return (
        <div>
            {
                ((inited && !apiConnected) || wrongNetwork)? <button className="connect-btn" disabled={!inited} onClick={() => handleConnectWallet()}>Wrong Network</button> :
                cloverAccounts.length <= 0 ?
                    <button disabled={!inited} className="connect-btn" onClick={() => handleConnectWallet()}>{inited ? 'Connect Clover Wallet' : 'Connecting...'}</button> :
                    <div className="connect-btn connected-btn">{getAddress(cloverAccounts[0][0])}</div>
            }
        </div>
    )
}
