import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import type { MosqueEvent, MosqueService, MosqueSermon, MosqueDonation, MosqueGallery, MosqueHeroSlide } from '../types';

// Helper to fetch posts
const fetchPosts = async <T>(endpoint: string, params: any = {}) => {
    const response = await api.get<T[]>(endpoint, {
        params: {
            _embed: true, // To include featured images
            per_page: 3,  // Default limit
            ...params
        }
    });
    return response.data;
};

// Helper to fetch a single post
const fetchSinglePost = async <T>(endpoint: string, idOrSlug: string) => {
    const response = await api.get<T>(`${endpoint}/${idOrSlug}`, {
        params: { _embed: true }
    });
    return response.data;
};

export const useEvents = (limit = 3) => {
    return useQuery({
        queryKey: ['events', limit],
        queryFn: async () => {
            const events = await fetchPosts<MosqueEvent>('/wp/v2/mosque_event', {
                per_page: 100 // Fetch more to allow client-side filtration/sorting
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Filter out past events, sort by date ASC, and limit
            return events
                .filter(e => {
                    if (!e.meta?.event_date) return false;
                    const eventDate = new Date(e.meta.event_date);
                    return eventDate >= today;
                })
                .sort((a, b) => {
                    const dateA = new Date(a.meta.event_date).getTime();
                    const dateB = new Date(b.meta.event_date).getTime();
                    return dateA - dateB;
                })
                .slice(0, limit);
        },
    });
};

export const useEvent = (id: string | undefined) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => id ? fetchSinglePost<MosqueEvent>('/wp/v2/mosque_event', id) : Promise.reject('No ID provided'),
        enabled: !!id,
    });
};

export const useServices = (limit = 3) => {
    return useQuery({
        queryKey: ['services', limit],
        queryFn: () => fetchPosts<MosqueService>('/wp/v2/mosque_service', { per_page: limit }),
    });
};

export const useService = (id: string | undefined) => {
    return useQuery({
        queryKey: ['service', id],
        queryFn: () => id ? fetchSinglePost<MosqueService>('/wp/v2/mosque_service', id) : Promise.reject('No ID provided'),
        enabled: !!id,
    });
};

export const useSermons = (limit = 3) => {

    return useQuery({
        queryKey: ['sermons', limit],
        queryFn: () => fetchPosts<MosqueSermon>('/wp/v2/mosque_sermon', { per_page: limit }),
    });
};

export const useDonations = (limit = 10) => {
    return useQuery({
        queryKey: ['donations', limit],
        queryFn: () => fetchPosts<MosqueDonation>('/wp/v2/mosque_donation', { per_page: limit }),
    });
};

export const usePage = (slug: string) => {
    return useQuery({
        queryKey: ['page', slug],
        queryFn: async () => {
            const pages = await fetchPosts<any>('/wp/v2/pages', { slug });
            return pages.length > 0 ? pages[0] : null;
        },
        enabled: !!slug,
    });
};

export const useGallery = (limit = 100) => {
    return useQuery({
        queryKey: ['gallery', limit],
        queryFn: () => fetchPosts<MosqueGallery>('/wp/v2/mosque_gallery', { per_page: limit }),
    });
};

export const useHeroSlides = (limit = 10) => {
    return useQuery({
        queryKey: ['hero-slides', limit],
        queryFn: () => fetchPosts<MosqueHeroSlide>('/wp/v2/mosque_hero_slide', { per_page: limit }),
    });
};
