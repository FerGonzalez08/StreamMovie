// admin.js - Panel de administración con validaciones
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    if (!SessionManager.isLoggedIn() || !SessionManager.isAdmin()) {
        alert('Acceso denegado. Debes ser administrador.');
        window.location.href = 'StreamMovie_login_clean.html';
        return;
    }

    const currentUser = SessionManager.getUser();
    let movies = [];

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
        const mainContent = document.getElementById('main-content');

        switch(section) {
            case 'home':
                showDashboard();
                break;
            case 'add-movie':
                showAddMovieForm();
                break;
            case 'movies':
                showMoviesList();
                break;
            case 'profile':
                showProfile();
                break;
        }
    }

    function showDashboard() {
        const mainContent = document.getElementById('main-content');
        const totalMovies = movies.length;
        const latestYear = movies.length > 0 ? Math.max(...movies.map(m => m.anio || 0)) : 0;

        mainContent.innerHTML = `
            <div class="section-title">Dashboard de Administración</div>
            <p style="color: #b3b3b3; margin-bottom: 30px;">Bienvenido, ${currentUser.userName}</p>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${totalMovies}</div>
                    <div class="stat-label">Total Películas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${latestYear}</div>
                    <div class="stat-label">Año Más Reciente</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${new Set(movies.map(m => m.genero)).size}</div>
                    <div class="stat-label">Géneros Diferentes</div>
                </div>
            </div>

            <div class="section-title" style="margin-top: 40px;">Películas Recientes</div>
            <div class="movie-grid">
                ${movies.slice(0, 6).map(movie => `
                    <div class="movie-card">
                        <div class="movie-title">${movie.titulo}</div>
                        <div class="movie-info">${movie.genero}</div>
                        <div class="movie-info">${movie.anio || 'N/A'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showAddMovieForm() {
        const mainContent = document.getElementById('main-content');

        mainContent.innerHTML = `
            <div class="section-title">Agregar Nueva Película</div>

            <div class="form-container">
                <form id="add-movie-form">
                    <div class="form-group">
                        <label for="titulo">Título *</label>
                        <input type="text" id="titulo" required>
                        <span class="error-message" id="titulo-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="genero">Género *</label>
                        <select id="genero" required>
                            <option value="">Seleccionar género</option>
                            <option value="Acción">Acción</option>
                            <option value="Comedia">Comedia</option>
                            <option value="Drama">Drama</option>
                            <option value="Terror">Terror</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                            <option value="Romance">Romance</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Animación">Animación</option>
                            <option value="Documental">Documental</option>
                        </select>
                        <span class="error-message" id="genero-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="anio">Año</label>
                        <input type="number" id="anio" min="1900" max="2100">
                        <span class="error-message" id="anio-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="director">Director</label>
                        <input type="text" id="director">
                        <span class="error-message" id="director-error"></span>
                    </div>

                    <button type="submit" class="btn">Agregar Película</button>
                </form>
            </div>
        `;

        // Validación del formulario
        const form = document.getElementById('add-movie-form');
        const inputs = {
            titulo: document.getElementById('titulo'),
            genero: document.getElementById('genero'),
            anio: document.getElementById('anio'),
            director: document.getElementById('director')
        };

        // Validación en tiempo real
        inputs.titulo.addEventListener('blur', () => validateMovieField('titulo'));
        inputs.genero.addEventListener('change', () => validateMovieField('genero'));
        inputs.anio.addEventListener('blur', () => validateMovieField('anio'));

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar todos los campos
            const isTituloValid = validateMovieField('titulo');
            const isGeneroValid = validateMovieField('genero');
            const isAnioValid = validateMovieField('anio');

            if (!isTituloValid || !isGeneroValid || !isAnioValid) {
                showNotification('Por favor corrige los errores', 'error');
                return;
            }

            const movieData = {
                titulo: inputs.titulo.value.trim(),
                genero: inputs.genero.value,
                anio: inputs.anio.value ? parseInt(inputs.anio.value) : null,
                director: inputs.director.value.trim() || null
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
                showNotification('Error: ' + error.message, 'error');
            }
        });
    }

    function validateMovieField(fieldName) {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(fieldName) {
            case 'titulo':
                if (!value) {
                    errorMessage = 'El título es requerido';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'El título debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'genero':
                if (!value) {
                    errorMessage = 'Selecciona un género';
                    isValid = false;
                }
                break;

            case 'anio':
                if (value) {
                    const year = parseInt(value);
                    if (year < 1900 || year > 2100) {
                        errorMessage = 'El año debe estar entre 1900 y 2100';
                        isValid = false;
                    }
                }
                break;
        }

        // ✅ CORRECCIÓN: Usar template literals con backticks
        const errorSpan = document.getElementById(`${fieldName}-error`);
        if (errorSpan) {
            if (!isValid) {
                errorSpan.textContent = errorMessage;
                errorSpan.style.color = '#e50914';
                errorSpan.style.fontSize = '12px';
                errorSpan.style.marginTop = '5px';
                errorSpan.style.display = 'block';
                input.style.borderColor = '#e50914';
            } else {
                errorSpan.textContent = '';
                errorSpan.style.display = 'none';
                input.style.borderColor = '#555';
            }
        }

        return isValid;
    }

    function showMoviesList() {
        const mainContent = document.getElementById('main-content');

        mainContent.innerHTML = `
            <div class="section-title">Catálogo Completo (${movies.length})</div>

            <div class="movie-grid">
                ${movies.map(movie => `
                    <div class="movie-card">
                        <div class="movie-title">${movie.titulo}</div>
                        <div class="movie-info">Género: ${movie.genero}</div>
                        <div class="movie-info">Año: ${movie.anio || 'N/A'}</div>
                        <div class="movie-info">Director: ${movie.director || 'N/A'}</div>
                        <div class="movie-actions">
                            <button class="btn btn-secondary" onclick="editMovie(${movie.id})" style="font-size: 12px; padding: 8px 12px;">
                                Editar
                            </button>
                            <button class="btn btn-danger" onclick="deleteMovie(${movie.id})" style="font-size: 12px; padding: 8px 12px;">
                                Eliminar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showProfile() {
        const mainContent = document.getElementById('main-content');

        mainContent.innerHTML = `
            <div class="section-title">Mi Perfil</div>

            <div class="form-container">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #b3b3b3;">Nombre</label>
                    <div style="padding: 14px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                        ${currentUser.userName}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #b3b3b3;">Email</label>
                    <div style="padding: 14px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                        ${currentUser.email}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #b3b3b3;">Rol</label>
                    <div style="padding: 14px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                        ${currentUser.role}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #b3b3b3;">Estado</label>
                    <div style="padding: 14px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                        ${currentUser.status}
                    </div>
                </div>

                <button onclick="logout()" class="btn btn-danger" style="width: 100%;">
                    Cerrar Sesión
                </button>
            </div>
        `;
    }

    // Funciones globales
    window.deleteMovie = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta película?')) return;

        try {
            await apiRequest(API_CONFIG.ENDPOINTS.MOVIE_BY_ID(id), {
                method: 'DELETE'
            });
            showNotification('Película eliminada', 'success');
            await loadMovies();
            showMoviesList();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    };

    window.editMovie = async (id) => {
        const movie = movies.find(m => m.id === id);
        if (!movie) return;

        const mainContent = document.getElementById('main-content');

        mainContent.innerHTML = `
            <div class="section-title">Editar Película</div>

            <div class="form-container">
                <form id="edit-movie-form">
                    <div class="form-group">
                        <label for="edit-titulo">Título *</label>
                        <input type="text" id="edit-titulo" value="${movie.titulo}" required>
                        <span class="error-message" id="edit-titulo-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="edit-genero">Género *</label>
                        <select id="edit-genero" required>
                            <option value="">Seleccionar género</option>
                            <option value="Acción" ${movie.genero === 'Acción' ? 'selected' : ''}>Acción</option>
                            <option value="Comedia" ${movie.genero === 'Comedia' ? 'selected' : ''}>Comedia</option>
                            <option value="Drama" ${movie.genero === 'Drama' ? 'selected' : ''}>Drama</option>
                            <option value="Terror" ${movie.genero === 'Terror' ? 'selected' : ''}>Terror</option>
                            <option value="Ciencia Ficción" ${movie.genero === 'Ciencia Ficción' ? 'selected' : ''}>Ciencia Ficción</option>
                            <option value="Romance" ${movie.genero === 'Romance' ? 'selected' : ''}>Romance</option>
                            <option value="Thriller" ${movie.genero === 'Thriller' ? 'selected' : ''}>Thriller</option>
                            <option value="Animación" ${movie.genero === 'Animación' ? 'selected' : ''}>Animación</option>
                            <option value="Documental" ${movie.genero === 'Documental' ? 'selected' : ''}>Documental</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit-anio">Año</label>
                        <input type="number" id="edit-anio" value="${movie.anio || ''}" min="1900" max="2100">
                    </div>

                    <div class="form-group">
                        <label for="edit-director">Director</label>
                        <input type="text" id="edit-director" value="${movie.director || ''}">
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn">Guardar Cambios</button>
                        <button type="button" class="btn btn-secondary" onclick="loadSection('movies')">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('edit-movie-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedMovie = {
                titulo: document.getElementById('edit-titulo').value.trim(),
                genero: document.getElementById('edit-genero').value,
                anio: document.getElementById('edit-anio').value ? parseInt(document.getElementById('edit-anio').value) : null,
                director: document.getElementById('edit-director').value.trim() || null
            };

            // Validaciones
            if (!updatedMovie.titulo || updatedMovie.titulo.length < 2) {
                showNotification('El título debe tener al menos 2 caracteres', 'error');
                return;
            }

            if (!updatedMovie.genero) {
                showNotification('Selecciona un género', 'error');
                return;
            }

            try {
                await apiRequest(API_CONFIG.ENDPOINTS.MOVIE_BY_ID(id), {
                    method: 'PUT',
                    body: JSON.stringify(updatedMovie)
                });
                showNotification('Película actualizada', 'success');
                await loadMovies();
                showMoviesList();
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        });
    };

    window.logout = () => {
        if (confirm('¿Cerrar sesión?')) {
            SessionManager.clearUser();
            window.location.href = 'StreamMovie_login_clean.html';
        }
    };

    window.loadSection = loadSection;

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});