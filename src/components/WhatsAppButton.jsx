import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, CONTACT_INFO } from '../config/contact';

export default function WhatsAppButton({ 
  message, 
  productName, 
  productPrice,
  className = "btn-whatsapp",
  children 
}) {
  const getMessage = () => {
    if (message) return message;
    if (productName) {
      return CONTACT_INFO.messages.productInquiry(productName, productPrice);
    }
    return CONTACT_INFO.messages.general;
  };

  return (
    <a 
      href={getWhatsAppUrl(getMessage())} 
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
    >
      <MessageCircle size={18} />
      {children || 'WhatsApp'}
    </a>
  );
}
