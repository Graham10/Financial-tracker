// Authentication functionality
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('projectTrackerUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Initialize with admin user if no users exist
        if (this.users.length === 0) {
            this.createDefaultAdmin();
        }
    }

    createDefaultAdmin() {
        const adminUser = {
            id: 1,
            username: 'admin',
            email: 'admin@projecttracker.com',
            password: btoa('admin123'),
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        
        this.users.push(adminUser);
        this.saveUsers();
    }

    saveUsers() {
        localStorage.setItem('projectTrackerUsers', JSON.stringify(this.users));
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    register(username, email, password, role = 'user') {
        if (this.users.find(user => user.username === username)) {
            return { success: false, message: 'Username already exists' };
        }

        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        if (role === 'admin' && !this.isAdmin()) {
            return { success: false, message: 'Only administrators can create admin accounts' };
        }

        const newUser = {
            id: this.users.length + 1,
            username,
            email,
            password: btoa(password),
            role: role,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Registration successful' };
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === btoa(password));
        
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            return { success: true, user };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    }

    logout() {
        this.clearCurrentUser();
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isCurrentUser(username) {
        return this.currentUser && this.currentUser.username === username;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        if (!this.isAdmin()) {
            return [];
        }
        return this.users.filter(user => user.role !== 'admin');
    }

    deleteUser(userId) {
        if (!this.isAdmin()) {
            return { success: false, message: 'Insufficient permissions' };
        }

        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        if (this.users[userIndex].id === this.currentUser.id) {
            return { success: false, message: 'Cannot delete your own account' };
        }

        this.users.splice(userIndex, 1);
        this.saveUsers();
        localStorage.removeItem(`projects_${userId}`);

        return { success: true, message: 'User deleted successfully' };
    }
}

const authManager = new AuthManager();

if (window.location.pathname.includes('login.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const authMessage = document.getElementById('auth-message');

        if (authManager.isAuthenticated()) {
            window.location.href = 'index.html';
        }

        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            authMessage.textContent = '';
        });

        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            authMessage.textContent = '';
        });

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = authManager.login(username, password);
            
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                showMessage(result.message, 'error');
            }
        });

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            const result = authManager.register(username, email, password, 'user');
            
            if (result.success) {
                showMessage(result.message, 'success');
                setTimeout(() => {
                    registerForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    registerForm.reset();
                }, 1500);
            } else {
                showMessage(result.message, 'error');
            }
        });

        function showMessage(message, type) {
            authMessage.textContent = message;
            authMessage.className = `message ${type}`;
        }
    });
}