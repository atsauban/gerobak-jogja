import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../Toast';
import BlogCard from '../BlogCard';
import { logSitemapChange } from '../../utils/sitemapUpdater';
import { debouncedRegenerateSitemap } from '../../services/sitemapService';
import {
    getBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} from '../../services/firebaseService';

export default function AdminBlogManager({ showDeleteConfirmation }) {
    const toast = useToast();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Generate slug from blog title
    const generateSlug = (title) => {
        if (!title) return '';

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens

        return slug;
    };

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Tips',
        image: '',
        author: 'Admin Gerobak Jogja',
        readTime: '5 menit',
        featured: false
    });

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const data = await getBlogPosts();
            setBlogs(data);
        } catch (error) {
            console.error('❌ Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();

        // Validate featured articles (max 1)
        if (formData.featured) {
            const currentFeatured = blogs.filter(b => b.featured && b.id !== editingId);
            if (currentFeatured.length >= 1) {
                toast.warning('Hanya boleh ada 1 artikel featured! Hapus featured dari artikel lain terlebih dahulu.');
                return;
            }
        }

        const blogData = {
            ...formData,
            slug: formData.slug || generateSlug(formData.title),
            date: new Date().toISOString().split('T')[0]
        };

        try {
            let resultBlog;
            if (editingId) {
                await updateBlogPost(editingId, blogData);
                resultBlog = { ...blogData, id: editingId };
                logSitemapChange('updated', 'blog', resultBlog);
            } else {
                resultBlog = await createBlogPost(blogData);
                logSitemapChange('added', 'blog', resultBlog);
            }

            await loadBlogs();
            setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
            setShowForm(false);
            setEditingId(null);

            // Regenerate sitemap when blog is created/updated
            debouncedRegenerateSitemap();

            // Show success message
            toast.success(editingId ? 'Blog berhasil diupdate!' : 'Blog berhasil dibuat!');
        } catch (error) {
            console.error('❌ Blog submit error:', error);
            console.error('❌ Error details:', {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            toast.error('Gagal menyimpan blog: ' + error.message);
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            category: blog.category,
            image: blog.image || '',
            author: blog.author || 'Admin Gerobak Jogja',
            readTime: blog.readTime || '5 menit',
            featured: blog.featured || false
        });
        setEditingId(blog.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        // Get blog data before deleting for logging
        const blogToDelete = blogs.find(b => b.id === id);
        showDeleteConfirmation(
            'blog',
            id,
            blogToDelete?.title || 'ini',
            async () => {
                try {
                    await deleteBlogPost(id);
                    await loadBlogs();

                    // Log sitemap change for deleted blog
                    if (blogToDelete) {
                        logSitemapChange('deleted', 'blog', {
                            id: id,
                            title: blogToDelete.title,
                            slug: blogToDelete.slug,
                            image: blogToDelete.image
                        });
                    }

                    // Regenerate sitemap when blog is deleted
                    debouncedRegenerateSitemap();

                    toast.success('Blog berhasil dihapus!', 5000, {
                        onUndo: async () => {
                            try {
                                // Restore blog post
                                const restoredBlog = await createBlogPost({
                                    title: blogToDelete.title,
                                    slug: blogToDelete.slug,
                                    excerpt: blogToDelete.excerpt,
                                    content: blogToDelete.content,
                                    category: blogToDelete.category,
                                    image: blogToDelete.image || '',
                                    author: blogToDelete.author || 'Admin Gerobak Jogja',
                                    readTime: blogToDelete.readTime || '5 menit',
                                    featured: blogToDelete.featured || false,
                                    date: blogToDelete.date
                                });

                                // Log sitemap change for restored blog
                                logSitemapChange('added', 'blog', restoredBlog);
                                debouncedRegenerateSitemap();

                                await loadBlogs();
                                toast.success('Blog berhasil dikembalikan!');
                            } catch (error) {
                                toast.error('Gagal mengembalikan blog: ' + error.message);
                            }
                        }
                    });
                } catch (error) {
                    console.error('Delete blog error:', error);
                    toast.error('Gagal menghapus blog: ' + error.message);
                }
            }
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kelola Blog</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
                        setEditingId(null);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Tutup' : 'Tambah Blog'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleBlogSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Judul *</label>
                            <input
                                type="text"
                                placeholder="Tips Memilih Gerobak..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Slug (auto-generate)</label>
                            <input
                                type="text"
                                placeholder="tips-memilih-gerobak"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Kategori *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Tips">Tips</option>
                                <option value="Panduan">Panduan</option>
                                <option value="Berita">Berita</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">URL Gambar</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Penulis</label>
                            <input
                                type="text"
                                placeholder="Admin Gerobak Jogja"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Waktu Baca</label>
                            <input
                                type="text"
                                placeholder="5 menit"
                                value={formData.readTime}
                                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Excerpt *</label>
                        <textarea
                            placeholder="Ringkasan singkat artikel..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Konten * (Markdown)</label>
                        <div className="mb-2 text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                            <strong>Tips Formatting Markdown:</strong><br />
                            • Heading: <code>## Judul Besar</code> atau <code>### Judul Kecil</code><br />
                            • Paragraf: Tulis langsung, pisahkan dengan enter 2x<br />
                            • List: <code>- Item pertama</code> atau <code>* Item pertama</code><br />
                            • Bold: <code>**Teks tebal**</code> | Italic: <code>*Teks miring*</code><br />
                            • Link: <code>[Teks link](https://url.com)</code>
                        </div>
                        <textarea
                            placeholder="## Judul Bagian&#10;&#10;Ini adalah paragraf pertama dengan penjelasan lengkap.&#10;&#10;### Sub Judul&#10;&#10;Paragraf kedua dengan **teks tebal** dan *teks miring*.&#10;&#10;- Poin pertama&#10;- Poin kedua&#10;- Poin ketiga"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            rows="12"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Featured Article</span>
                        </label>
                        <div className="mt-2 text-xs text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                            <strong>Info Featured Article:</strong><br />
                            • Hanya boleh ada <strong>1 artikel featured</strong> dalam satu waktu<br />
                            • Artikel featured akan ditampilkan di bagian atas halaman blog<br />
                            • Jika ingin mengubah featured, hapus featured dari artikel lain terlebih dahulu
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
                            {editingId ? 'Update Blog' : 'Simpan Blog'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
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
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">Judul</th>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Featured</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map(blog => (
                                    <tr key={blog.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{blog.title}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {blog.featured && <span className="text-yellow-500" aria-label="Featured">⭐</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Lihat blog"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(blog)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Edit blog"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Hapus blog"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {blogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </>
            )}

            {!loading && blogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>Belum ada blog. Klik "Tambah Blog" untuk menambahkan.</p>
                </div>
            )}
        </div>
    );
}
