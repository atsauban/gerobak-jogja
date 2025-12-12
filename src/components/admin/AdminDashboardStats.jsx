import { Star, Plus, Edit } from 'lucide-react';

export default function AdminDashboardStats({ products }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 -mt-16 relative z-40">
            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                    <Star size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">{products.length}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Produk</div>
            </div>

            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                    <Plus size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {products.filter(p => p.category === 'aluminium').length}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Gerobak Aluminium</div>
            </div>

            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                    <Edit size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {products.filter(p => p.category === 'kayu').length}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Gerobak Kayu</div>
            </div>

            <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                    <Star size={20} className="sm:w-6 sm:h-6" fill="currentColor" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
                    {products.filter(p => p.featured).length}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Produk Unggulan</div>
            </div>
        </div>
    );
}
