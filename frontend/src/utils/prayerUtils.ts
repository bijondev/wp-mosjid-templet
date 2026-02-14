import type { PrayerTimes } from '../hooks/usePrayerTimes';

export const getNextPrayer = (timings: PrayerTimes, currentTime: Date = new Date()) => {
    const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Convert current time to seconds from midnight for easier comparison
    const currentSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

    const prayerTimes = prayerNames.map(name => {
        const timeStr = timings[name as keyof PrayerTimes].split(' ')[0];
        const [hours, minutes] = timeStr.split(':').map(Number);
        return {
            name,
            seconds: hours * 3600 + minutes * 60,
            timeStr
        };
    });

    // Find the first prayer that is after the current time
    let nextPrayer = prayerTimes.find(prayer => prayer.seconds > currentSeconds);

    if (!nextPrayer) {
        // If all prayers have passed today, the next prayer is Fajr tomorrow
        const fajr = prayerTimes[0];
        const secondsUntilMidnight = 86400 - currentSeconds;
        const remainingMs = (secondsUntilMidnight + fajr.seconds) * 1000;
        return {
            name: fajr.name,
            time: fajr.timeStr,
            remainingMs
        };
    }

    const remainingMs = (nextPrayer.seconds - currentSeconds) * 1000;
    return {
        name: nextPrayer.name,
        time: nextPrayer.timeStr,
        remainingMs
    };
};

export const formatCountdown = (ms: number) => {
    if (ms < 0) return "00:00:00";

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
};
