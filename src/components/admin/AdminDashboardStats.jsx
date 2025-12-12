import { useState, useEffect } from 'react';
import { Star, Image as ImageIcon, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import { getBlogPosts, getTestimonials, getGalleryImages, getFAQs } from '../../services/firebaseService';

export default function AdminDashboardStats({ products }) {
    const [stats, setStats] = useState({
        blogs: 0,
        testimonials: 0,
        gallery: 0,
        faqs: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [blogs, testimonials, gallery, faqs] = await Promise.all([
                    getBlogPosts(),
                    getTestimonials(),
                    getGalleryImages(),
                    getFAQs()
                ]);

                setStats({
                    blogs: blogs.length,
                    testimonials: testimonials.length,
                    gallery: gallery.length,
                    faqs: faqs.length,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 -mt-16 relative z-40">
            {/* Total Products */}
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-blue-200">
                    <Star size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">{products.length}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Produk</div>
            </div>

            {/* Total Gallery */}
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-green-200">
                    <ImageIcon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {stats.loading ? '-' : stats.gallery}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Galeri</div>
            </div>

            {/* Total Testimonials */}
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-orange-200">
                    <MessageSquare size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {stats.loading ? '-' : stats.testimonials}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Testimoni</div>
            </div>

            {/* Total Blogs */}
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-purple-200">
                    <BookOpen size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {stats.loading ? '-' : stats.blogs}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Blog</div>
            </div>

            {/* Total FAQ */}
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-cyan-200">
                    <HelpCircle size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {stats.loading ? '-' : stats.faqs}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total FAQ</div>
            </div>
        </div>
    );
}
