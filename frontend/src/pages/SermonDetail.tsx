import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Video, User, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import type { MosqueSermon } from '../types';

export default function SermonDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { branding } = useSettings();

    const { data: sermon, isLoading, error } = useQuery({
        queryKey: ['sermon', slug],
        queryFn: async () => {
            if (!slug) return Promise.reject('No slug provided');
            const response = await api.get<MosqueSermon[]>(`/wp/v2/mosque_sermon`, {
                params: { slug, _embed: true }
            });
            return response.data.length > 0 ? response.data[0] : null;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sermon...</p>
                </div>
            </div>
        );
    }

    if (error || !sermon) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">Sermon not found</p>
                    <Link to="/sermons" className="text-primary font-bold hover:underline">
                        ← Back to Sermons
                    </Link>
                </div>
            </div>
        );
    }

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

    const embedUrl = sermon.meta?.sermon_video_url ? getEmbedUrl(sermon.meta.sermon_video_url) : '';

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>{sermon.title.rendered.replace(/<[^>]*>/g, '')} | {branding.mosqueName}</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link
                    to="/sermons"
                    className="inline-flex items-center text-primary font-bold hover:underline mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sermons
                </Link>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Video Section */}
                    {embedUrl ? (
                        <div className="aspect-video bg-gray-900">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={sermon.title.rendered}
                            />
                        </div>
                    ) : sermon._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                        <div className="aspect-video bg-gray-200">
                            <img
                                src={sermon._embedded['wp:featuredmedia'][0].source_url}
                                alt={sermon.title.rendered}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            <Video className="w-24 h-24 text-gray-400" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8 lg:p-12">
                        <h1
                            className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
                            dangerouslySetInnerHTML={{ __html: sermon.title.rendered }}
                        />

                        {sermon.meta?.sermon_preacher && (
                            <div className="flex items-center text-gray-600 mb-6">
                                <User className="w-5 h-5 mr-2" />
                                <span className="font-medium">By {sermon.meta.sermon_preacher}</span>
                            </div>
                        )}

                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sermon.content.rendered }}
                        />

                        {/* External Video Link */}
                        {sermon.meta?.sermon_video_url && !embedUrl.includes('embed') && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <a
                                    href={sermon.meta.sermon_video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Video className="w-5 h-5" />
                                    Watch on External Platform
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
