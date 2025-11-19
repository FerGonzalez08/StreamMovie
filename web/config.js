// config.js - Configuración de la API
const API_CONFIG = {
    BASE_URL: 'https://streammovie-backend-epemguhkbvh9ejgp.canadacentral-01.azurewebsites.net',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        MOVIES: '/movies',
        MOVIE_BY_ID: (id) => `/movies/${id}`,
        USERS: '/users',
        USER_BY_ID: (id) => `/users/${id}`,
        ADMIN_BLOCK_BY_ID: (id) => `/admin/block/${id}`,
        ADMIN_BLOCK_BY_EMAIL: '/admin/block-by-email'
    }
};

async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (response.status === 204) {
            return { success: true };
        }

        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { message: text };
        }

        if (!response.ok) {
            const errorMessage = data.message || data || `Error ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Error de conexión. Verifica tu internet.');
        }
        throw error;
    }
}

const SessionManager = {
    setUser(user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    },

    getUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },

    clearUser() {
        try {
            localStorage.removeItem('currentUser');
        } catch (error) {
            console.error('Error al limpiar sesión:', error);
        }
    },

    isLoggedIn() {
        return this.getUser() !== null;
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    }
};