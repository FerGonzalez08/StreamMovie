// login.js - Login con validaciones
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (SessionManager.isLoggedIn()) {
        const user = SessionManager.getUser();
        const redirect = user.role === 'admin' ? 'StreamMovie_admin_clean.html' : 'StreamMovie_user_clean.html';
        window.location.href = redirect;
        return;
    }

    usernameInput.addEventListener('input', () => validateField('username'));
    passwordInput.addEventListener('input', () => validateField('password'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isUsernameValid = validateField('username');
        const isPasswordValid = validateField('password');

        if (!isUsernameValid || !isPasswordValid) {
            showMessage('Por favor corrige los errores', 'error');
            return;
        }

        await handleLogin();
    });

    function validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + '-error');
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
                errorMessage = 'Debe tener al menos 4 caracteres';
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

            const user = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({
                    identifier: username,
                    password: password
                })
            });

            if (user.status === 'BLOCKED') {
                showMessage('Tu cuenta ha sido bloqueada', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Iniciar Sesión';
                return;
            }

            SessionManager.setUser(user);
            showMessage('Inicio de sesión exitoso', 'success');

            setTimeout(() => {
                const redirectUrl = user.role === 'admin' ? 'StreamMovie_admin_clean.html' : 'StreamMovie_user_clean.html';
                window.location.href = redirectUrl;
            }, 1000);

        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            if (error.message.includes('401') || error.message.includes('invalid')) {
                errorMessage = 'Usuario o contraseña incorrectos';
            } else if (error.message.includes('403') || error.message.includes('blocked')) {
                errorMessage = 'Tu cuenta ha sido bloqueada';
            } else if (error.message.includes('conexión')) {
                errorMessage = 'Error de conexión con el servidor';
            }

            showMessage(errorMessage, 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    }

    function showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + type;
        messageDiv.textContent = message;
        form.insertAdjacentElement('beforebegin', messageDiv);

        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 4000);
    }
});