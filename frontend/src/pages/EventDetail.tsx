import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../hooks/useContent';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

export default function EventDetail() {
    const { branding } = useSettings();
    const { slug } = useParams<{ slug: string }>();
    const { data: event, isLoading, error } = useEvent(slug);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading event details...</div>;
    }

    if (error || !event) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Event not found</h2>
                <Link to="/events" className="text-primary hover:underline flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date TBA';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const featuredImage = event._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>{event.title.rendered} | {branding.mosqueName}</title>
            </Helmet>

            <Link to="/events" className="text-primary hover:underline flex items-center mb-8 font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
            </Link>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {featuredImage && (
                    <div className="w-full h-[400px]">
                        <img
                            src={featuredImage}
                            alt={event.title.rendered}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8 lg:p-12">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-serif text-gray-900"
                        dangerouslySetInnerHTML={{ __html: event.title.rendered }}
                    />

                    <div className="grid md:grid-cols-2 gap-6 mb-10 pb-10 border-b border-gray-100">
                        <div className="flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Date</h3>
                                <p className="text-lg font-semibold text-gray-800">
                                    {event.meta?.event_date ? formatDate(event.meta.event_date) : 'Date TBA'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Time</h3>
                                <p className="text-lg font-semibold text-gray-800">{event.meta?.event_time || 'Time TBA'}</p>
                            </div>
                        </div>

                        {event.meta?.event_location && (
                            <div className="flex items-start space-x-4 md:col-span-2">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Location</h3>
                                    <p className="text-lg font-semibold text-gray-800">{event.meta.event_location}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: event.content.rendered }}
                    />
                </div>
            </div>
        </div>
    );
}
