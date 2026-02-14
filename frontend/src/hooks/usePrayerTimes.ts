import { useQuery } from '@tanstack/react-query';
import { aladhanApi } from '../utils/api';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface HijriDate {
    date: string;
    format: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
}

export interface PrayerData {
    timings: PrayerTimes;
    date: {
        readable: string;
        hijri: HijriDate;
    };
}

export function usePrayerTimes(city: string = 'New York', country: string = 'US') {
    return useQuery({
        queryKey: ['prayerTimes', city, country],
        queryFn: async () => {
            const response = await aladhanApi.get('/timingsByCity', {
                params: {
                    city,
                    country,
                    method: 2, // ISNA
                },
            });
            return response.data.data as PrayerData;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
