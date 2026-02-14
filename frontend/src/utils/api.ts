import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_WP_API_URL || 'http://localhost/masjidbaitunnoor/server-wordpress/wp-json',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const aladhanApi = axios.create({
    baseURL: 'https://api.aladhan.com/v1',
});

export default api;
