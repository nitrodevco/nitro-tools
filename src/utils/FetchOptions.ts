import { Agent } from 'https';
import { RequestInit } from "node-fetch";

export const FetchOptions = {
    agent: new Agent({
        keepAlive: true,
        keepAliveMsecs: 24000,
        maxSockets: 100,
        scheduling: 'fifo',
    })
} as RequestInit;
