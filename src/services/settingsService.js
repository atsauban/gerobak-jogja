import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';

export const getSettings = async () => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return defaultSettings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return defaultSettings;
    }
};

export const updateSettings = async (newSettings) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
        await setDoc(docRef, newSettings, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
};

export const subscribeToSettings = (callback) => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            callback(defaultSettings);
        }
    });
};

const defaultSettings = {
    maintenanceMode: false,
    maintenanceMessage: 'Kami sedang melakukan pemeliharaan sistem. Silakan kembali lagi nanti.',
    contactEmail: 'info@gerobakjogja.com',
    contactPhone: '082327220077',
    whatsappNumber: '6282327220077'
};
