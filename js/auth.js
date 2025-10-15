// Authentication functionality
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('projectTrackerUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        if (this.users.length === 0) {
            this.createDefaultUsers();
        }else {
        this.ensureUserPermissions();
    }
    }

    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@company.com',
                password: btoa('admin123'),
                role: 'admin',
                permissions: ['all'],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'manager',
                email: 'manager@company.com',
                password: btoa('manager123'),
                role: 'manager',
                permissions: [
                    'view_projects', 
                    'create_projects', 
                    'edit_projects', 
                    'delete_projects',
                    'view_suppliers', 
                    'create_suppliers', 
                    'edit_suppliers', 
                    'delete_suppliers',
                    'record_payments'
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                username: 'viewer',
                email: 'viewer@company.com',
                password: btoa('viewer123'),
                role: 'viewer',
                permissions: ['view_projects', 'view_suppliers'],
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                username: 'accountant',
                email: 'accountant@company.com',
                password: btoa('accountant123'),
                role: 'accountant',
                permissions: [
                    'view_projects', 
                    'view_suppliers', 
                    'record_payments'
                ],
                createdAt: new Date().toISOString()
            }
        ];
        
        this.users = defaultUsers;
        this.saveUsers();
    }

    ensureUserPermissions() {
    this.users.forEach(user => {
        if (!user.permissions || !Array.isArray(user.permissions)) {
            // Set default permissions based on role
            const rolePermissions = {
                viewer: ['view_projects', 'view_suppliers'],
                accountant: ['view_projects', 'view_suppliers', 'record_payments'],
                manager: [
                    'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
                    'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
                    'record_payments'
                ],
                admin: ['all']
            };
            user.permissions = rolePermissions[user.role] || ['view_projects', 'view_suppliers'];
        }
    });
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

    register(username, email, password, role = 'user', permissions = null) {
        if (this.users.find(user => user.username === username)) {
            return { success: false, message: 'Username already exists' };
        }

        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        if ((role === 'admin' || role === 'manager') && !this.isAdmin()) {
            return { success: false, message: 'Only administrators can create manager or admin accounts' };
        }

        const rolePermissions = {
            viewer: ['view_projects', 'view_suppliers'],
            accountant: ['view_projects', 'view_suppliers', 'record_payments'],
            manager: [
                'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
                'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
                'record_payments'
            ],
            admin: ['all']
        };

        const newUser = {
            id: this.users.length + 1,
            username,
            email,
            password: btoa(password),
            role: role,
            permissions: permissions || rolePermissions[role],
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

    hasPermission(permission) {
    // Add proper null checks
    if (!this.currentUser || typeof this.currentUser !== 'object') {
        console.warn('No current user or invalid user object');
        return false;
    }
    
    if (this.currentUser.role === 'admin') return true;
    
    // Check if permissions array exists and is valid
    if (!this.currentUser.permissions || !Array.isArray(this.currentUser.permissions)) {
        console.warn('User permissions array is missing or invalid:', this.currentUser);
        return false;
    }
    
    return this.currentUser.permissions.includes(permission);
}

    canViewProjects() {
        return this.hasPermission('view_projects');
    }

    canCreateProjects() {
        return this.hasPermission('create_projects');
    }

    canEditProjects() {
        return this.hasPermission('edit_projects');
    }

    canDeleteProjects() {
        return this.hasPermission('delete_projects');
    }

    canViewSuppliers() {
        return this.hasPermission('view_suppliers');
    }

    canCreateSuppliers() {
        return this.hasPermission('create_suppliers');
    }

    canEditSuppliers() {
        return this.hasPermission('edit_suppliers');
    }

    canDeleteSuppliers() {
        return this.hasPermission('delete_suppliers');
    }

    canRecordPayments() {
        return this.hasPermission('record_payments');
    }

    isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
}

isAuthenticated() {
    return this.currentUser !== null && typeof this.currentUser === 'object';
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

    getAvailablePermissions() {
        return {
            view_projects: 'View Projects',
            create_projects: 'Create Projects',
            edit_projects: 'Edit Projects',
            delete_projects: 'Delete Projects',
            view_suppliers: 'View Suppliers',
            create_suppliers: 'Create Suppliers',
            edit_suppliers: 'Edit Suppliers',
            delete_suppliers: 'Delete Suppliers',
            record_payments: 'Record Payments'
        };
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
    const role = document.getElementById('user-role').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    // RESTRICT ROLE CREATION FOR NON-ADMINS
    let finalRole = role;
    if (!authManager.isAdmin()) {
        // Non-admins can only create Viewer or Accountant accounts
        if (role === 'manager' || role === 'admin') {
            showMessage('Only administrators can create manager or admin accounts. Your account will be created as a Viewer.', 'warning');
            finalRole = 'viewer';
        }
    }

            const result = authManager.register(username, email, password, role);
            
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