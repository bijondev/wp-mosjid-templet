import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrayerTimes from './pages/PrayerTimes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Sermons from './pages/Sermons';
import SermonDetail from './pages/SermonDetail';
import { SettingsProvider } from './context/SettingsContext';
import { PrayerTimesProvider } from './context/PrayerTimesContext';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <PrayerTimesProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/prayer-times" element={<PrayerTimes />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/sermons" element={<Sermons />} />
                  <Route path="/sermons/:id" element={<SermonDetail />} />
                </Routes>
              </Layout>
            </Router>
          </PrayerTimesProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
