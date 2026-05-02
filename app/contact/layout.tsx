import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ZarcZ Fitness Solutions. Reach out for support, sales, or any questions regarding our premium gym equipment and supplements.',
  openGraph: {
    title: 'Contact ZarcZ Fitness',
    description: 'We are here to help you reach your peak performance. Contact us today.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
