import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '../../services/firebaseService';

export default function AdminTestimonialManager({ showDeleteConfirmation }) {
    const { user } = useAuth();
    const toast = useToast();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        business: '',
        rating: 5,
        text: '',
        image: ''
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateTestimonial(editingId, formData);
            } else {
                await createTestimonial(formData);
            }

            await loadTestimonials();
            setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
            setShowForm(false);
            setEditingId(null);
        } catch (error) {
            toast.error('Gagal menyimpan testimoni: ' + error.message);
        }
    };

    const handleEdit = (testimonial) => {
        setFormData({
            name: testimonial.name,
            business: testimonial.business,
            rating: testimonial.rating,
            text: testimonial.text,
            image: testimonial.image || ''
        });
        setEditingId(testimonial.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const testimonial = testimonials.find(t => t.id === id);
        showDeleteConfirmation(
            'testimonial',
            id,
            testimonial?.name || 'pengguna ini',
            async () => {
                try {
                    await deleteTestimonial(id);
                    await loadTestimonials();
                    toast.success('Testimoni berhasil dihapus!');
                } catch (error) {
                    toast.error('Gagal menghapus testimoni: ' + error.message);
                }
            }
        );
    };

    const generateAvatar = (name) => {
        const colors = ['0284c7', '22c55e', 'f59e0b', 'ef4444', '8b5cf6', 'ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff`;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kelola Testimoni</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
                        setEditingId(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Tutup' : 'Tambah Testimoni'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleTestimonialSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nama Pelanggan *</label>
                            <input
                                type="text"
                                placeholder="Budi Santoso"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Nama Bisnis *</label>
                            <input
                                type="text"
                                placeholder="Warung Kopi Budi"
                                value={formData.business}
                                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating *</label>
                            <select
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4)</option>
                                <option value={3}>⭐⭐⭐ (3)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">URL Foto (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://... (kosongkan untuk auto-generate)"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Testimoni *</label>
                        <textarea
                            placeholder="Testimoni pelanggan..."
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
                            {editingId ? 'Update Testimoni' : 'Simpan Testimoni'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
                            }}
                            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-start gap-3 mb-3">
                                <img
                                    src={testimonial.image || generateAvatar(testimonial.name)}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                                    <div className="flex gap-1 mt-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{testimonial.text}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(testimonial)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && testimonials.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>Belum ada testimoni. Klik "Tambah Testimoni" untuk menambahkan.</p>
                </div>
            )}
        </div>
    );
}
