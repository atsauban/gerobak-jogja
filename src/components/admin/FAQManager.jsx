import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '../Toast';
import {
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
} from '../../services/firebaseService';

export default function AdminFAQManager({ showDeleteConfirmation }) {
    const toast = useToast();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0
    });

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        try {
            setLoading(true);
            const data = await getFAQs();
            setFaqs(data);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFAQSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateFAQ(editingId, formData);
            } else {
                await createFAQ(formData);
            }

            await loadFAQs();
            setFormData({ question: '', answer: '', order: 0 });
            setShowForm(false);
            setEditingId(null);
        } catch (error) {
            toast.error('Gagal menyimpan FAQ: ' + error.message);
        }
    };

    const handleEdit = (faq) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
            order: faq.order || 0
        });
        setEditingId(faq.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const faq = faqs.find(f => f.id === id);
        showDeleteConfirmation(
            'faq',
            id,
            faq?.question || 'ini',
            async () => {
                try {
                    await deleteFAQ(id);
                    await loadFAQs();

                    toast.success('FAQ berhasil dihapus!', 5000, {
                        onUndo: async () => {
                            try {
                                // Restore FAQ
                                await createFAQ({
                                    question: faq.question,
                                    answer: faq.answer,
                                    order: faq.order || 0
                                });

                                await loadFAQs();
                                toast.success('FAQ berhasil dikembalikan!');
                            } catch (error) {
                                toast.error('Gagal mengembalikan FAQ: ' + error.message);
                            }
                        }
                    });
                } catch (error) {
                    toast.error('Gagal menghapus FAQ: ' + error.message);
                }
            }
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kelola FAQ</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormData({ question: '', answer: '', order: 0 });
                        setEditingId(null);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Tutup' : 'Tambah FAQ'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleFAQSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Pertanyaan *</label>
                        <input
                            type="text"
                            placeholder="Berapa lama proses pembuatan gerobak?"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Jawaban *</label>
                        <textarea
                            placeholder="Proses pembuatan gerobak memakan waktu..."
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Urutan (Order)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
                            {editingId ? 'Update FAQ' : 'Simpan FAQ'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ question: '', answer: '', order: 0 });
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
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-semibold">
                                            #{faq.order || index + 1}
                                        </span>
                                        <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && faqs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>Belum ada FAQ. Klik "Tambah FAQ" untuk menambahkan.</p>
                </div>
            )}
        </div>
    );
}
