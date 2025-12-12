import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageHero from '../components/PageHero';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';

export default function Kontak() {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero (PageHero) */}
      <PageHero
        title="Hubungi Kami"
        description="Kami siap membantu mewujudkan bisnis gerobak impian Anda"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-display font-bold mb-8 text-gray-900">Informasi Kontak</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Telepon / WhatsApp</h3>
                  <a href={`tel:${CONTACT_INFO.whatsapp}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Email</h3>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Alamat</h3>
                  <a
                    href={CONTACT_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    {CONTACT_INFO.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Jam Operasional</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Senin - Jumat: {CONTACT_INFO.workingHours.weekday}</p>
                    <p>Sabtu: {CONTACT_INFO.workingHours.saturday}</p>
                    <p>Minggu: {CONTACT_INFO.workingHours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Butuh Respon Cepat?</h3>
              <p className="text-gray-600 mb-4">
                Hubungi kami via WhatsApp untuk mendapatkan respon lebih cepat
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center"
              >
                <MessageCircle size={20} />
                Chat via WhatsApp
              </a>
            </div>

            {/* Google Maps */}
            <div className="mt-8 card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1012855.4286934437!2d108.60636266689741!3d-7.413507263453636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5c726449b23d%3A0x133981e9e5eec5f9!2sGEROBAK%20JOGJA%20(GEROJOG)%20(Since%202017)!5e0!3m2!1sen!2sid!4v1765213552538!5m2!1sen!2sid"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Gerobak Jogja"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
