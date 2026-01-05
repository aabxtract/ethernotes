On-Chain Notes dApp

A minimal Ethereum dApp that allows users to write and read short notes stored permanently on-chain.
Built with RainbowKit, wagmi, and Next.js for a clean and friendly Web3 experience.

🌍 Overview

On-Chain Notes is a simple decentralized application where:

Users connect their wallet using RainbowKit

Write short notes (memories, ideas, logs)

Store those notes immutably on the Ethereum blockchain

View notes associated with any wallet address

This project demonstrates the core building blocks of a modern Ethereum dApp.

✨ Features

🌈 Wallet connection via RainbowKit

🔐 Ethereum account-based note ownership

📝 Write notes directly to the blockchain

⏱️ Timestamped entries

👀 View notes by wallet address

⚡ Real-time transaction feedback

📱 Responsive, minimal UI

🧠 Why This Project?

This dApp is intentionally simple to help developers:

Learn wallet connections

Understand smart contract reads & writes

Build confidence with Ethereum tooling

Ship a complete Web3 product quickly

Perfect for:

Beginners

Hackathons

Web3 demos

Portfolio projects

🏗️ Tech Stack
Frontend

Next.js (App Router)

TypeScript

RainbowKit

wagmi

ethers.js

Tailwind CSS

Blockchain

Solidity

Ethereum (Sepolia Testnet)

📜 Smart Contract
Core Data Structure
struct Note {
    address author;
    string content;
    uint256 timestamp;
}

Functions

addNote(string content)

getNotesByUser(address user)

Each note is permanently associated with the author’s wallet address.

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/onchain-notes
cd onchain-notes

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env.local file:

NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address

4️⃣ Run the App
npm run dev


Open http://localhost:3000 in your browser.

🔗 Wallet & Network

Wallets supported: MetaMask, WalletConnect

Network: Sepolia Testnet

Make sure your wallet is connected to Sepolia.

🧪 Usage Flow

Open the app

Connect wallet using RainbowKit

Write a short note (max 200 characters)

Confirm transaction

View notes instantly after confirmation

🛡️ Error Handling

Empty notes are blocked

Wallet connection required

Transaction rejection handled gracefully

Loading states for pending transactions

🌱 Future Improvements

Edit or delete latest note

ENS name support

Public / private notes (hashed storage)

Turn notes into NFTs

Small ETH fee to prevent spam

🏁 Conclusion

On-Chain Notes is a lightweight, practical example of how Web3 apps work end-to-end — from wallet connection to smart contract interaction — using modern Ethereum tooling.

📄 License

MIT License