import { useState, useEffect } from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useSettings } from '../context/SettingsContext';
import { Calendar, MapPin, Search, Navigation } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { US_STATES } from '../data/us-locations';

export default function PrayerTimes() {
    const { branding } = useSettings();
    const [city, setCity] = useState('New York');
    const [state, setState] = useState('NY');
    const [searchInput, setSearchInput] = useState('New York');
    const { data: prayerData, isLoading, error } = usePrayerTimes(`${city}, ${state}`, 'US');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim()) {
                setCity(searchInput.trim());
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await res.json();
                if (data.city) {
                    setCity(data.city);
                    setSearchInput(data.city);
                    if (data.principalSubdivisionCode) {
                        const stateCode = data.principalSubdivisionCode.split('-')[1];
                        if (stateCode) setState(stateCode);
                    }
                }
            } catch (err) {
                console.error("Failed to detect location", err);
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>Prayer Times | {branding.mosqueName}</title>
            </Helmet>

            <div className="max-w-4xl mx-auto mb-16 text-center">
                <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 font-outfit text-gray-900 tracking-tight">
                    Prayer Times
                </h1>
                <p className="text-xl text-gray-600 font-medium">Find accurate prayer schedules for any city in the United States</p>
            </div>

            {/* Location Selector Card */}
            <div className="max-w-3xl mx-auto mb-12 bg-white rounded-3xl shadow-xl shadow-primary/5 p-8 border border-gray-100">
                <div className="grid md:grid-cols-12 gap-6 items-end">
                    {/* State Selector */}
                    <div className="md:col-span-4">
                        <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1" htmlFor="state">
                            Select State
                        </label>
                        <div className="relative">
                            <select
                                id="state"
                                className="block appearance-none w-full bg-gray-50 border-2 border-gray-100 hover:border-primary/30 px-4 py-4 pr-8 rounded-2xl transition-all focus:outline-none focus:border-primary font-bold text-gray-800"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                {US_STATES.map((s) => (
                                    <option key={s.abbrev} value={s.abbrev}>{s.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <MapPin className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* City Search */}
                    <div className="md:col-span-6">
                        <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1" htmlFor="city">
                            Search City
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="city"
                                placeholder="Enter city name..."
                                className="block w-full bg-gray-50 border-2 border-gray-100 hover:border-primary/30 px-12 py-4 rounded-2xl transition-all focus:outline-none focus:border-primary font-bold text-gray-800 placeholder:text-gray-400"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Geolocation Button */}
                    <div className="md:col-span-2">
                        <button
                            onClick={handleGeolocation}
                            title="Use My Current Location"
                            className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white p-4 rounded-2xl transition-all flex items-center justify-center group shadow-sm shadow-primary/10"
                        >
                            <Navigation className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400 font-medium">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Currently showing: <span className="text-primary font-bold">{city}, {state}</span></span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium font-outfit">Fetching sacred timings...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-red-100">
                    <p className="text-red-500 font-bold text-lg mb-2">Location Not Found</p>
                    <p className="text-red-400">Please check the city name and try again.</p>
                </div>
            ) : (
                <div className="space-y-12 animate-fade-in-up">
                    {/* Today's Schedule Card */}
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-primary/5 p-8 lg:p-12 border border-gray-50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 font-outfit mb-2">Today's Schedule</h2>
                                <p className="text-gray-500 font-medium tracking-wide">
                                    {prayerData?.date.readable} • {prayerData?.date.hijri.day} {prayerData?.date.hijri.month.en} {prayerData?.date.hijri.year} AH
                                </p>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="text-lg font-bold text-gray-800">
                                    {city}, {state}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, idx) => (
                                <div
                                    key={prayer}
                                    className="relative group text-center p-8 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4 group-hover:text-primary transition-colors">{prayer}</div>
                                    <div className="text-3xl font-extrabold text-gray-900 font-outfit">
                                        {prayerData?.timings[prayer as keyof typeof prayerData.timings].split(' ')[0]}
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <div className="h-8 w-8 bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
}
