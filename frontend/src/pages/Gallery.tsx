import { useState } from 'react';
import { useGallery } from '../hooks/useContent';
import { useSettings } from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';
import { X, Maximize2, ImageIcon } from 'lucide-react';

export default function Gallery() {
    const { branding } = useSettings();
    const { data: galleryItems, isLoading } = useGallery(100);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const openLightbox = (item: any) => {
        setSelectedImage(item);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <Helmet>
                <title>Gallery | {branding.mosqueName}</title>
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={branding.galleryHeroImage || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt="Gallery"
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white font-outfit animate-fade-in-up tracking-tight">
                        Our Gallery
                    </h1>
                    <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full animate-fade-in-up animation-delay-200"></div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                {galleryItems?.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl font-medium">No images in the gallery yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {galleryItems?.map((item) => {
                            const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                            if (!imageUrl) return null;

                            return (
                                <div
                                    key={item.id}
                                    className="relative group break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
                                    onClick={() => openLightbox(item)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={item.title.rendered}
                                        className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <div className="bg-white/20 backdrop-blur-md self-center p-3 rounded-full mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <Maximize2 className="text-white w-6 h-6" />
                                        </div>
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                            <h3 className="text-white font-bold text-lg mb-1" dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                                            {item.excerpt.rendered && (
                                                <div
                                                    className="text-white/80 text-sm line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: item.excerpt.rendered }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-fade-in"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20 z-[110]"
                        onClick={closeLightbox}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="relative max-w-6xl w-full h-full flex flex-col justify-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex-grow flex items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                            <img
                                src={selectedImage._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                                alt={selectedImage.title.rendered}
                                className="max-w-full max-h-full object-contain animate-zoom-in"
                            />
                        </div>

                        <div className="text-center animate-fade-in-up">
                            <h3 className="text-white text-2xl font-bold mb-2 font-outfit" dangerouslySetInnerHTML={{ __html: selectedImage.title.rendered }} />
                            {selectedImage.excerpt.rendered && (
                                <div
                                    className="text-white/70 text-lg max-w-2xl mx-auto"
                                    dangerouslySetInnerHTML={{ __html: selectedImage.excerpt.rendered }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
