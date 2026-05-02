import { siteConfig } from "@/config/site";

export interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}

export function handleWhatsAppCheckout(items: CheckoutItem[], totalAmount: number) {
  if (items.length === 0) return;

  const message = `*New Order from ${siteConfig.name}*\n\n` +
    items.map(item => `- ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n') +
    `\n\n*Total Amount: ₹${totalAmount.toFixed(2)}*`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}
