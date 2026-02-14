import { useServices } from '../hooks/useContent';
import { Users, BookOpen, Heart, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';

export default function Services() {
    const { branding } = useSettings();
    const { data: services, isLoading } = useServices(20);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading services...</div>;
    }

    // Helper to map icon name to component (fallback to Heart)
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return <Users className="w-12 h-12 text-primary mb-4" />;
            case 'BookOpen': return <BookOpen className="w-12 h-12 text-primary mb-4" />;
            case 'Globe': return <Globe className="w-12 h-12 text-primary mb-4" />;
            default: return <Heart className="w-12 h-12 text-primary mb-4" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>Our Services | {branding.mosqueName}</title>
            </Helmet>
            <h1 className="text-4xl font-bold text-center mb-12 font-serif text-primary">Our Services</h1>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services?.length === 0 && <p className="text-center col-span-full text-gray-500">No services found.</p>}
                {services?.map((service) => (
                    <div key={service.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all text-center flex flex-col">
                        <div className="flex justify-center">
                            {getIcon(service.meta?.service_icon || '')}
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            <Link to={`/services/${service.id}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: service.title.rendered }} />
                        </h3>
                        <div className="text-gray-600 mb-6 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: service.excerpt.rendered }} />

                        <div className="mt-auto pt-6 border-t border-gray-50">
                            <Link
                                to={`/services/${service.id}`}
                                className="inline-flex items-center text-primary font-bold hover:underline"
                            >
                                Learn More <ExternalLink className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
