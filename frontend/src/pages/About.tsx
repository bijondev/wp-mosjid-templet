import { usePage } from '../hooks/useContent';
import { useSettings } from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Heart, Users, Target } from 'lucide-react';

export default function About() {
    const { branding } = useSettings();
    const { data: page, isLoading } = usePage('about-us');

    const highlights = [
        {
            icon: <Heart className="w-8 h-8 text-primary" />,
            title: "Our Mission",
            description: "To serve Allah and our community by providing religious, educational, and social services that inspire righteousness and compassion."
        },
        {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: "Our Vision",
            description: "To be a beacon of Islamic values and a center of excellence for spiritual growth and community development in the region."
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Community First",
            description: "We believe in the power of unity and strive to create an inclusive environment where everyone feels welcome and supported."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-primary" />,
            title: "Lifelong Learning",
            description: "Commitment to providing authentic Islamic knowledge and practical life skills through our various educational programs."
        }
    ];

    const featuredImageUrl = page?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-20">
            <Helmet>
                <title>About Us | {branding.mosqueName}</title>
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={featuredImageUrl || branding.mainImageUrl || "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt={page?.title?.rendered || "About Us"}
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white font-outfit animate-fade-in-up tracking-tight">
                        {page?.title?.rendered || "About Us"}
                    </h1>
                    <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full animate-fade-in-up animation-delay-200"></div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 animate-fade-in-up animation-delay-200">
                        <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-bold mb-8 font-serif text-gray-800">
                                {page?.title?.rendered || "Our Story"}
                            </h2>
                            <div
                                className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6"
                                dangerouslySetInnerHTML={{ __html: page?.content?.rendered || "<p>Welcome to our mosque. We are dedicated to serving our community and providing a space for worship and growth. Content coming soon.</p>" }}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Highlights */}
                    <div className="lg:col-span-4 space-y-6">
                        {highlights.map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:shadow-primary/5 transition-all animate-fade-in-up`}
                                style={{ animationDelay: `${400 + (index * 100)}ms` }}
                            >
                                <div className="p-4 bg-primary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-outfit">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quote Section */}
            <section className="bg-primary py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Heart className="w-12 h-12 text-white/40 mx-auto mb-8" />
                        <h2 className="text-3xl lg:text-4xl font-bold text-white font-serif italic mb-8">
                            "The best of people are those that are most useful to people."
                        </h2>
                        <p className="text-white/80 font-bold tracking-widest uppercase text-sm">
                            — Prophet Muhammad (PBUH)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
