import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Gym Gear & Supplements',
  description: 'Explore our range of professional gym equipment, high-quality supplements, and fitness accessories. Built for athletes, by athletes.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
