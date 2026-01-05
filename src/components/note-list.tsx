'use client';

import { useReadContract } from 'wagmi';
import { etherNotesABI, etherNotesAddress } from '@/lib/contracts';
import { Address } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { BookMarked, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Note = {
  author: Address;
  content: string;
  timestamp: bigint;
};

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
      <h2 className="text-2xl font-bold text-center">Your Notes</h2>
      {reversedNotes.map((note, index) => (
        <Card key={index} className="shadow-md transition-shadow hover:shadow-xl">
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
        </Card>
      ))}
    </div>
  );
}
