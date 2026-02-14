import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const { branding, contact, social } = useSettings();

    return (
        <footer className="bg-secondary text-white">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold font-sans text-primary mb-4">{branding.mosqueName}</h3>
                        <p className="text-gray-300 max-w-sm font-sans">
                            {branding.description || "A place of worship, community, and spiritual growth. Join us for prayers and events."}
                        </p>
                        <div className="flex space-x-4 mt-6">
                            {social.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <Facebook className="h-6 w-6" />
                                </a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram className="h-6 w-6" />
                                </a>
                            )}
                            {social.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <Twitter className="h-6 w-6" />
                                </a>
                            )}
                            {social.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">YouTube</span>
                                    <Youtube className="h-6 w-6" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/prayer-times" className="text-gray-400 hover:text-primary transition-colors">Prayer Times</Link></li>
                            <li><Link to="/events" className="text-gray-400 hover:text-primary transition-colors">Events</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/donate" className="text-gray-400 hover:text-primary transition-colors">Donate</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="whitespace-pre-line">{contact.address}</li>
                            <li><a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a></li>
                            <li><a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">{contact.phone}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} {branding.mosqueName}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
