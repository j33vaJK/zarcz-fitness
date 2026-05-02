import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ZarcZ Fitness',
  description: 'Discover the ZarcZ mission. We provide premium gym equipment, essential supplements, and reliable fitness gear to help you achieve your health goals.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
