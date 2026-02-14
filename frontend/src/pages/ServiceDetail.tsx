import { useParams, Link } from 'react-router-dom';
import { useService } from '../hooks/useContent';
import { Users, BookOpen, Heart, Globe, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

export default function ServiceDetail() {
    const { branding } = useSettings();
    const { id } = useParams<{ id: string }>();
    const { data: service, isLoading, error } = useService(id);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading service details...</div>;
    }

    if (error || !service) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Service not found</h2>
                <Link to="/services" className="text-primary hover:underline flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </Link>
            </div>
        );
    }

    // Helper to map icon name to component (fallback to Heart)
    const getIcon = (iconName: string) => {
        const className = "w-16 h-16 text-primary mb-6";
        switch (iconName) {
            case 'Users': return <Users className={className} />;
            case 'BookOpen': return <BookOpen className={className} />;
            case 'Globe': return <Globe className={className} />;
            default: return <Heart className={className} />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>{service.title.rendered} | {branding.mosqueName}</title>
            </Helmet>

            <Link to="/services" className="text-primary hover:underline flex items-center mb-8 font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
            </Link>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-8 lg:p-12 text-center">
                    <div className="flex justify-center">
                        {getIcon(service.meta?.service_icon || '')}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold mb-8 font-serif text-gray-900"
                        dangerouslySetInnerHTML={{ __html: service.title.rendered }}
                    />

                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed text-left mx-auto bg-gray-50 p-8 rounded-xl"
                        dangerouslySetInnerHTML={{ __html: service.content.rendered }}
                    />

                    <div className="mt-12 text-center">
                        <Link
                            to="/contact"
                            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg"
                        >
                            Inquire About This Service
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
