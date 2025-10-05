// Main application functionality
class App {
    constructor() {
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
        this.renderProjects();
        this.setupEventListeners();
        
        // Select first project by default if available
        if (projectsManager.getProjects().length > 0) {
            this.selectProject(projectsManager.getProjects()[0].id);
        }
    }

    renderProjects() {
        this.projectsList.innerHTML = '';
        
        projectsManager.getProjects().forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.textContent = project.name;
            projectItem.dataset.id = project.id;
            
            projectItem.addEventListener('click', () => {
                this.selectProject(project.id);
            });
            
            this.projectsList.appendChild(projectItem);
        });
    }

    selectProject(projectId) {
        // Update active state
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.project-item[data-id="${projectId}"]`).classList.add('active');
        
        // Update current project
        projectsManager.setCurrentProject(projectId);
        
        // Show project details
        const project = projectsManager.getProject(projectId);
        this.projectTitle.textContent = project.name;
        this.projectInfo.style.display = 'block';
        this.addSupplierBtn.style.display = 'block';
        
        // Update financial totals
        this.updateFinancialTotals(projectId);
        
        // Render suppliers
        suppliersUI.renderSuppliers(project.suppliers);
    }

    updateFinancialTotals(projectId) {
        const financials = projectsManager.getProjectFinancials(projectId);
        
        if (financials) {
            this.totalOwed.textContent = `Kshs${financials.totalOwed.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            this.totalPaid.textContent = `Kshs${financials.totalPaid.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            this.balance.textContent = `Kshs${financials.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        }
    }

    setupEventListeners() {
        // Project modal
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
            this.renderProjects();
            this.selectProject(newProject.id);
            this.modals.project.style.display = 'none';
            this.forms.project.reset();
        });
        
        // Supplier modal
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
            
            projectsManager.addSupplierToCurrentProject({
                name,
                owed: parseFloat(owed),
                paid: parseFloat(paid)
            });
            
            this.updateFinancialTotals(projectsManager.currentProjectId);
            suppliersUI.renderSuppliers(projectsManager.getCurrentProject().suppliers);
            this.modals.supplier.style.display = 'none';
            this.forms.supplier.reset();
        });
        
        // Payment modal
        document.getElementById('close-payment-modal').addEventListener('click', () => {
            this.modals.payment.style.display = 'none';
        });
        
        document.getElementById('cancel-payment-btn').addEventListener('click', () => {
            this.modals.payment.style.display = 'none';
        });
        
        this.forms.payment.addEventListener('submit', (e) => {
            e.preventDefault();
            const supplierId = parseInt(e.target.dataset.supplierId);
            const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
            
            if (projectsManager.addPaymentToSupplier(projectsManager.currentProjectId, supplierId, paymentAmount)) {
                this.updateFinancialTotals(projectsManager.currentProjectId);
                suppliersUI.renderSuppliers(projectsManager.getCurrentProject().suppliers);
                this.modals.payment.style.display = 'none';
                this.forms.payment.reset();
            }
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            Object.values(this.modals).forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});