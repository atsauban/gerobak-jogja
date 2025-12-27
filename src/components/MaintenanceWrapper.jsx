import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { subscribeToSettings } from '../services/settingsService';
import MaintenancePage from '../pages/MaintenancePage';

export default function MaintenanceWrapper({ children }) {
    const [maintenance, setMaintenance] = useState({
        active: false,
        message: ''
    });
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = subscribeToSettings((settings) => {
            setMaintenance({
                active: settings.maintenanceMode,
                message: settings.maintenanceMessage
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Admin and Login pages are always accessible
    if (location.pathname.startsWith('/admin')) {
        return children;
    }

    if (loading) {
        return null; // or a loading spinner
    }

    if (maintenance.active) {
        return <MaintenancePage message={maintenance.message} />;
    }

    return children;
}
