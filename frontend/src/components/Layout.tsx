import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function Layout({ children, title = 'Mosque Theme', description }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description || 'Mosque website'} />
            </Helmet>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
