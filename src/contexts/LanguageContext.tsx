import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from '@/i18n/i18n';

interface LanguageContextType {
    currentLanguage: string;
    changeLanguage: (locale: string) => Promise<void>;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('zh');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved language on app start
    useEffect(() => {
        const loadSavedLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('user_language');
                const defaultLanguage = (Localization.locale || 'zh').split('-')[0] || 'zh';
                const languageToUse = savedLanguage || defaultLanguage;

                if (languageToUse === 'en' || languageToUse === 'zh') {
                    i18n.locale = languageToUse;
                    setCurrentLanguage(languageToUse);
                }
            } catch (error) {
                console.error('Error loading saved language:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedLanguage();
    }, []);

    const changeLanguage = async (locale: string) => {
        try {
            // Set the new locale
            i18n.locale = locale;
            setCurrentLanguage(locale);

            // Save to AsyncStorage for persistence
            await AsyncStorage.setItem('user_language', locale);

            console.log(`Language changed to: ${locale}`);
        } catch (error) {
            console.error('Error changing language:', error);
            throw error;
        }
    };

    const value: LanguageContextType = {
        currentLanguage,
        changeLanguage,
        isLoading,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};