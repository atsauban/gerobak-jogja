import { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { getSettings, updateSettings } from '../../services/settingsService';
import { Save, AlertTriangle, Globe, MessageSquare } from 'lucide-react';

export default function SettingsManager() {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        maintenanceMessage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            toast.error('Gagal memuat pengaturan');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSettings(settings);
            toast.success('Pengaturan berhasil disimpan');
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Memuat pengaturan...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Maintenance Mode Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${settings.maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Mode Maintenance</h3>
                            <p className="text-sm text-gray-500">Aktifkan mode ini untuk menutup akses publik sementara</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <span className="font-medium text-gray-900">Status Website</span>
                                <p className="text-sm text-gray-500">
                                    {settings.maintenanceMode ? 'Website SEDANG DITUTUP (Maintenance)' : 'Website ONLINE (Dapat diakses publik)'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pesan Maintenance
                            </label>
                            <textarea
                                name="maintenanceMessage"
                                value={settings.maintenanceMessage}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Contoh: Kami sedang melakukan perbaikan sistem..."
                            />
                        </div>
                    </div>
                </div>



                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}
