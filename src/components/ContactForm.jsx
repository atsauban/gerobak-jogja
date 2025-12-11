import { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle, Phone } from 'lucide-react';

// Validation functions
const validateName = (name) => {
  if (!name.trim()) return 'Nama tidak boleh kosong';
  if (name.trim().length < 2) return 'Nama minimal 2 karakter';
  if (name.trim().length > 50) return 'Nama maksimal 50 karakter';
  return '';
};

const validateEmail = (email) => {
  if (!email.trim()) return 'Email tidak boleh kosong';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Format email tidak valid';
  return '';
};

const validatePhone = (phone) => {
  if (!phone.trim()) return ''; // Phone is optional
  // Indonesian phone format: 08xx-xxxx-xxxx or 08xxxxxxxxxx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  if (!phoneRegex.test(cleanPhone)) return 'Format nomor telepon tidak valid (contoh: 081234567890)';
  return '';
};

const validateMessage = (message) => {
  if (!message.trim()) return 'Pesan tidak boleh kosong';
  if (message.trim().length < 10) return 'Pesan minimal 10 karakter';
  if (message.trim().length > 1000) return 'Pesan maksimal 1000 karakter';
  return '';
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'name':
          error = validateName(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'message':
          error = validateMessage(value);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'message':
        error = validateMessage(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message)
    };
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true
    });
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({ name: '', email: '', phone: '', message: '' });
      setTouched({ name: false, email: false, phone: false, message: false });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const messageLength = formData.message.length;
  const maxMessageLength = 1000;

  if (isSuccess) {
    return (
      <div className="card p-8 text-center animate-scale-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Pesan Terkirim!</h3>
        <p className="text-gray-600">
          Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-4">
          <Mail size={20} />
          <span className="font-semibold">Form Kontak</span>
        </div>
        <h3 className="text-3xl font-display font-bold mb-2 text-gray-900">Kirim Pesan</h3>
        <p className="text-gray-600">
          Isi form di bawah ini dan kami akan menghubungi Anda segera
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.name && touched.name ? 'text-red-500' : 'text-gray-400'
            }`} size={20} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.name && touched.name
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="Masukkan nama Anda"
              aria-invalid={errors.name && touched.name ? 'true' : 'false'}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
            />
          </div>
          {errors.name && touched.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.email && touched.email ? 'text-red-500' : 'text-gray-400'
            }`} size={20} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="nama@email.com"
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && touched.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
            <span className="text-gray-500 text-xs font-normal ml-1">(Opsional)</span>
          </label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.phone && touched.phone ? 'text-red-500' : 'text-gray-400'
            }`} size={20} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.phone && touched.phone
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="081234567890"
              aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
              aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
            />
          </div>
          {errors.phone && touched.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle size={14} />
              {errors.phone}
            </p>
          )}
          {!errors.phone && formData.phone && (
            <p className="mt-1 text-xs text-gray-500">Format: 08xx-xxxx-xxxx atau 08xxxxxxxxxx</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Pesan *
            </label>
            <span className={`text-xs ${
              messageLength > maxMessageLength 
                ? 'text-red-600 font-semibold' 
                : messageLength > maxMessageLength * 0.9
                ? 'text-yellow-600'
                : 'text-gray-500'
            }`}>
              {messageLength} / {maxMessageLength}
            </span>
          </div>
          <div className="relative">
            <MessageSquare className={`absolute left-3 top-3 ${
              errors.message && touched.message ? 'text-red-500' : 'text-gray-400'
            }`} size={20} />
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows="5"
              maxLength={maxMessageLength}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
                errors.message && touched.message
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="Tulis pesan Anda di sini..."
              aria-invalid={errors.message && touched.message ? 'true' : 'false'}
              aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
            />
          </div>
          {errors.message && touched.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle size={14} />
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mengirim...
            </>
          ) : (
            <>
              <Send size={20} />
              Kirim Pesan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
