import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Headphones,
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';

export default function Kontak() {
  const contactItems = [
    {
      icon: Phone,
      label: 'Telepon / WhatsApp',
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.whatsapp}`,
      color: 'primary',
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      color: 'green',
    },
    {
      icon: MapPin,
      label: 'Alamat',
      value: CONTACT_INFO.address,
      href: CONTACT_INFO.mapsUrl,
      external: true,
      color: 'purple',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                <Headphones size={14} />
                Layanan Pelanggan
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <MessageCircle size={14} />
                Respon Cepat
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Hubungi Kami
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kami siap membantu mewujudkan bisnis gerobak impian Anda.
              Konsultasikan kebutuhan Anda dengan tim kami.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Informasi Kontak
              </h2>
              <div className="space-y-3">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClasses(item.color)} group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">
                          {item.label}
                        </div>
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  );
                })}

                {/* Working Hours */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClasses('orange')}`}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Jam Operasional
                    </div>
                    <div className="text-sm text-gray-700 space-y-0.5">
                      <p>
                        <span className="text-gray-500">Sen-Jum:</span>{' '}
                        {CONTACT_INFO.workingHours.weekday}
                      </p>
                      <p>
                        <span className="text-gray-500">Sabtu:</span>{' '}
                        {CONTACT_INFO.workingHours.saturday}
                      </p>
                      <p>
                        <span className="text-gray-500">Minggu:</span>{' '}
                        <span className="text-red-500 font-medium">
                          {CONTACT_INFO.workingHours.sunday}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-bold text-lg">Butuh Respon Cepat?</h3>
              </div>
              <p className="text-green-100 text-sm mb-4">
                Hubungi kami via WhatsApp untuk mendapatkan respon lebih cepat
                dan konsultasi langsung.
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors"
              >
                <Send size={18} />
                Chat via WhatsApp
              </a>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-600" />
                  Lokasi Kami
                </h3>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1012855.4286934437!2d108.60636266689741!3d-7.413507263453636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5c726449b23d%3A0x133981e9e5eec5f9!2sGEROBAK%20JOGJA%20(GEROJOG)%20(Since%202017)!5e0!3m2!1sen!2sid!4v1765213552538!5m2!1sen!2sid"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Gerobak Jogja"
              ></iframe>
            </div>
          </div>

          {/* Contact Form - Right Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Kirim Pesan
                </h2>
                <p className="text-gray-500 text-sm">
                  Isi formulir di bawah ini dan kami akan segera menghubungi
                  Anda.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
