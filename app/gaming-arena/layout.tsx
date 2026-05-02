import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gaming Arena',
  description: 'Step into the ZARCZ Gaming Arena — the premium fusion of athletic performance and immersive gaming. Join the elite community.',
  openGraph: {
    title: 'ZARCZ Gaming Arena',
    description: 'Where fitness meets gaming. Experience the future of athletic entertainment.',
  },
};

export default function GamingArenaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
