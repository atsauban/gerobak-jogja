import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-display font-bold mb-4 gradient-text bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Gerobak Jogja
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Spesialis pembuatan gerobak kualitas premium untuk melejitkan bisnis kuliner Anda. Desain kekinian, bahan awet.
            </p>
            <div className="flex gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-green-500 hover:border-green-500 rounded-xl flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                title="WhatsApp"
              >
                <MessageCircle size={20} className="group-hover:text-white transition-colors" />
              </a>
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-pink-500 hover:border-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                title="Instagram"
              >
                <Instagram size={20} className="group-hover:text-white transition-colors" />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                title="Facebook Page"
              >
                <Facebook size={20} className="group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Menu Cepat
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['Beranda', 'Katalog', 'Galeri', 'Tentang', 'Kontak', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary-400 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Kontak Kami
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h3>
            <div className="space-y-4">
              <a href={`tel:${CONTACT_INFO.whatsapp}`} className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors backdrop-blur-sm border border-white/10">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Telepon / WA</div>
                  <div className="font-medium text-white">{CONTACT_INFO.phone}</div>
                </div>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors backdrop-blur-sm border border-white/10">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Email</div>
                  <div className="font-medium text-white">{CONTACT_INFO.email}</div>
                </div>
              </a>
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors backdrop-blur-sm border border-white/10">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Lokasi Workshop</div>
                  <div className="font-medium text-white text-sm leading-snug">{CONTACT_INFO.address}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Jam Operasional
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h3>
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Senin - Jumat</span>
                  <span className="font-semibold text-primary-300">{CONTACT_INFO.workingHours.weekday}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Sabtu</span>
                  <span className="font-semibold text-primary-300">{CONTACT_INFO.workingHours.saturday}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-400">Minggu</span>
                  <span className="font-semibold text-red-400">{CONTACT_INFO.workingHours.sunday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Gerobak Jogja. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
