// user.js - Lógica del panel de usuario
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario esté logueado
    if (!SessionManager.isLoggedIn()) {
        alert('Debes iniciar sesión primero.');
        window.location.href = 'StreamMovie_login_clean.html';
        return;
    }

    const currentUser = SessionManager.getUser();
    let movies = [];
    let myList = JSON.parse(localStorage.getItem(`myList_${currentUser.id}`)) || [];

    // Cargar películas al iniciar
    loadMovies();

    // Manejar navegación
    setupNavigation();

    async function loadMovies() {
        try {
            movies = await apiRequest(API_CONFIG.ENDPOINTS.MOVIES);
            displayMovies();
        } catch (error) {
            console.error('Error al cargar películas:', error);
            showNotification('Error al cargar películas', 'error');
        }
    }

    function displayMovies() {
        const movieGrid = document.querySelector('.movie-grid');

        if (movies.length === 0) {
            movieGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay películas disponibles</p>';
            return;
        }

        movieGrid.innerHTML = movies.map(movie => {
            const isInList = myList.some(m => m.id === movie.id);
            return `
                <div class="movie-card" style="position: relative;">
                    <h3 style="margin: 0 0 10px 0;">${movie.titulo}</h3>
                    <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                    <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Director:</strong> ${movie.director || 'N/A'}</p>
                    <button
                        onclick="toggleMyList(${movie.id})"
                        style="
                            margin-top: 10px;
                            width: 100%;
                            padding: 8px;
                            background-color: ${isInList ? '#f44336' : '#4CAF50'};
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        "
                    >
                        ${isInList ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}
                    </button>
                </div>
            `;
        }).join('');
    }

    function setupNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                loadSection(section);
            });
        });
    }

    function loadSection(section) {
        const homeContent = document.querySelector('.home-content');

        switch(section) {
            case 'home':
                showHome();
                break;
            case 'movies':
                showAllMovies();
                break;
            case 'recommendations':
                showRecommendations();
                break;
            case 'my-list':
                showMyList();
                break;
            case 'profile':
                showProfile();
                break;
            default:
                homeContent.innerHTML = '<p>Sección en desarrollo</p>';
        }
    }

    function showHome() {
        const homeContent = document.querySelector('.home-content');
        homeContent.innerHTML = `
            <h2>¡Bienvenido, ${currentUser.userName}!</h2>
            <p>Descubre y disfruta de tus películas favoritas.</p>

            <div style="margin: 30px 0; padding: 20px; background-color: rgba(255,255,255,0.1); border-radius: 8px;">
                <h3>Estadísticas Personales</h3>
                <p>Películas en tu lista: <strong>${myList.length}</strong></p>
                <p>Total en catálogo: <strong>${movies.length}</strong></p>
            </div>

            <h3>Películas Destacadas</h3>
            <div class="movie-grid">
                ${movies.slice(0, 6).map(movie => {
                    const isInList = myList.some(m => m.id === movie.id);
                    return `
                        <div class="movie-card">
                            <h3 style="margin: 0 0 10px 0;">${movie.titulo}</h3>
                            <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                            <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                            <button
                                onclick="toggleMyList(${movie.id})"
                                style="
                                    margin-top: 10px;
                                    width: 100%;
                                    padding: 8px;
                                    background-color: ${isInList ? '#f44336' : '#4CAF50'};
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                "
                            >
                                ${isInList ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function showAllMovies() {
        const homeContent = document.querySelector('.home-content');
        homeContent.innerHTML = `
            <h2>Catálogo Completo</h2>
            <p>Explora todas las películas disponibles (${movies.length})</p>

            <div style="margin: 20px 0;">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Buscar por título..."
                    style="
                        width: 100%;
                        max-width: 400px;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        color: #333;
                    "
                >
            </div>

            <div class="movie-grid" id="movies-container">
                ${movies.map(movie => {
                    const isInList = myList.some(m => m.id === movie.id);
                    return `
                        <div class="movie-card" data-title="${movie.titulo.toLowerCase()}">
                            <h3 style="margin: 0 0 10px 0;">${movie.titulo}</h3>
                            <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                            <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Director:</strong> ${movie.director || 'N/A'}</p>
                            <button
                                onclick="toggleMyList(${movie.id})"
                                style="
                                    margin-top: 10px;
                                    width: 100%;
                                    padding: 8px;
                                    background-color: ${isInList ? '#f44336' : '#4CAF50'};
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                "
                            >
                                ${isInList ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Agregar funcionalidad de búsqueda
        document.getElementById('search-input').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const movieCards = document.querySelectorAll('.movie-card');

            movieCards.forEach(card => {
                const title = card.getAttribute('data-title');
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    function showRecommendations() {
        const homeContent = document.querySelector('.home-content');

        // Obtener géneros de películas en "Mi Lista"
        const myGenres = [...new Set(myList.map(m => m.genero))];

        // Recomendar películas del mismo género que no estén en Mi Lista
        const recommendations = movies.filter(movie =>
            myGenres.includes(movie.genero) && !myList.some(m => m.id === movie.id)
        );

        homeContent.innerHTML = `
            <h2>Recomendaciones Personalizadas</h2>
            <p>Basadas en tus películas favoritas</p>

            ${recommendations.length > 0 ? `
                <div class="movie-grid">
                    ${recommendations.map(movie => `
                        <div class="movie-card">
                            <h3 style="margin: 0 0 10px 0;">${movie.titulo}</h3>
                            <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                            <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Director:</strong> ${movie.director || 'N/A'}</p>
                            <button
                                onclick="toggleMyList(${movie.id})"
                                style="
                                    margin-top: 10px;
                                    width: 100%;
                                    padding: 8px;
                                    background-color: #4CAF50;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                "
                            >
                                Agregar a Mi Lista
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <p style="margin-top: 30px;">
                    ${myList.length === 0
                        ? 'Agrega películas a "Mi Lista" para recibir recomendaciones personalizadas.'
                        : 'No hay más películas similares para recomendar en este momento.'}
                </p>
            `}
        `;
    }

    function showMyList() {
        const homeContent = document.querySelector('.home-content');

        homeContent.innerHTML = `
            <h2>Mi Lista</h2>
            <p>Tus películas guardadas (${myList.length})</p>

            ${myList.length > 0 ? `
                <div class="movie-grid">
                    ${myList.map(movie => `
                        <div class="movie-card">
                            <h3 style="margin: 0 0 10px 0;">${movie.titulo}</h3>
                            <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                            <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Director:</strong> ${movie.director || 'N/A'}</p>
                            <button
                                onclick="toggleMyList(${movie.id})"
                                style="
                                    margin-top: 10px;
                                    width: 100%;
                                    padding: 8px;
                                    background-color: #f44336;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                "
                            >
                                Quitar de Mi Lista
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <p style="margin-top: 30px;">Tu lista está vacía. ¡Explora el catálogo y agrega tus películas favoritas!</p>
                <button
                    onclick="loadSection('movies')"
                    style="
                        margin-top: 20px;
                        padding: 12px 24px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    "
                >
                    Explorar Películas
                </button>
            `}
        `;
    }

    function showProfile() {
        const homeContent = document.querySelector('.home-content');
        homeContent.innerHTML = `
            <h2>Mi Perfil</h2>

            <div style="max-width: 500px; margin: 30px auto; padding: 20px; background-color: rgba(255,255,255,0.1); border-radius: 8px; text-align: left;">
                <p style="margin: 10px 0;"><strong>Nombre:</strong> ${currentUser.userName}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${currentUser.email}</p>
                <p style="margin: 10px 0;"><strong>Rol:</strong> ${currentUser.role}</p>
                <p style="margin: 10px 0;"><strong>Estado:</strong> ${currentUser.status}</p>
                <p style="margin: 10px 0;"><strong>Películas en Mi Lista:</strong> ${myList.length}</p>

                <button
                    onclick="logout()"
                    style="
                        margin-top: 20px;
                        width: 100%;
                        padding: 12px;
                        background-color: #f44336;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    "
                >
                    Cerrar Sesión
                </button>
            </div>
        `;
    }

    // Función global para agregar/quitar de Mi Lista
    window.toggleMyList = (movieId) => {
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        const index = myList.findIndex(m => m.id === movieId);

        if (index > -1) {
            // Quitar de la lista
            myList.splice(index, 1);
            showNotification(`"${movie.titulo}" eliminada de tu lista`, 'info');
        } else {
            // Agregar a la lista
            myList.push(movie);
            showNotification(`"${movie.titulo}" agregada a tu lista`, 'success');
        }

        // Guardar en localStorage
        localStorage.setItem(`myList_${currentUser.id}`, JSON.stringify(myList));

        // Recargar la vista actual
        const activeSection = document.querySelector('nav a').getAttribute('href').substring(1);
        loadSection(activeSection);
    };

    window.loadSection = loadSection;

    window.logout = () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            SessionManager.clearUser();
            window.location.href = 'StreamMovie_login_clean.html';
        }
    };

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Inicializar con la vista home
    showHome();
});