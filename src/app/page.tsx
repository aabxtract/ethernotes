'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NoteForm } from '@/components/note-form';
import { NoteList } from '@/components/note-list';
import { useState } from 'react';

export default function Home() {
  const { isConnected, address } = useAccount();
  const [noteAdded, setNoteAdded] = useState(0);

  const handleNoteAdded = () => {
    setNoteAdded((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <header className="w-full p-4 flex justify-end sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <ConnectButton />
      </header>
      <main className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 flex-1">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] font-headline">
            Ether<span className="text-[hsl(var(--primary))]">Notes</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Write your thoughts, store them forever on the chain.
          </p>
        </div>

        {isConnected && address ? (
          <div className="w-full max-w-2xl flex flex-col gap-8">
            <NoteForm onNoteAdded={handleNoteAdded} />
            <NoteList key={noteAdded} userAddress={address} />
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed rounded-lg max-w-md">
            <p className="text-lg font-medium text-foreground/90">Welcome to EtherNotes</p>
            <p className="text-muted-foreground mt-2">Please connect your wallet to start writing notes on the Sepolia testnet.</p>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Built with Calm, Minimal, Developer-friendly vibes.
      </footer>
    </div>
  );
}
