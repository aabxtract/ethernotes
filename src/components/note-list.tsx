'use client';

import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { etherNotesABI, etherNotesAddress, etherNoteNFTAddress, etherNoteNFTABI } from '@/lib/contracts';
import { Address } from 'viem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { BookMarked, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type Note = {
  author: Address;
  content: string;
  timestamp: bigint;
};

function NoteCard({ note }: { note: Note }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);

  const { data: hash, writeContract, reset, error: mintError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    if (!address) return;
    setIsMinting(true);
    writeContract({
      address: etherNoteNFTAddress,
      abi: etherNoteNFTABI,
      functionName: 'mintNote',
      args: [address, note.content, note.timestamp],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "NFT Minted!",
        description: "Your note has been immortalized as an NFT.",
      });
      setIsMinting(false);
      reset();
    }
    if (mintError) {
      toast({
        title: "Minting Error",
        description: mintError.shortMessage || "An error occurred while minting.",
        variant: 'destructive',
      });
      setIsMinting(false);
      reset();
    }
  }, [isConfirmed, mintError, toast, reset]);
  
  const isMintButtonDisabled = isMinting || isConfirming;

  return (
    <Card className="shadow-md transition-shadow hover:shadow-xl">
      <CardHeader>
        <CardDescription>
          {formatDistanceToNow(new Date(Number(note.timestamp) * 1000), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
        </article>
      </CardContent>
      {address === note.author && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto" 
            onClick={handleMint}
            disabled={isMintButtonDisabled}
          >
            {isConfirming ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isConfirming ? 'Minting...' : isMinting ? 'Awaiting...' : 'Mint as NFT'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}


export function NoteList({ userAddress }: { userAddress: Address }) {
  const { data: notes, isLoading, error } = useReadContract({
    address: etherNotesAddress,
    abi: etherNotesABI,
    functionName: 'getNotesByUser',
    args: [userAddress],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Loading Your Notes...</h2>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">Error Fetching Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not fetch your notes. The contract may not be deployed on the connected network.</p>
          <p className="text-xs text-destructive/80 mt-2">{error.shortMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <BookMarked className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Notes Yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Once you save a note, it will appear here.</p>
      </div>
    );
  }

  const reversedNotes = [...(notes as Note[])].reverse();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Notes</h2>
      {reversedNotes.map((note, index) => (
        <NoteCard key={`${note.timestamp}-${index}`} note={note} />
      ))}
    </div>
  );
}
