import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Aryan Certificate Portal',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [polygonAmoy, baseSepolia],
  ssr: true,
});
