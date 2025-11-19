// user.js - Panel de usuario mejorado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    if (!SessionManager.isLoggedIn()) {
        alert('Debes iniciar sesión primero.');
        window.location.href = 'StreamMovie_login_clean.html';
        return;
    }

    const currentUser = SessionManager.getUser();
    let movies = [];
    let myList = JSON.parse(localStorage.getItem(`myList_${currentUser.id}`)) || [];

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Navegación
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
            const section = e.target.getAttribute('data-section');
            loadSection(section);
        });
    });

    // Cargar películas
    loadMovies();

    async function loadMovies() {
        try {
            movies = await apiRequest(API_CONFIG.ENDPOINTS.MOVIES);
            loadSection('home');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al cargar películas', 'error');
        }
    }

    function loadSection(section) {
        switch(section) {
            case 'home':
                showHome();
                break;
            case 'movies':
                showAllMovies();
                break;
            case 'my-list':
                showMyList();
                break;
            case 'profile':
                showProfile();
                break;
        }
    }

    function showHome() {
        const mainContent = document.getElementById('main-content');
        const genres = [...new Set(movies.map(m => m.genero))];

        mainContent.innerHTML = `
            <div class="hero-section">
                <div class="hero-title">Bienvenido, ${currentUser.userName}</div>
                <div class="hero-subtitle">
                    Descubre miles de películas y series. Encuentra tu próxima obsesión.
                </div>
            </div>

            ${myList.length > 0 ? `
                <div class="section-title">Continuar viendo</div>
                <div class="movie-row">
                    ${myList.slice(0, 6).map(movie => createMovieCard(movie)).join('')}
                </div>
            ` : ''}

            <div class="section-title">Tendencias ahora</div>
            <div class="movie-row">
                ${movies.slice(0, 6).map(movie => createMovieCard(movie)).join('')}
            </div>

            ${genres.slice(0, 2).map(genre => {
                const genreMovies = movies.filter(m => m.genero === genre).slice(0, 6);
                return `
                    <div class="section-title">${genre}</div>
                    <div class="movie-row">
                        ${genreMovies.map(movie => createMovieCard(movie)).join('')}
                    </div>
                `;
            }).join('')}
        `;
    }

    function showAllMovies() {
        const mainContent = document.getElementById('main-content');

        mainContent.innerHTML = `
            <div style="margin-top: 20px;">
                <h2 class="section-title">Explorar Películas</h2>
                <p style="color: #b3b3b3; margin-bottom: 20px;">
                    ${movies.length} películas disponibles
                </p>

                <input
                    type="text"
                    id="search-input"
                    class="search-bar"
                    placeholder="Buscar películas por título..."
                >

                <div class="movie-row" id="movies-container">
                    ${movies.map(movie => createMovieCard(movie)).join('')}
                </div>
            </div>
        `;

        // Búsqueda en tiempo real
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const container = document.getElementById('movies-container');

            if (!searchTerm) {
                container.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
                return;
            }

            const filtered = movies.filter(movie =>
                movie.titulo.toLowerCase().includes(searchTerm) ||
                movie.genero.toLowerCase().includes(searchTerm) ||
                (movie.director && movie.director.toLowerCase().includes(searchTerm))
            );

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta con otro término de búsqueda</p>
                    </div>
                `;
            } else {
                container.innerHTML = filtered.map(movie => createMovieCard(movie)).join('');
            }
        });
    }

    function showMyList() {
        const mainContent = document.getElementById('main-content');

        if (myList.length === 0) {
            mainContent.innerHTML = `
                <div style="margin-top: 20px;">
                    <h2 class="section-title">Mi Lista</h2>
                    <div class="empty-state">
                        <h3>Tu lista está vacía</h3>
                        <p>Agrega películas para verlas más tarde</p>
                        <button
                            onclick="loadSection('movies')"
                            class="btn-list btn-add"
                            style="width: auto; padding: 12px 24px; margin-top: 20px;"
                        >
                            Explorar Películas
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Agrupar por género
        const byGenre = {};
        myList.forEach(movie => {
            if (!byGenre[movie.genero]) {
                byGenre[movie.genero] = [];
            }
            byGenre[movie.genero].push(movie);
        });

        mainContent.innerHTML = `
            <div style="margin-top: 20px;">
                <h2 class="section-title">Mi Lista (${myList.length})</h2>
                <p style="color: #b3b3b3; margin-bottom: 30px;">
                    Tus películas guardadas
                </p>

                ${Object.keys(byGenre).map(genre => `
                    <div class="section-title" style="font-size: 18px; margin-top: 30px;">
                        ${genre} (${byGenre[genre].length})
                    </div>
                    <div class="movie-row">
                        ${byGenre[genre].map(movie => createMovieCard(movie)).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showProfile() {
        const mainContent = document.getElementById('main-content');
        const genres = [...new Set(myList.map(m => m.genero))];
        const favoriteGenre = genres.length > 0 ?
            genres.reduce((a, b) =>
                myList.filter(m => m.genero === a).length > myList.filter(m => m.genero === b).length ? a : b
            ) : 'Ninguno';

        mainContent.innerHTML = `
            <div style="margin-top: 20px; max-width: 800px; margin-left: auto; margin-right: auto;">
                <h2 class="section-title">Mi Perfil</h2>

                <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 8px; margin-bottom: 30px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
                        <div>
                            <div style="color: #b3b3b3; font-size: 13px; margin-bottom: 5px;">Nombre</div>
                            <div style="font-size: 18px; font-weight: 600;">${currentUser.userName}</div>
                        </div>
                        <div>
                            <div style="color: #b3b3b3; font-size: 13px; margin-bottom: 5px;">Email</div>
                            <div style="font-size: 18px; font-weight: 600;">${currentUser.email}</div>
                        </div>
                        <div>
                            <div style="color: #b3b3b3; font-size: 13px; margin-bottom: 5px;">Rol</div>
                            <div style="font-size: 18px; font-weight: 600; text-transform: capitalize;">${currentUser.role}</div>
                        </div>
                        <div>
                            <div style="color: #b3b3b3; font-size: 13px; margin-bottom: 5px;">Estado</div>
                            <div style="font-size: 18px; font-weight: 600; color: ${currentUser.status === 'ACTIVE' ? '#4CAF50' : '#e50914'};">
                                ${currentUser.status}
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="margin-bottom: 20px; font-size: 20px;">Estadísticas</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; color: #e50914;">${myList.length}</div>
                            <div style="color: #b3b3b3; font-size: 13px;">En Mi Lista</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; color: #e50914;">${genres.length}</div>
                            <div style="color: #b3b3b3; font-size: 13px;">Géneros</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 20px; font-weight: bold; color: #e50914;">${favoriteGenre}</div>
                            <div style="color: #b3b3b3; font-size: 13px;">Favorito</div>
                        </div>
                    </div>
                </div>

                <button
                    onclick="logout()"
                    class="btn-list btn-remove"
                    style="max-width: 300px; margin: 0 auto; display: block;"
                >
                    Cerrar Sesión
                </button>
            </div>
        `;
    }

    function createMovieCard(movie) {
        const isInList = myList.some(m => m.id === movie.id);
        const year = movie.anio || 'N/A';
        const director = movie.director || 'Desconocido';

        return `
            <div class="movie-card">
                <div class="movie-poster">
                    ${movie.titulo.substring(0, 3).toUpperCase()}
                </div>
                <div class="movie-info-card">
                    <div class="movie-title-card" title="${movie.titulo}">
                        ${movie.titulo}
                    </div>
                    <div class="movie-meta">${movie.genero} • ${year}</div>
                    <div class="movie-meta">${director}</div>
                    <button
                        onclick="toggleMyList(${movie.id})"
                        class="btn-list ${isInList ? 'btn-remove' : 'btn-add'}"
                    >
                        ${isInList ? '✓ En Mi Lista' : '+ Agregar'}
                    </button>
                </div>
            </div>
        `;
    }

    // Funciones globales
    window.toggleMyList = (movieId) => {
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        const index = myList.findIndex(m => m.id === movieId);

        if (index > -1) {
            myList.splice(index, 1);
            showNotification(`"${movie.titulo}" eliminada de tu lista`, 'info');
        } else {
            myList.push(movie);
            showNotification(`"${movie.titulo}" agregada a tu lista`, 'success');
        }

        localStorage.setItem(`myList_${currentUser.id}`, JSON.stringify(myList));

        // Recargar la sección actual
        const activeSection = document.querySelector('nav a.active').getAttribute('data-section');
        loadSection(activeSection);
    };

    window.loadSection = loadSection;

    window.logout = () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            SessionManager.clearUser();
            window.location.href = 'StreamMovie_login_clean.html';
        }
    };

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});