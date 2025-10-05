// Projects data and functionality
class ProjectsManager {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('projects')) || [
            {
                id: 1,
                name: "Office Building Construction",
                description: "Construction of a 3-story office building",
                suppliers: [
                    { id: 1, name: "ABC Construction", owed: 50000, paid: 30000 },
                    { id: 2, name: "XYZ Electrical", owed: 25000, paid: 15000 },
                    { id: 3, name: "Mario Plumbing Pros", owed: 18000, paid: 10000 }
                ]
            },
            {
                id: 2,
                name: "Shopping Mall Renovation",
                description: "Complete renovation of Luqman shopping mall",
                suppliers: [
                    { id: 1, name: "Renovation Experts", owed: 75000, paid: 45000 },
                    { id: 2, name: "Flooring Specialists", owed: 32000, paid: 20000 }
                ]
            },
            {
                id: 3,
                name: "Residential Complex",
                description: "Construction of 50-unit residential complex",
                suppliers: [
                    { id: 1, name: "Foundation Corp", owed: 120000, paid: 80000 },
                    { id: 2, name: "Roofing Masters", owed: 45000, paid: 25000 },
                    { id: 3, name: "Interior Design Co", owed: 60000, paid: 30000 }
                ]
            }
        ];
        this.currentProjectId = null;
    }

    saveToLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    getProjects() {
        return this.projects;
    }

    getProject(id) {
        return this.projects.find(project => project.id === id);
    }

    addProject(name, description) {
        const newProject = {
            id: this.projects.length > 0 ? Math.max(...this.projects.map(p => p.id)) + 1 : 1,
            name,
            description,
            suppliers: []
        };
        
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return newProject;
    }

    setCurrentProject(id) {
        this.currentProjectId = id;
    }

    getCurrentProject() {
        return this.getProject(this.currentProjectId);
    }

    addSupplierToCurrentProject(supplierData) {
        const project = this.getCurrentProject();
        if (project) {
            const newSupplier = {
                id: project.suppliers.length > 0 ? Math.max(...project.suppliers.map(s => s.id)) + 1 : 1,
                ...supplierData
            };
            
            project.suppliers.push(newSupplier);
            this.saveToLocalStorage();
            return newSupplier;
        }
        return null;
    }

    addPaymentToSupplier(projectId, supplierId, paymentAmount) {
        const project = this.getProject(projectId);
        if (project) {
            const supplier = project.suppliers.find(s => s.id === supplierId);
            if (supplier) {
                supplier.paid += parseFloat(paymentAmount);
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

// Create global instance
const projectsManager = new ProjectsManager();