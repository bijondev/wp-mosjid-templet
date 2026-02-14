import { Link } from 'react-router-dom';
import { useSermons } from '../hooks/useContent';
import { Video, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

export default function Sermons() {
    const { branding } = useSettings();
    const { data: sermons, isLoading } = useSermons(100); // Fetch all sermons

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sermons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Sermons | {branding.mosqueName}</title>
            </Helmet>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        Sermons & Lectures
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Watch and learn from our collection of inspiring sermons and Islamic lectures
                    </p>
                </div>

                {/* Sermons Grid */}
                {!sermons || sermons.length === 0 ? (
                    <div className="text-center py-12">
                        <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No sermons available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sermons.map((sermon) => (
                            <Link
                                key={sermon.id}
                                to={`/sermons/${sermon.slug}`}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                    {sermon._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                        <img
                                            src={sermon._embedded['wp:featuredmedia'][0].source_url}
                                            alt={sermon.title.rendered}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Video className="text-gray-400 w-16 h-16" />
                                    )}
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                            <div className="w-0 h-0 border-l-[16px] border-l-primary border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3
                                        className="font-bold text-xl mb-2 text-gray-800 group-hover:text-primary transition-colors line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: sermon.title.rendered }}
                                    />
                                    {sermon.meta?.sermon_preacher && (
                                        <p className="text-sm text-gray-500 mb-3">
                                            By {sermon.meta.sermon_preacher}
                                        </p>
                                    )}
                                    <div
                                        className="text-gray-600 text-sm line-clamp-3 mb-4"
                                        dangerouslySetInnerHTML={{ __html: sermon.excerpt.rendered }}
                                    />
                                    <div className="flex items-center text-primary font-bold text-sm">
                                        {sermon.meta?.sermon_video_url ? 'Watch Video' : 'View Details'}
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
