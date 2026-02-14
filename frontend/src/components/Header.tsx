import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { branding } = useSettings();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Prayer Times', href: '/prayer-times' },
        { name: 'Services', href: '/services' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Events', href: '/events' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="flex w-full items-center justify-between border-b border-indigo-500 py-4 lg:border-none">
                    <div className="flex items-center">
                        <Link to="/">
                            <span className="sr-only">{branding.mosqueName}</span>
                            {branding.logoUrl ? (
                                <img src={branding.logoUrl} alt={branding.mosqueName} className="h-12 w-auto" />
                            ) : (
                                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">M</div>
                            )}
                        </Link>
                        <div className="hidden ml-10 space-x-8 lg:block">
                            {navigation.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="ml-10 space-x-4 flex items-center">
                        <Link
                            to="/donate"
                            className="inline-block bg-primary py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-yellow-600 transition-colors"
                        >
                            Donate
                        </Link>
                        <div className="lg:hidden">
                            <button
                                type="button"
                                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="sr-only">Open menu</span>
                                {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={clsx("lg:hidden", isOpen ? "block" : "hidden")}>
                    <div className="pt-2 pb-4 space-y-1">
                        {navigation.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
