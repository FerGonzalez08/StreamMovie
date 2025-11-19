// login.js - Maneja el login con validaciones
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    // Verificar si ya hay sesión activa
    if (SessionManager.isLoggedIn()) {
        const user = SessionManager.getUser();
        const redirect = user.role === 'admin'
            ? 'StreamMovie_admin_clean.html'
            : 'StreamMovie_user_clean.html';
        window.location.href = redirect;
        return;
    }

    // Validación en tiempo real
    usernameInput.addEventListener('input', () => validateField('username'));
    passwordInput.addEventListener('input', () => validateField('password'));

    // Manejar submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const isUsernameValid = validateField('username');
        const isPasswordValid = validateField('password');

        if (!isUsernameValid || !isPasswordValid) {
            showMessage('Por favor corrige los errores antes de continuar', 'error');
            return;
        }

        await handleLogin();
    });

    function validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = document.getElementById(${fieldName}-error);
        const value = input.value.trim();

        let errorMessage = '';

        if (fieldName === 'username') {
            if (!value) {
                errorMessage = 'El usuario o email es requerido';
            } else if (value.length < 3) {
                errorMessage = 'Debe tener al menos 3 caracteres';
            }
        }

        if (fieldName === 'password') {
            if (!value) {
                errorMessage = 'La contraseña es requerida';
            } else if (value.length < 4) {
                errorMessage = 'La contraseña debe tener al menos 4 caracteres';
            }
        }

        if (errorMessage) {
            input.classList.add('error');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.add('show');
            return false;
        } else {
            input.classList.remove('error');
            errorDiv.classList.remove('show');
            return true;
        }
    }

    async function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Iniciando sesión...';

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

            let errorMessage = 'Error al iniciar sesión';
            if (error.message.includes('401') || error.message.includes('invalid')) {
                errorMessage = 'Usuario o contraseña incorrectos';
            } else if (error.message.includes('403') || error.message.includes('blocked')) {
                errorMessage = 'Tu cuenta ha sido bloqueada';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Error de conexión. Verifica tu internet';
            }

            showMessage(errorMessage, 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    }

    function showMessage(message, type) {
        // Eliminar mensaje anterior
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = message ${type};
        messageDiv.textContent = message;

        form.insertAdjacentElement('beforebegin', messageDiv);

        // Eliminar después de 4 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }
});