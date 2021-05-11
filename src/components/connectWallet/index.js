import React, { useEffect } from 'react'
import './index.css'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useWrongNetwork } from '../../state/wallet/hooks';
import {getAddress, createEmptyAccountInfo} from './utils'
import { useApiInited, useApiConnected } from '../../state/api/hooks';

export default function ConnectWallet(props) {
    const inited = useApiInited()
    const apiConnected = useApiConnected()
    const wrongNetwork = useWrongNetwork()
    const myInfo = useAccountInfo()
    const updateAccountInfo = useAccountInfoUpdate()
    useEffect(() => {
        updateAccountInfo(createEmptyAccountInfo())
    }, [updateAccountInfo]);
    const { handleConnectWallet } = props
    return (
        <div>
            {
                ((inited && !apiConnected) || wrongNetwork)? <button className="connect-btn" disabled={!inited} onClick={() => handleConnectWallet()}>Wrong Network</button> :
                myInfo.address === '' ?
                    <button disabled={!inited} className="connect-btn" onClick={() => handleConnectWallet()}>{inited ? 'Connect Clover Wallet' : 'Connecting...'}</button> :
                    <div className="connect-btn connected-btn">{getAddress(myInfo.address)}</div>
            }
        </div>
    )
}
