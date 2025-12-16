import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function ShareButton({ title, text, url, className = "" }) {
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Use current URL if not provided
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareText = text || "Cek produk menarik ini di Gerobak Jogja!";

    const handleShare = async () => {
        // 1. Try Native Share API (Mobile Default)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
                // Success? No action needed usually
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    setIsOpen(!isOpen); // Fallback to custom menu
                }
            }
        } else {
            // 2. Fallback to Custom Menu (Desktop)
            setIsOpen(!isOpen);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            toast.success('Link berhasil disalin!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error('Gagal menyalin link');
        }
    };

    const shareToWhatsApp = () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
        window.open(waUrl, '_blank');
    };

    const shareToFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(fbUrl, '_blank');
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleShare}
                className={`btn-secondary flex items-center gap-2 ${className}`}
                aria-label="Bagikan"
            >
                <Share2 size={18} />
                <span>Bagikan</span>
            </button>

            {/* Dropdown Menu for Desktop Fallback */}
            {isOpen && (
                <>
                    {/* Backdrop to close */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-scale-in origin-top-right overflow-hidden">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={shareToWhatsApp}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <MessageCircle size={16} />
                                </div>
                                <span className="font-medium text-sm">WhatsApp</span>
                            </button>

                            <button
                                onClick={shareToFacebook}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Facebook size={16} />
                                </div>
                                <span className="font-medium text-sm">Facebook</span>
                            </button>

                            <button
                                onClick={shareToTwitter}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-sky-50 text-gray-700 hover:text-sky-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                    <Twitter size={16} />
                                </div>
                                <span className="font-medium text-sm">Twitter / X</span>
                            </button>

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                </div>
                                <span className="font-medium text-sm">
                                    {isCopied ? 'Tersalin!' : 'Salin Link'}
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
