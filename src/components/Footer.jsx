import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';

export default function Footer() {
  const links = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog', path: '/katalog' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Tentang', path: '/tentang' },
    { label: 'Blog', path: '/blog' },
    { label: 'Kontak', path: '/kontak' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src="/images/logo.webp"
                alt="Gerobak Jogja"
                className="h-10 w-10 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-xl font-display font-bold">Gerobak Jogja</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Spesialis pembuatan gerobak premium untuk bisnis kuliner Anda. Desain custom, bahan berkualitas.
            </p>
            <div className="flex gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Menu
            </h4>
            <ul className="space-y-2.5">
              {links.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <div className="space-y-3">
              <a href={`tel:${CONTACT_INFO.whatsapp}`} className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                <Phone size={16} />
                {CONTACT_INFO.phone}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                <Mail size={16} />
                {CONTACT_INFO.email}
              </a>
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Senin - Jumat</span>
                <span className="text-white">{CONTACT_INFO.workingHours.weekday}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Sabtu</span>
                <span className="text-white">{CONTACT_INFO.workingHours.saturday}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Minggu</span>
                <span className="text-red-400">{CONTACT_INFO.workingHours.sunday}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Gerobak Jogja. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
