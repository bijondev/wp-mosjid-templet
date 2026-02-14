import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useEvents, useSermons, useServices, useHeroSlides } from '../hooks/useContent';
import { Clock, MapPin, Video, Users, BookOpen, Heart, Globe, ExternalLink, Timer, Target, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { islamicQuotes } from '../data/quotes';
import { getNextPrayer, formatCountdown } from '../utils/prayerUtils';
import clsx from 'clsx'; // Added clsx import

export default function Home() {
    const { branding, contact, aboutHighlights } = useSettings();
    const { data: prayerData, isLoading } = usePrayerTimes();
    const { data: events } = useEvents(3);
    const { data: sermons } = useSermons();
    const { data: services } = useServices(3);
    const { data: cptSlides } = useHeroSlides(10);
    const [currentSlide, setCurrentSlide] = useState(0);

    const fallbacks = [
        {
            image: "https://images.unsplash.com/photo-1591604129939-f1efa4d8f7ec?q=80&w=1920&auto=format&fit=crop",
            quote: islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
        },
        {
            image: "https://images.unsplash.com/photo-1591604129939-f1efa4d8f7ec?q=80&w=1920&auto=format&fit=crop",
            quote: islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
        },
        {
            image: "https://images.unsplash.com/photo-1591604129939-f1efa4d8f7ec?q=80&w=1920&auto=format&fit=crop",
            quote: islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
        }
    ];

    const [heroSlides, setHeroSlides] = useState<any[]>(fallbacks);

    useEffect(() => {
        if (cptSlides && cptSlides.length > 0) {
            const slidesWithQuotes = cptSlides.map((slide: any) => {
                const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
                return {
                    image: slide._embedded?.['wp:featuredmedia']?.[0]?.source_url || slide.thumbnail_url || branding?.mainImageUrl || '',
                    quote: randomQuote
                };
            }).filter((s: any) => s.image);

            if (slidesWithQuotes.length > 0) {
                setHeroSlides(slidesWithQuotes);
            }
        }
    }, [cptSlides, branding.mainImageUrl]);

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroSlides(prev => {
                if (prev.length === 0) return prev;
                setCurrentSlide((current) => (current + 1) % prev.length);
                return prev;
            });
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const activeSlide = heroSlides[currentSlide] || fallbacks[0];

    // Removed `quote` state as it's now part of `heroSlides`
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState<any>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (prayerData?.timings) {
            setNextPrayer(getNextPrayer(prayerData.timings, currentTime));
        }
    }, [prayerData, currentTime]);


    // Helper to map icon name to component (fallback to Heart)
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return <Users className="w-10 h-10 text-primary mb-4" />;
            case 'BookOpen': return <BookOpen className="w-10 h-10 text-primary mb-4" />;
            case 'Globe': return <Globe className="w-10 h-10 text-primary mb-4" />;
            default: return <Heart className="w-10 h-10 text-primary mb-4" />;
        }
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { month: 'TBA', day: '--', dateStr: 'Date TBA' };
        }
        return {
            month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
            day: date.getDate(),
            dateStr: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
    };

    // Helper to get embed URL from YouTube/Vimeo links
    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        // YouTube
        const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return url;
    };

    // Show loader while essential data is loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10">
                <Helmet>
                    <title>Home | {branding?.mosqueName || 'Masjid Baitun Noor'}</title>
                </Helmet>
                <div className="text-center">
                    {/* Animated Mosque Icon */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto">
                            {/* Outer rotating ring */}
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                            {/* Middle pulsing ring */}
                            <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-pulse"></div>
                            {/* Inner star/crescent shape */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-primary rounded-full animate-pulse flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white fill-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in-up">
                        {branding?.mosqueName || 'Masjid Baitun Noor'}
                    </h2>
                    <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Loading...
                    </p>

                    {/* Animated dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <Helmet>
                <title>Home | {branding?.mosqueName || 'Masjid Baitun Noor'}</title>
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center">
                {/* Background Image Slides */}
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "absolute inset-0 z-0 transition-opacity duration-2000 ease-in-out",
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <img
                            src={slide.image}
                            alt={`Mosque ${index + 1}`}
                            className={clsx(
                                "w-full h-full object-cover",
                                index === currentSlide && "animate-ken-burns"
                            )}
                        />
                        {/* Sophisticated Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                ))}

                <div className="relative container mx-auto px-4 text-center z-10">
                    <h1
                        key={`title-${currentSlide}`}
                        className="text-5xl lg:text-8xl font-extrabold mb-6 font-outfit text-white animate-fade-in-up tracking-tight drop-shadow-2xl"
                    >
                        {branding.mosqueName}
                    </h1>
                    <div
                        key={`quote-${currentSlide}`}
                        className="animate-fade-in-up animation-delay-200"
                    >
                        <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto text-white/95 italic leading-relaxed">
                            "{activeSlide.quote.text}"
                            <span className="block text-base not-italic mt-6 font-sans font-bold text-primary tracking-widest uppercase">— {activeSlide.quote.source}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up animation-delay-400">
                        <Link
                            to="/prayer-times"
                            className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transform"
                        >
                            Prayer Times
                        </Link>
                        <Link
                            to="/donate"
                            className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 transform border border-white/20"
                        >
                            Donate Now
                        </Link>
                    </div>
                </div>

                {/* Decorative Bottom Wave/Curve */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 translate-y-px">
                    <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,88.75,117.05,74,175.52,62.15Z" fill="#F9FAFB"></path>
                    </svg>
                </div>
            </section>

            {/* Prayer Times Highlight */}
            <section className="container mx-auto px-4 -mt-16 relative z-10">
                <div className="bg-white rounded-lg shadow-xl p-6 lg:p-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="text-primary" /> Prayer Times
                            </h2>
                            <p className="text-gray-500">{prayerData?.date.readable} | {prayerData?.date.hijri.day} {prayerData?.date.hijri.month.en} {prayerData?.date.hijri.year}</p>
                        </div>
                        <div className="flex items-center text-primary font-bold">
                            <MapPin className="h-5 w-5 mr-1" /> {contact.address ? contact.address.split(',').slice(-2).join(',') : 'Location'}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading prayer times...</div>
                    ) : (
                        <div>
                            {nextPrayer && (
                                <div className="mb-8 flex justify-center">
                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 animate-pulse-subtle">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20">
                                                <Timer className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-primary uppercase tracking-wider">Next Prayer</p>
                                                <h3 className="text-2xl font-black text-gray-800 font-outfit">{nextPrayer.name} at {nextPrayer.time}</h3>
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                        <div className="text-center md:text-left">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time Remaining</p>
                                            <p className="text-3xl font-black text-primary font-mono tracking-tighter">
                                                {formatCountdown(nextPrayer.remainingMs)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                                {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                                    const isNext = nextPrayer?.name === prayer;
                                    return (
                                        <div
                                            key={prayer}
                                            className={`p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${isNext
                                                ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <h3 className={`text-lg font-bold mb-1 ${isNext ? 'text-white' : 'text-gray-800'}`}>{prayer}</h3>
                                            <p className={`text-xl font-black ${isNext ? 'text-white' : 'text-primary'}`}>
                                                {prayerData?.timings[prayer as keyof typeof prayerData.timings].split(' ')[0]}
                                            </p>
                                            {isNext && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 block opacity-80">Next</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Our Services Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Our Services</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">We offer a variety of services to our community, from religious education to social support.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {services?.map((service) => (
                        <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all text-center flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[280px] group">
                            <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                                {getIcon(service.meta?.service_icon || '')}
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-outfit">
                                <Link to={`/services/${service.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: service.title.rendered }} />
                            </h3>
                            <div className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.excerpt.rendered }} />
                            <Link to={`/services/${service.slug}`} className="mt-auto inline-flex items-center justify-center py-2 px-4 rounded-full border border-primary/20 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all group-hover:border-primary">
                                Learn More <ExternalLink className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    ))}
                    {services?.length === 0 && <p className="text-center w-full text-gray-500 italic">No services available at the moment.</p>}
                </div>
                <div className="text-center mt-8">
                    <Link to="/services" className="text-primary font-bold hover:underline">View All Services &rarr;</Link>
                </div>
            </section>

            {/* Upcoming Events & Latest Sermons */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {!events || events.length === 0 ? (
                                <p className="text-gray-500">No upcoming events at the moment.</p>
                            ) : (
                                events.map((event) => {
                                    const date = formatDate(event.meta?.event_date || '');
                                    return (
                                        <div key={event.id} className="flex bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="bg-primary text-white p-3 rounded flex flex-col items-center justify-center min-w-[80px]">
                                                <span className="text-sm font-bold">{date.month}</span>
                                                <span className="text-2xl font-bold">{date.day}</span>
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <h3 className="font-bold text-lg">
                                                    <Link to={`/events/${event.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: event.title.rendered }} />
                                                </h3>
                                                <p className="text-gray-500 text-sm flex items-center mt-1">
                                                    <Clock className="w-4 h-4 mr-1" /> {event.meta?.event_time || 'TBA'}
                                                    {event.meta?.event_location && (
                                                        <span className="flex items-center ml-4">
                                                            <MapPin className="w-4 h-4 mr-1" /> {event.meta.event_location}
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="text-gray-600 mt-2 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: event.excerpt.rendered }} />
                                                <Link to={`/events/${event.slug}`} className="mt-2 text-primary text-xs font-bold hover:underline inline-flex items-center">
                                                    Details <ExternalLink className="w-3 h-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {/* About Highlights Section */}
                        <div className="mt-12 bg-gray-100/50 p-8 rounded-3xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                                    <Heart className="w-5 h-5 text-white" />
                                </span>
                                Our Core Values
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Mission */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{aboutHighlights.mission.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{aboutHighlights.mission.desc}</p>
                                </div>
                                {/* Vision */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up animation-delay-200">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{aboutHighlights.vision.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{aboutHighlights.vision.desc}</p>
                                </div>
                                {/* Community */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up animation-delay-400">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{aboutHighlights.community.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{aboutHighlights.community.desc}</p>
                                </div>
                                {/* Education */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up animation-delay-400">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{aboutHighlights.education.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{aboutHighlights.education.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-primary pl-4">Latest Sermons</h2>
                            <Link to="/sermons" className="text-primary font-bold hover:underline flex items-center gap-1">
                                View All <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {sermons?.length === 0 && <p className="text-gray-500">No sermons available.</p>}
                            {sermons?.map((sermon) => (
                                <Link
                                    key={sermon.id}
                                    to={`/sermons/${sermon.slug}`}
                                    className="block bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden relative">
                                        {sermon._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                            <img
                                                src={sermon._embedded['wp:featuredmedia'][0].source_url}
                                                alt={sermon.title.rendered}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <Video className="text-gray-400 w-12 h-12" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: sermon.title.rendered }} />
                                    <p className="text-gray-500 text-sm">
                                        {sermon.meta?.sermon_preacher && `By ${sermon.meta.sermon_preacher}`}
                                    </p>
                                    <div className="text-gray-600 mt-2 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: sermon.excerpt.rendered }} />
                                    {sermon.meta?.sermon_video_url && (
                                        <span className="text-primary text-sm font-bold mt-2 inline-flex items-center gap-1">
                                            Watch Video <ExternalLink className="w-3 h-3" />
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Feature Video Section */}
            {branding.introVideoUrl && (
                <section className="container mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="grid lg:grid-cols-5 items-stretch">
                            <div className="lg:col-span-3 aspect-video bg-black relative">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={getEmbedUrl(branding.introVideoUrl)}
                                    title="Feature Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                                <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-sm mb-4">
                                    Feature Video
                                </span>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">Welcome to {branding.mosqueName}</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Watch our introductory video to learn more about our mission, our community, and the services we provide. We are dedicated to serving Allah and our community through education, support, and prayer.
                                </p>
                                <div className="flex space-x-4">
                                    <Link to="/about" className="text-primary font-bold hover:underline">About Us &rarr;</Link>
                                    <Link to="/contact" className="text-primary font-bold hover:underline">Visit Us &rarr;</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Support Our mission Banner */}
            <section className="bg-primary py-16 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10">
                    <Heart size={400} />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-bold mb-6 font-serif">Support Your Mosque</h2>
                        <p className="text-xl mb-8 opacity-90 leading-relaxed">
                            "The believer's shade on the Day of Resurrection will be his charity." – Prophet Muhammad (PBUH).
                            Help us continue our mission of serving the community.
                        </p>
                        <Link
                            to="/donate"
                            className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl group"
                        >
                            Donate Now <Heart className="ml-2 w-5 h-5 group-hover:fill-primary transition-colors" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
