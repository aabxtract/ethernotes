// TODO: Replace with your deployed smart contract address
export const etherNotesAddress =
  '0x0000000000000000000000000000000000000000' as const;

export const etherNotesABI = [
  {
    type: 'function',
    name: 'addNote',
    inputs: [{ name: 'content', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getNotesByUser',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct EtherNotes.Note[]',
        components: [
          { name: 'author', type: 'address', internalType: 'address' },
          { name: 'content', type: 'string', internalType: 'string' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;

export type Note = {
  author: `0x${string}`;
  content: string;
  timestamp: bigint;
};
