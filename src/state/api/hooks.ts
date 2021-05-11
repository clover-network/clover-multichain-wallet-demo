import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'

import { connected, ready, inited } from './actions'

export function useApiConnected(): boolean {
  return useSelector((state: AppState) => state.api.connected)
}

export function useApiConnectedUpdate(): (isConnected: boolean) => void {
  const dispatch = useDispatch()
  return useCallback((isConnected: boolean) => dispatch(connected({connected: isConnected})), [dispatch])
}

export function useApiInited(): boolean {
  return useSelector((state: AppState) => state.api.inited)
}

export function useApiInitedUpdate(): (isInited: boolean) => void {
  const dispatch = useDispatch()
  return useCallback((isInited: boolean) => dispatch(inited({ inited: isInited })), [dispatch])
}

export function useApiReady(): boolean {
  return useSelector((state: AppState) => state.api.ready)
}

export function useApiReadyUpdate(): (isReady: boolean) => void {
  const dispatch = useDispatch()
  return useCallback((isReady: boolean) => dispatch(ready({ ready: isReady })), [dispatch])
}