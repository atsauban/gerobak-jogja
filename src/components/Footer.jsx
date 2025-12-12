import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-display font-bold mb-4 gradient-text bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Gerobak Jogja
            </h3>
            <p className="text-gray-400 mb-6">
              Spesialis pembuatan gerobak berkualitas untuk berbagai kebutuhan usaha Anda.
            </p>
            <div className="flex gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                title="Facebook Page"
              >
                <Facebook size={20} />
              </a>
              <a
                href={CONTACT_INFO.facebookGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Facebook Group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Menu Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/katalog" className="text-gray-400 hover:text-white transition-colors">Katalog</Link>
              </li>
              <li>
                <Link to="/galeri" className="text-gray-400 hover:text-white transition-colors">Galeri</Link>
              </li>
              <li>
                <Link to="/tentang" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/kontak" className="text-gray-400 hover:text-white transition-colors">Kontak</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <div className="space-y-3">
              <a href={`tel:${CONTACT_INFO.whatsapp}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <span>{CONTACT_INFO.email}</span>
              </a>
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <span>{CONTACT_INFO.address}</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span className="font-semibold text-white">{CONTACT_INFO.workingHours.weekday}</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu</span>
                <span className="font-semibold text-white">{CONTACT_INFO.workingHours.saturday}</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu</span>
                <span className="font-semibold text-red-400">{CONTACT_INFO.workingHours.sunday}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Gerobak Jogja. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
