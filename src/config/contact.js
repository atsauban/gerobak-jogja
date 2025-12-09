export const CONTACT_INFO = {
  whatsapp: '6282327220077',
  phone: '+62 823-2722-0077',
  email: 'info@gerobakjogja.com',
  address: 'Yogyakarta, Indonesia',
  
  // Social Media
  instagram: 'https://instagram.com/gerobak.jogja_gerojog',
  facebook: 'https://www.facebook.com/GEROJOG/',
  facebookGroup: 'https://www.facebook.com/share/g/17UBpV6dpP/',
  
  // Working Hours
  workingHours: {
    weekday: '08:00 - 17:00 WIB',
    saturday: '08:00 - 15:00 WIB',
    sunday: 'Tutup'
  },
  
  // WhatsApp Messages
  messages: {
    general: 'Halo Gerobak Jogja, saya ingin bertanya',
    consultation: 'Halo Gerobak Jogja, saya ingin konsultasi',
    customDesign: 'Halo, saya ingin custom design gerobak',
    productInquiry: (productName, price) => 
      `Halo, saya tertarik dengan ${productName}${price ? ` (Rp ${price})` : ''}`
  }
};

export const getWhatsAppUrl = (message = CONTACT_INFO.messages.general) => {
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
};
