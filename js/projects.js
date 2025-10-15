// Projects data and functionality
class ProjectsManager {
    constructor() {
        this.loadProjects();
    }

    loadProjects() {
        const currentUser = authManager.getCurrentUser();
        if (currentUser) {
            const userProjects = localStorage.getItem(`projects_${currentUser.id}`);
            this.projects = userProjects ? JSON.parse(userProjects) : this.getDefaultProjects();
        } else {
            this.projects = this.getDefaultProjects();
        }
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                name: "Office Building Construction",
                description: "Construction of a 10-story office building",
                suppliers: [
                    { id: 1, name: "ABC Construction", owed: 50000, paid: 30000 },
                    { id: 2, name: "XYZ Electrical", owed: 25000, paid: 15000 },
                    { id: 3, name: "Plumbing Pros", owed: 18000, paid: 10000 }
                ],
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveToLocalStorage() {
        const currentUser = authManager.getCurrentUser();
        if (currentUser) {
            localStorage.setItem(`projects_${currentUser.id}`, JSON.stringify(this.projects));
        }
    }

    getProjects() {
        return this.projects;
    }

    getProject(id) {
        return this.projects.find(project => project.id === id);
    }

    canViewProjects() { 
    return authManager.isAuthenticated() && authManager.canViewProjects(); 
}

canCreateProjects() { 
    return authManager.isAuthenticated() && authManager.canCreateProjects(); 
}

canEditProjects() { 
    return authManager.isAuthenticated() && authManager.canEditProjects(); 
}

canDeleteProjects() { 
    return authManager.isAuthenticated() && authManager.canDeleteProjects(); 
}

canViewSuppliers() { 
    return authManager.isAuthenticated() && authManager.canViewSuppliers(); 
}

canCreateSuppliers() { 
    return authManager.isAuthenticated() && authManager.canCreateSuppliers(); 
}

canEditSuppliers() { 
    return authManager.isAuthenticated() && authManager.canEditSuppliers(); 
}

canDeleteSuppliers() { 
    return authManager.isAuthenticated() && authManager.canDeleteSuppliers(); 
}

canRecordPayments() { 
    return authManager.isAuthenticated() && authManager.canRecordPayments(); 
}

    addProject(name, description) {
        if (!this.canCreateProjects()) {
            alert('You do not have permission to create projects.');
            return null;
        }

        const newProject = {
            id: this.projects.length > 0 ? Math.max(...this.projects.map(p => p.id)) + 1 : 1,
            name,
            description,
            suppliers: [],
            createdBy: authManager.getCurrentUser()?.username,
            createdAt: new Date().toISOString()
        };
        
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return newProject;
    }

    deleteProject(projectId) {
        if (!this.canDeleteProjects()) {
            alert('You do not have permission to delete projects.');
            return false;
        }

        const index = this.projects.findIndex(project => project.id === projectId);
        if (index !== -1) {
            this.projects.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    setCurrentProject(id) {
        this.currentProjectId = id;
    }

    getCurrentProject() {
        return this.getProject(this.currentProjectId);
    }

    addSupplierToCurrentProject(supplierData) {
        if (!this.canCreateSuppliers()) {
            alert('You do not have permission to add suppliers.');
            return null;
        }

        const project = this.getCurrentProject();
        if (project) {
            const newSupplier = {
                id: project.suppliers.length > 0 ? Math.max(...project.suppliers.map(s => s.id)) + 1 : 1,
                ...supplierData,
                createdBy: authManager.getCurrentUser()?.username,
                createdAt: new Date().toISOString()
            };
            
            project.suppliers.push(newSupplier);
            this.saveToLocalStorage();
            return newSupplier;
        }
        return null;
    }

    deleteSupplier(projectId, supplierId) {
        if (!this.canDeleteSuppliers()) {
            alert('You do not have permission to delete suppliers.');
            return false;
        }

        const project = this.getProject(projectId);
        if (project) {
            const index = project.suppliers.findIndex(supplier => supplier.id === supplierId);
            if (index !== -1) {
                project.suppliers.splice(index, 1);
                this.saveToLocalStorage();
                return true;
            }
        }
        return false;
    }

    addPaymentToSupplier(projectId, supplierId, paymentAmount, paymentDate, notes = '') {
        if (!this.canRecordPayments()) {
            alert('You do not have permission to record payments.');
            return false;
        }

        const project = this.getProject(projectId);
        if (project) {
            const supplier = project.suppliers.find(s => s.id === supplierId);
            if (supplier) {
                supplier.paid += parseFloat(paymentAmount);
                
                if (!supplier.paymentHistory) {
                    supplier.paymentHistory = [];
                }
                
                supplier.paymentHistory.push({
                    id: supplier.paymentHistory.length + 1,
                    amount: parseFloat(paymentAmount),
                    date: paymentDate,
                    notes: notes,
                    timestamp: new Date().toISOString(),
                    recordedBy: authManager.getCurrentUser()?.username
                });
                
                this.saveToLocalStorage();
                return true;
            }
        }
        return false;
    }

    getProjectFinancials(projectId) {
        const project = this.getProject(projectId);
        if (!project) return null;

        let totalOwed = 0;
        let totalPaid = 0;

        project.suppliers.forEach(supplier => {
            totalOwed += supplier.owed;
            totalPaid += supplier.paid;
        });

        return {
            totalOwed,
            totalPaid,
            balance: totalOwed - totalPaid
        };
    }
}

const projectsManager = new ProjectsManager();