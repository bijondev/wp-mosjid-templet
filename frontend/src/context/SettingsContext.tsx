import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../utils/api';
import { useQuery } from '@tanstack/react-query';

interface BrandingSettings {
    mosqueName: string;
    logoUrl?: string;
    primaryColor: string;
    description?: string;
    mainImageUrl?: string;
    introVideoUrl?: string;
}

interface ContactSettings {
    phone: string;
    email: string;
    address: string;
    website: string;
    latitude?: string;
    longitude?: string;
}

interface SocialFiles {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

interface SettingsState {
    branding: BrandingSettings;
    contact: ContactSettings;
    social: SocialFiles;
    nonce?: string;
}

const defaultSettings: SettingsState = {
    branding: {
        mosqueName: 'Masjid Baitun Noor',
        primaryColor: '#D4AF37',
    },
    contact: {
        phone: '',
        email: '',
        address: '',
        website: '',
        latitude: '',
        longitude: '',
    },
    social: {
        facebook: '#',
        instagram: '#',
        twitter: '#',
        youtube: '#',
    },
    nonce: '',
};

const SettingsContext = createContext<SettingsState>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { data: fetchedSettings } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/mosque/v1/settings');
            return response.data;
        },
    });

    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    useEffect(() => {
        if (fetchedSettings) {
            // Map API response to state structure if needed, or ensure API matches
            // largely matches based on rest-api.php inspection

            // The API returns snake_case keys for some nested objects?
            // rest-api.php:
            // 'branding' => [ 'name', 'description', 'primary_color' ]
            // 'contact' => [ 'phone', 'email', 'address', 'website', 'latitude', 'longitude' ]
            // 'social' => [ ... ]

            // Need to map fetchedSettings to SettingsState
            const newSettings: SettingsState = {
                branding: {
                    mosqueName: fetchedSettings.branding.name || defaultSettings.branding.mosqueName,
                    description: fetchedSettings.branding.description,
                    primaryColor: fetchedSettings.branding.primary_color || defaultSettings.branding.primaryColor,
                    logoUrl: fetchedSettings.branding.logo_url,
                    mainImageUrl: fetchedSettings.branding.main_image,
                    introVideoUrl: fetchedSettings.branding.intro_video_url,
                },
                contact: {
                    phone: fetchedSettings.contact.phone || defaultSettings.contact.phone,
                    email: fetchedSettings.contact.email || defaultSettings.contact.email,
                    address: fetchedSettings.contact.address || defaultSettings.contact.address,
                    website: fetchedSettings.contact.website || defaultSettings.contact.website,
                    latitude: fetchedSettings.contact.latitude || '',
                    longitude: fetchedSettings.contact.longitude || '',
                },
                social: fetchedSettings.social || defaultSettings.social,
                nonce: fetchedSettings.nonce,
            };

            setSettings(newSettings);

            // Update Document Title
            document.title = newSettings.branding.mosqueName;

            // Update CSS Variable for Primary Color
            document.documentElement.style.setProperty('--color-primary', newSettings.branding.primaryColor);
        }
    }, [fetchedSettings]);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};
