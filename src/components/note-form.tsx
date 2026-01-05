'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { etherNotesABI, etherNotesAddress } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lock, Unlock } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import EthCrypto from 'eth-crypto';
import { getPublicKey } from '@/lib/crypto';

const MAX_NOTE_LENGTH = 200;

export function NoteForm({ onNoteAdded }: { onNoteAdded: () => void }) {
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();

  const { data: hash, error, isPending, writeContract, reset } = useWriteContract();

  const handleSaveNote = async () => {
    if (!note.trim()) {
      toast({
        title: 'Empty Note',
        description: 'Please write something before saving.',
        variant: 'destructive',
      });
      return;
    }

    if (!address) {
       toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to save a note.',
        variant: 'destructive',
      });
      return;
    }

    let contentToSave = note;

    if (isPrivate) {
      try {
        const publicKey = await getPublicKey();
        const encrypted = await EthCrypto.encryptWithPublicKey(
          publicKey,
          note
        );
        contentToSave = EthCrypto.cipher.stringify(encrypted);
      } catch (e) {
        toast({
          title: 'Encryption Failed',
          description: 'Could not prepare the private note. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    const finalContent = isPrivate ? `encrypted::${contentToSave}` : contentToSave;

    writeContract({
      address: etherNotesAddress,
      abi: etherNotesABI,
      functionName: 'addNote',
      args: [finalContent],
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
      setIsPrivate(false);
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
        <div className="grid w-full gap-4">
          <Textarea
            placeholder="Your thoughts on the blockchain..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={MAX_NOTE_LENGTH}
            className="resize-none h-28"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="private-note" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private-note" className="flex items-center gap-2">
                {isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                Private Note
              </Label>
            </div>
            <p className="text-sm text-muted-foreground text-right">
              {note.length} / {MAX_NOTE_LENGTH}
            </p>
          </div>
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
