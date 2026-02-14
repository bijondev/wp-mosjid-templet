import { useEvents, useDonations } from '../hooks/useContent';
import { Calendar, Clock, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';

export default function Events() {
    const { branding } = useSettings();
    const { data: events, isLoading } = useEvents(20);
    const { data: donations } = useDonations(3);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading events...</div>;
    }

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { dateStr: 'Date TBA' };
        }
        return {
            dateStr: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>Upcoming Events | {branding.mosqueName}</title>
            </Helmet>
            <h1 className="text-4xl font-bold text-center mb-12 font-serif text-primary">Upcoming Events</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {!events || events.length === 0 ? (
                    <p className="text-center col-span-full text-gray-500">No upcoming events found.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                            <Link to={`/events/${event.id}`} className="block h-48 bg-gray-200 relative group overflow-hidden">
                                {event._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                    <img
                                        src={event._embedded['wp:featuredmedia'][0].source_url}
                                        alt={event.title.rendered}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                            </Link>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-sm text-primary font-bold mb-2">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {event.meta?.event_date ? formatDate(event.meta.event_date).dateStr : 'Date TBA'}
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                    <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: event.title.rendered }} />
                                </h3>
                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <Clock className="w-4 h-4 mr-1" /> {event.meta?.event_time || 'Time TBA'}
                                </div>
                                {event.meta?.event_location && (
                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <MapPin className="w-4 h-4 mr-1" /> {event.meta.event_location}
                                    </div>
                                )}
                                <div className="text-gray-600 mb-6 line-clamp-2" dangerouslySetInnerHTML={{ __html: event.excerpt.rendered }} />

                                <div className="mt-auto pt-4 border-t border-gray-50">
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-flex items-center text-primary font-bold hover:underline"
                                    >
                                        View Details <ExternalLink className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Support Our Causes Section */}
            {donations && donations.length > 0 && (
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                        <h2 className="text-3xl font-bold font-serif text-primary flex items-center">
                            <Heart className="w-8 h-8 mr-3 fill-primary" /> Support Our mission
                        </h2>
                        <Link to="/donate" className="text-primary font-bold hover:underline hidden sm:block">View All Causes &rarr;</Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {donations.map((donation) => {
                            const CardContent = (
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 group-hover:border-primary/30 transition-colors h-full flex flex-col">
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: donation.title.rendered }} />
                                    <div className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow" dangerouslySetInnerHTML={{ __html: donation.excerpt.rendered }} />
                                    {donation.meta?.donation_link && (
                                        <span className="text-primary text-sm font-bold flex items-center group-hover:underline mt-auto">
                                            Donate Now <ExternalLink className="w-3 h-3 ml-1" />
                                        </span>
                                    )}
                                </div>
                            );

                            return donation.meta?.donation_link ? (
                                <a
                                    key={donation.id}
                                    href={donation.meta.donation_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block h-full"
                                >
                                    {CardContent}
                                </a>
                            ) : (
                                <div key={donation.id} className="h-full">
                                    {CardContent}
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/donate" className="text-primary font-bold hover:underline">View All Causes &rarr;</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
