'use client';

import { useAccount, useEnsAddress } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NoteForm } from '@/components/note-form';
import { NoteList } from '@/components/note-list';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddressDisplay } from '@/components/address-display';
import { Address, isAddress } from 'viem';
import { normalize } from 'viem/ens';

export default function Home() {
  const { isConnected, address: connectedAddress } = useAccount();
  const [noteAdded, setNoteAdded] = useState(0);
  const [viewAddress, setViewAddress] = useState<Address | undefined>();
  const [searchInput, setSearchInput] = useState('');

  const { data: ensResolvedAddress, isLoading: isEnsLoading } = useEnsAddress({
    name: normalize(searchInput),
    chainId: 1,
    query: {
      enabled: searchInput.includes('.'),
    },
  });

  useEffect(() => {
    if (connectedAddress) {
      setViewAddress(connectedAddress);
    } else {
      setViewAddress(undefined);
    }
  }, [connectedAddress]);

  const handleNoteAdded = () => {
    setNoteAdded((prev) => prev + 1);
  };

  const handleSearch = () => {
    if (isAddress(searchInput)) {
      setViewAddress(searchInput);
    } else if (ensResolvedAddress) {
      setViewAddress(ensResolvedAddress);
    } else {
      // Handle case where input is not a valid address or ENS name
      console.warn('Invalid address or ENS name');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <header className="w-full p-4 flex justify-end sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <ConnectButton />
      </header>
      <main className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-16 flex-1">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] font-headline">
            Ether<span className="text-[hsl(var(--primary))]">Notes</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Write your thoughts, store them forever on the chain.
          </p>
        </div>

        <div className="w-full max-w-md flex gap-2">
          <Input 
            placeholder="Enter address or ENS name (e.g., vitalik.eth)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isEnsLoading}>
            {isEnsLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {viewAddress && (
          <div className="text-center">
            <p className="text-muted-foreground">Showing notes for:</p>
            <AddressDisplay address={viewAddress} />
          </div>
        )}

        {isConnected && connectedAddress && connectedAddress === viewAddress && (
          <div className="w-full max-w-2xl">
            <NoteForm onNoteAdded={handleNoteAdded} />
          </div>
        )}

        {viewAddress ? (
          <div className="w-full max-w-2xl flex flex-col gap-8">
            <NoteList key={`${viewAddress}-${noteAdded}`} userAddress={viewAddress} />
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed rounded-lg max-w-md">
            <p className="text-lg font-medium text-foreground/90">Welcome to EtherNotes</p>
            <p className="text-muted-foreground mt-2">
              Connect your wallet to write notes, or search for an address/ENS to view existing notes.
            </p>
          </div>
        )}

      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Built with Calm, Minimal, Developer-friendly vibes.
      </footer>
    </div>
  );
}
