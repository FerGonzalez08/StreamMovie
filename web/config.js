// config.js - Configuración mejorada de la API
const API_CONFIG = {
    BASE_URL: 'https://streammovie-backend-epemguhkbvh9ejgp.canadacentral-01.azurewebsites.net',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',

        // Movies
        MOVIES: '/movies',
        MOVIE_BY_ID: (id) => /movies/${id},

        // Users
        USERS: '/users',
        USER_BY_ID: (id) => /users/${id},

        // Admin
        ADMIN_BLOCK_BY_ID: (id) => /admin/block/${id},
        ADMIN_BLOCK_BY_EMAIL: '/admin/block-by-email'
    }
};

// Función mejorada para hacer peticiones con manejo de errores
async function apiRequest(endpoint, options = {}) {
    const url = ${API_CONFIG.BASE_URL}${endpoint};

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);

        // Si es 204 No Content, retornar éxito
        if (response.status === 204) {
            return { success: true };
        }

        // Intentar parsear como JSON
        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Si no es JSON, obtener como texto
            const text = await response.text();
            data = { message: text };
        }

        // Si la respuesta no es OK, lanzar error con mensaje descriptivo
        if (!response.ok) {
            const errorMessage = data.message || data || Error ${response.status};
            throw new Error(errorMessage);
        }

        return data;

    } catch (error) {
        // Si es error de red
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Error de red:', error);
            throw new Error('Error de conexión. Verifica tu internet o que el servidor esté activo.');
        }

        // Re-lanzar el error con más contexto
        console.error('API Error:', error);
        throw error;
    }
}

// Gestión de sesión en localStorage
const SessionManager = {
    setUser(user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('Usuario guardado en sesión:', user.userName);
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
            console.log('Sesión cerrada');
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
    },

    isBlocked() {
        const user = this.getUser();
        return user && user.status === 'BLOCKED';
    }
};