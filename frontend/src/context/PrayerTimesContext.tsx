import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

interface PrayerTimesState {
    timings: any; // Type strictly later
    hijri: any;
    isLoading: boolean;
    error: any;
    nextPrayer: string | null;
    timeToNextPrayer: string | null;
}

const PrayerTimesContext = createContext<PrayerTimesState | null>(null);

export const usePrayerContext = () => {
    const context = useContext(PrayerTimesContext);
    if (!context) {
        throw new Error('usePrayerContext must be used within a PrayerTimesProvider');
    }
    return context;
};

export const PrayerTimesProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, error } = usePrayerTimes('New York', 'US'); // Default city for now
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);

    // Logic to calculate next prayer would go here (simplified for now)

    const value = {
        timings: data?.timings,
        hijri: data?.date.hijri,
        isLoading,
        error,
        nextPrayer,
        timeToNextPrayer: null,
    };

    return (
        <PrayerTimesContext.Provider value={value}>
            {children}
        </PrayerTimesContext.Provider>
    );
};
