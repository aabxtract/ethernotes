# **App Name**: EtherNotes

## Core Features:

- Wallet Connection: Connect to the dApp using RainbowKit with MetaMask and WalletConnect support.
- Note Input: Allow users to input notes with a maximum of 200 characters.
- On-Chain Storage: Store user notes on the Sepolia testnet by calling the 'addNote' function of a Solidity smart contract.
- Note Display: Display the user's notes with timestamps, fetched using the 'getNotesByUser' smart contract function.
- Loading State: Show a loading state during transaction processing.
- Transaction Notifications: Display success and error toast notifications for transaction outcomes.

## Style Guidelines:

- Primary color: Light blue (#ADD8E6), evokes a sense of calm and trustworthiness, suitable for a developer-friendly application.
- Background color: Off-white (#F5F5F5), providing a clean, neutral backdrop to emphasize the notes and interactions. 
- Accent color: Pale violet (#D8BFD8), serves as a gentle highlight for interactive elements without distracting from the calm design.
- Font pairing: 'Inter' (sans-serif) for both headlines and body, for a clean and modern look.
- Use subtle icons for wallet connection status and transaction states.
- Implement a centered layout with rounded inputs and buttons, ensuring a mobile-responsive design.
- Use subtle hover effects and loading animations to enhance user experience without being distracting.