'use client';

import { getAccount, signMessage, getClient } from '@wagmi/core';
import { config } from './wagmi';
import EthCrypto, { Encrypted } from 'eth-crypto';

// This is a simplified approach. In a real app, you might want to cache this key
// or derive it in a more sophisticated way.
async function getPrivateKeyFromSignature(): Promise<string> {
  const account = getAccount(config);
  if (!account.address) {
    throw new Error('Wallet not connected');
  }

  const messageToSign =
    'This signature is used to generate a unique private key for encrypting and decrypting your private notes. It is safe and does not authorize any transaction.';

  const signature = await signMessage(config, {
    message: messageToSign,
  });

  // A signature is not a private key, but we can use its hash as one.
  // This is for demonstration; for production, use a more robust key derivation.
  const privateKey = EthCrypto.hash.keccak256(signature);

  return privateKey;
}

export async function getPublicKey(): Promise<string> {
    const client = getClient(config);
    if (!client) throw new Error('Wagmi client not found');
    const account = getAccount(config);
    if (!account.address) throw new Error('Not connected');
    
    // Requesting the public key from the wallet
    const pubKey = await client.request({
        method: 'eth_getEncryptionPublicKey',
        params: [account.address],
    });

    return pubKey as string;
}

export async function decryptMessage(encryptedObject: Encrypted): Promise<string> {
    const client = getClient(config);
    if (!client) throw new Error('Wagmi client not found');
    const account = getAccount(config);
    if (!account.address) throw new Error('Not connected');
    
    const encryptedString = EthCrypto.cipher.stringify(encryptedObject);

    // Requesting decryption from the wallet
    const decryptedMessage = await client.request({
        method: 'eth_decrypt',
        params: [encryptedString, account.address],
    });
    
    return decryptedMessage as string;
}
