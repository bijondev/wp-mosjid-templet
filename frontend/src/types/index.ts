export interface WPPost {
    id: number;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
        }>;
    };
}

export interface MosqueEvent extends WPPost {
    meta: {
        event_date: string;
        event_time: string;
        event_location: string;
    };
}

export interface MosqueService extends WPPost {
    meta: {
        service_icon: string;
    };
}

export interface MosqueSermon extends WPPost {
    meta: {
        sermon_video_url: string;
        sermon_preacher: string;
    };
}

export interface MosqueDonation extends WPPost {
    meta: {
        donation_link: string;
    };
}
