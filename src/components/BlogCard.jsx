/**
 * Blog Card Component for Mobile View
 * Used in Admin panel to replace table on mobile devices
 */
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function BlogCard({ blog, onEdit, onDelete }) {
  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
        </div>
        {blog.featured && (
          <span className="text-yellow-500 text-xl" aria-label="Featured">⭐</span>
        )}
      </div>

      {/* Category */}
      <div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          {blog.category}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
        <Link
          to={`/blog/${blog.slug}`}
          target="_blank"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Lihat blog"
        >
          <Eye size={20} />
        </Link>
        <button
          onClick={() => onEdit(blog)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Edit blog"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => onDelete(blog.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Hapus blog"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

