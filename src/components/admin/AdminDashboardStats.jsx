import { useState, useEffect } from 'react';
import {
  Package,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import {
  getBlogPosts,
  getTestimonials,
  getGalleryImages,
  getFAQs,
} from '../../services/firebaseService';

export default function AdminDashboardStats({ products }) {
  const [stats, setStats] = useState({
    blogs: 0,
    testimonials: 0,
    gallery: 0,
    faqs: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, testimonials, gallery, faqs] = await Promise.all([
          getBlogPosts(),
          getTestimonials(),
          getGalleryImages(),
          getFAQs(),
        ]);

        setStats({
          blogs: blogs.length,
          testimonials: testimonials.length,
          gallery: gallery.length,
          faqs: faqs.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Produk',
      value: products.length,
      icon: Package,
      color: 'blue',
    },
    {
      label: 'Galeri',
      value: stats.gallery,
      icon: ImageIcon,
      color: 'green',
    },
    {
      label: 'Testimoni',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'orange',
    },
    {
      label: 'Blog',
      value: stats.blogs,
      icon: BookOpen,
      color: 'purple',
    },
    {
      label: 'FAQ',
      value: stats.faqs,
      icon: HelpCircle,
      color: 'cyan',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      cyan: 'bg-cyan-100 text-cyan-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(item.color)} group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">
              {stats.loading && item.label !== 'Produk' ? (
                <span className="inline-block w-8 h-7 bg-gray-100 rounded animate-pulse"></span>
              ) : (
                item.value
              )}
            </div>
            <div className="text-gray-500 text-sm">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
