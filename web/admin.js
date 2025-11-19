// admin.js - Lógica del panel de administración
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario sea admin
    if (!SessionManager.isLoggedIn() || !SessionManager.isAdmin()) {
        alert('Acceso denegado. Debes ser administrador.');
        window.location.href = 'StreamMovie_login_clean.html';
        return;
    }

    const currentUser = SessionManager.getUser();
    let movies = [];

    // Cargar películas al iniciar
    loadMovies();

    // Manejar navegación
    setupNavigation();

    // Funciones principales
    async function loadMovies() {
        try {
            movies = await apiRequest(API_CONFIG.ENDPOINTS.MOVIES);
            updateDashboard();
        } catch (error) {
            console.error('Error al cargar películas:', error);
            showNotification('Error al cargar películas', 'error');
        }
    }

    function updateDashboard() {
        const dashboardContent = document.querySelector('.dashboard-content');

        dashboardContent.innerHTML = `
            <h2>Admin Dashboard</h2>
            <p>Bienvenido, <strong>${currentUser.userName}</strong>!</p>

            <div style="margin: 30px 0; padding: 20px; background-color: #fff; border-radius: 8px;">
                <h3 style="color: #333; margin-bottom: 15px;">Estadísticas</h3>
                <p style="color: #333;">Total de películas en el catálogo: <strong>${movies.length}</strong></p>
                <p style="color: #333;">Última actualización: ${new Date().toLocaleDateString()}</p>
            </div>

            <div id="content-section">
                <p>Usa el menú superior para gestionar películas.</p>
            </div>
        `;
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
        const contentSection = document.getElementById('content-section') ||
                             document.querySelector('.dashboard-content');

        switch(section) {
            case 'add-movie':
                showAddMovieForm();
                break;
            case 'erase-movie':
                showDeleteMovieSection();
                break;
            case 'edit-movie':
                showEditMovieSection();
                break;
            case 'movies':
                showMoviesList();
                break;
            case 'profile':
                showProfile();
                break;
            case 'home':
                updateDashboard();
                break;
            default:
                contentSection.innerHTML = '<p>Sección en desarrollo</p>';
        }
    }

    function showAddMovieForm() {
        const contentSection = document.getElementById('content-section');
        contentSection.innerHTML = `
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Agregar Nueva Película</h3>
                <form id="add-movie-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Título:</label>
                        <input type="text" id="titulo" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Género:</label>
                        <input type="text" id="genero" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Año:</label>
                        <input type="number" id="anio" min="1900" max="2100" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Director:</label>
                        <input type="text" id="director" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                        Agregar Película
                    </button>
                </form>
            </div>
        `;

        document.getElementById('add-movie-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const movieData = {
                titulo: document.getElementById('titulo').value,
                genero: document.getElementById('genero').value,
                anio: parseInt(document.getElementById('anio').value) || null,
                director: document.getElementById('director').value || null
            };

            try {
                await apiRequest(API_CONFIG.ENDPOINTS.MOVIES, {
                    method: 'POST',
                    body: JSON.stringify(movieData)
                });

                showNotification('Película agregada exitosamente', 'success');
                await loadMovies();
                loadSection('movies');
            } catch (error) {
                showNotification('Error al agregar película: ' + error.message, 'error');
            }
        });
    }

    function showDeleteMovieSection() {
        const contentSection = document.getElementById('content-section');

        const moviesHTML = movies.map(movie => `
            <div style="background-color: #fff; padding: 15px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #333;">
                    <strong>${movie.titulo}</strong> (${movie.anio || 'N/A'}) - ${movie.genero}
                </div>
                <button onclick="deleteMovie(${movie.id})" style="background-color: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                    Eliminar
                </button>
            </div>
        `).join('');

        contentSection.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Eliminar Películas</h3>
                ${moviesHTML || '<p>No hay películas disponibles</p>'}
            </div>
        `;
    }

    function showEditMovieSection() {
        const contentSection = document.getElementById('content-section');

        const moviesHTML = movies.map(movie => `
            <div style="background-color: #fff; padding: 15px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #333;">
                    <strong>${movie.titulo}</strong> (${movie.anio || 'N/A'}) - ${movie.genero}
                </div>
                <button onclick="editMovie(${movie.id})" style="background-color: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                    Editar
                </button>
            </div>
        `).join('');

        contentSection.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Editar Películas</h3>
                ${moviesHTML || '<p>No hay películas disponibles</p>'}
            </div>
        `;
    }

    function showMoviesList() {
        const contentSection = document.getElementById('content-section');

        const moviesHTML = movies.map(movie => `
            <div style="background-color: #fff; padding: 15px; margin-bottom: 10px; border-radius: 5px; color: #333;">
                <h4 style="margin: 0 0 10px 0;">${movie.titulo}</h4>
                <p style="margin: 5px 0;"><strong>Género:</strong> ${movie.genero}</p>
                <p style="margin: 5px 0;"><strong>Año:</strong> ${movie.anio || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Director:</strong> ${movie.director || 'N/A'}</p>
            </div>
        `).join('');

        contentSection.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Catálogo de Películas (${movies.length})</h3>
                <div style="max-height: 600px; overflow-y: auto;">
                    ${moviesHTML || '<p>No hay películas disponibles</p>'}
                </div>
            </div>
        `;
    }

    function showProfile() {
        const contentSection = document.getElementById('content-section');
        contentSection.innerHTML = `
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Perfil de Administrador</h3>
                <p style="color: #333;"><strong>Nombre:</strong> ${currentUser.userName}</p>
                <p style="color: #333;"><strong>Email:</strong> ${currentUser.email}</p>
                <p style="color: #333;"><strong>Rol:</strong> ${currentUser.role}</p>
                <p style="color: #333;"><strong>Estado:</strong> ${currentUser.status}</p>
                <button onclick="logout()" style="margin-top: 20px; width: 100%; padding: 12px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cerrar Sesión
                </button>
            </div>
        `;
    }

    // Funciones globales para botones
    window.deleteMovie = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta película?')) return;

        try {
            await apiRequest(API_CONFIG.ENDPOINTS.MOVIE_BY_ID(id), {
                method: 'DELETE'
            });
            showNotification('Película eliminada exitosamente', 'success');
            await loadMovies();
            showDeleteMovieSection();
        } catch (error) {
            showNotification('Error al eliminar: ' + error.message, 'error');
        }
    };

    window.editMovie = async (id) => {
        const movie = movies.find(m => m.id === id);
        if (!movie) return;

        const contentSection = document.getElementById('content-section');
        contentSection.innerHTML = `
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h3 style="color: #333; margin-bottom: 20px;">Editar Película</h3>
                <form id="edit-movie-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Título:</label>
                        <input type="text" id="edit-titulo" value="${movie.titulo}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Género:</label>
                        <input type="text" id="edit-genero" value="${movie.genero}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Año:</label>
                        <input type="number" id="edit-anio" value="${movie.anio || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: #333; margin-bottom: 5px;">Director:</label>
                        <input type="text" id="edit-director" value="${movie.director || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        `;

        document.getElementById('edit-movie-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedMovie = {
                titulo: document.getElementById('edit-titulo').value,
                genero: document.getElementById('edit-genero').value,
                anio: parseInt(document.getElementById('edit-anio').value) || null,
                director: document.getElementById('edit-director').value || null
            };

            try {
                await apiRequest(API_CONFIG.ENDPOINTS.MOVIE_BY_ID(id), {
                    method: 'PUT',
                    body: JSON.stringify(updatedMovie)
                });
                showNotification('Película actualizada exitosamente', 'success');
                await loadMovies();
                showEditMovieSection();
            } catch (error) {
                showNotification('Error al actualizar: ' + error.message, 'error');
            }
        });
    };

    window.logout = () => {
        SessionManager.clearUser();
        window.location.href = 'StreamMovie_login_clean.html';
    };

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});