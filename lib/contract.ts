// lib/contract.ts

// TODO: REPLACE THIS WITH YOUR ACTUAL CONTRACT ADDRESS AFTER DEPLOYMENT
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

/**
 * This is the ABI for the IdentityManager.sol contract.
 * It is a JSON representation of the contract's functions and events,
 * allowing your frontend to know how to communicate with it.
 */
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "cid",
        "type": "string"
      }
    ],
    "name": "CredentialClaimed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cid",
        "type": "string"
      }
    ],
    "name": "claimCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userCredentials",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "viewCredential",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];