'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: 'hsl(var(--primary))',
              accentColorForeground: 'hsl(var(--primary-foreground))',
              borderRadius: 'medium',
            }),
            darkMode: darkTheme({
              accentColor: 'hsl(var(--primary))',
              accentColorForeground: 'hsl(var(--primary-foreground))',
              borderRadius: 'medium',
            }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
