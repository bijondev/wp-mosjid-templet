import { useDonations } from '../hooks/useContent';
import { useSettings } from '../context/SettingsContext';
import { Heart, ExternalLink, ShieldCheck, Zap, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Donate() {
    const { data: donations, isLoading } = useDonations(20);
    const { branding } = useSettings();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading donation causes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Donate | {branding.mosqueName}</title>
            </Helmet>
            {/* Premium Hero Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <img
                    src={branding.mainImageUrl || 'https://images.unsplash.com/photo-1542810634-71277d903dc0?auto=format&fit=crop&q=80'}
                    alt="Mosque Interior"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full text-primary-light mb-6 border border-primary/30">
                        <Heart className="w-4 h-4 fill-primary" />
                        <span className="text-sm font-bold tracking-wider uppercase">Sadaqah Jariyah</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">Support Our Mission</h1>
                    <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-light">
                        Every contribution, no matter the size, helps us maintain the House of Allah and serve our community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
                {/* Causes Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {!donations || donations.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl shadow-xl text-center col-span-full border border-gray-100">
                            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">No active causes</h2>
                            <p className="text-gray-500">We don't have any specific donation causes at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        donations.map((donation) => {
                            const CardContent = (
                                <>
                                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                                        {donation._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                            <img
                                                src={donation._embedded['wp:featuredmedia'][0].source_url}
                                                alt={donation.title.rendered}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                                                <Heart className="w-20 h-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <h3 className="text-2xl font-bold mb-4 text-gray-800 font-serif group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: donation.title.rendered }} />
                                        <div className="text-gray-600 mb-8 line-clamp-3 leading-relaxed flex-grow" dangerouslySetInnerHTML={{ __html: donation.excerpt.rendered }} />

                                        {donation.meta?.donation_link && (
                                            <span className="inline-flex items-center justify-center w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold text-lg group-hover:bg-opacity-90 transition-all shadow-lg group-hover:shadow-primary/30">
                                                Donate Now <ExternalLink className="w-5 h-5 ml-2" />
                                            </span>
                                        )}
                                    </div>
                                </>
                            );

                            return donation.meta?.donation_link ? (
                                <a
                                    key={donation.id}
                                    href={donation.meta.donation_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-2 cursor-pointer"
                                >
                                    {CardContent}
                                </a>
                            ) : (
                                <div key={donation.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
                                    {CardContent}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Trust & Transparency Section */}
                <div className="mt-24 grid md:grid-cols-3 gap-12">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">100% Transparent</h4>
                        <p className="text-gray-600">Every penny you donate is accounted for and dedicated to our community causes.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">Instant Impact</h4>
                        <p className="text-gray-600">Your contributions are processed immediately to support ongoing mosque operations.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">Community First</h4>
                        <p className="text-gray-600">Join thousands of others in building a stronger foundation for our brothers and sisters.</p>
                    </div>
                </div>

                {/* Manual Donation Banner */}
                <div className="mt-24 rounded-[3rem] bg-gray-900 p-12 text-center text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6 font-serif">Prefer to give in person?</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            We accept cash, checks, and wire transfers at the mosque office.
                            JazakAllah Khair for your generosity and support.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-sm font-semibold">Bank: <span className="text-primary-light">Islamic Bank PLC</span></div>
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-sm font-semibold">A/C: <span className="text-primary-light">123-456-7890</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
