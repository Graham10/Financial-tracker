// Main application functionality
class App {
    constructor() {
        //debugging snap code
            console.log('App constructor started');
    console.log('Auth manager currentUser:', authManager.currentUser);
    console.log('Is authenticated:', authManager.isAuthenticated());
    
    if (!authManager.isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    console.log('User authenticated, proceeding with app initialization');
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        this.projectsList = document.getElementById('projects-list');
        this.projectTitle = document.getElementById('project-title');
        this.projectInfo = document.getElementById('project-info');
        this.totalOwed = document.getElementById('total-owed');
        this.totalPaid = document.getElementById('total-paid');
        this.balance = document.getElementById('balance');
        this.addProjectBtn = document.getElementById('add-project-btn');
        this.addSupplierBtn = document.getElementById('add-supplier-btn');
        
        this.modals = {
            project: document.getElementById('project-modal'),
            supplier: document.getElementById('supplier-modal'),
            payment: document.getElementById('payment-modal')
        };

        this.forms = {
            project: document.getElementById('project-form'),
            supplier: document.getElementById('supplier-form'),
            payment: document.getElementById('payment-form')
        };

        this.init();
    }

    init() {
        this.setupUserInterface();
        this.renderProjects();
        this.setupEventListeners();
        
        if (projectsManager.getProjects().length > 0) {
            this.selectProject(projectsManager.getProjects()[0].id);
        }
    }

    setupUserInterface() {
        const user = authManager.getCurrentUser();
        const headerContent = document.querySelector('.header-content');
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span class="user-welcome">
                Welcome, ${user.username} 
                <span class="user-role-badge">${user.role}</span>
            </span>
            ${authManager.isAdmin() ? '<button class="btn btn-warning btn-sm" id="manage-users-btn">Manage Users</button>' : ''}
            <button class="btn btn-logout" id="logout-btn">Logout</button>
        `;
        
        headerContent.appendChild(userInfo);

        this.addProjectBtn.style.display = authManager.canCreateProjects() ? 'block' : 'none';
        this.addSupplierBtn.style.display = 'none';

        document.getElementById('logout-btn').addEventListener('click', () => {
            authManager.logout();
        });

        if (authManager.isAdmin()) {
            document.getElementById('manage-users-btn').addEventListener('click', () => {
                this.showUserManagementModal();
            });
        }
    }

    showUserManagementModal() {
    const users = authManager.getAllUsers();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h3>User Management</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 30px;">
                    <h4>Create New User</h4>
                    <form id="admin-create-user-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: end;">
                            <div class="form-group">
                                <label for="new-username">Username</label>
                                <input type="text" id="new-username" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="new-email">Email</label>
                                <input type="email" id="new-email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="new-user-role">Role</label>
                                <select id="new-user-role" class="form-control" required>
                                    <option value="viewer">Viewer</option>
                                    <option value="accountant">Accountant</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-success">Create User</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="new-password">Password</label>
                            <input type="password" id="new-password" class="form-control" required>
                        </div>
                    </form>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4>Existing Users</h4>
                    ${users.length === 0 ? 
                        '<p>No users registered yet.</p>' : 
                        '<div class="users-list" style="max-height: 400px; overflow-y: auto;"></div>'
                    }
                </div>
                
                <div class="permissions-guide">
                    <h5>Role Permissions:</h5>
                    <ul>
                        <li><strong>Viewer:</strong> Can only view projects and suppliers</li>
                        <li><strong>Accountant:</strong> Can view + record payments</li>
                        <li><strong>Manager:</strong> Can create/edit/delete projects and suppliers</li>
                        <li><strong>Admin:</strong> Full access + user management</li>
                    </ul>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn" id="close-users-modal">Close</button>
            </div>
        </div>
    `;

    // Handle new user creation
    const createUserForm = modal.querySelector('#admin-create-user-form');
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdminCreateUser(modal);
    });

    if (users.length > 0) {
        const usersList = modal.querySelector('.users-list');
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.style.padding = '15px';
            userItem.style.border = '1px solid #eee';
            userItem.style.marginBottom = '10px';
            userItem.style.borderRadius = '4px';
            
            // FIX: Check if permissions exists and is an array
            const permissionsText = user.permissions && Array.isArray(user.permissions) 
                ? user.permissions.join(', ') 
                : 'No permissions set';
            
            userItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <strong>${user.username}</strong> (${user.email})
                        <br><small>Role: <span class="user-role-badge">${user.role}</span> | Registered: ${Utils.formatDate(user.createdAt)}</small>
                        <br><small>Permissions: ${permissionsText}</small>
                    </div>
                    <div class="user-item-actions">
                        <button class="btn btn-warning btn-sm edit-role-btn" data-user-id="${user.id}" style="margin-right: 5px;">
                            Change Role
                        </button>
                        <button class="btn btn-danger btn-sm delete-user-btn" data-user-id="${user.id}">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            
            usersList.appendChild(userItem);
        });

        // Add edit role functionality
        modal.querySelectorAll('.edit-role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.dataset.userId);
                this.showEditRoleModal(userId, modal);
            });
        });

        modal.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.dataset.userId);
                const user = users.find(u => u.id === userId);
                
                if (user) {
                    Utils.showConfirmation(
                        `Are you sure you want to delete user "${user.username}"? This will also delete all their projects and data.`,
                        () => {
                            const result = authManager.deleteUser(userId);
                            if (result.success) {
                                modal.querySelector('.close-modal').click();
                                this.showUserManagementModal();
                            } else {
                                alert(result.message);
                            }
                        }
                    );
                }
            });
        });
    }

    document.body.appendChild(modal);

    const closeModal = () => document.body.removeChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-users-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Add the missing handleAdminCreateUser method
handleAdminCreateUser(modal) {
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-user-role').value;

    const result = authManager.register(username, email, password, role);
    
    if (result.success) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'message success';
        successMsg.textContent = `User "${username}" created successfully as ${role}!`;
        successMsg.style.marginTop = '10px';
        
        const form = modal.querySelector('#admin-create-user-form');
        form.appendChild(successMsg);
        
        // Clear form
        form.reset();
        
        // Refresh user list after a delay
        setTimeout(() => {
            modal.querySelector('.close-modal').click();
            this.showUserManagementModal();
        }, 1500);
    } else {
        alert(result.message);
    }
}

// Add the missing showEditRoleModal method
showEditRoleModal(userId, parentModal) {
    const user = authManager.users.find(u => u.id === userId);
    if (!user) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Change User Role</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p>Changing role for: <strong>${user.username}</strong></p>
                <div class="form-group">
                    <label for="edit-user-role">New Role</label>
                    <select id="edit-user-role" class="form-control">
                        <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                        <option value="accountant" ${user.role === 'accountant' ? 'selected' : ''}>Accountant</option>
                        <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn" id="cancel-edit-role">Cancel</button>
                <button class="btn btn-primary" id="save-role-change">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => document.body.removeChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('#cancel-edit-role').addEventListener('click', closeModal);
    
    modal.querySelector('#save-role-change').addEventListener('click', () => {
        const newRole = document.getElementById('edit-user-role').value;
        
        // Update user role
        user.role = newRole;
        
        // Update permissions based on role
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
        
        user.permissions = rolePermissions[newRole];
        authManager.saveUsers();
        
        closeModal();
        parentModal.querySelector('.close-modal').click();
        this.showUserManagementModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

    renderProjects() {
        this.projectsList.innerHTML = '';
        
        const projects = projectsManager.getProjects();
        
        if (projects.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#7f8c8d';
            emptyMessage.textContent = authManager.canCreateProjects() ? 
                'No projects found. Click "Add New Project" to create one.' :
                'No projects available.';
            this.projectsList.appendChild(emptyMessage);
            return;
        }
        
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            const canDelete = authManager.canDeleteProjects();
            
            projectItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${project.name}</span>
                    ${canDelete ? `
                    <button class="btn btn-danger btn-sm delete-project-btn" data-project-id="${project.id}">×</button>
                    ` : ''}
                </div>
                ${project.createdBy ? `<small>Created by: ${project.createdBy}</small>` : ''}
            `;
            projectItem.dataset.id = project.id;
            
            projectItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-project-btn')) {
                    this.selectProject(project.id);
                }
            });
            
            if (canDelete) {
                const deleteBtn = projectItem.querySelector('.delete-project-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteProject(project.id);
                });
            }
            
            this.projectsList.appendChild(projectItem);
        });
    }

    deleteProject(projectId) {
        const project = projectsManager.getProject(projectId);
        if (project) {
            Utils.showConfirmation(
                `Are you sure you want to delete project "${project.name}"? This will also delete all associated suppliers and payment data. This action cannot be undone.`,
                () => {
                    if (projectsManager.deleteProject(projectId)) {
                        this.renderProjects();
                        
                        if (projectsManager.currentProjectId === projectId) {
                            this.projectTitle.textContent = 'Select a Project';
                            this.projectInfo.style.display = 'none';
                            this.addSupplierBtn.style.display = 'none';
                            projectsManager.setCurrentProject(null);
                        }
                        
                        const projects = projectsManager.getProjects();
                        if (projects.length > 0) {
                            this.selectProject(projects[0].id);
                        }
                    }
                }
            );
        }
    }

    selectProject(projectId) {
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.project-item[data-id="${projectId}"]`).classList.add('active');
        
        projectsManager.setCurrentProject(projectId);
        
        const project = projectsManager.getProject(projectId);
        this.projectTitle.textContent = project.name;
        this.projectInfo.style.display = 'block';
        this.addSupplierBtn.style.display = authManager.canCreateSuppliers() ? 'block' : 'none';
        
        this.updateFinancialTotals(projectId);
        suppliersUI.renderSuppliers(project.suppliers, projectId);
    }

    updateFinancialTotals(projectId) {
        const financials = projectsManager.getProjectFinancials(projectId);
        
        if (financials) {
            this.totalOwed.textContent = Utils.formatCurrency(financials.totalOwed);
            this.totalPaid.textContent = Utils.formatCurrency(financials.totalPaid);
            this.balance.textContent = Utils.formatCurrency(financials.balance);
        }
    }

    setupEventListeners() {
        this.addProjectBtn.addEventListener('click', () => {
            this.modals.project.style.display = 'flex';
        });
        
        document.getElementById('close-project-modal').addEventListener('click', () => {
            this.modals.project.style.display = 'none';
        });
        
        document.getElementById('cancel-project-btn').addEventListener('click', () => {
            this.modals.project.style.display = 'none';
        });
        
        this.forms.project.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name').value;
            const description = document.getElementById('project-description').value;
            
            const newProject = projectsManager.addProject(name, description);
            if (newProject) {
                this.renderProjects();
                this.selectProject(newProject.id);
                this.modals.project.style.display = 'none';
                this.forms.project.reset();
            }
        });
        
        this.addSupplierBtn.addEventListener('click', () => {
            if (projectsManager.currentProjectId) {
                this.modals.supplier.style.display = 'flex';
            }
        });
        
        document.getElementById('close-supplier-modal').addEventListener('click', () => {
            this.modals.supplier.style.display = 'none';
        });
        
        document.getElementById('cancel-supplier-btn').addEventListener('click', () => {
            this.modals.supplier.style.display = 'none';
        });
        
        this.forms.supplier.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('supplier-name').value;
            const owed = document.getElementById('amount-owed').value;
            const paid = document.getElementById('amount-paid').value;
            
            const supplier = projectsManager.addSupplierToCurrentProject({
                name,
                owed: parseFloat(owed),
                paid: parseFloat(paid)
            });
            
            if (supplier) {
                this.updateFinancialTotals(projectsManager.currentProjectId);
                suppliersUI.renderSuppliers(projectsManager.getCurrentProject().suppliers, projectsManager.currentProjectId);
                this.modals.supplier.style.display = 'none';
                this.forms.supplier.reset();
            }
        });
        
        document.getElementById('close-payment-modal').addEventListener('click', () => {
            this.modals.payment.style.display = 'none';
        });
        
        document.getElementById('cancel-payment-btn').addEventListener('click', () => {
            this.modals.payment.style.display = 'none';
        });
        
        this.forms.payment.addEventListener('submit', (e) => {
            e.preventDefault();
            const projectId = parseInt(e.target.dataset.projectId);
            const supplierId = parseInt(e.target.dataset.supplierId);
            const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
            const paymentDate = document.getElementById('payment-date').value;
            const paymentNotes = document.getElementById('payment-notes').value;
            
            if (projectsManager.addPaymentToSupplier(projectId, supplierId, paymentAmount, paymentDate, paymentNotes)) {
                this.updateFinancialTotals(projectId);
                suppliersUI.renderSuppliers(projectsManager.getProject(projectId).suppliers, projectId);
                this.modals.payment.style.display = 'none';
                this.forms.payment.reset();
            }
        });
        
        window.addEventListener('click', (e) => {
            Object.values(this.modals).forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new App();
});