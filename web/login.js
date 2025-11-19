// login.js - Maneja el login de usuarios
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const signInBtn = document.querySelector('.sign-in');
    const signOutBtn = document.querySelector('.sign-out');

    // Manejar Sign In
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            signInBtn.disabled = true;
            signInBtn.textContent = 'Iniciando sesión...';

            // Llamar al endpoint de login
            const user = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({
                    identifier: username,
                    password: password
                })
            });

            // Verificar si el usuario está bloqueado
            if (user.status === 'BLOCKED') {
                showMessage('Tu cuenta ha sido bloqueada. Contacta al administrador.', 'error');
                return;
            }

            // Guardar sesión
            SessionManager.setUser(user);
            showMessage('¡Inicio de sesión exitoso!', 'success');

            // Redirigir según el rol
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'StreamMovie_admin_clean.html';
                } else {
                    window.location.href = 'StreamMovie_user_clean.html';
                }
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            showMessage('Usuario o contraseña incorrectos', 'error');
        } finally {
            signInBtn.disabled = false;
            signInBtn.textContent = 'Sign In';
        }
    });

    // Manejar Sign Out
    signOutBtn.addEventListener('click', () => {
        SessionManager.clearUser();
        showMessage('Sesión cerrada', 'success');
        form.reset();
    });

    // Función para mostrar mensajes
    function showMessage(message, type) {
        // Eliminar mensaje anterior si existe
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
        `;

        form.appendChild(messageDiv);

        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Verificar si ya hay sesión activa
    if (SessionManager.isLoggedIn()) {
        const user = SessionManager.getUser();
        const redirect = user.role === 'admin'
            ? 'StreamMovie_admin_clean.html'
            : 'StreamMovie_user_clean.html';

        if (confirm('Ya tienes una sesión activa. ¿Deseas continuar?')) {
            window.location.href = redirect;
        }
    }
});