import { createAction } from '@reduxjs/toolkit'

export const connected = createAction<{connected: boolean}>('api/connected');
export const inited = createAction<{inited: boolean}>('api/inited')
export const ready = createAction<{ready: boolean}>('api/ready')


