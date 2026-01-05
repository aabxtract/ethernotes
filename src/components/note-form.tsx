'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { etherNotesABI, etherNotesAddress } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const MAX_NOTE_LENGTH = 200;

export function NoteForm({ onNoteAdded }: { onNoteAdded: () => void }) {
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const { data: hash, error, isPending, writeContract, reset } = useWriteContract();

  const handleSaveNote = () => {
    if (!note.trim()) {
      toast({
        title: 'Empty Note',
        description: 'Please write something before saving.',
        variant: 'destructive',
      });
      return;
    }
    writeContract({
      address: etherNotesAddress,
      abi: etherNotesABI,
      functionName: 'addNote',
      args: [note],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: 'Note Saved!',
        description: 'Your note has been successfully stored on-chain.',
      });
      setNote('');
      onNoteAdded();
      reset();
    }
    if (error) {
      toast({
        title: 'Transaction Error',
        description: error.shortMessage || 'An error occurred.',
        variant: 'destructive',
      });
      reset();
    }
  }, [isConfirmed, error, toast, onNoteAdded, reset]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Write a New Note</CardTitle>
        <CardDescription>Your note will be stored on the Sepolia testnet.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-2">
          <Textarea
            placeholder="Your thoughts on the blockchain..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={MAX_NOTE_LENGTH}
            className="resize-none h-28"
          />
          <p className="text-sm text-muted-foreground text-right">
            {note.length} / {MAX_NOTE_LENGTH}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSaveNote}
          disabled={!note.trim() || isPending || isConfirming}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isConfirming ? 'Confirming Transaction...' : 'Awaiting Signature...'}
            </>
          ) : (
            'Save Note'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
