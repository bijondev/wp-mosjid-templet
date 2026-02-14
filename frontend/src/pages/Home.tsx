import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useEvents, useSermons, useServices } from '../hooks/useContent';
import { Clock, MapPin, Video, Users, BookOpen, Heart, Globe, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { islamicQuotes } from '../data/quotes';

export default function Home() {
    const { branding, contact } = useSettings();
    const { data: prayerData, isLoading } = usePrayerTimes();
    const { data: events } = useEvents();
    const { data: sermons } = useSermons();
    const { data: services } = useServices();
    const [quote, setQuote] = useState(islamicQuotes[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
        setQuote(islamicQuotes[randomIndex]);
    }, []);

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

    return (
        <div className="space-y-12">
            <Helmet>
                <title>Home | {branding.mosqueName}</title>
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center">
                {/* Background Image with Ken Burns Effect */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={branding.mainImageUrl || "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt="Mosque"
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                    {/* Sophisticated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="relative container mx-auto px-4 text-center z-10">
                    <h1 className="text-5xl lg:text-8xl font-extrabold mb-6 font-outfit text-white animate-fade-in-up tracking-tight drop-shadow-md">
                        {branding.mosqueName}
                    </h1>
                    <p className="text-xl lg:text-2xl mb-12 max-w-2xl mx-auto text-white/90 italic animate-fade-in-up animation-delay-200">
                        "{quote.text}"
                        <span className="block text-base not-italic mt-4 font-sans font-medium text-primary">— {quote.source}</span>
                    </p>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                                <div key={prayer} className="bg-gray-50 p-4 rounded-lg hover:bg-primary hover:text-white transition-colors group">
                                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-white">{prayer}</h3>
                                    <p className="text-xl font-bold text-primary group-hover:text-white">
                                        {prayerData?.timings[prayer as keyof typeof prayerData.timings].split(' ')[0]}
                                    </p>
                                </div>
                            ))}
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
                                <Link to={`/services/${service.id}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: service.title.rendered }} />
                            </h3>
                            <div className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.excerpt.rendered }} />
                            <Link to={`/services/${service.id}`} className="mt-auto inline-flex items-center justify-center py-2 px-4 rounded-full border border-primary/20 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all group-hover:border-primary">
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
                                                    <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: event.title.rendered }} />
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
                                                <Link to={`/events/${event.id}`} className="mt-2 text-primary text-xs font-bold hover:underline inline-flex items-center">
                                                    Details <ExternalLink className="w-3 h-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-4">Latest Sermons</h2>
                        <div className="space-y-4">
                            {sermons?.length === 0 && <p className="text-gray-500">No sermons available.</p>}
                            {sermons?.map((sermon) => (
                                <div key={sermon.id} className="bg-white p-4 rounded shadow-sm">
                                    <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden relative">
                                        {sermon._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                            <img
                                                src={sermon._embedded['wp:featuredmedia'][0].source_url}
                                                alt={sermon.title.rendered}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Video className="text-gray-400 w-12 h-12" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: sermon.title.rendered }} />
                                    <p className="text-gray-500 text-sm">
                                        {sermon.meta?.sermon_preacher && `By ${sermon.meta.sermon_preacher}`}
                                    </p>
                                    <div className="text-gray-600 mt-2 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: sermon.excerpt.rendered }} />
                                    {sermon.meta?.sermon_video_url && (
                                        <a href={sermon.meta.sermon_video_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-bold mt-2 inline-block hover:underline">
                                            Watch Video
                                        </a>
                                    )}
                                </div>
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
