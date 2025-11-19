// config.js - Configuración de la API
const API_CONFIG = {
    BASE_URL: 'https://streammovie-backend-epemguhkbvh9ejgp.canadacentral-01.azurewebsites.net',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',

        // Movies
        MOVIES: '/movies',
        MOVIE_BY_ID: (id) => `/movies/${id}`,

        // Users
        USERS: '/users',
        USER_BY_ID: (id) => `/users/${id}`,

        // Admin
        ADMIN_BLOCK_BY_ID: (id) => `/admin/block/${id}`,
        ADMIN_BLOCK_BY_EMAIL: '/admin/block-by-email'
    }
};

// Función helper para hacer peticiones
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);

        // Si es 204 No Content, no intentes parsear JSON
        if (response.status === 204) {
            return { success: true };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Error ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Gestión de sesión en localStorage
const SessionManager = {
    setUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    clearUser() {
        localStorage.removeItem('currentUser');
    },

    isLoggedIn() {
        return this.getUser() !== null;
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    }
};