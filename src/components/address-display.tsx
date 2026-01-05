'use client';

import { useEnsName } from 'wagmi';
import { Address } from 'viem';
import { Skeleton } from './ui/skeleton';

export function AddressDisplay({ address }: { address: Address }) {
  const { data: ensName, isLoading } = useEnsName({
    address,
    chainId: 1, // Mainnet for ENS resolution
  });

  if (isLoading) {
    return <Skeleton className="h-6 w-40" />;
  }

  if (ensName) {
    return <span className="font-semibold">{ensName}</span>;
  }

  return (
    <span className="font-mono text-sm">
      {`${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`}
    </span>
  );
}
